import { DatabaseConnection } from "./conexao";

let db = null;
export class DatabaseInit {

    constructor() {
        db = DatabaseConnection.getConnection()
        db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () => console.log('Foreign keys turned on'));
        this.InitDb()
    }

    InitDb() {
        const sql = [
            `create table if not exists unidades (
                id_unidade integer primary key autoincrement,
                nome text,
                descricao text,
                data integer
         
            );`,
            `create table if not exists tags (
                id_tag integer primary key autoincrement,
                nome text,
                descricao text,
                ativo integer
            );`,
             `create table if not exists casos (
                id_caso integer primary key autoincrement,
                id_unidade int,
                data integer,
                descricao text,
                acoes text,
                pqs text,
                foreign key (id_unidade) references unidades (id_unidade)
            );`,
            `create table if not exists casos_tags (
                id_caso int,
                id_tag int,
                foreign key (id_caso) references casos (id_caso),
                foreign key (id_tag) references tags (id_tag)
            )`
        ];

        db.transaction(
            tx => {
                for(let i = 0; i < sql.length; i++) {
                    tx.executeSql(sql[i]);
                }
            }, (error) => {
                console.log(`Ocorreu um erro : ${JSON.stringify(error)}`);
                console.log(error);
            }, () => {
                console.log("Todas as ações iniciais foram finalizadas");
            }
        );
    }

}