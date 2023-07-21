import axios from "axios";

export default async function Check(req, res) {
    if(req.method === 'POST'){
        const { id } = req.body;
        axios.get(`https://api.pagar.me/core/v5/charges/${id}`, { headers: { Authorization: `Basic ${process.env.PAGARME_KEY}`}})
        .then(resul => {
            res.status(200).send({status: resul.data?.status})
        })
    }
}