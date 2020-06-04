const layout = {
    background: {
        dark: "#423E37",
        light: "#F1F1F1"
    },
    primaryColor: {
        dark: "#FFFFFF",
        light: "#000000"
    },
    areaDados: {
        dark: "#57524A",
        light: "#DFDEDD"
    },
    iconDel: {
        dark: "#FC4A4A",
        light: "#D10000"
    },
    iconMais: {
        dark: "#4EFC4A",
        light: "#1DA823"
    }
};

export default function trocarLayout(tipo) {
    return {
        background: { backgroundColor: layout.background[tipo] },
        primaryColor: { color: layout.primaryColor[tipo] },
        areaDados: { backgroundColor: layout.areaDados[tipo] },
        iconDel: { color: layout.iconDel[tipo] },
        iconMais: { color: layout.iconMais[tipo] }
    };
}
