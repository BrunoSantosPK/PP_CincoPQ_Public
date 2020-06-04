import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const AppStack = createStackNavigator();

import Inicio from "./pages/Inicio";
import Ajuda from "./pages/Ajuda";
import Casos from "./pages/Casos";
import NovaUnidade from "./pages/NovaUnidade";
import NovoCaso from "./pages/NovoCaso";
import Unidades from "./pages/Unidades";

export default function Routes() {
    return (
        <NavigationContainer>
            <AppStack.Navigator screenOptions={{ headerShown: false }}>
                <AppStack.Screen name="Inicio" component={Inicio} />
                <AppStack.Screen name="Ajuda" component={Ajuda} />
                <AppStack.Screen name="Casos" component={Casos} />
                <AppStack.Screen name="NovaUnidade" component={NovaUnidade} />
                <AppStack.Screen name="NovoCaso" component={NovoCaso} />
                <AppStack.Screen name="Unidades" component={Unidades} />
            </AppStack.Navigator>
        </NavigationContainer>
    );
}