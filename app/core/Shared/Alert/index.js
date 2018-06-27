import React, { Component } from 'react'
import styles from './style.css'

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';

import * as alertTypes from './types'

const materialStyles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

const AUTO_HIDE_DURATION = 3000

class Alert extends Component {

  constructor (props) {
    super()
    this.state = {
      open: false
    }
  }

  render() {
    return (
      <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.state.open}
        autoHideDuration={AUTO_HIDE_DURATION}
        onClose={this.handleAlertClose}
        SnackbarContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{this.props.alertMessage}</span>}
        action={[
          <SnackbarButton key="close" color="secondary" size="small"
            onClick={this.handleAlertClose}>
            CLOSE
          </SnackbarButton>
        ]}
      />
    </div>
    )
  }

  handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      open: false
    })
  }

}

export default Alert