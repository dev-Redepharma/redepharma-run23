import { useState, useEffect } from "react";
import { HiLogout, HiUserAdd, HiUserCircle, HiCheck, HiCash, HiX } from "react-icons/hi";
import { HiExclamationCircle, HiExclamationTriangle } from 'react-icons/hi2';
import { Inter } from "next/font/google";
import { destroyCookie, parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { cpf } from 'cpf-cnpj-validator';
import { InfinitySpin } from  'react-loader-spinner'
import InputMask from 'react-input-mask';
import axios from 'axios';
import Modal from "react-modal";

import styles from '@/styles/Payment.module.css';
import { useForm } from "react-hook-form";

const inter = Inter({ subsets: ['latin'] })

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  Modal.setAppElement('#__next');
export default function Payment({runners, token, paymentValue}){
    const {register, handleSubmit} = useForm();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardValidity, setCardValidity] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imgPix, setImgPix] = useState('');
    const [codePix, setCodePix] = useState('');
    const [hasError, setHasError] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);
    
    const router = useRouter()
    
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }

    return(
        <main className={inter.className}>
            <nav className={`flex w-full items-center justify-between relative`}>
                <div className={styles.navDashboard}>
                    <img className="cursor-pointer" src="/RunBlack.png" onClick={() => {
                        router.push('/dashboard')
                    }}/>
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
            {hasError ?  <div className={styles.messageError}>
                <HiExclamationTriangle /><span className='text-center'>{hasError}</span></div> : ''}
            <div className={`flex justify-center ${runners.length > 1 ? '' : 'pt-[50px]'}`}>
                <form className='px-4 min-w-[500px]' onSubmit={handleSubmit((data) => {
                    if(cpf.isValid(data.cpf)){
                        if(data.paymentMethod == 'pix'){
                            setIsLoading(true)
                            openModal()
                            axios.post('/api/payment/confirm', {...data, token})
                                .then(result => {
                                    if(result.data.status == false){
                                        setIsLoading(false)
                                        closeModal()
                                        setHasError("Ocorreu um erro, tente novamente.")
                                        return
                                    }
                                    setImgPix(result?.data?.charges[0]?.last_transaction?.qr_code_url)
                                    setCodePix(result?.data?.charges[0]?.last_transaction?.qr_code)
    
                                    var checkPayment = setInterval(() => {
                                        axios.post('/api/payment/check', {id: result.data?.charges[0]?.id})
                                        .then(resul => {
                                            if(resul.data?.status == "paid"){
                                                axios.post('/api/info/updateRunner', {chargeId: result.data?.charges[0]?.id, status: result.data?.status})
                                                .then(() => {clearInterval(checkPayment); router.push('/dashboard')})
                                                .catch(() => {clearInterval(checkPayment); alert("Ocorreu um erro na verificação instantânea, não se preocupe, em até 30 minutos verificaremos para você."); router.push('/dashboard')})
                                            }
                                        })
                                        .catch(() => {clearInterval(checkPayment); alert("Ocorreu um erro na verificação instantânea, não se preocupe, em até 30 minutos verificaremos para você."); router.push('/dashboard')})
                                    }, 5000)
                                })
                                .catch(err => {
                                    setHasError("Ocorreu um erro, tente novamente.")
                                    console.log(err)
                                    setIsLoading(false)
                                    closeModal()
                                })
                        }
                        if(data.paymentMethod == 'voucher'){
                            setIsLoading(true)
                            axios.post('/api/payment/confirm', {...data, token})
                            .then(result => {
                                if(result.data.status == false){
                                    setIsLoading(false)
                                    setHasError(result.data.message)
                                    return
                                }
                                router.push('/dashboard')
                            })
                        }
                        if(data.paymentMethod == 'credito'){
                            setIsLoading(true)
                            axios.get(`https://brasilapi.com.br/api/cep/v1/${data.CEP}`)
                            .then(result => {
                                axios.post('/api/payment/confirm', {...data, token, houseinfo: result.data})
                                .then(resultinho => {
                                    if(resultinho.data.status == false){
                                        setIsLoading(false)
                                        setHasError(resultinho.data.message)
                                        if(resultinho.data.tipo == 'processing'){
                                            setIsLoading(true)
                                        }
                                        return
                                    }
                                    router.push('/dashboard')
                                })
                                .catch(err => {
                                    setIsLoading(false)
                                    console.log(err)
                                    setHasError("Ocorreu um erro, tente novamente!")
                                })
                            })
                            .catch(err => {
                                setIsLoading(false)
                                setHasError("CEP não localizado")
                                console.log(err)
                            })
                        }
                    }else{
                        setHasError('CPF Inválido')
                    }
                })}>
                    <div className='flex flex-col'>
                        <label>Forma de pagamento:</label>
                        <select {...register('paymentMethod')} onChange={(e) => {setPaymentMethod(e.target.value)}} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' required>
                            <option value=''></option>
                            <option value='pix'>PIX</option>
                            <option value='credito'>Cartão de Crédito</option>
                            <option value='voucher' disabled={runners.length > 1 ? true : false}>Voucher</option>
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label>Nome:</label>
                        <input {...register('name')} onChange={(e) => {setCardName(e.target.value)}} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' required></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>CPF:</label>
                        <InputMask {...register("cpf")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' mask="999.999.999-99" maskChar="" required></InputMask>
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
                                    <InputMask {...register("cardNumber")} onChange={(e) => {setCardNumber(e.target.value)}} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' mask="9999 9999 9999 9999" maskChar="" required></InputMask>
                                </div>
                                <div className='flex gap-3'>
                                    <div className='flex flex-col'>
                                        <label>CVV:</label>
                                        <InputMask {...register("cardCVV")} onChange={(e) => {setCardCVV(e.target.value)}} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type="text" mask="999" maskChar="" required></InputMask>
                                    </div>
                                    <div className='flex flex-col'>
                                        <label>Validade:</label>
                                        <InputMask {...register("cardValidity")} onChange={(e) => {setCardValidity(e.target.value)}} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type="text" mask="99/99" maskChar="" required></InputMask>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        ''
                    }

                    {/* DIV SE FOR POR VOUCHER */}
                    {(paymentMethod == 'voucher') ? 
                        <div className='flex flex-col'>
                            <label>Voucher:</label>
                            <input {...register("voucher")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' required></input>
                        </div>
                        :
                        ''
                    }

                    {/* CEP - Com validação */}
                    {paymentMethod == 'credito'? 
                        <>
                        <div className='flex flex-col'>
                            <label>CEP:</label>
                            <input {...register("CEP")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='number' required></input>
                        </div>
                        <div className='flex flex-col'>
                            <label>Número da residência:</label>
                            <input {...register("numeroCasa")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' required></input>
                        </div>
                        </>
                        :
                        ''  
                    }


                    {/* QUANTAS VEZES VAI SER PARCELADO */}
                    {(paymentMethod == 'credito') ? 
                        <div className='flex flex-col'>
                            <label>Parcelas:</label>
                            <select {...register("parcelas")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' required>
                                <option value={1}>1x - R${paymentValue},00</option>
                                {runners.length > 1 ? <option value={2}>2x - R${Number(paymentValue)/2},00</option> : ''}
                                {runners.length > 3 ? <option value={3}>3x - R${Number(paymentValue)/3},00</option> : ''}
                            </select>
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
                    {/* Input referente ao valor */}
                    <input {...register("paymentValue")} value={paymentValue} type="hidden"/>
                    {/* BOTAO DE PAGAMENTO */}
                    {isLoading ? 
                    <div className="w-full flex items-center justify-center">
                        <InfinitySpin width="150" color="#6CA721"/>
                    </div>
                    :
                    <div>
                        <input value="Realizar Pagamento" className={styles.button} type="submit"/>
                    </div>
                    }
                </form>
                <div className='bg-white flex flex-col rounded-[20px] p-4 justify-between'>
                    <h1 className='italic font-bold text-[20px]'>Resumo do pagamento</h1>
                    <div className='flex flex-col'>
                        {runners.map(runner => <span key={runner.id} className='italic'>{runner.name} - {runner.pcd ? 'R$0,00' : runner.lowIncome ? 'R$0,00' : Number(((runner.bornDate).split('/'))[2]) <= 1963 ? 'R$50,00' : 'R$100,00'}</span>)}
                    </div>
                    <div className='flex flex-col items-end'>
                        <span className='italic text-[22px] leading-[5px]'>Subtotal:</span>
                        <span className='font-black text-[27px] italic'>R${paymentValue},00</span>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="ModalPix"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-[24px] font-bold italic">Quase lá!</h2>
                    <HiX onClick={closeModal} size={25} className="cursor-pointer transition text-[rgba(0,0,0,0.5)] hover:text-[rgba(0,0,0,1)]"/>
                </div>
                <div className="flex mt-5 flex-col justify-center items-center">
                    <span>Para finalizar o pagamento, basta ler o QR-Code</span>
                    {imgPix ? <img src={imgPix} width={200}/> : <div className={styles.skeletonLoadingPix} />}
                    <span>ou copiar a chave a baixo:</span>
                    {codePix ? <textarea value={codePix} className="resize-none w-full h-[100px] bg-[rgba(0,0,0,0.07) border-[2px] border-[#000]"/> : <div className={styles.skeletonLoadingCode}/>}
                    {codePix ? <div onClick={() => {
                        navigator.clipboard.writeText(codePix)
                    }} className={`items-center justify-center flex mt-5 ${styles.button}`}>Copiar</div> : ''}
                </div>
            </Modal>
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
    var paymentValue = 0
    runners.map(runner => {
        if(runner.pcd || runner.lowIncome){
            paymentValue += 0
        }else if(Number(((runner.bornDate).split('/'))[2]) <= 1963){
            paymentValue += 50
        }else{
            paymentValue += 100
        }
    })

    if(runners.length == 0){
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            }
        }
    }

    return {
        props: {
            token,
            runners,
            paymentValue
        }
    }
}