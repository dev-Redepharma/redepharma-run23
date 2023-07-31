import mysql from 'mysql2/promise';

export default async function UpdateRunner(req, res) {
  if(req.method === 'POST'){
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        database: process.env.DB_DB
      });
      db.connect()
      try{
        const { chargeId, status, voucher, name, cpf } = req.body;
        const query = `SELECT camisas FROM transactions WHERE chargeId = ?`;
        const values = [chargeId];
        const result = await db.execute(query, values);

        const queryUpdate = `UPDATE transactions SET status = ? WHERE chargeId = ?`;
        const valuesUpdate = [status, chargeId];
        db.execute(queryUpdate, valuesUpdate);

        const queryUpdateVoucher = `UPDATE vouchers SET usado = 'true', nome = ?, cpf = ? WHERE voucher = ?`
        const valuesUpdateVoucher = [name, cpf, voucher]
        db.execute(queryUpdateVoucher, valuesUpdateVoucher)
        
        var runners = JSON.parse(result[0][0].camisas);

        runners.map(async runner => {
            const queryzinha = `UPDATE runners SET status = 'confirmado', shirtSize = ? WHERE id = ?`;
            const valuezinho = [runner.tamanho, runner.id]
            await db.execute(queryzinha, valuezinho)
        })
        
        db.end()
        res.status(200).send({status: true, message: "Pagamento realizado"})
      }catch(err){
        db.end();
        res.status(200).send({status: false, message: "Ocorreu um erro com o banco de dados", err})
      }
  }
}