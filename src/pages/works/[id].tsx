import { Container, Heading } from '@chakra-ui/react'
import { GetServerSidePropsContext, NextPage } from 'next'

const Work: NextPage<{ message: string }> = props => {
  return (
    <Container>
      <Heading as="h3" fontSize={20} my={10}>
        {props.message}
      </Heading>
    </Container>
  )
}

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  return {
    props: { message: `${context.params?.id} page` }
  }
}

export default Work
