import { Container, Heading } from '@chakra-ui/react'
import { NextPage } from 'next'

const Works: NextPage<unknown> = () => {
  return (
    <Container>
      <Heading as="h3" fontSize={20} my={4}>
        Works
      </Heading>
    </Container>
  )
}

export default Works
