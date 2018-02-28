import styled from 'styled-components'

export const MainContainer = styled.div`
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
  height: 100%;
`

export const NavigationContainer = styled.div`
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-align-items: center;
  align-items: center;
  flex: 1 0 200px;
  width: 70px;
  height: 100%;
  padding-top: 1rem;
  position: fixed;
  background: #1D2836;
`

export const NavigationContainerSpacer = styled.div`
  margin-top: 1.5rem;
`

export const NavigationSpacer = styled.div`
  display: inline-block;
  height: 2.5rem;
`

export const ContentContainer = styled.div`
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-align-items: center;
  align-items: center;
  flex: 1 1 auto;
  overflow: auto;
`

export const AccountAddressLabel = styled.h3`
  margin-top: 3rem;
  font-size: 1rem;
  font-weight: 100;
  color: #000000;
`

export const AccountBalanceLabel = styled.h5`
  margin-top: 1rem;
  font-size: 1.5rem;
  font-weight: 100;
  color: #000000;
`

export const SendAssetFormContainer = styled.div`
  width: 70%;
  margin-top: 3rem;
  padding-bottom: 2rem;
  padding-left: 2rem;
`

export const SendAssetFormLabel = styled.label`
  color: #000000;
`

export const LogoIcon = styled.img`
  width: 150px;
  height: 77px;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`

export const SettingsIcon = styled.img`
  margin-top: 1.5rem;
  width: 30px;
  height: 30px;
`

export const WalletIcon = styled.img`
  width: 30px;
  height: 30px;
`

// .sendAssetFormDisplayErrors input:invalid {
//   border-color: #f73772;
// }
