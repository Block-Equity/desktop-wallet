import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import mainLogo from './logo-gray.png'

import {
  Container,
  Header,
  LaunchButton
} from './styledComponents'

class Launch extends Component {
  render () {
    return (
      <Container data-tid='container'>
        <img src={mainLogo} width='150' height='77' alt='' />
        <Header>BlockEQ Wallet</Header>
        <Link to='/wallet'>
          <LaunchButton type='button' className='btn btn-outline-success'>Launch</LaunchButton>
        </Link>
      </Container>
    )
  }
}

export default Launch
