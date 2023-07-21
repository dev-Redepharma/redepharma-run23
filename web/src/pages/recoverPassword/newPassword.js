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
import Head from 'next/head';

import styles from '@/styles/Login.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Login({id}) {
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
            <main className={`${styles.main} ${inter.className}`}>
                <Head>
                    <title>Nova Senha | Redepharma RUN</title>
                </Head>
                <div className={styles.borderGradient}>
                    <div className={styles.containerMain2}>
                        <div className={styles.formDiv}>
                            <h1 className={`${styles.title}`}>Recuperar Senha</h1>
                            <form onSubmit={handleSubmit((data) => {
                                if(data.novaSenha == data.repetirSenha) {
                                    setIsLoading(true)
                                    axios.post('/api/auth/updatePassword', {...data, id})
                                    .then(result => {
                                        setIsLoading(false)
                                        if(result.data.status == false) {
                                            console.log(result.data)
                                            setHasError(result.data.message)
                                        }else{
                                            location.href = '/login'
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        alert("Ocorreu um erro, tente novamente mais tarde")
                                    })
                                }else{
                                    setHasError("As senhas devem ser iguais.")
                                }
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

export async function getServerSideProps(ctx) {
    const { id } = ctx.query;

    return {
        props: {
            id
        }
    }
}