import { useRouter } from 'next/router';
import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form'
import { Inter } from 'next/font/google'
import { Loading } from "@/components/Loading";
import { AuthContext } from '@/contexts/AuthContext';
import { parseCookies, setCookie } from 'nookies';
import { HiAtSymbol, HiLockClosed } from 'react-icons/hi';
import { HiExclamationTriangle } from 'react-icons/hi2';
import axios from 'axios'

import styles from '@/styles/Login.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Login() {
    const {register, handleSubmit} = useForm();
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState('')
    const { setLogin } = useContext(AuthContext)
    

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
                                        setCookie(null, 'token.authRRUN23', result.data.token)
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
                                    <input {...register("email")} type='email' className={styles.input} autoComplete='username' placeholder='exemplo@email.com'/>
                                    <HiAtSymbol height={18} color="#bbb"/>
                                    </div>
                                    <div className={styles.inputPassword}>
                                    <p>Senha:</p>
                                    <input {...register("senha")} className={styles.input} type="password" autoComplete='current-password' placeholder='••••••'/>
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
                                    <a>Esqueci a senha</a>
                                </div>
                                <div className={styles.groupInput}>
                                    <input className={styles.button} value="Entrar" type="submit"/>
                                    <div className={styles.messageError}>
                                        {hasError ? <><HiExclamationTriangle /><span className='text-center'>{hasError}</span></> : ''}
                                    </div>
                                </div>
                            </form>
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