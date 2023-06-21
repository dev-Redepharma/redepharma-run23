import { useContext, useEffect } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { parseCookies } from "nookies";

export default function Dashboard() {
    const { user } = useContext(AuthContext)

    return (
        <h1>Olá, {user?.nome}</h1>
    )
}


export async function getServerSideProps(ctx) {
    const { 'token.authRRUN23' : token} = parseCookies(ctx)
    console.log(token)

    return {
        props: {token}
    }
}