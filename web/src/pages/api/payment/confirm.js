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

  const {name, cpf, paymentMethod, paymentValue, cardNumber, cardCVV, cardValidity, camisa0, camisa1, camisa2, camisa3, camisa4, camisa5, camisa6, camisa7, camisa8, camisa9} = req.body;
   
  // Verificações se existem camisas
   const camisa = []
    if(camisa0){
      camisa.push({id0: (camisa0.split('/'))[1], tamanho0: (camisa0.split('/'))[0]})
    }
    if(camisa1){
      camisa.push({id1: (camisa1.split('/'))[1], tamanho1: (camisa1.split('/'))[0]})
    }
    if(camisa2){
      camisa.push({id2: (camisa2.split('/'))[1], tamanho2: (camisa2.split('/'))[0]})
    }
    if(camisa3){
      camisa.push({id3: (camisa3.split('/'))[1], tamanho3: (camisa3.split('/'))[0]})
    }
    if(camisa4){
      camisa.push({id4: (camisa4.split('/'))[1], tamanho4: (camisa4.split('/'))[0]})
    }
    if(camisa5){
      camisa.push({id5: (camisa5.split('/'))[1], tamanho5: (camisa5.split('/'))[0]})
    }
    if(camisa6){
      camisa.push({id6: (camisa6.split('/'))[1], tamanho6: (camisa6.split('/'))[0]})
    }
    if(camisa7){
      camisa.push({id7: (camisa7.split('/'))[1], tamanho7: (camisa7.split('/'))[0]})
    }
    if(camisa8){
      camisa.push({id8: (camisa8.split('/'))[1], tamanho8: (camisa8.split('/'))[0]})
    }
    if(camisa9){
      camisa.push({id9: (camisa9.split('/'))[1], tamanho9: (camisa9.split('/'))[0]})
    }

    if(paymentMethod == 'pix') {
      axios.post('https://api.pagar.me/core/v5/orders/', {
        "customer": {
              "phones": {
                  "mobile_phone": {
                        "country_code": "55",
                        "area_code": "83",
                        "number": "993818054"
                  }
              },
              "name": name,
              "type": "individual",
              "email": "kcaiosouza@gmail.com",
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
      .then(result => {
        res.status(200).send(result.data)
        return
      })
      .catch(err => {
        res.status(200).send({status: false, message: "Ocorreu um erro de conexão com a empresa responsável pelo pagamento."})
      })
    }

db.end()
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
