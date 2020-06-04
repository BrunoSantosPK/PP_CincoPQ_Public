import React, { useState } from "react";
import { View, Modal, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import globals from "./globalStyle";

export default function ModalLayout({ call }) {
    const [visibilidade, setVisibilidade] = useState(false);

    function alterar(tipo) {
        call(tipo);
        setVisibilidade(false);
    }

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visibilidade}
                onRequestClose={() => setVisibilidade(false)}
            >
                <View style={style.bodyModal}>
                    <View style={style.contentModal}>
                        <Text style={style.textoModal}>Escolha o layout que deseja utilizar nesta aplicação.</Text>

                        <View style={style.areaBotoes}>
                            <TouchableOpacity style={globals.botao} onPress={() => alterar("light")}>
                                <Text style={globals.textoBotao}>Layout Claro</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={globals.botao} onPress={() => alterar("dark")}>
                                <Text style={globals.textoBotao}>Layout Escuro</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={style.abrirModal}>
                <TouchableOpacity onPress={() => setVisibilidade(true)}>
                    <Text style={style.textoAbertura}>
                        <Feather name="settings" size={13}></Feather>
                        Alterar Layout
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const style = StyleSheet.create({

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

    textoModal: {
        fontFamily: "Roboto",
        fontSize: 20
    },
    
    areaBotoes: {
        paddingVertical: 20
    },

    abrirModal: {
        alignItems: "flex-end",
    },

    textoAbertura: {
        marginBottom: 30,
        fontFamily: "RobotoBold",
        fontSize: 14,
        backgroundColor: "#D10000",
        paddingVertical: 5,
        paddingHorizontal: 10,
        color: "#FFFFFF",
        borderRadius: 8
    }

});