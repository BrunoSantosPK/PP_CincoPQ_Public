import { StyleSheet } from "react-native";

export default StyleSheet.create({
    areaNovo: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingBottom: 10
    },
    textoNovo: {
        marginLeft: 5,
        fontFamily: "Noto",
        fontSize: 14,
        textDecorationLine: "underline"
    },
    textoDel: {
        marginLeft: 5,
        fontFamily: "Noto",
        fontSize: 14
    },
    areaIcon: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    areaIcones: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10
    },
    bodyModal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    contentModal: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    recuoBotaoModal: {
        marginLeft: 20
    }
});