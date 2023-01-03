import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import { NextPage } from 'next'

import { Section } from '../../components/Section'
import { GridItem } from '../../components/common/GridItems'
import { Loading } from '../../components/common/Loading'
import { Layout } from '../../components/layouts/Layout'
import { DEFAULT_WORKS_VALUE } from '../../shared/const/works'
import { useFetchData } from '../../shared/hooks/useFetchData'
import { GetWorks } from '../../shared/types'

const Works: NextPage<unknown> = () => {
  const {
    data: { contents }
  } = useFetchData<GetWorks>({
    defaultValue: DEFAULT_WORKS_VALUE,
    content: 'works'
  })

  return (
    <Layout title="Works">
      <Container>
        <Heading as="h3" fontSize={20} my={10}>
          Works
        </Heading>

        <SimpleGrid minChildWidth="210px" spacing="40px">
          {contents.length > 0 ? (
            contents.map((work, index) => (
              <Section key={work.id} delay={(index * 0.1).toString()}>
                <GridItem
                  id={work.id}
                  title={work.title}
                  content="works"
                  thumbnail={work.thumbnail.url}
                >
                  {work.description}
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

export default Works
