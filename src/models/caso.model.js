export class Caso {

    constructor(id_unidade, descricao, acoes, pqs) {
        this.id_unidade = id_unidade;
        this.descricao = descricao;
        this.acoes = acoes;
        this.pqs = pqs;

        this.erro = false;
        this.log = "";

        this.montar();
    }

    setID(id_caso) {
        this.id_caso = id_caso;
    }

    montar() {
        // Valida a descrição do caso
        if(this.descricao == "") {
            this.erro = true;
            this.log = "A descrição informada está em branco, por favor revise.";
            return;
        }

        // Valida as ações
        if(this.acoes == "") {
            this.erro = true;
            this.log = "Nenhuma ação foi informada, por favor revise.";
            return;
        }

        // Valida os porquês
        for(let i = 0; i < this.pqs.length; i++) {
            if(this.pqs[i].trim() == "") {
                this.erro = true;
                this.log = `Um dos porquês (${i + 1}º) está em branco, por favor revise`;
                return;
            }
        }

        let pqs = "";
        for(let i = 0; i < this.pqs.length; i++) {
            pqs += `${this.pqs[i].trim()}<br>`;
        }
        this.pqs = pqs;

        this.data = (new Date()).getTime();

    }

    getValidacao() {
        return {
            erro: this.erro,
            log: this.log
        };
    }

}