import styled from 'styled-components'

export const Container = styled.div`
  height: 100vh;
  background-color: var(--brand-dark);
  -webkit-app-region: drag;
`
export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const Header = styled.h2`
  font-size: 3rem;
  font-weight: 400;
  margin-top: 0.75rem;
  color: #FFFFFF;
`

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 3rem;
`

export const LaunchButton = styled.button`
  width: 20rem;
  margin-top: 1rem;
`

export const CreationButton = styled.button`
  margin-top: 1rem;
  width: 20rem;
`

export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
