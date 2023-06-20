import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt'

export default async function AddFilial(req, res) {
    const db = await mysql.createConnection({
        host: 'redepharma.com.br',
        user: 'redeph12_corrida',
        password:'redeph12@corrida',
        database: 'redeph12_run23'
      });
      db.connect()
      try{
        const { email, senha } = req.body;
        const query = `SELECT * FROM accounts WHERE email = ?`;
        const values = [email];
        const result = await db.execute(query, values);
        db.end();

        var output = {}
        if((result[0]).length != 0) {
            var password_hash=result[0][0]["senha"];
            const verified = bcrypt.compareSync(senha, password_hash);
            if(verified) {
                output["status"] = true;
                output["token"] = result[0][0].id
                output["user"] = {
                    id: result[0][0].id,
                    nome: result[0][0].nome,
                    email: result[0][0].email
                }
            }else{
                output["status"] = false;
                output["message"] = "A senha está errada";
            }
        }else{
            output["status"] = false;
            output["message"] = "Este usuário não existe";
        }
        
        res.status(200).send(output)
      }catch{
        db.end();
        res.status(444).send({error: "Ocorreu um erro com o banco de dados"})
      }
}