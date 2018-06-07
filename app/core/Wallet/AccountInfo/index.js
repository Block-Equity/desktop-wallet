import React, { Component } from 'react'
import { connect } from 'react-redux'

import { joinInflationPoolOperation, fetchAccountDetails } from '../../../common/account/actions'
import { getStellarMarketCADPrice, getStellarMarketUSDPrice } from '../../../common/market/selectors'
import { getCurrentAccount } from '../../../common/account/selectors'

import isEmpty from 'lodash/isEmpty'
import numeral from 'numeral'

import styles from './style.css'
import { CircularProgress } from 'material-ui/Progress'
import Button from 'material-ui/Button'
import { Card, Col, Popover, PopoverHeader, PopoverBody, Alert } from 'reactstrap'

const alertStyle = {
  width: '100%',
  height: '2rem',
  padding: '0.45rem',
  fontSize: '0.75rem',
  marginTop: '-0.2rem',
  borderRadius: '3px 3px 0px 0px'
}

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
    const availableBalance = balance - (currentAccount.minimumBalance ? currentAccount.minimumBalance.minimumBalanceAmount : 0)
    const assetDesc = currentAccount.asset_code === 'XLM' ?
      (<div>{`Available ${currentAccount.asset_name} (${currentAccount.asset_code})`}
        <a onClick={this.toggleInfo} id="Popover1">
          <i className='fa fa-arrow-circle-right' style={{marginLeft: '0.25rem', color: '#c2c2c2'}}/>
        </a>
      </div>) : `${currentAccount.asset_name} (${currentAccount.asset_code})`
    return (
      <Col sm='7'>
        <Card body style={{ backgroundColor: '#F9F9F9', borderColor: '#ECEEEF', marginBottom: '1rem', marginTop: '0.75rem', padding: '0rem'}}>
          <div className={styles.container}>
            { this.renderConditionForInflationPoolView() }
            <div className={styles.balanceTitle}>
              { assetDesc }
            </div>
            <div className={styles.balanceLabel}>
              <b> {numeral(availableBalance).format('0,0.00')} </b>
            </div>
            { currentAccount.asset_code === 'XLM' ? this.renderMarketValue(availableBalance) : this.renderSpacerView() }
          </div>
      </Card>
    </Col>
    )
  }

  renderConditionForInflationPoolView() {
    const { currentAccount } = this.props

    if (!isEmpty(currentAccount.inflationDestination)) {
      console.log(`Inflation Pool Condition: Destination Specified`)
      if (currentAccount.asset_type === 'native') {
        return ( this.renderInflationPoolContent() )
      } else {
        return ( <div style={{height: '1.5rem'}} /> )
      }
    } else {
      if (currentAccount.balance > 1.01) {
        if (currentAccount.asset_type === 'native') {
          return ( this.renderJoinInflationAlertContent() )
        } else {
          return ( <div style={{height: '1.5rem'}} /> )
        }
      } else {
        return ( <div style={{height: '1.5rem'}} /> )
      }
    }
  }

  renderJoinInflationAlertContent() {
    const alert = (
      <Alert color='success' style={ alertStyle }>
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
              style={alertStyle}>
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

  renderInflationPoolContent() {
    const alert = (
      <Alert color='success'
              style={alertStyle}>
        <div id={styles.linkContainer}>
          You are part of an inflation pool
          <a onClick={this.toggleInfo} id="Popover1">
            <i className='fa fa-info-circle' style={{marginLeft: '0.5rem'}}/>
          </a>
        </div>
        { this.renderInfo() }
      </Alert>
    )

    return alert
  }

  renderInfo() {
    return (
      <Popover placement="bottom" isOpen={this.state.infoOpen} target="Popover1" toggle={this.toggleInfo}>
        <PopoverHeader>What are inflation pools?</PopoverHeader>
        <PopoverBody>The Stellar distributed network has a built-in, fixed, nominal inflation mechanism. New lumens are added to the network at the rate of 1% each year. Each week, the protocol distributes these lumens to any account that gets over .05% of the “votes” from other accounts in the network.</PopoverBody>
      </Popover>
    )
  }

  renderMarketValue(balance) {
    const { currentAccount, stellarCADValue, stellarUSDValue } = this.props
    const balanceCAD = balance * stellarCADValue
    const balanceUSD = balance * stellarUSDValue
    return (
      <div className={styles.marketValueLabel}>
        { `Approx. USD $${numeral(balanceUSD).format('0,0.00')}` }
        <i className="fa fa-circle" style={{color:'#A1A1A1', marginRight: '0.35rem', marginLeft: '0.35rem', fontSize: '0.4rem'}}></i>
        { `CAD $${numeral(balanceCAD).format('0,0.00')}` }
      </div>
    )
  }

  renderSpacerView() {
    return (
      <div style={{height: '1.5rem'}}/>
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
    await this.props.fetchAccountDetails()
    setTimeout(function(){
      this.setState({
        inProgress: false
      })
    }.bind(this), 1500);
  }

  toggleInfo() {
    this.setState({
      infoOpen: !this.state.infoOpen
    })
  }
}

const mapStateToProps = (state) => {
  return {
    currentAccount: getCurrentAccount(state),
    stellarCADValue: getStellarMarketCADPrice(state),
    stellarUSDValue: getStellarMarketUSDPrice(state)
  }
}

export default connect(mapStateToProps, {
  joinInflationPoolOperation,
  fetchAccountDetails
})(AccountInfo)