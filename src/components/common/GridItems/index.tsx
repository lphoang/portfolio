import { Flex, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import Image from 'next/image'
import NextLink from 'next/link'

import { GridItemProps, WorkGridItemProps } from '../../../shared/types'

export const GridItem = ({
  children,
  href,
  title,
  thumbnail
}: GridItemProps) => (
  <LinkBox cursor="pointer">
    <Flex w="100%" align="center">
      <Image
        src={thumbnail}
        alt={title}
        className="grid-item-thumbnail"
        placeholder="blur"
        loading="lazy"
        blurDataURL={title}
        width={300}
        height={300}
        style={{
          width: 'auto',
          height: 'auto'
        }}
      />
      <LinkOverlay href={href} target="_blank">
        <Text mt={2}>{title}</Text>
      </LinkOverlay>
      <Text fontSize={14}>{children}</Text>
    </Flex>
  </LinkBox>
)

export const WorkGridItem = ({
  children,
  id,
  title,
  thumbnail
}: WorkGridItemProps) => (
  <NextLink href={`/works/${id}`}>
    <LinkBox cursor="pointer">
      <Flex w="100%" direction="column" align="center">
        <Image
          src={thumbnail}
          alt={title}
          className="grid-item-thumbnail"
          placeholder="blur"
          blurDataURL={title}
          width={300}
          height={300}
          style={{
            width: 'auto',
            height: 'auto'
          }}
        />
        <Text mt={2} fontSize={20}>
          {title}
        </Text>
        <Text fontSize={14} textAlign="center">
          {children}
        </Text>
      </Flex>
    </LinkBox>
  </NextLink>
)

export const GridItemStyle = () => (
  <Global
    styles={`
      .grid-item-thumbnail {
        border-radius: 12px;
      }
    `}
  />
)
