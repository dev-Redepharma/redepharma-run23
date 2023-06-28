import mysql from 'mysql2/promise';

export default async function ConfirmPayAPI(req, res){
    // const db = await mysql.createConnection({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_DB
    // });

    // db.connect()

  const {name, cpf, paymentMethod, camisa0, camisa1, camisa2, camisa3, camisa4, camisa5, camisa6, camisa7, camisa8, camisa9} = req.body;
    // Verificações se existem camisas
  if(camisa0){
    var id = (camisa0.split('/'))[1]
    var tamanho = (camisa0.split('/'))[0]
  }

  res.status(200).send({
    name, cpf, paymentMethod, tamanho, id
  })

//   const query = `DELETE FROM runners WHERE (id = ?);`;
//   const values = [id];
//   await db.execute(query, values)
//     .then(() => {
//     res.status(200).send({
//       message: "Corredor removido com sucesso!",
//       status: true
//       })
//     })
//     .catch(err => {
//     res.status(200).send({
//       message: "Não foi possível remover o corredor, tente novamente!",
//       status: false,
//       err: err
//       })
//     })

}
