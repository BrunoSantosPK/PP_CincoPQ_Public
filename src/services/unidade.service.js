import { DatabaseConnection } from "../database/conexao";

const table = "unidades"
const db = DatabaseConnection.getConnection()

export class UnidadeService {

    static add(unidade) {
        return new Promise((resolve, reject) => db.transaction(
            tx => {
                tx.executeSql(`insert into ${table} (nome, descricao, data) 
                    values (?, ?, ?)`, 
                    [unidade.nome, unidade.descricao, unidade.data],
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

    static deletar(id) {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`delete from ${table} where id_unidade = ?;`,
                [id],
                (_, { rows }) => { resolve(rows) }),
                (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                    console.log(txError);
                }
            )
        );
    }

    static buscar() {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${table}`,
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