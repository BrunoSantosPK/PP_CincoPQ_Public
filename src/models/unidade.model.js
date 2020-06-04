export class Unidade {
    constructor(nome, descricao) {
        this.nome = nome;
        this.descricao = descricao;
        this.data = (new Date()).getTime();
    }
}