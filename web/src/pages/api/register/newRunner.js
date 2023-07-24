import mysql from 'mysql2/promise';

export default async function NewRunnerAPI(req, res){
  if(req.method === 'POST'){
    const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB
    });

    db.connect()

  const {id, token, name, cpf, phone, category, bornDate, gender, cep, pcd, lowIncome, numberNIS, cadeirante} = req.body;
  
  const age = bornDate.split('/')[2]
  const status = pcd ? 'analise' : lowIncome ? 'analise' : 2023 - age >= 60 ? 'analise': 'pendente'
  const nis = numberNIS ? numberNIS : null
  const cad = cadeirante ? 1 : 0

  const queryzinha = `SELECT * FROM runners WHERE cpf = ?`
  const valuezinho = [cpf]
  const resultzinho = await db.execute(queryzinha, valuezinho);

  if((resultzinho[0]).length != 0){
    res.status(200).send({status: false, message: "Esse CPF já foi cadastrado."})
  }else{
    const query = `INSERT INTO runners (id, authorId, name, cpf, phone, category, bornDate, gender, cep, status, pcd, cadeirante, lowIncome, nis) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const values = [id, token, name, cpf, phone, category, bornDate, gender, cep, status, pcd, cad, lowIncome, nis];
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
}