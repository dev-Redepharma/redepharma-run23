import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies';
import { Loading } from '@/components/Loading';
import { Inter } from 'next/font/google';
import { HiAtSymbol, HiLockClosed } from 'react-icons/hi';
import { HiExclamationTriangle, HiUser } from 'react-icons/hi2';
import axios from 'axios'

import styles from '@/styles/Login.module.css'
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })

export default function Subscribe() {
    const {register, handleSubmit} = useForm()
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(null)

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
                    <title>Inscrição | Redepharma RUN</title>
                </Head>
                <div className={styles.borderGradient}>
                    <div className={styles.containerMain}>
                        <div className={styles.formDiv}>
                            <h1 className={`${styles.title}`}>Cadastro</h1>
                            <form onSubmit={handleSubmit((data =>{
                                if(data.confirmRules){
                                    if(data.senha == data.senhaVerificao){
                                        setIsLoading(true)
                                        axios.post('/api/auth/signup', data)
                                            .then(result => {
                                                if(result.data.status == false) {
                                                    setHasError(result.data.message)
                                                    setIsLoading(false)
                                                    return
                                                }
                                                router.push('/login')
                                                // setIsLoading(false)
                                            })
                                            .catch(err => {
                                                setIsLoading(false)
                                                console.log(err)
                                                setHasError('Ocorreu um erro, tente novamente!')
                                                alert("Ocorreu um erro, tente novamente mais tarde")
                                            })
                                        }else{
                                            setHasError('As senhas não são semelhantes.')
                                        }
                                }else{
                                    setHasError('Para prosseguir você precisa confirmar os termos.')
                                }
                            }))}>
                                <div className={styles.groupInput}>
                                    <div className={styles.inputUser}>
                                    <p>Nome:</p>
                                    <input {...register("nome")} className={styles.input} autoComplete='username' placeholder='Fulano de Tal' required/>
                                    <HiUser height={18} color="#bbb"/>
                                    </div>
                                    <div className={styles.inputUser}>
                                    <p>Email:</p>
                                    <input {...register("email")} className={styles.input} type='email' autoComplete='username' placeholder='exemplo@email.com' required/>
                                    <HiAtSymbol height={18} color="#bbb"/>
                                    </div>
                                    <div className={styles.inputPassword}>
                                    <p>Senha:</p>
                                    <input {...register("senha")} className={styles.input} type="password" autoComplete='current-password' placeholder='••••••' required/>
                                    <HiLockClosed height={18} color="#bbb"/>
                                    </div>
                                    <div className={styles.inputPassword}>
                                    <p>Repetir a senha:</p>
                                    <input {...register("senhaVerificao")} className={styles.input} type="password" autoComplete='current-password' placeholder='••••••' required/>
                                    <HiLockClosed height={18} color="#bbb"/>
                                    </div>
                                </div>

                                <div className={styles.groupRow}>
                                    <div className={styles.checkRemember}>
                                    <label className={styles.chk}>
                                        <input {...register("confirmRules")} type='checkbox' required/>
                                        <span/>
                                        <p>LI e COMPREENDI o <a className={styles.anchorRules} href='/regulamento.pdf'>REGULAMENTO</a> e a <a className={styles.anchorRules} href='/politica.pdf'>POLITICA DE DADOS</a> da corrida</p>
                                    </label>
                                    </div>
                                </div>
                                <div className={styles.groupInput}>
                                    <input className={styles.button} value="Cadastrar" type="submit"/>
                                    <div className={styles.messageError}>
                                        {hasError ? <><HiExclamationTriangle /><span className={`${styles.messageErrorSpan}`}>{hasError}</span></> : ''}
                                    </div>
                                </div>
                            </form>
                            <div className={`${styles.boxChange} ${styles.linkBox}`} onClick={() => router.push('/login')}>
                                <span>Já Possuo Conta</span>
                            </div>
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