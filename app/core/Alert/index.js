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

const AUTO_HIDE_DURATION = 6000

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
        onClose={this.alertActions(alertTypes.CLOSE)}
        SnackbarContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Payment Sent</span>}
        action={ this.renderActions() }
      />
    </div>
    )
  }

  renderActions() {
    var actionSet = new Set()
    this.props.alertActions.map(action => {
      actionSet.add(
          <Button key={action} color="primary" size="small" onClick={this.alertActions(action)}>
              {action} </Button>
        )
      console.log(`Actions list || ${actionSet}`)
    })
    return Array.from(actionSet.values());
  }

  alertActions(type) {
    if (type === alertTypes.CLOSE) {
      this.setState({ open: false });
    }
    this.props.alertActionType(type)
  }
}

export default Alert;