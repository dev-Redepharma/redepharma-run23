import mysql from 'mysql2/promise';
import {v4} from 'uuid';

export default async function NewRunnerAPI(req, res){
    const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB
    });

    db.connect()

  const {token, name, cpf, phone, category, bornDate, gender, cep, pcd, lowIncome} = req.body;

  const status = pcd ? 'analise' : lowIncome ? 'analise' : 'pendente'

  const queryzinha = `SELECT * FROM runners WHERE cpf = ?`
  const valuezinho = [cpf]
  const resultzinho = await db.execute(queryzinha, valuezinho);

  if((resultzinho[0]).length != 0){
    res.status(200).send({status: false, message: "Esse CPF já foi cadastrado."})
  }else{
    const query = `INSERT INTO runners (id, authorId, name, cpf, phone, category, bornDate, gender, cep, status, pcd, lowIncome) VALUES ('${v4()}', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const values = [token, name, cpf, phone, category, bornDate, gender, cep, status, pcd, lowIncome];
    await db.execute(query, values)
      .then(() => {
        db.end();
        res.status(200).send({
            message: "Corredor cadastrado com sucesso!",
            status: true
            })
        })
        .catch(err => {
        db.end();
        res.status(200).send({
            message: "Não foi possível cadastrar o corredor, tente novamente!",
            status: false,
            err: err
            })
        })
    }

}