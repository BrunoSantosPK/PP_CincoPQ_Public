import { StyleSheet } from "react-native";

export default StyleSheet.create({

    body: {
        flex: 1
    },

    conteudo: {
        paddingHorizontal: 20,
        paddingTop: 25
    },

    botao: {
        borderRadius: 8,
        backgroundColor: "#D10000",
        paddingHorizontal: 15,
        paddingVertical: 5,
        alignItems: "center",
        marginTop: 10
    },

    textoBotao: {
        color: "#FFFFFF",
        fontFamily: "NotoBold",
        fontSize: 16
    },

    textoGeral: {
        fontFamily: "Noto",
        fontSize: 16,
        marginBottom: 10
    },

    textoLabel: {
        fontFamily: "Noto",
        fontSize: 14,
        marginBottom: 5
    },

    textoIcon: {
        fontFamily: "Noto",
        fontSize: 14,
    },

    textoLabelBold: {
        fontFamily: "NotoBold",
        fontSize: 15
    },

    spinnerTextStyle: {
        color: "#FFF"
    },

    secao: {
        marginBottom: 10,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingTop: 5,
        paddingBottom: 15
    },

    input: {
        borderStyle: "solid",
        borderColor: "#000000",
        borderWidth: 1,
        paddingLeft: 2,
        fontFamily: "Noto",
        fontSize: 15,
        paddingVertical: 2
    }

});