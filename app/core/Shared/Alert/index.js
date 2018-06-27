import React, { Component } from 'react'
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';

const AUTO_HIDE_DURATION = 8000
const font = "'Lato', sans-serif"
const successbgColor = '#DFF0D8'
const successTextColor = '#3C763D'
const errorbgColor = '#F2DEDE'
const errorTextColor = '#A94442'

class Alert extends Component {
  render() {
    return (
      <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.props.open}
        autoHideDuration={AUTO_HIDE_DURATION}
        onClose={this.handleAlertClose}
        SnackbarContentProps={{
          'aria-describedby': 'message-id',
          style: {
            fontFamily: font,
            fontWeight: '400',
            fontSize: '1rem',
            backgroundColor: this.props.success ? successbgColor : errorbgColor,
            color: this.props.success ? successTextColor : errorTextColor,
          },
        }}
        message={<span id="message-id">{this.props.message}</span>}
        action={[
          <Button
            key='close'
            color='default'
            size='small'
            onClick={this.handleAlertClose}
            style={{
              fontFamily: font,
              fontWeight: '700',
              boxShadow: 'none',
              outline: 'none',
              color: this.props.success ? successTextColor : errorTextColor
            }}>
              CLOSE
          </Button>
        ]}
      />
    </div>
    )
  }

  handleAlertClose = (reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.props.close()
  }

}

export default Alert