// Componentes padrão
import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, AsyncStorage } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';

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
import { Unidade } from "../../models/unidade.model";
import { UnidadeService } from "../../services/unidade.service";

export default function NovaUnidade() {
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const mode = route.params.mode == "new" ? "Criação de Unidade (ou Processo)" : "Alteração de Unidade (ou Processo)";

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");

    // Gerencia as preferências de layout
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

    useEffect(() => {
        getTipoLayout();
    }, []);

    function salvar() {
        if(nome == "") {
            erro("O nome está vazio, por favor verifique.");
            return;
        }
        if(descricao == "") {
            erro("É preciso dar uma breve descrição, por favor verifique os dados informados.");
            return;
        }

        setLoading(true);
        const novaUnidade = new Unidade(nome, descricao);
        UnidadeService.add(novaUnidade).then(res => {
            setLoading(false);
            sucesso()
        }).catch();
    }

    function erro(log) {
        Alert.alert("Alerta", log, [
            {
                text: "OK",
                style: "cancel"
            }
        ], { cancelable: false });
    }

    function sucesso() {
        Alert.alert("Sucesso", "A Unidade (ou Processo) foi adicionada(o) ao banco de dados com sucesso.", [
            {
                text: "Voltar",
                onPress: () => navegar(nav, "Unidades", { forceLoad: true }),
                style: "cancel"
            }
        ], { cancelable: false });
    }

    return(
        <KeyboardAvoidingView style={globals.body} behavior={Platform.Os == "ios" ? "padding" : "height"}>

            <Header />

            <ScrollView style={[globals.conteudo, layout.background]}>
                <Spinner
                    visible={loading}
                    textContent={"Carregando..."}
                    textStyle={globals.spinnerTextStyle}
                />

                <ModalLayout call={alterarLayout} />

                <Text style={[globals.textoGeral, layout.primaryColor]}>{mode}</Text>

                <View style={[globals.secao, layout.areaDados]}>
                    <Text style={[globals.textoLabel, layout.primaryColor]}>Nome</Text>
                    <TextInput
                        style={[globals.input, layout.primaryColor]}
                        onChangeText={text =>setNome(text)}
                        value={nome}
                    />
                </View>

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[globals.secao, layout.areaDados]}>
                        <Text style={[globals.textoLabel, layout.primaryColor]}>Descricao</Text>
                        <TextInput
                            style={[globals.input, layout.primaryColor]}
                            onChangeText={text =>setDescricao(text)}
                            value={descricao}
                            multiline={true}
                        />
                    </View>
                    </TouchableWithoutFeedback>


                <View style={estilos.areaFinalizar}>
                    <TouchableOpacity style={globals.botao} onPress={salvar}>
                        <Text style={globals.textoBotao}>SALVAR</Text>
                    </TouchableOpacity>
                </View>

                <FinalMargin />
            </ScrollView>

            <AdMob />

        </KeyboardAvoidingView>
    );
}