import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import { NextPage } from 'next'

import { Section } from '../../components/Section'
import { GridItem } from '../../components/common/GridItems'
import { Loading } from '../../components/common/Loading'
import { Layout } from '../../components/layouts/Layout'
import { DEFAULT_POSTS_VALUE } from '../../shared/const/posts'
import { useFetchData } from '../../shared/hooks/useFetchData'
import { GetPosts } from '../../shared/types'

const Posts: NextPage<unknown> = () => {
  const {
    data: { contents }
  } = useFetchData<GetPosts>({
    defaultValue: DEFAULT_POSTS_VALUE,
    content: 'posts'
  })

  return (
    <Layout title="Posts">
      <Container>
        <Heading as="h3" fontSize={20} my={10}>
          Posts
        </Heading>

        <SimpleGrid minChildWidth="210px" spacing="40px">
          {contents.length > 0 ? (
            contents.map((post, index) => (
              <Section key={post.id} delay={(index * 0.1).toString()}>
                <GridItem
                  id={post.id}
                  title={post.title}
                  content="posts"
                  thumbnail={post.thumbnail.url}
                >
                  {post.description}
                </GridItem>
              </Section>
            ))
          ) : (
            <Loading />
          )}
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default Posts
