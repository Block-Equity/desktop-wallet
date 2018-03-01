import styled from 'styled-components'
//Reference: https://www.styled-components.com/docs/basics

export const MainContainer = styled.div`
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
  height: 100%;
  background: #FFFFFF;
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

export const TabContainer = styled.div`
  width: 80%;
  margin-top: 2rem;
  margin-bottom: 2rem;
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

export const AccountInfoContainer = styled.div`
  width: 80%;
  background: #EAEFF2;
  border-radius: 5px;
  margin-bottom: 0.5rem;
`

export const AccountInfoTitle = styled.text`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #999999;
  font-size: 0.7rem;
  font-weight: 100;
`

export const AccountBalanceContainer = styled.div`
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
  margin-top: -1rem;
`

export const AccountAddressLabel = styled.h3`
  margin-top: 3rem;
  font-size: 1rem;
  font-weight: 100;
  color: #000000;
`

export const AccountBalanceLabel = styled.h5`
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 100;
  color: #000000;
`

export const AccountBalanceCurrencyLabel = styled.h6`
  margin-top: 1.5rem;
  margin-left: 0.25rem;
  font-size: 0.75rem;
  font-weight: 200;
  color: #444444;
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
  width: 50px;
  height: 26px;
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
