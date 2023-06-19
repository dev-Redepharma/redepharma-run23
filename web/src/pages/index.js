import Image from 'next/image'
import Marquee from 'react-fast-marquee';
import { Inter } from 'next/font/google'
import { HiPhone, HiMapPin } from 'react-icons/hi2'
import { HiAtSymbol } from 'react-icons/hi'

const inter = Inter({ subsets: ['latin'] })

import styles from '@/styles/Index.module.css'

export default function Home() {
  return (
    <main
      className={`${styles.container} ${inter.className}`}
    >
      <nav className={styles.navigation}>
        <img src='smallLogoRede.png' alt='LogoRedepharma'/>
        <div className={styles.links}>
          <a href='#sobre'>SOBRE</a>
          <a href='#percursos'>PERCURSO</a>
          <a href='#kit'>KIT ATLETA</a>
          <a href='/'>INSCREVA-SE</a>
        </div>
      </nav>
      <header className={styles.header}>
        <div className={styles.sectionMain}>
          <img src='bigLogo.png' alt='LogoRun2023'/>
          <div className={styles.btnInscrever}>INSCREVA-SE</div>
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
            <img src='sandoz.png' alt='sandoz o patrocinador'/>
            <img src='sandoz.png' alt='sandoz o patrocinador'/>
            <img src='sandoz.png' alt='sandoz o patrocinador'/>
            <img src='sandoz.png' alt='sandoz o patrocinador'/>
            <img src='sandoz.png' alt='sandoz o patrocinador'/>
            <img src='sandoz.png' alt='sandoz o patrocinador'/>
            <img src='sandoz.png' alt='sandoz o patrocinador'/>
            <img src='sandoz.png' alt='sandoz o patrocinador'/>
            <img src='sandoz.png' alt='sandoz o patrocinador'/>
            <img src='sandoz.png' alt='sandoz o patrocinador'/>
            <img src='sandoz.png' alt='sandoz o patrocinador'/>
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
            <div className={styles.cardButton}>Correr!</div>
          </div>
          <div className={styles.mapImage3}>
            <span>Ver ruas</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Distancia 5km</span>
            <div className={styles.cardButton}>Correr!</div>
          </div>
          <div className={styles.mapImage5}>
            <span>Ver ruas</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Distancia 10km</span>
            <div className={styles.cardButton}>Correr!</div>
          </div>
          <div className={styles.mapImage10}>
            <span>Ver ruas</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Distancia 15km</span>
            <div className={styles.cardButton}>Correr!</div>
          </div>
          <div className={styles.mapImage15}>
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
                  <li>Produtos</li>
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
