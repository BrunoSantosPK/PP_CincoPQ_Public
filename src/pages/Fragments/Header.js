import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import Constants from "expo-constants";

import logoCinza from "../../assets/logo-cinza.png";
import logoPreta from "../../assets/logo-preta.png";

export default function Header() {
    return (
        <View style={style.barra}>
            <Text style={style.titulo}>Cinco Porquês</Text>
            <Image source={logoCinza} />
        </View>
    );
}

const style = new StyleSheet.create({
    barra: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingTop: Constants.statusBarHeight + 10,
        paddingBottom: 10,
        backgroundColor: "#d10000"
    },
    titulo: {
        fontFamily: "MontserratBold",
        fontSize: 20,
        color: "#fff"
    }
});