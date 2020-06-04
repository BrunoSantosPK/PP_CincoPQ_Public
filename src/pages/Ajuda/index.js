import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, SafeAreaView, ScrollView, AsyncStorage } from "react-native";

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

export default function Ajuda() {
    const nav = useNavigation();

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

    useEffect(() => {
        getTipoLayout();
    }, []);

    // Gerencia os textos
    const conteudo = [
        `Olá, seja bem-vindo(a) ao aplicativo "Cinco Porquês". Aqui você poderá cadastrar as unidades, equipamentos ou processos (o jeito que você desejar chamar), para os quais poderá anexar relatórios de manutenção utilizando a técnica dos 5 Porquês.`,
        `É bem simples, mais vou te dar algumas dicas para você não ter nenhum problema. Vamos lá.`,
        `A primeira coisa que você precisa fazer é cadastrar o seu equipamento, processo ou unidade para o qual vai anexar os relatórios 5 Porquês. Aqui no aplicativos, chamados tudo genericamente de "Unidades".`,
        `No menu principal, acesse "Unidades Cadastradas", logo depois clique em "Cadastrar Nova". Você será levado para uma tela com os campos para preencher. Assim que informar o pedido, só clicar no botão "SALVAR".`,
        `Pronto! Sua Unidade foi criada e o aplicativo te leverá para a tela anterior, onde você verá a sua Unidade.`,
        `Você poderá Deletar ela, clicando em "Deletar", ou então poderá começar a gerar os relatórios 5 Porquês. Para isso, só clicar em "Visualizar Casos".`,
        `Sempre que quiser criar um novo relatório, clique em "Cadastrar Novo", preencha os dados pedidos em tela e por fim clique em "SALVAR".`,
        `Na tela de visualização de casos, os relatórios 5 Porquês são ordenados do mais recente para o mais antigo. Se quiser fazer alguma alteração, só clicar em "Alterar Dados". Se quiser deletar, só clicar em "Deletar".`,
        `Viu como é fácil? Espero que faça bom uso do aplicativo. E antes que eu me esqueça, você poode alterar as cores, clicando no menu "Alterar Layout" no início de qualquer tela. Se estiver com dificuldade de ler, use essa função. Até a próxima.`
    ];

    return(
        <SafeAreaView style={globals.body}>

            <Header />

            <ScrollView style={[globals.conteudo, layout.background]}>

                <ModalLayout call={alterarLayout} />

                {conteudo.map((texto, indc) => (
                    <Text style={[globals.textoGeral, layout.primaryColor]} key={indc}>{texto}</Text>
                ))}

                <FinalMargin />
            </ScrollView>

            <AdMob />

        </SafeAreaView>
    );
}