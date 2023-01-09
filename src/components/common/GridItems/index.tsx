import {
  Flex,
  LinkBox,
  LinkOverlay,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { Global } from '@emotion/react'
import Image from 'next/image'
import NextLink from 'next/link'

import { GridItemProps, WorkGridItemProps } from '../../../shared/types'

export const GridElement = ({
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
        width={200}
        height={200}
      />
      <LinkOverlay href={href} target="_blank">
        <Text mt={2}>{title}</Text>
      </LinkOverlay>
      <Text fontSize={14}>{children}</Text>
    </Flex>
  </LinkBox>
)

export const GridItem = ({
  children,
  id,
  title,
  thumbnail,
  content
}: WorkGridItemProps) => (
  <NextLink href={`/${content}/${id}`}>
    <LinkBox cursor="pointer">
      <Flex w="100%" direction="column" align="center">
        <Image
          src={thumbnail}
          alt={title}
          className="grid-item-thumbnail"
          width={200}
          height={200}
          priority
        />
        <Text
          mt={2}
          fontSize={20}
          color={useColorModeValue('green.600', 'green.300')}
        >
          {title}
        </Text>
        <Text
          fontSize={14}
          textAlign="center"
          className="grid-item-description"
          title={String(children)}
        >
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
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
      .grid-item-description {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `}
  />
)
