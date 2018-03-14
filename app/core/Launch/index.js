import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'

import { getPassword } from '../../services/authentication/keychain'
import { databaseExists } from '../../db'

import {
  Container,
  ContentContainer,
  Header,
  ButtonContainer,
  LaunchButton,
  CreationButton
} from './styledComponents'

import mainLogo from './logo-white.png'
import MaterialButton from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'
import { CircularProgress } from 'material-ui/Progress'

const font = "'Lato', sans-serif";
const AUTO_HIDE_DURATION = 10000

class Launch extends Component {

  constructor (props) {
    super()
    this.state = {
      alertOpen: false,
      authenticated: false,
      pinExists: false,
      databaseExists: false,
      alertMessage: ''
    }
  }

  async componentDidMount () {
    try {
      const { exists } = await databaseExists()
      if (exists) {
        this.setState({
          databaseExists: exists,
          authenticated: exists
        })
      }
    } catch (e) {

    }
  }

  render () {
    if (this.state.authenticated) {
      return <Redirect to='/wallet' />
    }

    return (
      <Container data-id='container'>
        <ContentContainer>
          <img src={mainLogo} width='120' height='62' style={{ marginTop: '10rem' }} alt='' />
          <Header>BlockEQ</Header>
          <ButtonContainer>
            <Link to='/create'>
              <CreationButton type='button' className='btn btn-light'>Create Wallet</CreationButton>
            </Link>
            <Link to='/restore'>
              <CreationButton type='button' className='btn btn-outline-light'>Restore Wallet</CreationButton>
            </Link>
          </ButtonContainer>
          { this.renderAlertView() }
        </ContentContainer>
      </Container>
    )
  }

  //region Alert View
  //Alert View
  renderAlertView() {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.alertOpen}
          autoHideDuration={AUTO_HIDE_DURATION}
          onClose={this.handleSnackBarClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
            style: { fontFamily: font,
              fontWeight:'400',
              fontSize:'1rem',
              backgroundColor:'#962411',
              color:'#FFFFFF'
            },
          }}
          message={<span id="message-id">{this.state.alertMessage}</span>}
          action={[
            <MaterialButton key="close" color="default" size="small" onClick={this.handleSnackBarClose} style={{fontFamily: font, fontWeight:'700', color: '#FFFFFF'}}>
              CLOSE
            </MaterialButton>
          ]}
        />
      </div>
    )
  }

  handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ alertOpen: false });
  }

  showAlertMessage(message) {
    this.setState({
      alertOpen: true,
      alertMessage: message
    })
  }
  //endregion

}

export default Launch
