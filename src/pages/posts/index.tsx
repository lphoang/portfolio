import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import { NextPage } from 'next'

import { Section } from '../../components/Section'
import { WorkGridItem } from '../../components/common/GridItems'
import { Layout } from '../../components/layouts/Layout'

const Posts: NextPage<unknown> = () => {
  const randomImageUrl = '/images/works.jpg'
  return (
    <Layout title="Posts">
      <Container>
        <Heading as="h3" fontSize={20} my={10}>
          Posts
        </Heading>

        <SimpleGrid minChildWidth="210px" spacing="40px">
          <Section>
            <WorkGridItem
              id="first-work"
              title="My First Work"
              thumbnail={randomImageUrl}
            >
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Reprehenderit accusantium unde voluptatem dolorum?
            </WorkGridItem>
          </Section>
          <Section>
            <WorkGridItem
              id="second-work"
              title="My Second Work"
              thumbnail={randomImageUrl}
            >
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Reprehenderit accusantium unde voluptatem dolorum?
            </WorkGridItem>
          </Section>
          <Section>
            <WorkGridItem
              id="third-work"
              title="My Third Work"
              thumbnail={randomImageUrl}
            >
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Reprehenderit accusantium unde voluptatem dolorum?
            </WorkGridItem>
          </Section>
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default Posts
