import { StyleFunctionProps, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg: mode('#f0e7db', '#202023')(props)
    }
  })
}

const components = {
  Heading: {
    variants:
    {
      'section-title': (props: StyleFunctionProps) => ({
        textDecoration: 'underline',
        fontSize: 20,
        textUnderlineOffset: 6,
        textColor: mode('#037c6e', '#4fb9af')(props),
        textDecorationColor: mode('#037c6e', '#4fb9af')(props),
        textDecorationThickness: 4,
        marginTop: 3,
        marginBottom: 4
      }
      )
    }
  },
  Button: {
    variants: {
      'link': (props: StyleFunctionProps) => ({
        color: mode('#3d7aed', '#ff63c3')(props),
        textUnderlineOffset: 3
      })
    }
  }
}

const fonts = {
  heading: "'Dosis'",
  body: "'Dosis'"
}

const colors = {
  glassTeal: '#88ccca'
}

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false
}

const theme = extendTheme({
  colors,
  components,
  fonts,
  config,
  styles
})

export default theme
