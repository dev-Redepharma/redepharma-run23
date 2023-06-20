import {useState} from "react"
import styles from '@/styles/Loading.module.css'

export function Loading() {
    
    return (
        <>
            <section className={styles.world}>
                <div className={`${styles.back} ${styles.one}`}></div>
                <div className={`${styles.back} ${styles.two}`}></div>
                <div className={`${styles.back} ${styles.three}`}></div>
                <div className={`${styles.back} ${styles.four}`}></div>
                <div className={styles.floor}>
                    <div className={`${styles.rock} ${styles.one}`}></div>
                    <div className={`${styles.rock} ${styles.two}`}></div>
                    <div className={`${styles.rock} ${styles.three}`}></div>
                    <div className={`${styles.grass} ${styles.one}`}></div>
                    <div className={`${styles.grass} ${styles.two}`}></div>
                    <div className={`${styles.grass} ${styles.three}`}></div>
                    <div className={`${styles.grass} ${styles.four}`}></div>
                    <div className={`${styles.grass} ${styles.five}`}></div>
                    <div className={`${styles.grass} ${styles.six}`}></div>
                    <div className={`${styles.grass} ${styles.seven}`}></div>
                    <div className={`${styles.grass} ${styles.height}`}></div>
                    <div className={`${styles.grass} ${styles.nine}`}></div>
                    <div className={`${styles.grass} ${styles.ten}`}></div>
                </div>
                <div className={`${styles.cloud} ${styles.one}`}></div>
                <div className={`${styles.cloud} ${styles.two}`}></div>
                <div className={`${styles.cloud} ${styles.three}`}></div>
                <div className={styles.stick}>
                    <div className={styles.head}></div>
                    <div className={`${styles.arm} ${styles.left}`}>
                        <div className={styles.bottom}></div>
                    </div>
                    <div className={`${styles.arm} ${styles.right}`}>
                        <div className={styles.bottom}></div>
                    </div>
                    <div className={`${styles.leg} ${styles.left}`}>
                        <div className={styles.bottom}></div>
                    </div>
                    <div className={`${styles.leg} ${styles.right}`}>
                        <div className={styles.bottom}></div>
                    </div>
                </div>
            </section>
            <h1 className={styles.text}>Carregando...</h1>

        </>
    )
}