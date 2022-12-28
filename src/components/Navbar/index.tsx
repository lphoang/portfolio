import { HamburgerIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue
} from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'

import { NavbarData } from '../../shared/const/navbar'
import { LinkItemProps, NavbarProps } from '../../shared/types'
import { Logo } from '../Logo'
import { ThemeToggleButton } from '../ThemeToggleButton'

const LinkItem = ({ href, path, children }: LinkItemProps) => {
  const active = path === href
  const inactiveColor = useColorModeValue('gray.500', 'whiteAlpha.900')

  return (
    <NextLink href={href}>
      <Button
        p={2}
        bg={active ? 'glassTeal' : undefined}
        color={active ? '#202023' : inactiveColor}
      >
        {children}
      </Button>
    </NextLink>
  )
}

export const Navbar = (props: NavbarProps) => {
  const { path } = props
  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={useColorModeValue('#ffffff40', '#20202380')}
      style={{ backdropFilter: 'blur(10px)' }}
      zIndex={1}
      {...props}
    >
      <Container
        display="flex"
        p={2}
        maxW="container.xl"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing="tighter">
            <Logo />
          </Heading>
        </Flex>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          display={{ base: 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
          mt={{ base: 4, nmd: 0 }}
        >
          {NavbarData.map(link => (
            <LinkItem key={link.title} href={link.url} path={path}>
              {link.title}
            </LinkItem>
          ))}
        </Stack>
        <Box display="flex" justifyContent="flex-end" flex={1} alignItems="right">
          <ThemeToggleButton />
          <Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
              />
              <MenuList>
                {NavbarData.map(link => (
                  <MenuItem key={link.title}>
                    <NextLink href={link.url}>
                      {link.title}
                    </NextLink>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
