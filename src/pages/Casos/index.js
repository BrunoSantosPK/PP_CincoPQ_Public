import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Modal, AsyncStorage } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import { Feather } from "@expo/vector-icons";

// Estilos
import estilos from "./style";
import globals from "../Fragments/globalStyle";

// Componentes personalizados
import AdMob from "../Fragments/AdMob";
import Header from "../Fragments/Header";
import FinalMargin from "../Fragments/FinalMargin";
import ModalLayout from "../Fragments/ModalLayout";

// Funções úteis
import navegar from "../../utils/navegar";
import trocarLayout from "../../utils/changeLayout";
import formatarData from "../../utils/converterData";

// Conexão com o banco de dados
import { CasoService } from "../../services/caso.service";

export default function Casos() {
    // Gerencia a navegação
    const nav = useNavigation();

    // Gerencia o loading
    const [loading, setLoading] = useState(false);

    // Gerencia o layout
    const [layout, setLayout] = useState(trocarLayout("light"));
    const alterarLayout = (tipo) => {
        setLayout(trocarLayout(tipo));
        setTipoLayout(tipo);
    };
    async function getTipoLayout() {
        try {
            const type = await AsyncStorage.getItem("layout");
            if(type == null)
                await AsyncStorage.setItem("layout", "light");
            setLayout(trocarLayout(type));
        } catch(erro) {
            console.log(erro);
        }
    }
    async function setTipoLayout(tipo) {
        try {
            await AsyncStorage.setItem("layout", tipo);
        } catch(erro) {
            console.log(erro);
        }
    }

    // Gerencia parâmetros da rota
    const route = useRoute();
    const unidade = route.params.unidade;

    // Gerencia os casos cadastrados
    const [casos, setCasos] = useState([]);
    function load() {
        setLoading(true);
        CasoService.buscarTodos(unidade.id_unidade).then(res => {
            traduzir(res._array);
            setLoading(false);
        }).catch(erro => {
            setLoading(false);
        });
    }
    useEffect(() => {
        load();
        getTipoLayout();
    }, []);

    // Força o recarregamento após a adição de novo caso
    const [force, setForce] = useState(true);
    const forceLoad = route.params.forceLoad;
    if(forceLoad) {
        if(force) {
            load();
            setForce(false);
            getTipoLayout();
        }
    }

    // Faz a tradução dos dados do banco
    const [casosBK, setCasosBK] = useState([]);
    function traduzir(data) {
        const novosCasos = [];
        const backup = [];

        for(let i = data.length - 1; i >= 0; i--) {
            // Prepara backup
            let nbk = {
                acoes: data[i].acoes,
                descricao: data[i].descricao,
                id_caso: data[i].id_caso,
                pqs: data[i].pqs.slice()
            };

            let pqArray = data[i].pqs.split("<br>");
            let pq = ""
            for(let j = 0; j < pqArray.length - 1; j++) {
                pq += `Porque: ${pqArray[j]}`;
                if(j < pqArray.length - 2)
                    pq += "\n";
            }
            data[i].pqs = pq;
            data[i].data = formatarData(data[i].data);

            backup.push(nbk);
            novosCasos.push(data[i]);
        }

        setCasosBK(backup);
        setCasos(novosCasos);
    }

    // Gerencia o modal de exclusão de item
    const [visibilidade, setVisibilidade] = useState(false);
    const [descricaoDel, setDescricaoDel] = useState("")
    const [idDelecao, setIdDelecao] = useState(0);
    function deletarCaso(id_caso, descricalDel) {
        setVisibilidade(true);
        setDescricaoDel(descricalDel);
        setIdDelecao(id_caso);
    }
    function finalizarDelecao() {
        setLoading(true);
        setVisibilidade(false);
        CasoService.deletar(idDelecao).then(res => {
            setLoading(false);
            load();
        }).catch(erro => {
            setLoading(false);
        });
    }

    // Gerencia atualização
    function atualizar(id_caso) {console.log("Cilcanco em alterar");
        let dados = [];
        for(let i = 0; i < casosBK.length; i++) {
            if(casosBK[i].id_caso == id_caso) {
                dados = casosBK[i];
                break;
            }
        }
        navegar(nav, "NovoCaso", { mode: "atualizar", unidade, dados });
    }

    return(
        <SafeAreaView style={globals.body}>

            <Header />

            <ScrollView style={[globals.conteudo, layout.background]}>
                <Spinner visible={loading} textContent={"Carregando..."} textStyle={globals.spinnerTextStyle}/>

                <ModalLayout call={alterarLayout} />

                <Text style={[globals.textoGeral, layout.primaryColor]}>Aqui estão todas os casos cadastrados para a "<Text style={globals.textoLabelBold}>{unidade.nome}"</Text>.</Text>

                <View style={estilos.areaNovo}>
                    <Feather name="plus-circle" size={13} color={layout.primaryColor.color}></Feather>
                    <TouchableOpacity onPress={() => navegar(nav, "NovoCaso", { mode: "new", unidade })}>
                        <Text style={[estilos.textoNovo, layout.primaryColor]}>Cadastrar Novo</Text>
                    </TouchableOpacity>
                </View>

                {casos.map((item, indc) => (
                    <View style={[layout.areaDados, globals.secao]} key={item.id_caso}>

                        <Text style={[globals.textoLabel, layout.primaryColor]}>
                           <Text style={globals.textoLabelBold}>Descrição</Text>{`\n`}{item.descricao}
                        </Text>

                        <Text style={[globals.textoLabel, layout.primaryColor]}>
                           <Text style={globals.textoLabelBold}>Data de Criação</Text>{`\n`}{item.data}
                        </Text>

                        <Text style={[globals.textoLabel, layout.primaryColor]}>
                            <Text style={globals.textoLabelBold}>Causa Raiz</Text>{`\n`}{item.pqs}
                        </Text>

                        <Text style={[globals.textoLabel, layout.primaryColor]}>
                           <Text style={globals.textoLabelBold}>Ações Previstas</Text>{`\n`}{item.acoes}
                        </Text>

                        <View style={estilos.areaIcones}>
                            <View style={estilos.areaIcon}>
                                <Feather name="edit" size={13} color={layout.primaryColor.color}></Feather>
                                <TouchableOpacity onPress={() => atualizar(item.id_caso)}>
                                    <Text style={[estilos.textoIcon, layout.primaryColor]}>Alterar Dados</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={estilos.areaIcon}>
                                <Feather name="trash-2" size={13} color={layout.iconDel.color}></Feather>
                                <TouchableOpacity onPress={() => deletarCaso(item.id_caso, item.descricao)}>
                                    <Text style={[estilos.textoIcon, layout.iconDel]}>Deletar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                ))}

                <Modal animationType="slide" transparent={true} visible={visibilidade}
                    onRequestClose={() => setVisibilidade(false)} >
                    <View style={estilos.bodyModal}>
                        <View style={estilos.contentModal}>
                            <Text style={globals.textoGeral}>Deseja realmente excluir o registro de "5 Porquês", para o caso "{descricaoDel}"?</Text>
                            
                            <View style={estilos.areaIcones}>

                                <TouchableOpacity style={[globals.botao, estilos.botaoModal]}
                                    onPress={finalizarDelecao}>
                                    <Text style={globals.textoBotao}>Sim</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[globals.botao, estilos.recuoBotaoModal]}
                                    onPress={() => setVisibilidade(false)}>
                                    <Text style={globals.textoBotao}>Não</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </View>
                </Modal>

                <FinalMargin />
            </ScrollView>

            <AdMob />

        </SafeAreaView>
    );
}