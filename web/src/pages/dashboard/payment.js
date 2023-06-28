import { useState, useEffect } from "react";
import { HiLogout, HiUserAdd, HiUserCircle, HiCheck, HiCash } from "react-icons/hi";
import { HiExclamationCircle } from 'react-icons/hi2';
import { Inter } from "next/font/google";
import { destroyCookie, parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import axios from 'axios';

import styles from '@/styles/Payment.module.css';
import { useForm } from "react-hook-form";

const inter = Inter({ subsets: ['latin'] })

export default function Payment({runners, token}){
    const {register, handleSubmit} = useForm();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentValue, setPaymentValue] = useState(0);
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardValidity, setCardValidity] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    
    const router = useRouter()

    useEffect(() => {
        runners.map(runner => {
            if(runner.pcd || runner.lowIncome){
                setPaymentValue(old => old.valueOf() + 0)
            }else if(Number(((runner.bornDate).split('/'))[2]) <= 1963){
                setPaymentValue(old => old.valueOf() + 50)
            }else{
                setPaymentValue(old => old.valueOf() + 100)
            }
        })
    }, [])
    return(
        <main className={inter.className}>
            <nav className={`flex w-full items-center justify-between relative`}>
                <div className={styles.navDashboard}>
                    <img src="/RunBlack.png"/>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => {destroyCookie(null, 'token.authRRUN23'); router.push('/login')}}>
                        <span className="text-[17px] font-bold italic">Sair</span>
                        <HiLogout></HiLogout>  
                    </div>
                </div>
                <div className={styles.gradientBorder}></div>
            </nav>
            {runners.length > 1 ? 
                <div className="py-[45px] px-[100px] flex justify-center gap-4">
                    <HiExclamationCircle size={25}></HiExclamationCircle>
                    <span>O Voucher é de uso individual remova uma ou mais pessoas para utiliza-lo.</span>
                </div>
             :
             ''}
            <div className={`flex justify-center ${runners.length > 1 ? '' : 'pt-[50px]'}`}>
                <form className='px-4 min-w-[500px]' onSubmit={handleSubmit((data) => {
                    axios.post('/api/payment/confirm', data)
                        .then(result => {console.log(result.data)})
                        .catch(err => {console.log(err)})
                })}>
                    <div className='flex flex-col'>
                        <label>Forma de pagamento:</label>
                        <select {...register('paymentMethod')} onChange={(e) => {setPaymentMethod(e.target.value)}} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' required>
                            <option value=''></option>
                            <option value='pix'>PIX</option>
                            <option value='credito'>Cartão de Crédito</option>
                            <option value='debito'>Cartão de Débito</option>
                            <option value='boleto'>Boleto</option>
                            <option value='voucher' disabled={runners.length > 1 ? true : false}>Voucher</option>
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label>Nome:</label>
                        <input {...register('name')} onChange={(e) => {setCardName(e.target.value)}} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' required></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>CPF:</label>
                        <input {...register('cpf')} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' required></input>
                    </div>
                    {/* DIV SE FOR POR CARTAO */}
                    {(paymentMethod == 'credito' || paymentMethod == 'debito') ? 
                        <div className='flex justify-center items-center'>
                            <div className={`${styles.card} flex flex-col p-4 mt-3`}>
                                <div className='pb-4'>
                                    <img src='/smallLogoRede.png' className='w-[50px] h-[50px]'/>
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-white font-bold'>{cardName}</span>
                                    <span className='text-white italic'>{cardNumber}</span>
                                    <div className='flex gap-4 text-white font-bold'>
                                        <span>{cardValidity}</span>
                                        <span>{cardCVV}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='pl-4'>
                                <div className='flex flex-col'>
                                    <label>Número do cartão:</label>
                                    <input onChange={(e) => {setCardNumber(e.target.value)}} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' required></input>
                                </div>
                                <div className='flex gap-3'>
                                    <div className='flex flex-col'>
                                        <label>CVV:</label>
                                        <input onChange={(e) => {setCardCVV(e.target.value)}} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type="text" required></input>
                                    </div>
                                    <div className='flex flex-col'>
                                        <label>Validade:</label>
                                        <input onChange={(e) => {setCardValidity(e.target.value)}} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type="text" required></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        ''
                    }
                    <div>
                        <label>Tamanho Camisa:</label>
                        {runners.map((runner, index) => 
                            <div key={runner.id} className='flex gap-2'>
                                <span>{runner.name}:</span>
                                <div>
                                    <input {...register("camisa"+index)} type="radio" value={`p/${runner.id}`} id={'camisaP' + runner.id} required/>
                                    <label htmlFor={'camisaP' + runner.id}>P</label>
                                </div>
                                <div>
                                    <input {...register("camisa"+index)} type="radio" value={`m/${runner.id}`} id={'camisaM' + runner.id} required/>
                                    <label htmlFor={'camisaM' + runner.id}>M</label>
                                </div>
                                <div>
                                    <input {...register("camisa"+index)} type="radio" value={`g/${runner.id}`} id={'camisaG' + runner.id} required/>
                                    <label htmlFor={'camisaG' + runner.id}>G</label>
                                </div>
                                <div>
                                    <input {...register("camisa"+index)} type="radio" value={`gg/${runner.id}`} id={'camisaGG' + runner.id} required/>
                                    <label htmlFor={'camisaGG' + runner.id}>GG</label>
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <input value="Realizar Pagamento" className={styles.button} type="submit"/>
                    </div>
                </form>
                <div className='bg-white flex flex-col rounded-[20px] p-4 justify-between'>
                    <h1 className='italic font-bold text-[20px]'>Resumo do pagamento</h1>
                    <div className='flex flex-col'>
                        {runners.map(runner => <span key={runner.id} className='italic'>{runner.name} - {runner.pcd ? 'R$0,00' : runner.lowIncome ? 'R$0,00' : Number(((runner.bornDate).split('/'))[2]) <= 1963 ? 'R$50,00' : 'R$100,00'}</span>)}
                    </div>
                    <div className='flex flex-col items-end'>
                        <span className='italic text-[22px] leading-[5px]'>Subtotal:</span>
                        <span className='font-black text-[27px] italic'>R${paymentValue/2},00</span>
                    </div>
                </div>
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

    const { data : runners } = await axios.post('/api/info/runnersPendingById', {id: token})

    return {
        props: {
            token,
            runners
        }
    }
}