import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import avatarImg from '../../public/images/avatar.svg'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'
import styles from './home.module.scss'

interface HomeProps {
  product : {
    priceId: string,
    amount: number,
  }
}

// stripe listen --forward-to localhost:3000/api/webhooks 

// Client-side      -> Outros casos (sem indexação do Google)
// Server-side      -> Gerar HTML com dados dinâmicos *da sessão do usuário* (com indexação do Google)
// Static site Gen. -> Gerar HTML estático da page *para todos os usuários* (com indexação do Google)

// Conteúdo da página   : SSG
// Página de perfil     : SSR
// Comentários da página: Client-side (carregado após a página estar pronta) 

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👋 Hey, welcome!</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>Get acess to all the publications <br />
            <span>for {product.amount}/month</span>
          </p>

          <SubscribeButton
            priceId={product.priceId}
          />
        </section>

        <Image src={avatarImg} alt="Girl coding" />
      </main>

    </>
  )
}

// FUNÇÃO EXECUTADA NO SERVIDOR NEXT/NODE
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KTHDPJWYQ4fml651XP6OBS6')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100)
  }

  return {
     props: { product },
     revalidate: 60 * 60 * 24, // 24hrs
  }
}