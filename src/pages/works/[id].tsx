import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  AspectRatio,
  Badge,
  Container,
  Heading,
  List,
  ListItem
} from '@chakra-ui/react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Link from 'next/link'

import { Meta, Title, WorkImage } from '../../components/Detail'
import { Section } from '../../components/Section'
import { Loading } from '../../components/common/Loading'
import { Paragraph } from '../../components/common/Paragraph'
import { Layout } from '../../components/layouts/Layout'
import { DEFAULT_WORK_VALUE } from '../../shared/const/works'
import { useFetchDetail } from '../../shared/hooks/useFetchDetail'
import { WorkType } from '../../shared/types'

const Work: NextPage<{ id: string }> = props => {
  const { id } = props
  const { data } = useFetchDetail<WorkType>({
    content: 'works',
    defaultValue: DEFAULT_WORK_VALUE,
    id: String(id)
  })

  return (
    <Layout title={data.title}>
      {data.title ? (
        <Section delay="0.1">
          <Container mt={10}>
            <Title type="works">
              <span>
                {data.title} <Badge ml={2}>2022 - Present</Badge>
              </span>
            </Title>
            <Paragraph>{data.description}</Paragraph>
            <List ml={4} my={4}>
              <ListItem>
                <Meta>Website</Meta>
                <Link href={data.url || 'https://google.com'} target="_blank">
                  {data.url} <ExternalLinkIcon mx="2px" />
                </Link>
              </ListItem>
              <ListItem>
                <Meta>Platform</Meta>
                <span>{data.platform}</span>
              </ListItem>
              <ListItem>
                <Meta>Stack</Meta>
                <span>{data.stack}</span>
              </ListItem>
            </List>

            <Heading as="h3" variant="section-title">
              Images
            </Heading>
            <WorkImage src={data.firstThumbnail.url} alt={data.title} />
            <WorkImage src={data.secondThumbnail.url} alt={data.title} />
            {data.thirdThumbnail && (
              <WorkImage src={data.thirdThumbnail.url} alt={data.title} />
            )}
            <Heading as="h3" variant="section-title">
              Video
            </Heading>
            <AspectRatio maxW="640px" ratio={1.7} my={4}>
              <iframe
                src={data.videoUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </AspectRatio>
          </Container>
        </Section>
      ) : (
        <Container mt={10}>
          <Loading />
        </Container>
      )}
    </Layout>
  )
}

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  return {
    props: { id: String(context.params?.id) }
  }
}

export default Work
