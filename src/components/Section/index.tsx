import { chakra, shouldForwardProp } from '@chakra-ui/react'
import { motion } from 'framer-motion'

import { SectionProps } from '../../shared/types'

const StyledDiv = chakra(motion.div, {
  shouldForwardProp: prop => {
    return shouldForwardProp(prop) || prop === 'transition'
  }
})

export const Section = ({ children, delay = '0' }: SectionProps) => (
  <StyledDiv
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: '0.8', delay }}
    mb={6}
  >
    {children}
  </StyledDiv>
)
