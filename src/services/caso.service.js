import { DatabaseConnection } from "../database/conexao";

const db = DatabaseConnection.getConnection()

export class CasoService {

    static add(caso) {
        return new Promise((resolve, reject) => db.transaction(
            tx => {
                tx.executeSql(`insert into casos (id_unidade, data, descricao, acoes, pqs) 
                    values (?, ?, ?, ?, ?)`, 
                    [caso.id_unidade, caso.data, caso.descricao, caso.acoes, caso.pqs],
                    (_, { insertId, rows }) => {
                        console.log("id insert: " + insertId);
                        resolve(insertId)
                    }), (sqlError) => {
                        console.log(sqlError);
                    }
                }, (txError) => {
                    console.log(txError);
                }
            )
        );
    }

    static deletar(id_caso) {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`delete from casos where id_caso = ?;`,
                [id_caso],
                (_, { rows }) => { resolve(rows) }),
                (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                    console.log(txError);
                }
            )
        );
    }

    static deletarTudo(id_unidade) {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`delete from casos where id_unidade = ?;`,
                [id_unidade],
                (_, { rows }) => { resolve(rows) }),
                (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                    console.log(txError);
                }
            )
        );
    }


    static atualizar(caso) {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`update casos set descricao = ?, acoes = ?, pqs = ? where id_caso = ?;`,
                [caso.descricao, caso.acoes, caso.pqs, caso.id_caso],
                () => { resolve([]) }),
                (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                    console.log(txError);
                }
            )
        );
    }

    static buscarCaso(id_caso) {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from casos where id_caso = ?`,
                [id_caso],
                (_, { rows }) => { resolve(rows); }),
                (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                    console.log(txError);
                }
            )
        );
    }

    static buscarTodos(id_unidade) {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from casos where id_unidade = ?`,
                [id_unidade],
                (_, { rows }) => { resolve(rows); }),
                (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                    console.log(txError);
                }
            )
        );
    }

    static buscarGeral() {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from casos`,
                [],
                (_, { rows }) => { resolve(rows); }),
                (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                    console.log(txError);
                }
            )
        );
    }

}