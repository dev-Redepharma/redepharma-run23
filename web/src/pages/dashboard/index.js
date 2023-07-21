import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { destroyCookie, parseCookies } from "nookies";
import { HiClock, HiCheckCircle, HiExclamationCircle, HiPrinter, HiXCircle } from "react-icons/hi2"
import { HiLogout, HiUserAdd, HiUserCircle, HiCash, HiX } from "react-icons/hi";
import { Inter } from "next/font/google";
import axios from "axios";
import Head from "next/head";

import styles from "@/styles/Dashboard.module.css";

const inter = Inter({ subsets: ['latin'] })

export default function Dashboard({runners, pendingPayment, analisingRunner, confimatedRunner, token}) {
    const { user } = useContext(AuthContext);
    const [hasPayment, setHasPayment] = useState('');

    const router = useRouter();

    function setAndOpenModal(data) {
        if(window.confirm("Ao remover essa pessoa, os dados dela serão apagados, e caso ela vá correr, você precisará preencher todos os dados novamente.")){
            axios.post('/api/register/removeRunner', {id: data}).then(result => {location.reload()}).catch(err => {alert("Erro desconhecido, se persistir, por favor, entrar em contato com a Redepharma"); console.log(err)})
        }else{
            return
        }
    }

    useEffect(() => {
        axios.post('/api/info/runnersPayedPendingById', {id: token})
        .then(result => {
            (result.data).map(payment => {
                if(payment.tipo == 'pix'){
                    setHasPayment("Existe um pagamento via PIX pendente. Em até 30 minutos analisaremos para você!")
                }
                if(payment.tipo == 'boleto'){
                    setHasPayment("Existe um pagamento por Boleto pendente. Em até 72 horas analisaremos para você!")
                }
            })
        })
        .catch(err => {console.log(err)})
    }, [])

    return (
        <main className={inter.className}>
            <Head>
                <title>Painel | Redepharma RUN</title>
            </Head>
            <nav className={`${styles.nav}`}>
                <div className={styles.navDashboard}>
                    <img src="RunBlack.png" onClick={() => {router.push('/')}}/>
                    <div className={`${styles.navLogout}`} onClick={() => {destroyCookie(null, 'token.authRRUN23'); router.push('/login')}}>
                        <span>Sair</span>
                        <HiLogout></HiLogout>  
                    </div>
                </div>
                <div className={styles.gradientBorder}></div>
            </nav>
            <div className={`${styles.topTitle}`}>
                <div className={`${styles.topBoxInfo} ${runners.length < 1 ? '' :  styles.topBoxInfoIf}`}>
                    <h1 className={`${styles.topBoxTitle}`}>Corredores</h1>
                    <div className={`${styles.topBoxDetails}`}>
                        <span>
                            {confimatedRunner}/{runners.length} Confirmados
                        </span>
                        <div onClick={() => router.push('/dashboard/newRunner')} className={`${styles.boxAddRunner} ${styles.button}`}>
                            <HiUserAdd size={25}></HiUserAdd>
                            <span>Novo Corredor</span>
                        </div>
                    </div>
                </div>
                {runners.length < 1 ? 
                <div className={`${styles.messageInfoAbout}`}>
                    <HiExclamationCircle size={25}></HiExclamationCircle>
                    <span>Você ainda não cadastrou nenhum corredor, que tal começarmos por você?</span>
                </div> : 
                <>
                {runners.map(runner => 
                    <div key={runner.id} className={`${styles.runnerTable}`}>
                        <div className={`${styles.runnerTableFirstColumn}`}>
                            <HiUserCircle size={25}></HiUserCircle>
                            <span>{runner.name}</span>
                            <span>{runner.cpf}</span>
                        </div>
                        <div className={`${styles.runnerTableMiddleColumn}`}>
                            {runner.status == 'confirmado' ? <HiCheckCircle size={25} /> : ''}
                            {runner.status == 'pendente' ? <HiExclamationCircle size={25} /> : ''}
                            {runner.status == 'analise' ? <HiClock size={25} /> : ''}
                            {runner.status == 'negado' ? <HiXCircle size={25} /> : ''}
                            {runner.status == 'confirmado' ? <span>Pagamento Confirmado</span> : ''}
                            {runner.status == 'pendente' ? <span>Pagamento Pendente</span> : ''}
                            {runner.status == 'analise' ? <span>Em Análise</span> : ''}
                            {runner.status == 'negado' ? <span>Negado</span> : ''}
                        </div>
                        
                        {/* VERIFICA SE ESSA PESSOA JÁ PAGOU */}
                        {runner.status == 'confirmado' ? 
                        <div onClick={() => {router.push(`/dashboard/confirm/${runner.id}`)}} className={`${styles.buttonStatusRunner} ${styles.runnerTableFinalColumn}`}>
                            <HiPrinter size={25}></HiPrinter>
                            <span>Imprimir cartão de confirmação</span>
                        </div>
                         : 
                        <div onClick={() => setAndOpenModal(runner.id)} className={`${styles.buttonStatusRunner} ${styles.runnerTableFinalColumn}`}>
                            <HiX size={25}></HiX>
                            <span>Retirar corredor</span>
                        </div>
                        }
                    </div>
                    
                    )}

                {/* SE TIVER EM ANÁLISE ELE AVISA SOBRE O TEMPO */}
                {analisingRunner ? 
                    <div className={`${styles.timeWarning}`}>
                        <span>Pessoas em análise podem levar até 72hrs para serem validadas</span>
                    </div>
                : ''}
                
                {/* MOSTRA SE EXISTE UM PAGAMENTO PENDENTE */}
                {hasPayment && runners.length !== confimatedRunner ?
                    <div className={`${styles.infoAboutPayment} ${analisingRunner ? '' : styles.infoAboutPaymentAnalysing}}`}>
                        <b>{hasPayment}</b>
                    </div>
                : ''}

                {/* VERIFICA SE EXISTE AINDA PESSOAS PARA PAGAR */}
                {pendingPayment ? 
                    <div className={`${styles.infoAboutPendingPayment} ${analisingRunner ? '' : styles.infoAboutPendingPaymentAnalysing}`}>
                        <p>Resta o pagamento de {pendingPayment} pessoa(s). <br/>Garanta a inscrição, realize o pagamento.</p>
                        <div className={`${styles.payButton} ${styles.button}`} onClick={() => {
                            router.push('/dashboard/payment')
                        }}>
                            <HiCash size={25}></HiCash>
                            <span>Pagar Agora</span>
                        </div>
                    </div>
                : ''}

                {/* VERIFICAR SE ESTÃO TODOS CONFIRMADOS, E SE É MAIOR QUE 1*/}
                {runners.length == confimatedRunner ? 
                    confimatedRunner > 1 ?
                        <div className={`${styles.boxInfoSubscription}`}>
                            <span className={`${styles.messageInfoAboutSubscription}`}>Parabéns, suas inscrições estão confirmadas</span>
                        </div> : 
                        <div className={`${styles.boxAboutSubscription}`}>
                            <span>Parabéns, sua inscrição está confirmada</span>
                        </div> :
                '' }
                </>
                }
            </div>
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

    const { data : runners } = await axios.post('https://redepharma-run23.vercel.app/api/info/runnersById', {id: token})
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