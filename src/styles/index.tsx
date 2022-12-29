import { Global, css } from '@emotion/react'

export const globalStyles = (
  <Global
    styles={css`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;800;900&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;1,300;1,400&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Dosis:wght@500;600;800&display=swap');
      html,
      body {
        margin: 0;
        font-family: 'Dosis', 'Roboto Slab', 'Poppins', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .grid-item-thumbnail {
        border-radius: 12px;
      }
    `}
  />
)
