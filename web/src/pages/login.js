import { useRouter } from 'next/router';
import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form'
import { Loading } from "@/components/Loading";
import { AuthContext } from '@/contexts/AuthContext';
import { setCookie } from 'nookies';
import axios from 'axios'

export default function Login() {
    const {register, handleSubmit} = useForm();
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
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
            <main>
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
                    <input {...register("email")} autoComplete='username' type='email'></input>
                    <input {...register("senha")} autoComplete='current-password' type='password'></input>
                    <input type="submit"></input>

                    <span>{hasError}</span>
                </form>
            </main>
        )
    }
}