import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'

import { getPassword } from '../../services/authentication/keychain'
import { databaseExists, clearAllUserInfo } from '../../db'

import {
  APP_VERSION
} from '../../db/constants'

import {
  Container,
  ContentContainer,
  Header,
  ButtonContainer,
  LaunchButton,
  CreationButton,
  LoaderContainer
} from './styledComponents'

import mainLogo from './logo-brand.png'
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
      alertMessage: '',
      loading: false
    }
  }

  componentDidMount () {
    this.checkUserState()
  }

  async checkUserState() {
    try {
      this.setState({loading: true})
      const { exists, appVersion } = await databaseExists()
      console.log(`DB Data || Exists: ${exists} || Version: ${appVersion}`)

      setTimeout(function(){
        this.setState({
          loading: false,
          databaseExists: exists,
          authenticated: exists
        })
      }.bind(this), 2500)

    } catch (e) {

    }
  }

  render () {
    return (
      <Container data-id='container'>
        <ContentContainer>
            <img src={mainLogo} width='170' height='93' style={{ marginTop: '10rem' }} alt='' />
            { this.renderConditionalContent() }
          </ContentContainer>
      </Container>
    )
  }

  renderConditionalContent() {
    if (this.state.loading) {
      return (
        <div>
          { this.renderLoaderContainer() }
        </div>
      )
    } else {
      if (this.state.authenticated) {
        return <Redirect to='/wallet' />
      }
      return (
        <div>
          { this.renderButtonContainer() }
        </div>
      )
    }
  }

  renderButtonContainer() {
    return (
      <ButtonContainer>
        <Link to='/create'>
          <CreationButton type='button' className='btn btn-light'>Create Wallet</CreationButton>
        </Link>
        <Link to='/restore'>
          <CreationButton type='button' className='btn btn-outline-light'>Restore Wallet</CreationButton>
        </Link>
      </ButtonContainer>
    )
  }

  renderLoaderContainer() {
    return (
      <LoaderContainer>
        <CircularProgress size={30} style={{ color: '#FFFFFF', marginTop: '4rem' }} thickness={3} />
      </LoaderContainer>
    )
  }

}

export default Launch
