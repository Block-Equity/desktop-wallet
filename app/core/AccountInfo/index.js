import React, { Component } from 'react'

import { joinInflationDestination } from '../../services/networking/horizon'

import numeral from 'numeral'

import styles from './style.css'
import { CircularProgress } from 'material-ui/Progress'
import Button from 'material-ui/Button'
import { Card, Col } from 'reactstrap'

class AccountInfo extends Component {

  constructor (props) {
    super()
    this.state = {
      inProgress: false
    }
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
            { currentAccount.asset_type === 'native' && this.renderSendButtonContent }
          </div>
      </Card>
    </Col>
    )
  }

  renderSendButtonContent() {
    const renderNormalButton = (
      <div className={styles.buttonContainer}>
        <button className='btn btn-success'
                  type='submit'
                  style={{width: 'inherit', height: '3rem'}}
                  id="load">
                  Join Inflation Pool
        </button>
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



}

export default AccountInfo