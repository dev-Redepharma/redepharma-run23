import styles from '@/styles/Payment.module.css';
import { HiLogout, HiUserAdd, HiUserCircle, HiCheck, HiCash } from "react-icons/hi";
import { HiExclamationCircle } from 'react-icons/hi2';

import { Inter } from "next/font/google";
import { destroyCookie } from 'nookies';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })

export default function Payment(){
    const router = useRouter()
    return(
        <main className={inter.className}>
            <nav className={`flex w-full items-center justify-between relative`}>
                <div className={styles.navDashboard}>
                    <img src="/RunBlack.png"/>
                    <div className="flex items-center gap-2" onClick={() => {destroyCookie(null, 'token.authRRUN23'); router.push('/login')}}>
                        <span className="text-[17px] font-bold italic">Sair</span>
                        <HiLogout></HiLogout>  
                    </div>
                </div>
                <div className={styles.gradientBorder}></div>
            </nav>
            <div className="py-[45px] px-[100px] flex justify-center gap-4">
                <HiExclamationCircle size={25}></HiExclamationCircle>
                <span>O Voucher é de uso individual remova uma ou mais pessoas para utiliza-lo.</span>
            </div>
            <div className='flex justify-center'>
                <form className='px-4'>
                    <div className='flex flex-col'>
                        <label>Forma de pagamento:</label>
                        <select className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]'>
                            <option></option>
                            <option>PIX</option>
                            <option>Cartão de Crédito</option>
                            <option>Cartão de Débito</option>
                            <option>Boleto</option>
                            <option>Voucher</option>
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label>Nome:</label>
                        <input className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>CPF:</label>
                        <input className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text'></input>
                    </div>
                    <div className='flex justify-center items-center'>
                        <div className={`${styles.card} flex flex-col p-4 mt-3`}>
                            <div className='pb-4'>
                                <img src='/smallLogoRede.png' className='w-[50px] h-[50px]'/>
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-white font-bold'>CAIO S SANTOS</span>
                                <span className='text-white italic'>0000 0000 0000 0000</span>
                                <div className='flex gap-4 text-white font-bold'>
                                    <span>01/30</span>
                                    <span>001</span>
                                </div>
                            </div>
                        </div>
                        <div className='pl-4'>
                            <div className='flex flex-col'>
                                <label>Número do cartão:</label>
                                <input className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text'></input>
                            </div>
                            <div className='flex gap-3'>
                                <div className='flex flex-col'>
                                    <label>CVV:</label>
                                    <input className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type="text"></input>
                                </div>
                                <div className='flex flex-col'>
                                    <label>Validade:</label>
                                    <input className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type="text"></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label>Tamanho Camisa:</label>
                        <div className='flex gap-2'>
                            <span>Thiago Neto:</span>
                            <div>
                                <input type="radio" value="p" id="camisaP"/>
                                <label for="camisaP">P</label>
                            </div>
                            <div>
                                <input type="radio" value="m" id="camisaM"/>
                                <label for="camisaM">M</label>
                            </div>
                            <div>
                                <input type="radio" value="g" id="camisaG"/>
                                <label for="camisaG">G</label>
                            </div>
                            <div>
                                <input type="radio" value="gg" id="camisaGG"/>
                                <label for="camisaGG">GG</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <input value="Realizar Pagamento" type="submit"/>
                    </div>
                </form>
                <div className='bg-white flex flex-col rounded-[20px] p-4 justify-between'>
                    <h1 className='italic font-bold text-[20px]'>Resumo do pagamento</h1>
                    <div className='flex flex-col'>
                        <span className='italic'>Thiago Neto - R$100,00</span>
                        <span className='italic'>Joséfa Rosangela - R$0,00</span>
                    </div>
                    <div className='flex flex-col items-end'>
                        <span className='italic text-[22px] leading-[5px]'>Subtotal:</span>
                        <span className='font-black text-[27px] italic'>R$100,00</span>
                    </div>
                </div>
            </div>
        </main>
    )
}