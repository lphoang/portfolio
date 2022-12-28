import { ChevronRightIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  useColorModeValue
} from '@chakra-ui/react'
import { NextPage } from 'next'
import Link from 'next/link'

import { BioSection, BioYear } from '../components/Bio'
import { Section } from '../components/Section'
import { Paragraph } from '../components/common/Paragraph'
import { AddictionData } from '../shared/const/addiction'
import { BioData } from '../shared/const/bio'

const Home: NextPage<unknown> = () => {
  return (
    <>
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
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti,
            quam. Non dignissimos, dolorum esse aperiam impedit illo voluptate
            placeat quia quod quisquam ut voluptas earum accusamus hic
            excepturi, animi laboriosam. Architecto qui ex facilis ea itaque
            aperiam odio, repellat iste distinctio ut minima ducimus? Nesciunt
            labore repudiandae ipsa modi neque. Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Sunt possimus in voluptas, aliquid cum
            asperiores laboriosam consectetur cupiditate quam similique hic
            omnis, ducimus voluptatem cumque neque quisquam natus sapiente
            incidunt.
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
      </Container>
    </>
  )
}

export default Home
