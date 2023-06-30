import mysql from 'mysql2/promise';
import {v4} from 'uuid'
import axios from 'axios';

export default async function ConfirmPayAPI(req, res){
    const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB
    });

    db.connect()

  const {name, cpf, token, paymentMethod, paymentValue, cardNumber, cardCVV, cardValidity, camisa0, camisa1, camisa2, camisa3, camisa4, camisa5, camisa6, camisa7, camisa8, camisa9} = req.body;
   
  // Verificações se existem camisas
   const camisa = []
    if(camisa0){
      camisa.push({id: (camisa0.split('/'))[1], tamanho: (camisa0.split('/'))[0]})
    }
    if(camisa1){
      camisa.push({id: (camisa1.split('/'))[1], tamanho: (camisa1.split('/'))[0]})
    }
    if(camisa2){
      camisa.push({id: (camisa2.split('/'))[1], tamanho: (camisa2.split('/'))[0]})
    }
    if(camisa3){
      camisa.push({id: (camisa3.split('/'))[1], tamanho: (camisa3.split('/'))[0]})
    }
    if(camisa4){
      camisa.push({id: (camisa4.split('/'))[1], tamanho: (camisa4.split('/'))[0]})
    }
    if(camisa5){
      camisa.push({id: (camisa5.split('/'))[1], tamanho: (camisa5.split('/'))[0]})
    }
    if(camisa6){
      camisa.push({id: (camisa6.split('/'))[1], tamanho: (camisa6.split('/'))[0]})
    }
    if(camisa7){
      camisa.push({id: (camisa7.split('/'))[1], tamanho: (camisa7.split('/'))[0]})
    }
    if(camisa8){
      camisa.push({id: (camisa8.split('/'))[1], tamanho: (camisa8.split('/'))[0]})
    }
    if(camisa9){
      camisa.push({id: (camisa9.split('/'))[1], tamanho: (camisa9.split('/'))[0]})
    }

    const queryMoreInfo = `SELECT * FROM accounts WHERE id = ?`;
    const valuesMoreInfo = [token];
    const moreInfo = await db.execute(queryMoreInfo, valuesMoreInfo)

    const queryFirstRunner = `SELECT * FROM runners WHERE id = ?`;
    const valuesFirstRunner = [(camisa0.split('/'))[1]]
    const firstRunner = await db.execute(queryFirstRunner, valuesFirstRunner);

    if(paymentMethod == 'pix') {
      axios.post('https://api.pagar.me/core/v5/orders/', {
        "customer": {
              "phones": {
                  "mobile_phone": {
                        "country_code": "55",
                        "area_code": (firstRunner[0][0].phone).substring(0, 2),
                        "number": "9"+((firstRunner[0][0].phone).substring(5)).replaceAll('-', '')
                  }
              },
              "name": name,
              "type": "individual",
              "email": moreInfo[0][0].email,
              "gender": "male",
              "document": (cpf.replaceAll('.', '')).replaceAll('-', '')
        },
        "items": [
              {
                  "amount": Number(paymentValue + '00'),
                  "description": "Circuito Redepharma RUN 2023",
                  "quantity": 1
              }
        ],
        "payments": [
              {
                  "Pix": {
                        "expires_in": 86400
                  },
                  "payment_method": "pix"
              }
        ]
     }, {
      headers: {
          "Authorization": `Basic ${process.env.PAGARME_KEY}`,
          "Content-Type": "application/json"
      }
      })
      .then(async result => {
        const queryPix = `INSERT INTO transactions (id, transId, chargeId, accountId, tipo, valor, status, camisas, data) VALUES ('${v4()}', ?, ?, ?, ?, ?, ?, ?, ?)`
        const valuesPix = [result.data.charges[0].last_transaction.id, result.data.charges[0].id, token, paymentMethod, paymentValue, result.data.status, JSON.stringify(camisa), result.data.created_at]
        await db.execute(queryPix, valuesPix)
        db.end()
        res.status(200).send(result.data)
      })
      .catch(err => {
        res.status(200).send({status: false, message: "Ocorreu um erro de conexão com a empresa responsável pelo pagamento.", err})
      })
    }

}
