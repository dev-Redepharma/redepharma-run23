import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { parseCookies } from "nookies";
import { HiClock, HiCheckCircle, HiExclamationCircle, HiPrinter } from "react-icons/hi2"
import { HiLogout, HiUserAdd, HiUserCircle, HiCheck, HiCash } from "react-icons/hi";
import axios from "axios";
import styles from "@/styles/Dashboard.module.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'] })

export default function Dashboard({runners, pendingPayment, analisingRunner, confimatedRunner}) {
    const { user } = useContext(AuthContext);

    const router = useRouter();

    return (
        <main className={inter.className}>
            <nav className={`flex w-full items-center justify-between relative`}>
                <div className={styles.navDashboard}>
                    <img src="RunBlack.png"/>
                    <div className="flex items-center gap-2">
                    <span className="text-[17px] font-bold italic">Sair</span>
                    <HiLogout></HiLogout>  
                    </div>
                </div>
                <div className={styles.gradientBorder}></div>
            </nav>
            <div className="py-[45px] px-[100px]">
                <div className="flex justify-between items-center pb-7 border-b-[1px] border-black">
                    <h1 className="text-[32px] font-bold italic">Corredores</h1>
                    <div className="flex gap-8">
                        <span>
                            2/3 Confirmados
                        </span>
                        <div className="flex gap-2 items-center">
                            <HiUserAdd size={25}></HiUserAdd>
                            <span>Novo Corredor</span>
                        </div>
                    </div>
                </div>
                <div className="py-[45px] px-[100px] flex justify-center gap-4">
                    <HiExclamationCircle size={25}></HiExclamationCircle>
                    <span>Você ainda não cadastrou nenhum corredor, que tal começarmos por você?</span>
                </div>
                <div className="p-4 flex items-center justify-between border-b-[1px] border-black">
                    <div className="flex gap-4 items-center">
                        <HiUserCircle size={25}></HiUserCircle>
                        <span>Pedro Gonçalves</span>
                        <span>054.***.***-04</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <HiCheck size={25}></HiCheck>
                        <span>Pagamento Confirmado</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <HiPrinter size={25}></HiPrinter>
                        <span>Imprimir cartão de confirmação</span>
                    </div>
                </div>
                <div className="flex justify-between py-[45px]">
                    <p>Resta o pagamento de X pessoa(s). <br/>Garanta a inscrição, realize o pagamento.</p>
                    <div className="flex items-center gap-2">
                        <HiCash size={25}></HiCash>
                        <span>Pagar Agora</span>
                    </div>
                </div>
                <div className="flex w-full justify-center">
                    <span>Parabéns, sua(s) inscrição(ões) está(ão) confirmada(s)</span>
                </div> 
            </div>
            
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