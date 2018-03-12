import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import mainLogo from './logo-white.png'

import {
  Container,
  ContentContainer,
  Header,
  ButtonContainer,
  LaunchButton,
  CreationButton
} from './styledComponents'

class Launch extends Component {

  render () {
    return (
      <Container data-id='container'>
        <ContentContainer>
          <img src={mainLogo} width='120' height='62' style={{ marginTop: '10rem' }} alt='' />
          <Header>BlockEQ</Header>
          <ButtonContainer>
            <Link to='/login'>
              <CreationButton type='button' className='btn btn-light'>Create Wallet</CreationButton>
            </Link>
            <Link to='/restore'>
              <CreationButton type='button' className='btn btn-outline-light'>Restore Wallet</CreationButton>
            </Link>
            <Link to='/wallet'>
              <LaunchButton type='button' className='btn btn-outline-light'>Wallet</LaunchButton>
            </Link>
          </ButtonContainer>
        </ContentContainer>
      </Container>
    )
  }

}

export default Launch
