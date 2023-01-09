import { ChevronRightIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Container,
  Heading,
  Icon,
  Image,
  List,
  ListItem,
  useColorModeValue
} from '@chakra-ui/react'
import { NextPage } from 'next'
import Link from 'next/link'

import { BioSection, BioYear } from '../components/Bio'
import { Section } from '../components/Section'
import { Paragraph } from '../components/common/Paragraph'
import { Layout } from '../components/layouts/Layout'
import { AddictionData } from '../shared/const/addiction'
import { BioData } from '../shared/const/bio'
import { SocialMediaData } from '../shared/const/media'

const Home: NextPage<unknown> = () => {
  return (
    <Layout title="Homepage">
      <Container>
        <Box
          mt={10}
          borderRadius="lg"
          py={3}
          px={6}
          mb={6}
          alignItems="center"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
        >
          Hello, I&apos;m a full-stack developer based in Vietnam!
        </Box>
        <Box display={{ md: 'flex' }}>
          <Box flexGrow={1}>
            <Heading as="h2" variant="page-title">
              Lê Phước Hoàng
            </Heading>
            <p>
              At <strong> Building ME!</strong>
              <br /> (Developer, Dreamer, everything all at once)
            </p>
          </Box>
          <Box
            display="flex"
            flexShrink={0}
            mt={{ base: 4, md: 0 }}
            ml={{ md: 6 }}
            justifyContent="center"
          >
            <Image
              src="images/avatar.png"
              alt="profile-picture"
              borderColor="whiteAlpha.800"
              borderWidth={2}
              borderStyle="solid"
              width="150px"
              height="150px"
              objectFit="cover"
              display="inline-block"
              borderRadius="full"
            />
          </Box>
        </Box>

        <Section delay="0.1">
          <Heading as="h3" variant="section-title">
            Works
          </Heading>
          <Paragraph>
            I am a Backend Developer with nearly one year experience of
            full-stack experience designing, enhancing, and maintaining Java web
            applications. I also do Frontend libraries or frameworks such as
            ReactJS, NextJS,...
          </Paragraph>
          <Box display="flex" justifyContent="center" my={4}>
            <Link href="/works">
              <Button rightIcon={<ChevronRightIcon />} colorScheme="teal">
                My works
              </Button>
            </Link>
          </Box>
        </Section>
        <Section delay="0.2">
          <Heading as="h3" variant="section-title">
            Bio
          </Heading>
          <Box>
            {BioData.map(bio => (
              <BioSection key={bio.milestone}>
                <BioYear>{bio.milestone}</BioYear>
                {bio.description}
              </BioSection>
            ))}
          </Box>
        </Section>
        <Section delay="0.3">
          <Heading as="h3" variant="section-title">
            I addicted to ❤
          </Heading>
          <Box>
            {AddictionData.map(addiction => (
              <BioSection key={addiction}>
                <BioYear>-</BioYear>
                {addiction}
              </BioSection>
            ))}
          </Box>
        </Section>

        <Section delay="0.4">
          <Heading as="h3" variant="section-title">
            Connect me
          </Heading>
          <List>
            {SocialMediaData.map(media => (
              <ListItem key={media.url}>
                <Link href={media.url} target="_blank">
                  <Button
                    variant="ghost"
                    colorScheme="teal"
                    leftIcon={<Icon as={media.icon} />}
                  >
                    {media.title}
                  </Button>
                </Link>
              </ListItem>
            ))}
          </List>
        </Section>
      </Container>
    </Layout>
  )
}

export default Home
