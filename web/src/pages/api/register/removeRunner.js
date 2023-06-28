import mysql from 'mysql2/promise';

export default async function RemoveRunnerAPI(req, res){
    const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB
    });

    db.connect()

  const {id} = req.body;

  const query = `DELETE FROM runners WHERE (id = ?);`;
  const values = [id];
  await db.execute(query, values)
    .then(() => {
    db.end();
    res.status(200).send({
      message: "Corredor removido com sucesso!",
      status: true
      })
    })
    .catch(err => {
    db.end();
    res.status(200).send({
      message: "Não foi possível remover o corredor, tente novamente!",
      status: false,
      err: err
      })
    })

}
