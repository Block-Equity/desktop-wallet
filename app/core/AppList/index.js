import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './style.css'

import { ListGroup, ListGroupItem } from 'reactstrap'
import walletIcon from './icons/menu-wallet.png'
import tradingIcon from './icons/menu-trading.png'
import settingIcon from './icons/menu-settings.png'

import { fetchAccountDetails, setCurrentAccount } from '../../common/account/actions'
import { getAccounts, getCurrentAccount } from '../../common/account/selectors'

const menuItems = [
  { displayLabel: 'Wallet', icon: walletIcon, id: 0 } ,
  { displayLabel: 'Trading', icon: tradingIcon, id: 1 },
  { displayLabel: 'Settings', icon: settingIcon, id: 2 }
]

class AppList extends Component {

  constructor (props) {
    super()
    this.state = ({
      assetSelected: 0
    })
  }

  render() {
    return (
      <div style={{ width: '9rem', backgroundColor: '#1942c9', borderRight: '1px solid rgba(0, 0, 0, 0.125)', height: '100vh'}}>
        <ListGroup>
          { this.renderMenu() }
        </ListGroup>
      </div>
    )
  }

  renderMenu() {
      const listItemStyleNormal = {outline: 'none', borderRadius: '0', backgroundColor: '#1942c9', borderColor: 'rgba(0, 0, 0, 0.125)', color: '#F4F4F4', borderRight: '0', borderLeft: '0' }
      const listItemStyleActive = { ...listItemStyleNormal, backgroundColor: '#0026A2', color: '#FFFFFF' }

      return menuItems.map((menu, index) => {
        const selected = this.state.assetSelected === index ? true : false
        return (
          <ListGroupItem
            key = { index }
            style={ selected ? listItemStyleActive : listItemStyleNormal }
            active={ selected }
            tag='button'
            onClick={ this.handleMenuSelection(menu, index) } action>
            {this.renderAccountListLabel(menu, selected)}
          </ListGroupItem>
        )
      })
  }

  renderAccountListLabel (menu, isActive) {
    const labelView = (
      <label style={{ fontSize: '0.85rem', marginBottom: '0rem' }}>
        { menu.displayLabel }
      </label>
    )

    return (
      <div className={styles.assetContainer}>
        { isActive && (<div className={styles.assetContainerActiveIndicator}/>)}
        <img src={menu.icon} width='14' height='14' alt='' style={{marginTop: '0.2rem'}} />
        <div className={styles.assetLabelContainer}>
          { labelView }
        </div>
      </div>
    )
  }

  handleMenuSelection = (asset, index) => event => {
    event.preventDefault()
    this.setState({
      assetSelected: index
    })
    this.props.setCurrentAccount(asset)
  }

}

const mapStateToProps = (state) => {
  return {
    accounts: getAccounts(state),
    currentAccount: getCurrentAccount(state)
  }
}

export default connect(mapStateToProps, {
  fetchAccountDetails,
  setCurrentAccount
})(AppList)