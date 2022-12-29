import { ChakraProvider } from '@chakra-ui/react'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { AnimatePresence } from 'framer-motion'
import type { AppProps } from 'next/app'

import Layout from '../components/layouts/Main'
import theme from '../libs/theme'
import { globalStyles } from '../styles'

const cache = createCache({ key: 'next' })

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <CacheProvider value={cache}>
        {globalStyles}
        <Layout router={router}>
          <AnimatePresence initial={true} mode="wait">
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </Layout>
      </CacheProvider>
    </ChakraProvider>
  )
}
