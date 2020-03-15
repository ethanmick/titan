import { AppProps } from 'next/app'

const GameApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default GameApp
