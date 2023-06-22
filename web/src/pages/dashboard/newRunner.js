import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies';
import axios from 'axios'

export default function NewRunner({token}) {
    const {register, handleSubmit} = useForm()
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(null)
    const router = useRouter()
    return (
        <form onSubmit={handleSubmit((data =>{
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
            <input type='text' {...register("name")}></input>
            <input type='text' {...register("cpf")}></input>
            <input type='text' {...register("phone")}></input>
            <input type='text' {...register("category")}></input>
            <input type='text' {...register("bornDate")}></input>
            <input type='text' {...register("gender")}></input>
            <input type='text' {...register("cep")}></input>
            <input type='text' {...register("pcd")}></input>
            <input type='text' {...register("lowIncome")}></input>
            <input type='submit'></input>
            <span>{hasError}</span>
        </form>
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