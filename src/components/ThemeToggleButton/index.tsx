import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'

import { ToggleButtonContainer } from '../common/StyledContainer'

export const ThemeToggleButton = () => {
  const { toggleColorMode } = useColorMode()
  const toggleIcon = `/images/${useColorModeValue('light-', 'dark-')}mode.svg`

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        style={{ display: 'inline-block' }}
        key={useColorModeValue('light', 'dark')}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          aria-label="theme-toggle-button"
          colorScheme="whiteAlpha"
          icon={
            <ToggleButtonContainer>
              <Image
                src={toggleIcon}
                width={30}
                height={30}
                alt="theme-toggle-button"
              />
            </ToggleButtonContainer>
          }
          onClick={toggleColorMode}
        />
      </motion.div>
    </AnimatePresence>
  )
}
