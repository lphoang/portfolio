import {
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Text
} from '@chakra-ui/react'
import { NextPage } from 'next'
import NextLink from 'next/link'

import { Layout } from '../components/layouts/Layout'

const NotFoundPage: NextPage = () => {
  return (
    <Layout title="Not Found">
      <Container my={20}>
        <Heading as="h1">Not Found</Heading>
        <Text>The page you&apos;re looking for was not found.</Text>
        <Divider my={10} />

        <Flex my={6} align="center">
          <NextLink href="/">
            <Button colorScheme="teal"> Return to home </Button>
          </NextLink>
        </Flex>
      </Container>
    </Layout>
  )
}

export default NotFoundPage
