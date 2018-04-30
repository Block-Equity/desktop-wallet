import React, { Component } from 'react'

import styles from './style.css'
import { CircularProgress } from 'material-ui/Progress'

export default class ActionButton extends Component {

  render() {
    return (
      <div className={styles.buttonContainer}>
        { this.props.processing ? this.renderLoadingButton() : this.renderDefaultButton() }
      </div>
    )
  }

  renderDefaultButton() {
    return (
      <button className='btn btn-primary'
        type='submit'
        style={{width: 'inherit', height: '3rem'}}
        id='load'>
        { this.props.title.default }
      </button>
    )
  }

  renderLoadingButton() {
    return (
      <button className='btn btn-primary'
        type='submit'
        style={{width: 'inherit', height: '3rem'}}
        id='load' disabled>
        <CircularProgress style={{ color: '#FFFFFF', marginRight: '0.75rem' }} thickness={ 5 } size={ 15 } />
        { this.props.title.processing }
      </button>
    )
  }

  handleClick(event) {
    event.preventDefault()
  }
}