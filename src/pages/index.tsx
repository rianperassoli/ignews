import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'

import styles from './home.module.scss'

interface HomeProps {
  product: {
    priceId: string
    amount: number
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>

          <h1>News about the <span>React</span> world.</h1>

          <p>
            Get access to all publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceID={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  /**
   * CRIAR ARQUIVO .env.local NA RAIZ DA APLICACAO COM OS VALORES ABAIXO
   * 
   * STRIPE_API_KEY=sk_test_51J5f15Fqd745Cz5XrkoShkjzrr9cOXvZk7irt1Tzy8gjwKOzBzQ6cuWtCByCcdock7VmtJYAsc55pyLkT9MwUVvT00jCvA3q63
   */
  const price = await stripe.prices.retrieve('price_1J5f4lFqd745Cz5XH0vc5HNj')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100)
  }

  return {
    props: { product }
  }
}
