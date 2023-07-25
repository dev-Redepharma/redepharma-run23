import Image from 'next/image'
import Head from 'next/head';
import Marquee from 'react-fast-marquee';
import { Inter } from 'next/font/google'
import { HiPhone, HiMapPin } from 'react-icons/hi2'
import { HiAtSymbol } from 'react-icons/hi'
import { useRouter } from "next/router";

const inter = Inter({ subsets: ['latin'] })

import styles from '@/styles/Index.module.css'

export default function Home() {
  const router = useRouter()

  return (
    <main
      className={`${styles.container} ${inter.className}`}
    >
      <Head>
        <title>Redepharma RUN 2023</title>
      </Head>
      <nav className={styles.navigation}>
        <img src='smallLogoRede.png' alt='LogoRedepharma'/>
        <div className={styles.links}>
          <a href='#sobre'>SOBRE</a>
          <a href='#percursos'>PERCURSO</a>
          <a href='#kit'>KIT ATLETA</a>
          <a href='/regulamento.pdf'>REGULAMENTO</a>
        </div>
      </nav>
      <header className={styles.header}>
        <div className={styles.sectionMain}>
          <img src='bigLogo.png' alt='LogoRun2023'/>
          <section className={styles.infoRunHeader}>
            <img src='startDate.png' alt='22 de outubro de 2023'/>
            <img src='startInfo.png' alt='largada: açude velho'/>
          </section>
          <div className={styles.btnInscrever} onClick={() => router.push('/subscribe')}>INSCREVA-SE</div>
        </div>
        <img className={styles.runner} src='woman-running.png' alt='Corredora'/>
      </header>
      <div className={styles.yellowSection}>
        <div className={styles.textArea}>
          <h3>Redepharma RUN 2023: O ápice da superação e emoção.</h3>
          <span>Não há nada melhor do que correr pela sua saúde, pelo seu bem-estar e pela sua diversão. E é por isso que convidamos você a participar da nossa corrida anual em Campina Grande. Nós preparamos um percurso incrível para desafiar seus limites e proporcionar momentos inesquecíveis. Venha sentir a emoção de cruzar a linha de chegada e se tornar parte da nossa história. Não perca essa oportunidade única de se divertir e se superar!</span>
        </div>
        <img src='paraibaMap.png'/>
      </div>
      <Marquee pauseOnHover={true} speed={70} gradientColor={[230, 233, 242]} className={styles.patrocinadores}>
        <div className={styles.providers} id="sobre">
            <img onClick={() => {window.open("https://instagram.com/mink_oficial")}} className='cursor-pointer' src='mink.png' alt='mink o patrocinador'/>
            <img onClick={() => {window.open("https://instagram.com/mink_oficial")}} className='cursor-pointer' src='mink.png' alt='mink o patrocinador'/>
            <img onClick={() => {window.open("https://instagram.com/mink_oficial")}} className='cursor-pointer' src='mink.png' alt='mink o patrocinador'/>
            <img onClick={() => {window.open("https://instagram.com/mink_oficial")}} className='cursor-pointer' src='mink.png' alt='mink o patrocinador'/>
            <img onClick={() => {window.open("https://instagram.com/mink_oficial")}} className='cursor-pointer' src='mink.png' alt='mink o patrocinador'/>
            <img onClick={() => {window.open("https://instagram.com/mink_oficial")}} className='cursor-pointer' src='mink.png' alt='mink o patrocinador'/>
            <img onClick={() => {window.open("https://instagram.com/mink_oficial")}} className='cursor-pointer' src='mink.png' alt='mink o patrocinador'/>
            <img onClick={() => {window.open("https://instagram.com/mink_oficial")}} className='cursor-pointer' src='mink.png' alt='mink o patrocinador'/>
            <img onClick={() => {window.open("https://instagram.com/mink_oficial")}} className='cursor-pointer' src='mink.png' alt='mink o patrocinador'/>
            <img onClick={() => {window.open("https://instagram.com/mink_oficial")}} className='cursor-pointer' src='mink.png' alt='mink o patrocinador'/>
        </div>
      </Marquee>
      <div className={styles.aboutSection}>
        <h2>SOBRE A CORRIDA</h2>
        <p>Em Campina Grande, a prática de atividade física é constante. É comum observar pessoas em torno do Açude Velho, no Parque da Criança e em vários outros lugares em busca da qualidade de vida fazendo caminhadas, pedalando, andando de skate ou de patins.</p>
        <p id="percursos">Dentre tantas modalidades, o destaque é para corrida de rua, que ganha admiradores em todo o Brasil, e em Campina Grande, não é diferente. E como o Assunto é saúde e qualidade de vida, a Redepharma traz esse grande benefício para Campina Grande – O Circuito Redepharma RUN.</p>
      </div>
      <div className={styles.routesSection}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Distancia 3km</span>
            <div className={styles.cardButton} onClick={() => {
              window.open("https://onthegomap.com/?m=r&u=km&w%5B%5D=Routes+may+not+be+suitable+for+public+use.&c%5B%5D=Route+data+%C2%A92023+On+The+Go+Map%2C+OpenStreetMap+Contributors&d=3186&f=cf0caba33b&n=1&dm=1&context=share&r2=boZi1%7EXWx6Pj1DHX1z1Z3j5BP5NDZ2Qd2Ol1SV_2j2ULc1DS5s12_1A02i3SK_26UW1Y6Y1m54I2C6W1Aq1Cg1a1_2a1Y2c1y1W1k1Ug1EMa2e3q1e2e4u5Y1k1AK2Cb2q1TOl2_1j18j3Bp15d2Nl1PB9F7F3V25B33H1l16V6X1AD4d3OZ20b1Fb1Z1Z2x2v1l29D5T4r31d11J7JLZ1JNf1PTNz1f1b2t1b1h1BN1L2T8H4J3JW3l2q1j1GHe2p3Uf1Oj1O%7E16DEa26OCQa3k5Y1_1EI85Qi1")
            }}>Mapa</div>
          </div>
          <div onClick={() => {window.open("/previewMap3Km.png")}} className={styles.mapImage3}>
            <span>Ver ruas</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Distancia 5km</span>
            <div className={styles.cardButton} onClick={() => {
              window.open("https://onthegomap.com/?m=r&u=km&w%5B%5D=Routes+may+not+be+suitable+for+public+use.&c%5B%5D=Route+data+%C2%A92023+On+The+Go+Map%2C+OpenStreetMap+Contributors&d=5045&f=cf0caba33b&n=1&dm=1&context=share&r2=boZi1%7EXWx6Pj1DHX1z1Z3j5BP5NDZ2Qd2Ol1SV_2j2ULc1DS5s12_1A02i3SK_26UW1Y6Y1m54I2C6W1Aq1Cg1a1_2a1Y2c1y1W1k1Ug1EMa2e3q1e2e4u5Y1k1AK2Cb2q1TOl2_1j18j3Bp15d2Nl1PB9F7F3V25B33H1l16V6X1AD4d3OZ20N3b14X10L3l29h3H0175B0d3B71d3DH1b3Hl23v48f26z2Ob5i1j1CL6V8t3W1X2I9n37r31J7f37b51d10HLhC43295931Bt87p5a2AU4w2Ok3Y1E4A2w3c1q2Qi1Eu3e1k1OKGm2g3Y1u148CKm2w33M2E6EACCAM8E240G3G9CB8H4J3Jg3v2g1Z1GHe2p3Uf1Oj1O%7E16DEa26OCQa3k5Y1_1EI85A5Si1")
            }}>Mapa</div>
          </div>
          <div onClick={() => {window.open("previewMap5Km.png")}} className={styles.mapImage5}>
            <span>Ver ruas</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Distancia 10km</span>
            <div className={styles.cardButton} onClick={() => {
              window.open("https://onthegomap.com/?m=r&u=km&w%5B%5D=Routes+may+not+be+suitable+for+public+use.&c%5B%5D=Route+data+%C2%A92023+On+The+Go+Map%2C+OpenStreetMap+Contributors&d=9871&f=dcd1b39a1c&n=1&dm=1&context=share&r2=joZi1lYWx6HTDHX1z1Z3j5BP5NDZ21625Qd2Ol1SVg2z1KFULc1DS5s12U6W14i3U24Iw2Ie3Ku3c1Y62C6W1Aq1Cg1a1_2a1Y2c1y1W1k1i1W2a2e3q1e2g5c7AK2C12X3g2l2_1j18X5Hd2Nl1P8A79B9F7F3V25B33H1l16V6N892D4d3OZ20N3b14X10L3Z13h15h3H0175B0l3Dd3DH1b3Hl23v48f26z2Ob5i1j1CL6V8v5o1D4b3Sf5m1p4i1z2Sj5i1j2KZ3Qf5m1p3QT8P8x1Ip2Ih6u1f2Kp1E~1Ih2KTAd2QV8p1EJ6d6s1d7w1B8r1El3SH2r1E~1E3032b3SB8z3a112h1~6Pl4VX5Vf5Nt3Rn4N~3Th5o20_10g29w3LG1o3Lm37m40Y10y8CM6W14i5Ei44m10K6SIGCs1W1y1Y1m1C20S3M9MRCHk1d2E9a45S0g23m31W15a8Fe11c35K1q47E7g45u49c33M6I2G1e10i33_37g13M50201u4~1s2Z1s4z1g3r1a2Z1M3Q1M8I2G3G9CB6F214J3J5BJJN9J0H8H7HJ9Dt1v27Dh1b2x1n211VRTJZ2Nl7h2d1DB3l1Fj6v1d29Z1110205r21h31x30304W3Qs4Y2kBk3G6s2OW2KW26w2Es2ASAg2e1e2W1KCMEg2e1SKc1W1MAG06DEa26OCQa3k5Y1_1EIOg10000")
            }}>Mapa</div>
          </div>
          <div onClick={() => {window.open("/previewMap10Km.png")}} className={styles.mapImage10}>
            <span>Ver ruas</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Distancia 15km</span>
            <div className={styles.cardButton} onClick={() => {
              window.open("https://onthegomap.com/?m=r&u=km&w%5B%5D=Routes+may+not+be+suitable+for+public+use.&c%5B%5D=Route+data+%C2%A92023+On+The+Go+Map%2C+OpenStreetMap+Contributors&d=15239&f=4c3726fd09&n=1&dm=1&context=share&r2=loZi1lYWx6FTDHX1z1Z3j5BP5NDZ2Qd2AJERSV_2j2ULc1DS5s12_1Ao2MQ8K_2c1W7c1Y62C6W17070Sm34EEa1Os1o1q2g6W9GIc5g72E142320G32CZ3i2h2w134j18f13j29f13r1HH5l1PB95195F3V2PCJK387G3SNPB701D3f30d3CJ0V9FDV010L3l29h3H0175B07816T3d5LT7f3Fz1599v48f26z2Ob5i1j1CL6V8z1Gx3Y1D4b3Sf5m1p4i1z2Sj5i1j2KZ3Qf5m1p3QT8P8x1Ip2Ih6u1f2Kp1E%7E1Ih2KTAd2QV8d2Kd6s1d7w1B8r1El3SH2r1E%7E1E3032b3SB8%7E3c105h1v6Pl4VX5Vf5Nt3Rn4N%7E3Th57080o20_10g29w3LG1o3Lm37m40Y10y8CM6W14i5Ei44m10K6SIGCs1W1y1Y1o1CS3M9KN23CHk1d2E9a45S0w55W15e59y25e11c35K1q47E7g45u49c33E563K0G1a35Y31q3BG0e1JO7u1Lq3l1s3p1s3r1a3n169674J2E6EACCAM8I2E320G9CB8H4J3J5B57DBN9J0H8H7HJh1Z2LZ17Dh1b2x1n2X1TTJZ2Nl7h2d1DB3l1FX3Rh3Td29Z11H0r48r4Et48t4EH0p26d28x12l10Z11fAf1F1j23z2Bp3Hd1BJF7D7PHt35x3J8b1IPE787I1ABN15Vl1VFZ11b7AJ1r2331LFX1TH9n3p2H3I43PG%7E33040u69e7RC0c13_2Ds5Ny27k27o9VG1cCj1W5Fy4He13s25g4JG0q3BG1Q3k4JW5FY5Jy3Bc112525Fz3Dr3Pl5Dx3Fr4Dh3Pb63%7E17384_3y1K6q1Ay4W1e8s1e1AQ4cEY3g7o4Y3y1o3e2E6W3_1ACAA3Cb2y6n1m4l2w7Tk2Ti3Ne2t1W5Lu1Fo1d1_31Ar1Jf34x25b22z1Et3W1b2ENEBE72813W12Y21K2JKCW3s1SKc1W1MAG06DEa26OCQa3k5Y1_1EIAI")
            }}>Mapa</div>
          </div>
          <div onClick={() => {window.open("/previewMap15Km.png")}} className={styles.mapImage15}>
            <span id="kit">Ver ruas</span>
          </div>
        </div>
        
      </div>
      <div className={styles.kitSection}>
        <div className={styles.invoice}>
          <div className={styles.cardInvoice}>
            <div className={styles.cardInvoiceHeader}>
              <h3>Sobre o KIT</h3>
              <div>
                <div className={styles.smallLetters}>
                  <span>Descrição</span>
                  <span>Valor</span>
                </div>
                <div className={styles.infoInvoice}>
                  <span>Corrida</span>
                  <span>R$ 100,00</span>
                </div>
                <ul className={styles.listItems}>
                  <li>Mochila</li>
                  <li>Camisa</li>
                </ul>
              </div>
            </div>
            <div className={styles.subTotal}>
              <span>Valor total</span>
              <span>R$ 100,00</span>
            </div>
          </div>
        </div>

        <div className={styles.getKit}>
          <div className={styles.cardGetKit}>
            <h2>Retirada do KIT</h2>
            <p>A retirada do kit acontecerá entre os dias 19 e 21 de outubro.</p>
            <p>Local da retirada: Redepharma R50, Av. Manoel Tavares,400 - Jardim Taveres.</p>
            <p>Levar documento com foto e o cartão de confirmação, que será gerado ao final da inscrição.</p>
          </div>
        </div>
      </div>

      <div className={styles.photosSection}>
        <div className={styles.photo1}/>
        <div className={styles.photo2}/>
        <div className={styles.photo3}/>
        <div className={styles.photo4}/>
        <div className={styles.photo5}/>
        <div className={styles.photo6}/>
        <div className={styles.photo7}/>
        <div className={styles.photo8}/>
      </div>

      <div className={styles.contactSection}>
        <h2>CONTATO</h2>
        <div><HiAtSymbol size={22}/> <span>run@redepharma.com.br</span></div>
        <div><HiPhone size={22}/> <span>(83) 3315-6565</span></div>
        <div><HiMapPin size={22}/> <span>Rua Marquês do Herval, 98 – Centro, Campina Grande - PB</span></div>
      </div>

      <div className={styles.finalLine}/>
    </main>
  )
}
