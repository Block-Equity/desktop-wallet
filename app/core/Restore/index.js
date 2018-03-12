import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import logoIcon from '../Creation/images/logo-white.png'
import styles from './style.css'

import MaterialButton from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import { CircularProgress } from 'material-ui/Progress';

class Restore extends Component {

  constructor (props) {
    super()
    this.state = {
      restorationComplete: false
    }
  }

  render() {
    if (this.state.accountCreationComplete === true) {
      return <Redirect to='/wallet' />
    }

    return (
      <div className={styles.container}>
        <nav className='navbar navbar-dark' style={{background: '#0F547E'}}>
          <div className={styles.navContentContainer}>
            <img src={logoIcon} width='40' height='21' style={{marginBottom: '0.5rem'}} alt=""/>
          </div>
        </nav>
        <div style={{margin: '1rem', textAlign: 'center'}}>

        </div>
        { this.renderAlertView() }
      </div>
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
              backgroundColor:'#4E6068',
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

  showValidationErrorMessage(message) {
    this.setState({
      alertOpen: true,
      alertMessage: message
    })
  }
  //endregion

}

export default connect(null, null)(Restore)