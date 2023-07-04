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

import styles from '@/styles/Login.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Login() {
    const {register, handleSubmit} = useForm();
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState('')

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
                    <div className={styles.containerMain2}>
                        <div className={styles.formDiv}>
                            <h1 className='text-4xl font-bold italic text-[#72153D] mb-9'>Recuperar Senha</h1>
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
                                        <p>Nova Senha:</p>
                                        <input {...register("novaSenha")} type='password' className={styles.input}placeholder='••••••' required/>
                                        <HiAtSymbol height={18} color="#bbb"/>
                                    </div>
                                    <div className={styles.inputPassword}>
                                        <p>Repetir Senha:</p>
                                        <input {...register("repetirSenha")} className={styles.input} type="password" autoComplete='current-password' placeholder='••••••' required/>
                                        <HiLockClosed height={18} color="#bbb"/>
                                    </div>
                                </div>
                                <div className={styles.groupInput}>
                                    <input className={styles.button} value="Trocar Senha" type="submit"/>
                                    <div className={styles.messageError}>
                                        {hasError ? <><HiExclamationTriangle /><span className='text-center'>{hasError}</span></> : ''}
                                    </div>
                                </div>
                            </form>
                        </div>
                        <img src="/woman-trowtandol.png"/>
                    </div>
                </div>
            </main>
        )
    }
}