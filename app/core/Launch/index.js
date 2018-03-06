import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import mainLogo from './logo-gray.png'

import {
  Container,
  Header,
  ButtonContainer,
  LaunchButton,
  CreationButton
} from './styledComponents'

class Launch extends Component {
  render () {
    return (
      <Container data-id='container'>
        <img src={mainLogo} width='150' height='77' alt='' />
        <Header>BlockEQ</Header>
        <ButtonContainer>
          <Link to='/wallet'>
            <LaunchButton type='button' className='btn btn-outline-success'>Wallet</LaunchButton>
          </Link>
          <Link to='/login'>
            <CreationButton type='button' className='btn btn-outline-secondary'>Create Account</CreationButton>
          </Link>
        </ButtonContainer>
      </Container>
    )
  }
}

export default Launch
