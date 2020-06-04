// Componentes padrão
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
import { UnidadeService } from "../../services/unidade.service";
import { CasoService } from "../../services/caso.service";

export default function Unidades() {
    const nav = useNavigation();

    // Gerencia layout
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

    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(false);

    const [force, setFoce] = useState(true);
    const route = useRoute();
    const forceLoad = route.params.forceLoad;

    const [visibilidade, setVisibilidade] = useState(false);
    const [idDeletar, setIdDeletar] = useState(0);
    
    if(forceLoad) {
        if(force) {
            load();
            setFoce(false);
            getTipoLayout();
        }
    }

    function load() {
        setLoading(true);
        UnidadeService.buscar().then(res => {
            setUnidades(res._array);
            setLoading(false);
        }).catch(error => {
            console.log(error);
            setLoading(false);
        });
    }

    useEffect(() => {
        load();
        getTipoLayout();
    }, []);

    function validarDeletar(id) {
        setVisibilidade(true);
        setIdDeletar(id);
    }

    function finalizarDelecao() {
        setLoading(true);
        setVisibilidade(false);
        CasoService.deletarTudo(idDeletar).then(res => {
            return UnidadeService.deletar(idDeletar);
        }).then(res => {
            setLoading(false);
            load();
        }).catch(erro => {
            setLoading(false);
            console.log("Um erro ocorreu no processo.");
        });
    }

    return(
        <SafeAreaView style={globals.body}>

            <Header />

            <ScrollView style={[globals.conteudo, layout.background]}>

                <Spinner
                    visible={loading}
                    textContent={"Carregando..."}
                    textStyle={globals.spinnerTextStyle}
                />

                <ModalLayout call={alterarLayout} />

                <Text style={[globals.textoGeral, layout.primaryColor]}>Aqui estão todas as Unidades ou Processos que você cadastrou.</Text>

                <View style={estilos.areaNovo}>
                    <Feather name="plus-circle" size={13} color={layout.primaryColor.color}></Feather>
                    <TouchableOpacity onPress={() => navegar(nav, "NovaUnidade", { mode: "new" })}>
                        <Text style={[estilos.textoNovo, layout.primaryColor]}>Cadastrar Nova</Text>
                    </TouchableOpacity>
                </View>

                {unidades.map(item => (
                   <View style={[layout.areaDados, globals.secao]} key={item.id_unidade}>
                       <Text style={[globals.textoLabel, layout.primaryColor]}>
                           <Text style={globals.textoLabelBold}>Nome:</Text> {item.nome}
                        </Text>

                       <Text style={[globals.textoLabel, layout.primaryColor]}>
                           <Text style={globals.textoLabelBold}>Descrição:</Text> {item.descricao}
                        </Text>

                        <Text style={[globals.textoLabel, layout.primaryColor]}>
                           <Text style={globals.textoLabelBold}>Data de Criação:</Text> {formatarData(item.data)}
                        </Text>

                        <View style={estilos.areaIcones}>
                            <View style={estilos.areaIcon}>
                                <Feather name="layers" size={13} color={layout.primaryColor.color}></Feather>
                                <TouchableOpacity onPress={() => navegar(nav, "Casos", { unidade: item })}>
                                    <Text style={[estilos.textoDel, layout.primaryColor]}>Visualizar Casos</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={estilos.areaIcon}>
                                <Feather name="trash-2" size={13} color={layout.iconDel.color}></Feather>
                                <TouchableOpacity onPress={() => validarDeletar(item.id_unidade)}>
                                    <Text style={[estilos.textoDel, layout.iconDel]}>Deletar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                   </View>
                ))}

                <Modal animationType="slide" transparent={true} visible={visibilidade}
                    onRequestClose={() => setVisibilidade(false)}
                >
                    <View style={estilos.bodyModal}>
                        <View style={estilos.contentModal}>
                            <Text style={globals.textoGeral}>Deseja realmente excluir a unidade?</Text>
                            
                            <View style={estilos.areaIcones}>
                                <TouchableOpacity style={[globals.botao, estilos.botaoModal]}
                                    onPress={finalizarDelecao}
                                >
                                    <Text style={globals.textoBotao}>Sim</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[globals.botao, estilos.recuoBotaoModal]}
                                    onPress={() => setVisibilidade(false)}
                                >
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