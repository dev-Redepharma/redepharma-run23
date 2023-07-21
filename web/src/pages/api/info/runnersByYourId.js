import mysql from 'mysql2/promise';

export default async function RunnersById(req, res) {
  if(req.method === 'POST'){
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        database: process.env.DB_DB
      });
      db.connect()
      try{
        const { id } = req.body;
        const query = `SELECT * FROM runners WHERE id = ?`;
        const values = [id];
        const result = await db.execute(query, values);
        db.end();
        
        res.status(200).send(result[0])
      }catch{
        db.end();
        res.status(200).send({status: false, message: "Ocorreu um erro com o banco de dados"})
      }
  }
}