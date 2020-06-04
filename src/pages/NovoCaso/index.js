// Componentes padrão
import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, AsyncStorage } from "react-native";
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

// Conexão com o banco de dados
import { CasoService } from "../../services/caso.service";
import { Caso } from "../../models/caso.model";

export default function NovoCaso() {
    // Gerencia a navegação entre telas
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
    const mode = route.params.mode == "new" ? "Criação de caso" : "Atualização de caso";
    const unidade = route.params.unidade;

    // Gerencia os porquês
    const [descricao, setDescricao] = useState("");
    const [acoes, setAcoes] = useState("");
    const [pq, setPQ] = useState(["", "", "", "", ""]);
    function atualizarPQ(texto, indc) {
        const novoPQ = [];
        for(let i = 0; i < pq.length; i++) {
            if(i != indc)
                novoPQ.push(pq[i]);
            else
                novoPQ.push(texto);
        }
        setPQ(novoPQ);
    }
    function novoPQ() {
        const novo = [...pq];
        novo.push("");
        setPQ(novo);
    }

    // Gerencia o armazenamento
    function salvar() {
        // Verifica atualização
        if(route.params.mode == "atualizar") {
            const caso = new Caso(0, descricao, acoes, pq);
            caso.setID(route.params.dados.id_caso);
            const validacao = caso.getValidacao();

            if(!validacao.erro) {
                setLoading(true);
                CasoService.atualizar(caso).then(res => {
                    setLoading(false);
                    navegar(nav, "Casos", { unidade, forceLoad: true })
                }).catch(erro => {
                    setLoading(false);
                });
            }

            return;
        }

        const caso = new Caso(unidade.id_unidade, descricao, acoes, pq);
        const validacao = caso.getValidacao();
        
        if(!validacao.erro) {

            // Salva no banco
            setLoading(true);
            CasoService.add(caso).then(res => {
                setLoading(false);
                navegar(nav, "Casos", { unidade, forceLoad: true });
            }).catch(erro => {
                setLoading(false);
            });
        } else {
            Alert.alert("Atenção", validacao.log, [{
                text: "Corrigir",
                style: "cancel"
            }], { cancelable: false });
        }
    }

    // Gerencia a atualização de caso
    const dados = route.params.dados
    function initAtualizacao() {
        setDescricao(dados.descricao);
        setAcoes(dados.acoes);
        const list = dados.pqs.split("<br>");
        let pqAtualizar = [];
        for(let i = 0; i < list.length - 1; i++) {
            pqAtualizar.push(list[i]);
        }
        setPQ(pqAtualizar);
    }
    useEffect(() => {
        getTipoLayout();
        if(route.params.mode == "atualizar") {
            initAtualizacao();
        }
    }, []);

    return(
        <KeyboardAvoidingView style={globals.body} behavior={Platform.Os == "ios" ? "padding" : "height"}>

            <Header />

            <ScrollView style={[globals.conteudo, layout.background]}>
                <Spinner visible={loading} textContent={"Carregando..."} textStyle={globals.spinnerTextStyle}/>

                <ModalLayout call={alterarLayout} />

                <Text style={[globals.textoGeral, layout.primaryColor]}>{mode}. Preenche os campos abaixo com as informações necessárias.</Text>

                <View style={[globals.secao, layout.areaDados]}>

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={estilos.secaoInput}>
                            <Text style={[globals.textoLabel, layout.primaryColor]}>Descreva brevemente o problema visualizado.</Text>
                            <TextInput
                                style={[globals.input, layout.primaryColor]}
                                value={descricao}
                                onChangeText={text => setDescricao(text)}
                                multiline={true} />
                        </View>
                    </TouchableWithoutFeedback>

                    {pq.map((item, indc) => (
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} key={indc}>
                            <View style={estilos.secaoInput}>
                                <Text style={[globals.textoLabel, layout.primaryColor]}>Por quê?</Text>
                                <TextInput
                                    style={[globals.input, layout.primaryColor]}
                                    multiline={true}
                                    onChangeText={text => atualizarPQ(text, indc)}
                                    value={item} />
                            </View>
                        </TouchableWithoutFeedback>
                    ))}

                    <View style={estilos.areaIcone}>
                        <Feather name="edit" size={13} color={layout.primaryColor.color}></Feather>
                        <TouchableOpacity onPress={novoPQ}>
                            <Text style={[estilos.recuoIcone, layout.primaryColor, globals.textoIcon]}>Adicionar "Por quê"</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={estilos.secaoInput}>
                            <Text style={[globals.textoLabel, layout.primaryColor]}>Descreva as ações necessárias para correção do problema.</Text>
                            <TextInput
                                style={[globals.input, layout.primaryColor]}
                                value={acoes}
                                onChangeText={text => setAcoes(text)}
                                multiline={true} />
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={estilos.areaBotao}>
                        <TouchableOpacity style={[globals.botao, estilos.areaBotao]} onPress={salvar}>
                            <Feather name="save" size={13} color={globals.textoBotao.color}></Feather>
                            <Text style={[globals.textoBotao, estilos.recuoIcone]}>SALVAR</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <FinalMargin />
            </ScrollView>

            <AdMob />

        </KeyboardAvoidingView>
    );
}