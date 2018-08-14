import React, { Component } from 'react'
import styles from './style.css'

import { ListGroup, ListGroupItem, Button } from 'reactstrap'
import { Link } from 'react-router'
import { 
  set as setPinOptions, 
  get as getPinOptions, 
  GATE_LAUNCH,
  GATE_PAYMENT,
  GATE_VIEW_MNEMONIC
} from '../../../db/pin'

export const ToggleOption = ({ label, status, onClick }) => {
  const btn = status 
  ? { color: 'success', label: 'Enabled' }
  : { color: 'danger', label: 'Disabled'}

  return (
    <div>
      { label }
      <Button id={styles.toggleButton}  color={btn.color} onClick={onClick}>
        { 
          btn.label
        }
      </Button>
    </div>
  )
}

export default class PINOptions extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  
  componentDidMount() {
    getPinOptions().then(data => this.setState({
      ...this.state,
      ...data
    }))
  }

  toggleOption = (option) => {
    setPinOptions({ [option]: !this.state[option] }).then((res) => this.setState({ [option]: res[option] }))
  }

  render () {
    return (
      <div className={styles.container}>
        <h6>
          PIN Options
        </h6>
        <ListGroup className={styles.optionsContainer}>
          <ListGroupItem>
            <ToggleOption 
              label='On Launch' 
              status={this.state[GATE_LAUNCH]} 
              onClick={() => this.toggleOption(GATE_LAUNCH)}
              />
          </ListGroupItem>
          <ListGroupItem>
            <ToggleOption 
              label='When Sending Payments' 
              status={this.state[GATE_PAYMENT]} 
              onClick={() => this.toggleOption(GATE_PAYMENT)}
              />
          </ListGroupItem>
          <ListGroupItem>
            <ToggleOption 
              label='When Viewing Phrase' 
              status={this.state[GATE_VIEW_MNEMONIC]} 
              onClick={() => this.toggleOption(GATE_VIEW_MNEMONIC)}
              />
          </ListGroupItem>
          <ListGroupItem onClick={() => this.props.history.push('/reset-pin')} className={styles.navOption}>
            {'Reset PIN'}
          </ListGroupItem>
        </ListGroup>
      </div>
    )
  }
}