import { Container, Heading } from '@chakra-ui/react'
import { GetServerSidePropsContext, NextPage } from 'next'

import { Layout } from '../../components/layouts/Layout'
import { DEFAULT_POST_VALUE } from '../../shared/const/posts'
import { useFetchDetail } from '../../shared/hooks/useFetchDetail'
import { PostType } from '../../shared/types'

const Post: NextPage<{ id: string }> = props => {
  const { id } = props
  const { data } = useFetchDetail<PostType>({
    content: 'posts',
    defaultValue: DEFAULT_POST_VALUE,
    id: String(id)
  })
  return (
    <Layout title={data.title}>
      <Container>
        <Heading as="h4" fontSize={20} my={10}>
          {data.title}
        </Heading>

        <div dangerouslySetInnerHTML={{ __html: data.body }} />
      </Container>
    </Layout>
  )
}

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  return {
    props: { id: String(context.params?.id) }
  }
}

export default Post
