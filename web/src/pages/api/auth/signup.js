import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import {v4} from 'uuid';

export default async function Cadastro(req, res){
    const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB
    });

    db.connect()

  const {nome, senha, email} = req.body;



  const queryzinha = `SELECT * FROM accounts WHERE email = ?`
  const valuezinho = [email]
  const resultzinho = await db.execute(queryzinha, valuezinho);

  if((resultzinho[0]).length != 0){
    res.status(409).send({status: false, message: "Esse e-mail já foi utilizado."})
  }else{
    const senhaEncrypted = await bcrypt.hash(senha, 10)
    const query = `INSERT INTO accounts VALUES ('${v4()}', ?, ?, ?)`;
    const values = [nome, email, senhaEncrypted];
    await db.execute(query, values)
      .then(() => {
        res.status(200).send({
            message: "Usuário, cadastrado com sucesso, você já pode utilizar nosso sistema!",
            status: true
            })
        })
        .catch(err => {
        res.status(444).send({
            message: "Não foi possível criar o usuário, tente novamente!",
            status: false,
            err: err
            })
        })
    }

}