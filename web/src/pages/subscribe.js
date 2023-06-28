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
            <main className={`flex items-center justify-center h-[100vh] ${inter.className}`}>
                <div className={styles.borderGradient}>
                    <div className={styles.containerMain}>
                        <div className={styles.formDiv}>
                            <h1 className='text-4xl font-bold italic text-[#72153D] mb-9'>Cadastro</h1>
                            <form onSubmit={handleSubmit((data =>{
                                console.log(data.senhaVerificao, data.senha)
                                if(data.confirmRules){
                                    if(data.senha == data.senhaVerificao){
                                        setIsLoading(true)
                                        axios.post('/api/auth/signup', data)
                                            .then(result => {
                                                if(result.data.status == false) {
                                                    setHasError(result.data.message)
                                                    return
                                                }
                                                router.push('/login')
                                                setIsLoading(false)
                                            })
                                            .catch(err => {
                                                console.log(err)
                                                alert("Ocorreu um erro, tente novamente mais tarde")
                                            })
                                        }else{
                                            setHasError('As senhas não são semelhantes')
                                        }
                                }else{
                                    setHasError('Para prosseguir você precisa confirmar o regulamento')
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
                                        <input {...register("confirmRules")} type='checkbox'/>
                                        <span/>
                                        <p>LI e COMPREENDI o <a className={styles.anchorRules} href='/regulamento.pdf'>REGULAMENTO</a> da corrida</p>
                                    </label>
                                    </div>
                                </div>
                                <div className={styles.groupInput}>
                                    <input className={styles.button} value="Cadastrar" type="submit"/>
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