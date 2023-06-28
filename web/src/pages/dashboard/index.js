import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { destroyCookie, parseCookies } from "nookies";
import { HiClock, HiCheckCircle, HiExclamationCircle, HiPrinter } from "react-icons/hi2"
import { HiLogout, HiUserAdd, HiUserCircle, HiCash, HiX } from "react-icons/hi";
import { Inter } from "next/font/google";
import axios from "axios";

import styles from "@/styles/Dashboard.module.css";

const inter = Inter({ subsets: ['latin'] })

export default function Dashboard({runners, pendingPayment, analisingRunner, confimatedRunner}) {
    const { user } = useContext(AuthContext);

    const router = useRouter();

    function setAndOpenModal(data) {
        if(window.confirm("Ao remover essa pessoa, os dados dela serão apagados, e caso ela vá correr, você precisará preencher todos os dados novamente.")){
            axios.post('/api/register/removeRunner', {id: data}).then(result => {location.reload()}).catch(err => {alert("Erro desconhecido, se persistir, por favor, entrar em contato com a Redepharma"); console.log(err)})
        }else{
            return
        }
    }

    return (
        <main className={inter.className}>
            <nav className={`flex w-full items-center justify-between relative`}>
                <div className={styles.navDashboard}>
                    <img src="RunBlack.png"/>
                    <div className="flex items-center gap-2" onClick={() => {destroyCookie(null, 'token.authRRUN23'); router.push('/login')}}>
                    <span className="text-[17px] font-bold italic">Sair</span>
                    <HiLogout></HiLogout>  
                    </div>
                </div>
                <div className={styles.gradientBorder}></div>
            </nav>
            <div className="py-[45px] px-[100px]">
                <div className={`flex justify-between items-center pb-7 ${runners.length < 1 ? '' : 'border-b-[1px] border-black'}`}>
                    <h1 className="text-[32px] font-bold italic">Corredores</h1>
                    <div className="flex gap-8 items-center">
                        <span>
                            {confimatedRunner}/{runners.length} Confirmados
                        </span>
                        <div onClick={() => router.push('/dashboard/newRunner')} className={`flex gap-2 items-center ${styles.button}`}>
                            <HiUserAdd size={25}></HiUserAdd>
                            <span>Novo Corredor</span>
                        </div>
                    </div>
                </div>
                {runners.length < 1 ? 
                <div className="py-[45px] px-[100px] flex justify-center gap-4">
                    <HiExclamationCircle size={25}></HiExclamationCircle>
                    <span>Você ainda não cadastrou nenhum corredor, que tal começarmos por você?</span>
                </div> : 
                <>
                {runners.map(runner => 
                    <div key={runner.id} className="p-4 flex items-center justify-between border-b-[1px] border-black">
                        <div className="flex gap-4 items-center">
                            <HiUserCircle size={25}></HiUserCircle>
                            <span>{runner.name}</span>
                            <span>{runner.cpf}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {runner.status == 'confirmado' ? <HiCheckCircle size={25} /> : ''}
                            {runner.status == 'pendente' ? <HiExclamationCircle size={25} /> : ''}
                            {runner.status == 'analise' ? <HiClock size={25} /> : ''}
                            {runner.status == 'confirmado' ? <span>Pagamento Confirmado</span> : ''}
                            {runner.status == 'pendente' ? <span>Pagamento Pendente</span> : ''}
                            {runner.status == 'analise' ? <span>Em Análise</span> : ''}
                        </div>
                        
                        {/* VERIFICA SE ESSA PESSOA JÁ PAGOU */}
                        {runner.status == 'confirmado' ? 
                        <div className="flex items-center gap-4">
                            <HiPrinter size={25}></HiPrinter>
                            <span>Imprimir cartão de confirmação</span>
                        </div>
                         : 
                        <div onClick={() => setAndOpenModal(runner.id)} className="flex items-center gap-4">
                            <HiX size={25}></HiX>
                            <span>Retirar corredor</span>
                        </div>
                        }
                    </div>
                    
                    )}

                {/* SE TIVER EM ANÁLISE ELE AVISA SOBRE O TEMPO */}
                    {analisingRunner ? 
                    <div className="flex w-full py-[45px] justify-center">
                        <span>Pessoas em análise podem levar até 72hrs para serem validadas</span>
                    </div>
                    : ''}
                
                {/* VERIFICA SE EXISTE AINDA PESSOAS PARA PAGAR */}
                {pendingPayment ? 
                    <div className={`flex justify-between ${analisingRunner ? '' : 'py-[45px]'}`}>
                        <p>Resta o pagamento de {pendingPayment} pessoa(s). <br/>Garanta a inscrição, realize o pagamento.</p>
                        <div className={`flex items-center gap-2 ${styles.button}`}>
                            <HiCash size={25}></HiCash>
                            <span>Pagar Agora</span>
                        </div>
                    </div>
                : ''}

                {/* VERIFICAR SE ESTÃO TODOS CONFIRMADOS, E SE É MAIOR QUE 1*/}
                {runners.length == confimatedRunner ? 
                    confimatedRunner > 1 ?
                        <div className="flex w-full py-[45px] justify-center">
                            <span>Parabéns, suas inscrições estão confirmadas</span>
                        </div> : 
                        <div className="flex w-full py-[45px] justify-center">
                            <span>Parabéns, sua inscrição está confirmada</span>
                        </div> :
                '' }
                </>
                }
            </div>
            
            {/* <h1>Olá, {user?.nome}</h1>
            <span>seus corredores: </span>
            <div onClick={() => router.push('/dashboard/newRunner')}>ADD CORREDOR</div>
            {runners.map(runner => <p key={runner.id}>{runner?.name} {runner?.cpf} {runner?.status == 'pendente' ? <><HiExclamationCircle/></> : runner?.status == 'confirmado' ? <><HiCheckCircle/></> : runner?.status == 'analise' ? <><HiClock/></> : ''}</p>)}
            {pendingPayment > 0 ? <h1>MAJOR, FALTAM PAGAR {pendingPayment} PESSOAS! PAGUE AGORA CALOTEIRO</h1> : ''}
            {analisingRunner > 0 ? <h1>EXISTE {analisingRunner} PESSOAS EM ANALISE, AGUARDE ENQUANTO VALIDAMOS.</h1> : ''}
            {confimatedRunner > 0 ? <h1>PARABENS, TODOS ESTÃO CONFIRMADOS</h1> : ''} */}
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
    runners.map(runner => {
        if(runner.status == 'pendente') pendingPayment+=1;
        if(runner.status == 'analise') analisingRunner+=1;
        if(runner.status == 'confirmado') confimatedRunner+=1;
    })

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