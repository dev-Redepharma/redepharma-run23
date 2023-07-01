import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { destroyCookie } from "nookies";
import { HiPrinter } from "react-icons/hi2"
import { HiLogout } from "react-icons/hi";
import { Inter } from "next/font/google";
import axios from "axios";

import styles from "@/styles/Dashboard.module.css";

const inter = Inter({ subsets: ['latin'] })
 
export default function ConfirmRuners({data}) {
    const [author, setAuthor] = useState('')
    
    useEffect(() => {
        axios.post('/api/auth/reload', {id: data[0].authorId})
        .then(autor => {
            setAuthor(autor.data.user)
        })
        .catch(err => {console.log("Não foi possível coletar as informações do email.")})
    }, [])
  return(
    <main className={inter.className}>
        <nav className={`flex w-full items-center justify-between relative`}>
            <div className={styles.navDashboard}>
                <img src="/RunBlack.png"/>
                <div className="flex items-center gap-2 cursor-pointer print:hidden" onClick={() => {destroyCookie(null, 'token.authRRUN23'); router.push('/login')}}>
                    <span className="text-[17px] font-bold italic">Sair</span>
                    <HiLogout></HiLogout>  
                </div>
            </div>
            <div className={styles.gradientBorder}></div>
        </nav>

            <h1 className="text-center my-10 font-bold italic text-[28px]">Cartão de Inscrição - Circuito Redepharma RUN</h1>
        <div className="flex justify-center items-center flex-col gap-3" id='tablePDF'>
            <table id='tablePDF' className={styles.tabelaInfo}>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>{(data[0].name).split(' ')[0] + ' ' + ((data[0].name).split(' ')[1] ? (data[0].name).split(' ')[1] : '')}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Número de inscrição</td>
                        <td>{(data[0].id).substring(0,8)}...</td>
                    </tr>
                    <tr>
                        <td>CPF</td>
                        <td>{(data[0].cpf).replace(/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/g, "$1.***.***-$4")}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{author.email}</td>
                    </tr>
                    <tr>
                        <td>Telefone</td>
                        <td>{(data[0].phone).replace(/(\d{2})\ (\d)\ (\d{4})-(\d{4})/g, "$1 $2 ****-$4")}</td>
                    </tr>
                    <tr>
                        <td>Genero</td>
                        <td>{data[0]?.gender}</td>
                    </tr>
                    <tr>
                        <td>Categoria</td>
                        <td>{data[0]?.category}KM</td>
                    </tr>
                    <tr>
                        <td>Tamanho da Camisa</td>
                        <td>{(data[0]?.shirtSize).toUpperCase()}</td>
                    </tr>
                </tbody>
            </table>
        <div onClick={() => {window.print();}} className={`print:hidden ${styles.button}`}>Imprimir</div>
        </div>

    </main>
  )
}

export const getStaticPaths = async () => {
    const { data } = await axios.get('/api/info/allRunnersConfirmated')
    const paths = data.map(slug => {
        return {
            params: {
                slug: slug.id,
            }
        }
    })

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await axios.post('/api/info/runnersByYourId', {id: slug})

    return {
        props: {
            data,
        },
        revalidate: 60 * 60 // 1 hour
    }
}