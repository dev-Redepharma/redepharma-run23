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
import Head from "next/head";

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
    const {register, handleSubmit, setValue} = useForm();
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
    const [voucher, setVoucher] = useState('');
    const [paymentValor, setPaymentValor] = useState(paymentValue)
    
    const router = useRouter()
    
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }

    return(
        <main className={inter.className}>
            <Head>
                <title>Pagamento | Redepharma RUN</title>
            </Head>
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
            {/* {runners.length > 1  && String(paymentValue) !== '0'? 
                <div className={`${styles.infoVoucher}`}>
                    <HiExclamationCircle size={25}></HiExclamationCircle>
                    <span>O Voucher é de uso individual remova uma ou mais pessoas para utiliza-lo.</span>
                </div>
             :
             ''} */}
            {hasError ?  <div className={styles.messageError}>
                <HiExclamationTriangle /><span className='text-center'>{hasError}</span></div> : ''}
            <div className={`${styles.box} ${runners.length > 1 ? '' : styles.boxRunner} ${runners.length > 1 && String(paymentValue) !== '0' ? '' : styles.boxRunnerInfo}`}>
                {String(paymentValue) !== "0" ? 
                <form className={`${styles.formFill}`} onSubmit={handleSubmit((data) => {
                    if (data.voucher.trim().length == 0) {
                        if(cpf.isValid(data.cpf)){
                            if(data.paymentMethod == 'pix'){
                                setIsLoading(true)
                                openModal()
                                console.log(data)
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
                                                    axios.post('/api/info/updateRunner', {chargeId: result.data?.charges[0]?.id, status: result.data?.status, voucher: data.voucher, name: data.name, cpf: data.cpf})
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
                            if(data.paymentMethod == 'boleto'){
                                setIsLoading(true)
                                
                                axios.get(`https://brasilapi.com.br/api/cep/v1/${data.CEP}`)
                                .then(result => {
                                    axios.post('/api/payment/confirm', {...data, token, houseinfo: result.data})
                                        .then(result => {
                                            console.log(result.data)
                                            if(result.data.status == false){
                                                setIsLoading(false)
                                                setHasError("Ocorreu um erro, tente novamente.")
                                                return
                                            }
                                            if(result.data.status == 'failed') {
                                                setIsLoading(false)
                                                setHasError("Falha ao gerar o boleto, verifique seus dados e tente novamente!")
                                                return
                                            }
                                            if(result.data.charges[0].last_transaction.status == 'genereted'){
                                                window.open(result.data.charges[0].last_transaction.pdf)
                                                router.push('/dashboard')
                                                return
                                            }
                                            if(result.data.status == 'pending'){
                                                window.open(result.data.charges[0].last_transaction.pdf)
                                                router.push('/dashboard')
                                                return
                                            }
                                            setIsLoading(false)
                                            setHasError("Ocorreu um erro desconhecido, tente novamente!")
                                        })
                                        .catch(err => {
                                            setIsLoading(false)
                                            setHasError("Ocorreu um erro, tente novamente.")
                                            console.log(err)
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
                    }else {
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
                        }else{
                            setHasError('Selecione o pagamento como voucher')
                        }
                    }
                })}>
                    <div className={`${styles.inputBox}`}>
                        <label>Forma de pagamento:</label>
                        <select {...register('paymentMethod')} onChange={(e) => {setPaymentMethod(e.target.value)}} className={`${styles.inputFill}`} required>
                            <option value=''></option>
                            <option value='pix'>PIX</option>
                            <option value='credito'>Cartão de Crédito</option>
                            <option value='boleto'>Boleto</option>
                            <option value='voucher' disabled={runners.length > 1 ? true : false}>Voucher</option>
                        </select>
                    </div>
                    <div className={`${styles.inputBox}`}>
                        <label>Nome:</label>
                        <input {...register('name')} onChange={(e) => {setCardName(e.target.value)}} className={`${styles.inputFill}`} type='text' required></input>
                    </div>
                    <div className={`${styles.inputBox}`}>
                        <label>CPF:</label>
                        <InputMask {...register("cpf")} className={`${styles.inputFill}`} type='text' mask="999.999.999-99" maskChar="" required></InputMask>
                    </div>
                    {/* DIV SE FOR POR CARTAO */}
                    {(paymentMethod == 'credito' || paymentMethod == 'debito') ? 
                        <div className={`${styles.boxCard}`}>
                            <div className={`${styles.card}`}>
                                <div className={`${styles.cardImageBox}`}>
                                    <img src='/smallLogoRede.png' className={`${styles.cardImage}`}/>
                                </div>
                                <div className={`${styles.inputBox}`}>
                                    <span className={`${styles.cardInfoNumber}`}>{cardName}</span>
                                    <span className={`${styles.cardInfoNumber}`}>{cardNumber}</span>
                                    <div className={`${styles.cardImportantInfo}`}>
                                        <span>{cardValidity}</span>
                                        <span>{cardCVV}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`${styles.cardInformationNumber}`}>
                                <div className={`${styles.inputBox}`}>
                                    <label>Número do cartão:</label>
                                    <InputMask {...register("cardNumber")} onChange={(e) => {setCardNumber(e.target.value)}} className={`${styles.inputFill}`} type='text' mask="9999 9999 9999 9999" maskChar="" required></InputMask>
                                </div>
                                <div className={`${styles.cardInformations}`}>
                                    <div className={`${styles.inputBox}`}>
                                        <label>CVV:</label>
                                        <InputMask {...register("cardCVV")} onChange={(e) => {setCardCVV(e.target.value)}} className={`${styles.inputFill}`} type="text" mask="999" maskChar="" required></InputMask>
                                    </div>
                                    <div className={`${styles.inputBox}`}>
                                        <label>Validade:</label>
                                        <InputMask {...register("cardValidity")} onChange={(e) => {setCardValidity(e.target.value)}} className={`${styles.inputFill}`} type="text" mask="99/99" maskChar="" required></InputMask>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        ''
                    }

                    {/* DIV SE FOR POR VOUCHER */}
                    {/* {(paymentMethod == 'voucher') ? 
                        <div className={`${styles.inputBox}`}>
                            <label>Voucher:</label>
                            <input {...register("voucher")} className={`${styles.inputFill}`} type='text' required></input>
                        </div>
                        :
                        ''
                    } */}

                    {/* CEP - Com validação */}
                    {paymentMethod == 'credito' || paymentMethod == 'boleto' ? 
                        <>
                        <div className={`${styles.inputBox}`}>
                            <label>CEP:</label>
                            <input {...register("CEP")} className={`${styles.inputFill}`} type='number' required></input>
                        </div>
                        <div className={`${styles.inputBox}`}>
                            <label>Número da residência:</label>
                            <input {...register("numeroCasa")} className={`${styles.inputFill}`} type='text' required></input>
                        </div>
                        </>
                        :
                        ''  
                    }


                    {/* QUANTAS VEZES VAI SER PARCELADO */}
                    {(paymentMethod == 'credito') ? 
                        <div className={`${styles.inputBox}`}>
                            <label>Parcelas:</label>
                            <select {...register("parcelas")} className={`${styles.inputFill}`} type='text' required>
                                <option value={1}>1x - R${paymentValor},00</option>
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
                            <div key={runner.id} className={`${styles.shirtInfo}`}>
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
                    <input {...register("paymentValue")} value={paymentValor} type="hidden"/>
                    {runners.length > 1 ? '' : 
                        runners[0].bornDate.split('/')[2] <= 1963 ? '' :
                        <div className='flex items-center mb-2 gap-2'>
                            <div className='flex gap-2'>
                                <label>Voucher:</label>
                                <input type='text' {...register('voucher')} className={`${styles.inputFill}`} onChange={(e) => {
                                    setVoucher(e.target.value)
                                }}/>
                            </div>
                            <div className={`${styles.button} flex items-center justify-center`} onClick={() => {
                                setIsLoading(true)
                                axios.post('/api/payment/voucher', {voucher})
                                .then(result => {
                                    if(result.data.status){
                                        setIsLoading(false)
                                        setHasError(result.data.message)
                                        setPaymentValor(paymentValue * 0)
                                        setValue('paymentValue', paymentValue * 0) 
                                    }else{
                                        setHasError(result.data.message)
                                        setIsLoading(false)
                                    }
                                }).catch(err => {
                                    setIsLoading(false)
                                    console.log(err)
                                    alert('Não foi possível se comunicar com o sistema. Aguarde, em breve o erro será solucionado.')
                                })
                            }}>Aplicar</div>
                        </div>
                    }

                    {/* BOTAO DE PAGAMENTO */}
                    {isLoading ? 
                    <div className={`${styles.loadingBox}`}>
                        <InfinitySpin width="150" color="#6CA721"/>
                    </div>
                    :
                    <div>
                        <input value="Realizar Pagamento" className={styles.button} type="submit"/>
                    </div>
                    }

                    {hasError ?  <div className={styles.messageError}>
                        <HiExclamationTriangle /><span className='text-center'>{hasError}</span></div> : ''}
                </form>
                :
                <form className={`${styles.formFill}`} onSubmit={handleSubmit((data) => {
                    setIsLoading(true);
                    axios.post('/api/payment/confirm', {...data, token})
                    .then(result => {
                        if(result.data.status == false){
                            setIsLoading(false)
                            closeModal()
                            setHasError("Ocorreu um erro, tente novamente.")
                            return
                        }
                        router.push('/dashboard')
                    })
                    .catch(err => {
                        setIsLoading(false)
                        console.log(err)
                        alert('Não foi possível se comunicar com o sistema. Aguarde, em breve o erro será solucionado.')
                    })
                })
                }>
                    <div>
                        <label>Tamanho Camisa:</label>
                        {runners.map((runner, index) => 
                            <div key={runner.id} className={`${styles.shirtInfo}`}>
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
                    <input {...register("paymentMethod")} value="gratis" type="hidden" />
                    {isLoading ? 
                    <div className={`${styles.loadingBox}`}>
                        <InfinitySpin width="150" color="#6CA721"/>
                    </div>
                    :
                    <div>
                        <input value="Realizar Inscrição" className={styles.button} type="submit"/>
                    </div>
                    }
                </form>
                }
                <div className={`${styles.paymentResumeBox}`}>
                    <h1 className={`${styles.paymentResumeTitle}`}>Resumo do pagamento</h1>
                    <div className={`${styles.inputBox}`}>
                        {runners.map(runner => <span key={runner.id} className='italic'>{runner.name} - {runner.pcd ? 'R$0,00' : runner.lowIncome ? 'R$0,00' : Number(((runner.bornDate).split('/'))[2]) <= 1963 ? 'R$'+paymentValor+',00' : 'R$'+paymentValor+',00'}</span>)}
                    </div>
                    <div className={`${styles.paymentResumeTotalPrice}`}>
                        <span className={`${styles.paymentResumeTotalPriceTitle}`}>Subtotal:</span>
                        <span className={`${styles.paymentResumeTotalPriceValue}`}>R${paymentValor},00</span>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="ModalPix"
            >
                <div className={`${styles.modalPaymentPixBox}`}>
                    <h2 className={`${styles.modalPaymentPixBoxTitle}`}>Quase lá!</h2>
                    <HiX onClick={closeModal} size={25} className={`${styles.modalPaymentPixBoxCloseButton}`}/>
                </div>
                <div className={`${styles.modalPaymentPixTitleInfo}`}>
                    <span>Para finalizar o pagamento, basta ler o QR-Code</span>
                    {imgPix ? <img src={imgPix} width={200}/> : <div className={styles.skeletonLoadingPix} />}
                    <span>ou copiar a chave a baixo:</span>
                    {codePix ? <textarea value={codePix} className={`${styles.modalPaymentPixCodeArea}`}/> : <div className={styles.skeletonLoadingCode}/>}
                    {codePix ? <div onClick={() => {
                        navigator.clipboard.writeText(codePix)
                    }} className={`${styles.modalPaymentPixButton} ${styles.button}`}>Copiar</div> : ''}
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

    const { data : runners } = await axios.post('https://redepharma-run23.vercel.app/api/info/runnersPendingById', {id: token})
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