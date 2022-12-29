import { Container, Heading } from '@chakra-ui/react'
import { NextPage } from 'next'

const About: NextPage<unknown> = () => {
  return (
    <Container>
      <Heading as="h3" fontSize={20} my={4}>
        About
      </Heading>
    </Container>
  )
}

export default About
