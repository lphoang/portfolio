import { Flex, Spinner, useColorModeValue } from '@chakra-ui/react'

export const Loading = () => {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Spinner
        thickness="6px"
        speed="0.65s"
        emptyColor={useColorModeValue('gray.300', 'gray.200')}
        color="teal.500"
        size="xl"
      />
    </Flex>
  )
}
