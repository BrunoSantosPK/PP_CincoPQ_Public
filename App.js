import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as Font from "expo-font";
import { AppLoading } from "expo";

import Routes from "./src/routes";

// Conexão com o banco de dados
import { DatabaseInit } from "./src/database/DatabaseInit";

const loadFonts = () => {
  return Font.loadAsync({
    "Noto": require("./assets/fonts/Noto.ttf"),
    "NotoBold": require("./assets/fonts/NotoBold.ttf"),
    "Roboto": require("./assets/fonts/Roboto.ttf"),
    "RobotoBold": require("./assets/fonts/RobotoBold.ttf"),
    "Montserrat": require("./assets/fonts/Montserrat.ttf"),
    "MontserratBold": require("./assets/fonts/MontserratBold.ttf")
  });
};

export default function App() {
  useEffect(() => {
    new DatabaseInit()
  }, []);
  const [dataFont, setDataFont] = useState(false);


  if(!dataFont) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setDataFont(true)}
      />
    );
  }
  
  return (
    <Routes />
  );
}