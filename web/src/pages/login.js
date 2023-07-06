import { useRouter } from 'next/router';
import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form'
import { Inter } from 'next/font/google'
import { Loading } from "@/components/Loading";
import { AuthContext } from '@/contexts/AuthContext';
import { parseCookies, setCookie } from 'nookies';
import Modal from 'react-modal';
import { HiAtSymbol, HiLockClosed } from 'react-icons/hi';
import { HiExclamationTriangle } from 'react-icons/hi2';
import axios from 'axios'
import { InfinitySpin } from 'react-loader-spinner';

import styles from '@/styles/Login.module.css'

const inter = Inter({ subsets: ['latin'] })

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    },
  };

Modal.setAppElement('#__next');

export default function Login() {
    const {register, handleSubmit} = useForm();
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState('')
    const { setLogin } = useContext(AuthContext)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const router = useRouter()
    
    if(isLoading){
        return (
            <main>
                <Loading/>
            </main>
        )
    }else{
        return (
            <main className={`flex items-center justify-center h-[100vh] ${inter.className}`}>
                <div className={styles.borderGradient}>
                    <div className={styles.containerMain}>
                        <div className={styles.formDiv}>
                            <h1 className='text-4xl font-bold italic text-[#72153D] mb-9'>Entrar</h1>
                            <form onSubmit={handleSubmit((data) => {
                                setIsLoading(true)
                                axios.post('/api/auth/login', data)
                                .then(result => {
                                    setIsLoading(false)
                                    if(result.data.status == false) {
                                        setHasError(result.data.message)
                                    }else{
                                        setLogin(result.data)
                                        if(data.longLogin){
                                            setCookie(null, 'token.authRRUN23', result.data.token, {
                                                maxAge: 60 * 60 * 24 * 30 // 30 dias
                                            })
                                        }else{
                                            setCookie(null, 'token.authRRUN23', result.data.token, {
                                                maxAge: 60 * 60 * 5 // 5 horas
                                            })
                                        }
                                        router.push("/dashboard")
                                    }
                                })
                                .catch(err => {
                                    console.log(err)
                                    alert("Ocorreu um erro, tente novamente mais tarde")
                                })
                            })}>
                                <div className={styles.groupInput}>
                                    <div className={styles.inputUser}>
                                        <p>Email:</p>
                                        <input {...register("email")} type='email' className={styles.input} autoComplete='username' placeholder='exemplo@email.com' required/>
                                        <HiAtSymbol height={18} color="#bbb"/>
                                    </div>
                                    <div className={styles.inputPassword}>
                                        <p>Senha:</p>
                                        <input {...register("senha")} className={styles.input} type="password" autoComplete='current-password' placeholder='••••••' required/>
                                        <HiLockClosed height={18} color="#bbb"/>
                                    </div>
                                </div>

                                <div className={styles.groupRow}>
                                    <div className={styles.checkRemember}>
                                    <label className={styles.chk}>
                                        <input {...register("longLogin")} type='checkbox'/>
                                        <span/>
                                        <p>Lembrar por 30 dias</p>
                                    </label>
                                    </div>
                                    <div className={styles.boxChange} onClick={openModal}>
                                        <span>Esqueci a senha</span>
                                    </div>
                                </div>
                                <div className={styles.groupInput}>
                                    <input className={styles.button} value="Entrar" type="submit"/>
                                    <div className={styles.messageError}>
                                        {hasError ? <><HiExclamationTriangle /><span className='text-center'>{hasError}</span></> : ''}
                                    </div>
                                </div>
                            </form>
                            <div className={`${styles.boxChange} flex justify-center`} onClick={() => router.push('/subscribe')}>
                                <span>Registre-se</span>
                            </div>
                            <Modal
                                isOpen={modalIsOpen}
                                onRequestClose={closeModal}
                                style={customStyles}
                                contentLabel="Example Modal"
                            >
                                <form className='flex flex-col w-[65vh] ' onSubmit={handleSubmit((data) => {
                                    setIsSending(true)
                                    axios.post('/api/info/searchEmail', data)
                                    .then(result => {
                                        if(result.data.status == true){
                                            axios.get(`https://inventario.redepharma.com.br/sendEmail.php?email=${data.email}&id=${result.data.uuid}`).then((resul) =>{
                                            if(resul.data == 'FOI'){
                                                setMessage('Email enviado com sucesso! É possível que o email se localize na sua caixa de spam')
                                                setIsSending(false)
                                            }else{
                                                setMessage('Erro ao enviar o email')
                                                setIsSending(false)
                                            }
                                        }).catch(err => {
                                            console.log(err)
                                            setMessage('Erro ao enviar o email')
                                            setIsSending(false)
                                        })
                                        }else{
                                            setMessage(result.data.message)
                                            setIsSending(false)
                                        }
                                    }).catch(err =>{
                                        console.log(err)
                                        setMessage('Erro ao localizar o email')
                                        setIsSending(false)
                                    })
                                })}>
                                    <label className='text-[23px font-bold'>Digite seu email:</label>
                                    <input {...register('email')} className='rounded-[8px]  h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px] mt-[15px] mb-[15px]' type='email'/>
                                    {isSending ? <div className='flex justify-center'> <InfinitySpin /></div> :
                                    <input type='submit' value='Recuperar Senha' className={styles.buttonModal}/>}
                                    <span className='text-center'>{message}</span>
                                </form>
                            </Modal>
                        </div>
                        <img src="/woman-isticandolse.png"/>
                    </div>
                </div>
            </main>
        )
    }
}

export async function getServerSideProps(ctx) {
    const {'token.authRRUN23' : token} = parseCookies(ctx)
    if(token){
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            }
        }
    }

    return {
        props: {}
    }
}