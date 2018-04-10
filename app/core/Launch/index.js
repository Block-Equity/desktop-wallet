import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'

import Transport from '@ledgerhq/hw-transport-node-hid'
import Str from '@ledgerhq/hw-app-str'
const { ipcRenderer } = require('electron')

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

  async componentDidMount () {
    //await this.checkForLedger()
    ipcRenderer.send('getLedgerStellarKey', '')
    this.checkUserState()
  }

  checkForLedger() {
    const sub = Transport.listen({
      next: async e => {
          ipcRenderer.send('getLedgerStellarKey', e.descriptor)
          sub.unsubscribe()
          /*const transport = await Transport.open(e.descriptor)
          console.log(`Component Transport: ${JSON.stringify(transport)}`)
          //
          const str = new Str(transport)
          const result = await str.getAppConfiguration();
          console.log(`App Configuration: ${result.version}`)

          await str.getPublicKey("44'/148'/0'").then(res => {
            console.log('App found');
            console.log(`Public Key: ${res.publicKey}`)
          }).catch((err) => {
            console.log(JSON.stringify(err))
            transport.close();
          })*/
      },
      error: error => {
        console.log(JSON.stringify(error))
      },
      complete: () => {

      }
    })
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
      }.bind(this), 1500)

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
        <CreationButton onClick={this.handleNanoLedgerLogin} type='button' className='btn btn-outline-light'>Nano ledger</CreationButton>
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

  handleNanoLedgerLogin (event) {
    event.preventDefault()


  }

}

export default Launch
