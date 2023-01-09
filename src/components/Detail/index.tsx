import { ChevronRightIcon } from '@chakra-ui/icons'
import {
  Badge,
  Box,
  Button,
  Heading,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { Fragment } from 'react'

export const Title = ({
  children,
  type
}: {
  children: JSX.Element | JSX.Element[]
  type: 'works' | 'posts'
}) => {
  return (
    <Box>
      <NextLink href={`/${type}`}>
        <Button variant="link">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      </NextLink>
      <span>
        &nbsp;
        <ChevronRightIcon />
        &nbsp;
      </span>
      <Heading display="inline-block" as="h3" fontSize={16} mb={4}>
        {children}
      </Heading>
    </Box>
  )
}

export const WorkImage = ({ src, alt }: { src: string; alt: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Fragment>
      <Image
        borderRadius="lg"
        w="full"
        h={400}
        src={src}
        alt={alt}
        mb={4}
        objectFit="cover"
        onClick={onOpen}
        cursor="pointer"
      />
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        size="6xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <Image borderRadius="lg" w="full" h="full" src={src} alt={alt} />
        </ModalContent>
      </Modal>
    </Fragment>
  )
}

export const Meta = ({ children }: { children: JSX.Element | string }) => (
  <Badge colorScheme="green" mr={2}>
    {children}
  </Badge>
)
