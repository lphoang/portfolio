import { Box, Container } from '@chakra-ui/react'
import Head from 'next/head'

import { MainProps } from '../../../shared/types'
import { Navbar } from '../../Navbar'

const Main = (props: MainProps) => {
  const { children, router } = props
  return (
    <Box as="main" pb={8}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image" href="/images/dev_icon.png" />
        <title>Le Phuoc Hoang - Homepage</title>
      </Head>

      <Navbar path={router.asPath} />

      <Container maxW="container.md" pt={14}>
        {children}
      </Container>
    </Box>
  )
}

export default Main
