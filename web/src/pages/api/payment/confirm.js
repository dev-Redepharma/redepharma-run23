import mysql from 'mysql2/promise';
import axios from 'axios';
import date from 'date-and-time';
import {v4} from 'uuid'

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
    name,
    cpf,
    token,
    paymentMethod,
    paymentValue,
    voucher,
    cardNumber,
    cardCVV,
    cardValidity,
    numeroCasa,
    parcelas,
    houseinfo,
    camisa0,
    camisa1,
    camisa2,
    camisa3,
    camisa4,
    camisa5,
    camisa6,
    camisa7,
    camisa8,
    camisa9
  } = req.body;
   
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
        db.end()
        res.status(200).send({status: false, message: "Ocorreu um erro de conexão com a empresa responsável pelo pagamento.", err})
      })
    }

    if(paymentMethod == 'voucher') {
      const queryGetVoucher = `SELECT * FROM vouchers WHERE voucher = ? AND usado != 'true' AND STR_TO_DATE(validade, '%d/%m/%Y') >= CURRENT_DATE()`;
      
      const valuesGetVoucher = [voucher];
      const resultGetVoucher = await db.execute(queryGetVoucher, valuesGetVoucher);
      
      if((resultGetVoucher[0]).length !== 0) {
        camisa.map(runner => {
          const queryUpdateVoucherRunner = `UPDATE runners SET status = 'confirmado', shirtSize = ? WHERE id = ?`;
          const valueUpdateVoucherRunner = [runner.tamanho, runner.id];
          db.execute(queryUpdateVoucherRunner, valueUpdateVoucherRunner);
          const queryUseVoucher = `UPDATE vouchers SET usado = 'true', nome = ?, cpf = ? WHERE id = ?`;
          const valuesUseVoucher = [name, cpf, resultGetVoucher[0][0].id];
          db.execute(queryUseVoucher, valuesUseVoucher);
          db.end()
          res.status(200).send({status: true, message: "Voucher aplicado com sucesso"})
        })
      }else{
        db.end()
        res.status(200).send({status: false, message: "Voucher inválido ou já utilizado"})
      }
    }

    if(paymentMethod == 'credito') {
      axios.post('https://api.pagar.me/core/v5/orders/', {
        "items": [
          {
              "amount": Number(paymentValue + '00'),
              "code": "RRUN2023",
              "description": "Circuito Redepharma RUN 2023",
              "quantity": 1
          }
      ],
      "customer": {
          "name": name,
          "email": moreInfo[0][0].email,
          "phones": {
            "mobile_phone": {
                  "country_code": "55",
                  "area_code": (firstRunner[0][0].phone).substring(0, 2),
                  "number": "9"+((firstRunner[0][0].phone).substring(5)).replaceAll('-', '')
            }
          },
          "document": (cpf.replaceAll('.', '')).replaceAll('-', ''),
          "type": "Individual"

      },
      "payments": [
          {
              "payment_method": "credit_card",
              "credit_card": {
                  "recurrence": false,
                  "installments": Number(parcelas),
                  "statement_descriptor": "RUN 23",
                  "card": {
                      "number": cardNumber.replaceAll(' ', ''),
                      "holder_name": name,
                      "exp_month": Number(cardValidity.split('/')[0]),
                      "exp_year": Number(cardValidity.split('/')[1]),
                      "cvv": String(cardCVV),
                      "billing_address": {
                          "line_1": `${houseinfo.street}, ${numeroCasa}`,
                          "zip_code": String(houseinfo.cep),
                          "city": houseinfo.city,
                          "state": houseinfo.state,
                          "country": "BR"                
                      }
                  }
              }
          }
      ]
     }, {
      headers: {
          "Authorization": `Basic ${process.env.PAGARME_KEY}`,
          "Content-Type": "application/json"
      }
      })
      .then(async result => {
        const queryCredito = `INSERT INTO transactions (id, transId, chargeId, accountId, tipo, valor, status, camisas, data) VALUES ('${v4()}', ?, ?, ?, ?, ?, ?, ?, ?)`
        const valuesCredito = [result.data.charges[0].last_transaction.id, result.data.charges[0].id, token, paymentMethod, paymentValue, result.data.status, JSON.stringify(camisa), result.data.created_at]
        await db.execute(queryCredito, valuesCredito)
        db.end()

        if(result.data.status == 'paid'){
          axios.post('/api/info/updateRunner', {chargeId: result.data.charges[0].id, status: 'paid'})
          .then(resul => {
            res.status(200).send({status: true, message: "Pagamento autorizado"})
          })
          .catch(err => {
            res.status(200).send({status: false, message: "Não foi possível atualizar o status do seu pagamento, não se preocupe, em até 30 minutos confirmaremos para você!"})
          })
        }

        if(result.data.status == 'failed'){
          res.status(200).send({status: false, message: "Falha no pagamento, verifique seus dados e tente novamente", tipo: 'failed'})
        }

        if(result.data.status == 'processing'){
          res.status(200).send({status: false, message: "Seu pagamento está sendo processado, em até 30 minutos confirmaremos para você. Aguarde!", tipo: 'processing'})
        }
      })
      .catch(err => {
        if(err.message == 'The request is invalid.') {
          res.status(200).send({status: false, message: "Solicitação de pagamento inválida, revise seus dados de pagamento e tente novamente"})
        }else{
          res.status(200).send({status: false, message: "Erro desconhecido, verifique seus dados e tente novamente."})
        }
      })
    }

    if(paymentMethod == 'boleto') {
      let now = new Date();
      let dueDate = date.format(date.addDays(now, 3), 'YYYY-MM-DD');

      axios.post('https://api.pagar.me/core/v5/orders/', {
        "items": [
            {
                "amount": Number(paymentValue + '00'),
                "description": "Circuito Redepharma RUN 2023",
                "code": "RRUN2023",
                "quantity": 1
            }
        ],
        "customer": {
            "name": name,
            "email": moreInfo[0][0].email,
            "document_type": "CPF",
            "document": (cpf.replaceAll('.', '')).replaceAll('-', ''),
            "type": "Individual",
            "phones": {
              "mobile_phone": {
                    "country_code": "55",
                    "area_code": (firstRunner[0][0].phone).substring(0, 2),
                    "number": "9"+((firstRunner[0][0].phone).substring(5)).replaceAll('-', '')
              }
            },
            "address": {
              "line_1": `${houseinfo.street}, ${numeroCasa}`,
              "line_2": houseinfo.neighborhood,
              "zip_code": String(houseinfo.cep),
              "city": houseinfo.city,
              "state": houseinfo.state,
              "country": "BR"
          }
        },
        "payments": [
          {
            "payment_method": "boleto",
            "boleto": {
              "instructions": "Pagar até o vencimento",
              "due_at": `${dueDate}T00:00:00Z`,
              "document_number": 'VRBOL' + (v4()).split('-')[2]+(v4()).split('-')[3],
              "type": "DM"            
              }
          }
        ]
      }, {
        headers: {
            "Authorization": `Basic ${process.env.PAGARME_KEY}`,
            "Content-Type": "application/json"
        }
      })
        .then(async result => {
          const queryBoleto = `INSERT INTO transactions (id, transId, chargeId, accountId, tipo, valor, status, camisas, data) VALUES ('${v4()}', ?, ?, ?, ?, ?, ?, ?, ?)`
          const valuesBoleto = [result.data.charges[0].last_transaction.id, result.data.charges[0].id, token, paymentMethod, paymentValue, result.data.status, JSON.stringify(camisa), result.data.created_at]
          await db.execute(queryBoleto, valuesBoleto)
          db.end()
          res.status(200).send(result.data)
        })
        .catch(err => {
          db.end()
          res.status(200).send({status: false, message: "Ocorreu um erro de conexão com a empresa responsável pelo pagamento.", err});
        })
    }
  }
}