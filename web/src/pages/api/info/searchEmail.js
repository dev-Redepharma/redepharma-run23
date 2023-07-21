import mysql from 'mysql2/promise';

export default async function SearchEmail(req, res) {
    if(req.method === 'POST'){
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password:process.env.DB_PASSWORD,
            database: process.env.DB_DB
          });
          db.connect()
          try{
            const { email } = req.body;
            const query = `SELECT * FROM accounts WHERE email = ?`;
            const values = [email];
            const result = await db.execute(query, values);
            db.end();
    
            var output = {}
            if((result[0]).length != 0) {
                output["uuid"] = result[0][0].id; 
                output["status"] = true;
                output["message"] = "Email localizado";
        
            }else{
                output["status"] = false;
                output["message"] = "Este email não existe";
            }
            
            res.status(200).send(output)
          }catch{
            db.end();
            res.status(200).send({status: false, message: "Ocorreu um erro com o banco de dados"})
          }
    }
}