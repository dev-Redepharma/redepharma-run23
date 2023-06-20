import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { Loading } from "@/components/Loading";
import axios from 'axios'

export default function Login() {
    const {register, handleSubmit} = useForm();
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(false)

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
                        console.log(result.data)
                        setIsLoading(false)

                        result.data.status == false ? setHasError(result.data.message) : ''
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