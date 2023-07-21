import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

export default async function Cadastro(req, res){
  if(req.method === 'POST'){
    const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB
    });
  
    db.connect()
  
    const {id, novaSenha } = req.body;
  
    const senhaEncrypted = await bcrypt.hash(novaSenha, 10)
    const query = `UPDATE accounts SET senha = ? WHERE id = ?`;
    const values = [senhaEncrypted, id];
    await db.execute(query, values)
      .then(() => {
      db.end();
      res.status(200).send({
          message: "Senha modificada com sucesso!",
          status: true
          })
      })
      .catch(err => {
      db.end();
      res.status(200).send({
          message: "Não foi possível alterar a senha, tente novamente!",
          status: false,
          err: err
          })
      })
  }
}