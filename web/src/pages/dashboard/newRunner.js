import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { parseCookies, destroyCookie } from 'nookies';
import { HiLogout } from 'react-icons/hi';
import { HiExclamationTriangle } from 'react-icons/hi2';
import { Inter } from 'next/font/google';
import { cpf } from 'cpf-cnpj-validator';
import { v4 } from 'uuid';
import { storage } from '@/services/firebase'
import { ref, uploadBytes } from 'firebase/storage';
import InputMask from 'react-input-mask';
import axios from 'axios'
import { date } from 'date-and-time'
import { InfinitySpin } from 'react-loader-spinner';

import styles from '@/styles/Dashboard.module.css'
import stylesRunner from '@/styles/NewRunner.module.css'
const inter = Inter({ subsets: ['latin'] })

export default function NewRunner({token, id}) {
    const {register, handleSubmit} = useForm()
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(null)
    const [isPCD, setIsPCD] = useState(false)
    const [isLowIncome, setisLowIncome] = useState(false)
    const [messageFirebaseUpload, setMessageFirebaseUpload] = useState()
    const [uploadingFB, setUploadingFB] = useState(false);
    const [isOldAge, setisOldAge] = useState(false)
    const [age, setAge] = useState([])

    const router = useRouter()

    function handleChangePCD(){
        setIsPCD(!isPCD)
    }

    function handleChangeLowIncome(){
        setisLowIncome(!isLowIncome)
    }

    function uploadToFirebase(value) {
        setUploadingFB(true)
        const DocumentRef = ref(storage, `documents/${"Document_"+id}`)
            uploadBytes(DocumentRef, value).then((e) => {
                setMessageFirebaseUpload("Documento enviado!");
                setUploadingFB(false)
        })
    }

    return (
        
        <main className={inter.className}>
            
            <nav className={`flex w-full items-center justify-between relative`}>
                <div className={styles.navDashboard}>
                    <img src="/RunBlack.png"  className="cursor-pointer" onClick={() => {router.push('/dashboard')}}/>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => {destroyCookie(null, 'token.authRRUN23'); router.push('/login')}}>
                        <span className="text-[17px] font-bold italic">Sair</span>
                        <HiLogout></HiLogout>  
                    </div>
                </div>
                <div className={styles.gradientBorder}></div>
            </nav>
            <form className='py-[50px] px-[80px]' onSubmit={handleSubmit((data =>{
                if(cpf.isValid(data.cpf)){
                    axios.post('/api/register/newRunner', {
                        id: id,
                        name: data.name,
                        cpf: data.cpf,
                        phone: data.phone,
                        bornDate: data.bornDate,
                        gender: data.gender,
                        cep: data.cep,
                        pcd: data.pcd,
                        category: data.category,
                        lowIncome: data.lowIncome,
                        token: token,
                        numberNIS: data.numberNIS
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
                }else{
                    setHasError("CPF Inválido")
                }
            }))}>
                <div className='flex flex-col'>
                    <label>Nome:</label>
                    <input {...register("name")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' required></input>
                </div>
                <div className='flex flex-col'>
                    <label>CPF:</label>
                    <InputMask {...register("cpf")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' mask="999.999.999-99" maskChar="" required></InputMask>
                </div>
                <div className='flex flex-col'>
                    <label>Celular:</label>
                    <InputMask {...register("phone")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' mask="99 9 9999-9999" maskChar="" required></InputMask>
                </div>
                <div className='flex flex-col'>
                    <label>Percurso:</label>
                    <select {...register("category")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' required>
                        <option></option>
                        <option value='3'>3KM</option>
                        <option value='5'>5KM</option>
                        <option value='10'>10KM</option>
                        <option value='15'>15KM</option>
                    </select>
                </div>
                <div className='flex flex-col'>
                    <label>Data de nascimento:</label>
                    <InputMask {...register("bornDate")} title='Digite no seguinte padrão DD/MM/AAAA' pattern='^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19\d\d|20[0-2]\d|2023)$' className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' mask="99/99/9999" maskChar="" onChange={(e) => {
                        setAge(e.target.value.split('/'))
                    }} required></InputMask>
                </div>
                {2023 - age[2] >= 60 && age[2].length == 4 && !isPCD ? 
                    <>
                        <div className='flex flex-col pt-[18px] pb-[25px]'>
                            <label {...register("attachmentPCD")}>Selecione o comprovante PCD: </label>
                            <input type='file' onChange={(e)=>{
                                uploadToFirebase(e.target.files[0])}} required/>
                        </div>
                        <div className='flex text-center'>{messageFirebaseUpload}</div>
                    </>
                : ''}
                <div className='flex flex-col'>
                    <label>Gênero:</label>
                    <select {...register("gender")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' required>
                        <option></option>
                        <option value='masculino'>Masculino</option>
                        <option value='feminino'>Feminino</option>
                    </select>
                </div>
                <div className='flex flex-col'>
                    <label>CEP:</label>
                    <InputMask {...register("cep")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' mask="99999-999" maskChar=""></InputMask>
                </div>
                <div className='flex flex-col'>
                    <label>Informações adicionais:</label>
                    <div className='flex items-center gap-2'>
                        <input {...register("pcd")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='checkbox' onChange={handleChangePCD}></input>
                        <span>PCD - Pessoa Com Deficiência</span>
                    </div>
                    {!isPCD ? <div></div> :
                        <>
                            <div className='flex flex-col pt-[18px] pb-[25px]'>
                                <label {...register("attachmentPCD")}>Selecione a identidade: </label>
                                <input type='file' onChange={(e)=>{
                                    uploadToFirebase(e.target.files[0])}} required/>
                            </div>
                            <div className='flex text-center'>{messageFirebaseUpload}</div>
                        </>
                    }
                    <div className='flex items-center gap-2'>
                        <input {...register("lowIncome")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='checkbox' onChange={handleChangeLowIncome}></input>
                        <span>Baixa Renda</span>
                    </div>
                    {!isLowIncome ? <div></div> :
                         <div className='flex flex-col pt-[18px] pb-[25px]'>
                            <label>Informe seu número do NIS: </label>
                            <InputMask {...register("numberNIS")} className='rounded-[8px] h-[28px] border-[1px] border-black bg-[rgba(0,0,0,0.06)] px-[8px]' type='text' mask="99999999999" maskChar="" required></InputMask>
                        </div>
                    }
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <div className='flex gap-10'>
                        {uploadingFB ? '' : <input className={`cursor-pointer ${stylesRunner.buttonAddRunner}`} type='submit' value='Adicionar Corredor'/>}
                        {uploadingFB ? <InfinitySpin color= '#E94E1B' size={25}></InfinitySpin> : <div className={`cursor-pointer ${stylesRunner.buttonCancel}`} onClick={() => {router.push('/dashboard')}}>Cancelar</div>}
                        
                    </div>
                    <div className={stylesRunner.messageError}>
                        {hasError ? <><HiExclamationTriangle /><span className='text-center'>{hasError}</span></> : ''}
                    </div>
                </div>
            </form>
        </main>  
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

    const id = v4()

    return {
        props: {token, id}
    }
}