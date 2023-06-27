import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { parseCookies } from "nookies";
import { HiClock, HiCheckCircle, HiExclamationCircle } from "react-icons/hi2"
import axios from "axios";

export default function Dashboard({runners, pendingPayment, analisingRunner, confimatedRunner}) {
    const { user } = useContext(AuthContext);

    const router = useRouter();

    return (
        <main>
            <h1>Olá, {user?.nome}</h1>
            <span>seus corredores: </span>
            <div onClick={() => router.push('/dashboard/newRunner')}>ADD CORREDOR</div>
            {runners.map(runner => <p key={runner.id}>{runner?.name} {runner?.cpf} {runner?.status == 'pendente' ? <><HiExclamationCircle/></> : runner?.status == 'confirmado' ? <><HiCheckCircle/></> : runner?.status == 'analise' ? <><HiClock/></> : ''}</p>)}
            {pendingPayment > 0 ? <h1>MAJOR, FALTAM PAGAR {pendingPayment} PESSOAS! PAGUE AGORA CALOTEIRO</h1> : ''}
            {analisingRunner > 0 ? <h1>EXISTE {analisingRunner} PESSOAS EM ANALISE, AGUARDE ENQUANTO VALIDAMOS.</h1> : ''}
            {confimatedRunner > 0 ? <h1>PARABENS, TODOS ESTÃO CONFIRMADOS</h1> : ''}
        </main>
    )
}


export async function getServerSideProps(ctx) {
    const { 'token.authRRUN23' : token} = parseCookies(ctx)
    if(!token){
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }

    var pendingPayment = 0
    var analisingRunner = 0
    var confimatedRunner = 0

    const { data : runners } = await axios.post('/api/info/runnersById', {id: token})
    runners.map(runner => { if(runner.status == 'pendente') pendingPayment+=1; if(runner.status == 'analise') analisingRunner+=1; if(runner.status == 'confirmado') confimatedRunner+=1; })

    return {
        props: {
            token,
            runners,
            pendingPayment,
            analisingRunner,
            confimatedRunner,
        }
    }
}