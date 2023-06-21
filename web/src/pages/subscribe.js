import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies';

export default function Subscribe() {
    const {register, handleSubmit} = useForm()
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(null)
    const router = useRouter()
    return (
        <form onSubmit={handleSubmit((data =>{
            console.log(data.senhaVerificao, data.senha)
            if(data.senha == data.senhaVerificao){
                axios.post('/api/auth/signup', data)
                    .then(result => {
                        router.push('/login')
                        setIsLoading(false)
                        if(result.data.status == false) {
                            setHasError(result.data.message)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        alert("Ocorreu um erro, tente novamente mais tarde")
                    })
                }else{
                    setHasError('As senhas não são semelhantes')
                }
        }))}>
            <input type='text' {...register("nome")}></input>
            <input type='email' autoComplete='username' {...register("email")}></input>
            <input type='password' autoComplete='current-password' {...register("senha")}></input>
            <input type='password' autoComplete='current-password' {...register("senhaVerificao")}></input>
            <input type='submit'></input>
            <span>{hasError}</span>
        </form>
    )
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