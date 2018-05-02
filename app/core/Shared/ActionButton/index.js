import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './style.css'
import { CircularProgress } from 'material-ui/Progress'

export default class ActionButton extends Component {

  constructor (props) {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    return (
      <div className={ styles.buttonContainer }>
        { this.props.processing ? this.renderLoadingButton() : this.renderDefaultButton() }
      </div>
    )
  }

  renderDefaultButton() {
    var baseInputProps = {
      className: 'btn btn-primary',
      type: 'submit',
      id: 'load',
      style: { width: 'inherit', height: '3rem' }
    }

    const buttonWithHandler = (
      <button
        { ...baseInputProps }
        onClick={ this.handleClick }>
        { this.props.title.default }
      </button>
    )

    const buttonWithoutHandler = (
      <button { ...baseInputProps }>
        { this.props.title.default }
      </button>
    )

    if (this.props.isForm) {
      return buttonWithoutHandler
    } else {
      return buttonWithHandler
    }
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
    this.props.actionClicked()
  }
}

ActionButton.propTypes = {
  processing: PropTypes.bool,
  isForm: PropTypes.bool,
  title: PropTypes.shape({
    default: PropTypes.string.isRequired,
    processing: PropTypes.string
  }),
  actionClicked: PropTypes.any
}