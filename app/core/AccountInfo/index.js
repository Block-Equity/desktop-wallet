import React, { Component } from 'react'
import { connect } from 'react-redux'

import { joinInflationPoolOperation } from '../../common/account/actions'

import isEmpty from 'lodash/isEmpty'
import numeral from 'numeral'

import styles from './style.css'
import { CircularProgress } from 'material-ui/Progress'
import Button from 'material-ui/Button'
import { Card, Col, Popover, PopoverHeader, PopoverBody, Alert } from 'reactstrap'

class AccountInfo extends Component {

  constructor (props) {
    super()
    this.state = {
      inProgress: false,
      infoOpen: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.toggleInfo = this.toggleInfo.bind(this)
  }

  render() {
    const { currentAccount } = this.props
    const balance = currentAccount.balance
    const assetDesc = `${currentAccount.asset_name} (${currentAccount.asset_code})`
    return (
      <Col sm='7'>
        <Card body
            style={{ backgroundColor: '#F9F9F9', borderColor: '#ECEEEF', marginBottom: '1rem', marginTop: '0.75rem', padding: '0rem'}}>
          <div className={styles.container}>
            { this.renderConditionForInflationPoolView() }
            <div className={styles.balanceTitle}>
              { assetDesc }
            </div>
            <div className={styles.balanceLabel}>
              <b> {numeral(balance).format('0,0.00')} </b>
            </div>
          </div>
      </Card>
    </Col>
    )
  }

  renderConditionForInflationPoolView() {
    const { currentAccount } = this.props
    if (isEmpty(currentAccount.inflationDestination)) {
      if (currentAccount.asset_type === 'native') {
        return (
          this.renderJoinInflationAlertContent()
        )
      } else {
        return ( <div style={{height: '1.5rem'}} /> )
      }
    } else {
      return ( <div style={{height: '1.5rem'}} /> )
    }
  }

  renderJoinInflationAlertContent() {
    const alert = (
      <Alert color='success'
              style={{ width: '100%',
                       height: '2rem',
                       padding: '0.45rem',
                       fontSize: '0.75rem',
                       marginTop: '-0.2rem',
                       borderRadius: '3px 3px 0px 0px'
                      }}>
        <div id={styles.linkContainer}>
          <a onClick={this.handleClick}><b>Join inflation pool</b></a>
          <a onClick={this.toggleInfo} id="Popover1">
            <i className='fa fa-info-circle' style={{marginLeft: '0.5rem'}}/>
          </a>
        </div>
        { this.renderInfo() }
      </Alert>
    )

    const alertLoading = (
      <Alert color='success'
              style={{ width: '100%',
                      height: '2rem',
                      padding: '0.45rem',
                      fontSize: '0.75rem',
                      marginTop: '-0.2rem',
                      borderRadius: '3px 3px 0px 0px'
                      }}>
        <div id={styles.linkContainer}>
          <a><b>Joining inflation pool</b></a>
          <CircularProgress
            style={{ color: '#000000', marginLeft: '0.4rem', marginBottom: '0.3rem' }}
            thickness={ 5 }
            size={ 11 } />
        </div>
      </Alert>
    )

    if (this.state.inProgress) {
      return alertLoading
    } else {
      return alert
    }
  }

  renderInfo() {
    return (
      <Popover placement="bottom" isOpen={this.state.infoOpen} target="Popover1" toggle={this.toggleInfo}>
        <PopoverHeader>What are inflation pools?</PopoverHeader>
        <PopoverBody>The Stellar distributed network has a built-in, fixed, nominal inflation mechanism. New lumens are added to the network at the rate of 1% each year. Each week, the protocol distributes these lumens to any account that gets over .05% of the “votes” from other accounts in the network.</PopoverBody>
      </Popover>
    )
  }

  handleClick(event) {
    event.preventDefault()
    this.setState({
      inProgress: true
    })
    this.joinInflationPool()
  }

  async joinInflationPool () {
    await this.props.joinInflationPoolOperation()
    setTimeout(function(){
      this.setState({
        inProgress: false
      })
    }, 1500);
  }

  toggleInfo() {
    this.setState({
      infoOpen: !this.state.infoOpen
    })
  }
}

export default connect(null, {
  joinInflationPoolOperation
})(AccountInfo)