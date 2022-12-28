import styled from '@emotion/styled'

export const ToggleButtonContainer = styled.span`
  font-weight: bold;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  height: 30px;
  line-height: 20px;
  padding: 5px;

  &:hover img {
    transform: rotate(20deg);
  }
`

export const LogoContainer = styled.span`
  display: inline-flex;
  padding: 5px;

  &:hover img {
    transform: scale(1.05);
  }
`
