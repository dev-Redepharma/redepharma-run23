import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { parseCookies, destroyCookie } from 'nookies';
import { HiLogout } from 'react-icons/hi';
import { Inter } from 'next/font/google';
import axios from 'axios'

import styles from '@/styles/Dashboard.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function NewRunner({token}) {
    const {register, handleSubmit} = useForm()
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(null)

    const router = useRouter()

    return (
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
            <form className='py-[50px] px-[80px]' onSubmit={handleSubmit((data =>{
                axios.post('/api/register/newRunner', {
                    name: data.name,
                    cpf: data.cpf,
                    phone: data.phone,
                    bornDate: data.bornDate,
                    gender: data.gender,
                    cep: data.cep,
                    pcd: data.pcd,
                    category: data.category,
                    lowIncome: data.lowIncome,
                    token: token
                })
                    .then(result => {
                        setIsLoading(false)
                        if(result.data.status == false) {
                            setHasError(result.data.message)
                            console.log(result.data.err)
                            return
                        }
                        router.push('/dashboard')
                    })
                    .catch(err => {
                        console.log(err)
                        alert("Ocorreu um erro, tente novamente mais tarde")
                    })
            }))}>
                <div className='flex flex-col'>
                    <label>Nome:</label>
                    <input {...register("name")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text'></input>
                </div>
                <div className='flex flex-col'>
                    <label>CPF:</label>
                    <input {...register("cpf")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Celular:</label>
                    <input {...register("phone")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Percurso:</label>
                    <select {...register("category")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text'>
                        <option></option>
                        <option value='3'>3KM</option>
                        <option value='5'>5KM</option>
                        <option value='10'>10KM</option>
                        <option value='15'>15KM</option>
                    </select>
                </div>
                <div className='flex flex-col'>
                    <label>Data de nascimento:</label>
                    <input {...register("bornDate")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Gênero:</label>
                    <select {...register("gender")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text'>
                        <option></option>
                        <option value='masculino'>Masculino</option>
                        <option value='feminino'>Feminino</option>
                    </select>
                </div>
                <div className='flex flex-col'>
                    <label>CEP:</label>
                    <input {...register("cep")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Informações adicionais:</label>
                    <input {...register("pcd")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='checkbox'></input>
                    <span>PCD - Pessoa Com Deficiência</span>
                    <input {...register("lowIncome")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='checkbox'></input>
                    <span>Baixa Renda</span>
                </div>
                <input type='submit' value='Adicionar Corredor' />
                <div onClick={() => {router.push('/dashboard')}}>Cancelar</div>
                <span>{hasError}</span>
            </form>
        </main>
        //     <input type='text' ></input>
        //     <input type='text' {...register("cpf")}></input>
        //     <input type='text' {...register("phone")}></input>
        //     <input type='text' {...register("category")}></input>
        //     <input type='text' {...register("bornDate")}></input>
        //     <input type='text' {...register("gender")}></input>
        //     <input type='text' {...register("cep")}></input>
        //     <input type='text' {...register("pcd")}></input>
        //     <input type='text' {...register("lowIncome")}></input>
        //     <input type='submit'></input>
        //     
    )
}

export async function getServerSideProps(ctx) {
    const {'token.authRRUN23' : token} = parseCookies(ctx)
    if(!token){
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {token}
    }
}