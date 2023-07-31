import mysql from 'mysql2/promise';


export default async function ConfirmPayAPI(req, res){
    if(req.method === 'POST'){
      const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DB
      });
  
      db.connect()
  
    const {
      voucher
    } = req.body;
  

const queryGetVoucher = `SELECT * FROM vouchers WHERE voucher = ? AND usado != 'true' AND STR_TO_DATE(validade, '%d/%m/%Y') >= CURRENT_DATE()`;
      
      const valuesGetVoucher = [voucher];
      const resultGetVoucher = await db.execute(queryGetVoucher, valuesGetVoucher);

      if(resultGetVoucher[0].length !== 0){
        res.status(200).send({
            status: true,
            message: "Voucher aplicado com sucesso!"
        })
      }else{
        res.status(200).send({
            status: false,
            message: "Voucher inválido"
        })
      }
    
}}