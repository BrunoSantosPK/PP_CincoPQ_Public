// Componentes padrão
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, SafeAreaView, ScrollView, TouchableOpacity, View, AsyncStorage } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';

// Estilos
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
import { UnidadeService } from "../../services/unidade.service";
import { CasoService } from "../../services/caso.service";

export default function Inicio() {
    const nav = useNavigation();
    const [layout, setLayout] = useState(trocarLayout("light"));

    // Gerencia o layout
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

    // Gerencia o relatório inicial
    const [totalUnidades, setTotalUnidades] = useState(0);
    const [totalCasos, setTotalCasos] = useState(0);
    const [loading, setLoading] = useState(false);
    function load() {
        setLoading(true);
        UnidadeService.buscar().then(res => {
            setTotalUnidades(res._array.length);
            return CasoService.buscarGeral();
        }).then(res => {
            setLoading(false);
            setTotalCasos(res._array.length);
        }).catch(erro => {
            setLoading(false);
        });
    }
    useEffect(() => {
        load();
        getTipoLayout();
    }, []);

    return(
        <SafeAreaView style={globals.body}>

            <Header />

            <ScrollView style={[globals.conteudo, layout.background]}>

                <ModalLayout call={alterarLayout} />

                <Spinner
                    visible={loading} textContent={"Carregando..."} textStyle={globals.spinnerTextStyle}
                />

                <Text style={[globals.textoGeral, layout.primaryColor]}>Olá, bem-vindo ao aplicativo "Cinco Porquês".</Text>

                <View style={[globals.secao, layout.areaDados]}>
                    <Text style={[globals.textoLabel, layout.primaryColor]}>
                        <Text style={globals.textoLabelBold}>Total de Unidades cadastradas</Text>: {totalUnidades}
                    </Text>
                    <Text style={[globals.textoLabel, layout.primaryColor]}>
                        <Text style={globals.textoLabelBold}>Total de relatórios criados</Text>: {totalCasos}
                    </Text>
                </View>

                <TouchableOpacity style={globals.botao} onPress={() => navegar(nav, "Unidades")}>
                    <Text style={globals.textoBotao}>Unidades Cadastradas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={globals.botao} onPress={() => navegar(nav, "Ajuda")}>
                    <Text style={globals.textoBotao}>Ajuda sobre o Aplicativo</Text>
                </TouchableOpacity>

                <FinalMargin />

            </ScrollView>

            <AdMob />

        </SafeAreaView>
    );
}