import { IconButton, Text, useColorModeValue } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'

import { LogoContainer } from '../common/StyledContainer'

export const Logo = () => {
  const logoImg = `/images/logo.svg`

  return (
    <Link href="/">
      <LogoContainer>
        <IconButton
          colorScheme="whiteAlpha"
          aria-label="logo"
          icon={
            <Image src={logoImg} priority width={50} height={50} alt="logo" />
          }
        />
        <Text
          color={useColorModeValue('gray.800', 'whiteAlpha.900')}
          fontWeight="bold"
          ml={3}
        >
          leph
        </Text>
      </LogoContainer>
    </Link>
  )
}
