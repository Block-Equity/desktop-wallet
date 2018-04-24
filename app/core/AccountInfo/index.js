import React, { Component } from 'react'

import { joinInflationDestination } from '../../services/networking/horizon'

import numeral from 'numeral'

import styles from './style.css'
import { CircularProgress } from 'material-ui/Progress'
import Button from 'material-ui/Button'
import { Card, Col, Popover, PopoverHeader, PopoverBody } from 'reactstrap'

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
      <Col sm='8'>
        <Card body
            style={{ backgroundColor: '#F9F9F9', borderColor: '#ECEEEF', marginBottom: '1rem', marginTop: '0.75rem'}}>
          <div className={styles.container}>
            <div className={styles.balanceTitle}>
              { assetDesc }
            </div>
            <div className={styles.balanceLabel}>
              <b> {numeral(balance).format('0,0.00')} </b>
            </div>
            { currentAccount.asset_type === 'native' && this.renderButtonContent() }
          </div>
      </Card>
    </Col>
    )
  }

  renderButtonContent() {
    const renderNormalButton = (
      <div className={styles.buttonContainer}>
        <button className='btn btn-success'
                  type='submit'
                  onClick={this.handleClick(this.props.currentAccount.pKey)}
                  style={{width: 'inherit', height: '2.1rem', fontSize: '0.8rem'}}
                  id="load">
                  Join Inflation Pool
        </button>
        <a className={styles.info} onClick={this.toggleInfo} id="Popover1">What are inflation pools?</a>
        { this.renderInfo() }
      </div>
    )

    const renderLoadingButton = (
      <div className={styles.buttonContainer}>
        <button className='btn btn-success'
                  type='submit'
                  style={{width: 'inherit', height: '3rem'}}
                  id="load" disabled>
                  <CircularProgress style={{ color: '#FFFFFF', marginRight: '0.75rem' }} thickness={ 5 } size={ 15 } />
                  Joining Inflation Pool
        </button>
      </div>
    )

    if (this.state.inProgress) {
      return renderLoadingButton
    } else {
      return renderNormalButton
    }
  }

  renderInfo() {
    return (
      <Popover placement="bottom" isOpen={this.state.infoOpen} target="Popover1" toggle={this.toggleInfo}>
        <PopoverHeader>What are inflation pools?</PopoverHeader>
        <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
      </Popover>
    )
  }

  handleClick = ( publicKey ) => event => {
    event.preventDefault()
    this.setState({
      inProgress: true
    })
    this.joinInflationPool(publicKey)
  }

  async joinInflationPool ( publicKey ) {
    const { payload, error } = await joinInflationDestination(publicKey)
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

export default AccountInfo