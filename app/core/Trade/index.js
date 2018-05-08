import React, { Component } from 'react'
import { connect } from 'react-redux'

import styles from './style.css'
import Tabs from './Tabs'
import TradeAsset from './TradeAsset'

const navigation = { tradeAsset: 0, tradeHistory: 1 }
const INITIAL_NAVIGATION_INDEX = navigation.tradeAsset

class Trade extends Component {

  constructor (props) {
    super()
    this.state = {
      dbInit: false,
      selectedMenuItem: INITIAL_NAVIGATION_INDEX
    }
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <Tabs selectedItem={this.selectedItem} setItem={this.state.selectedMenuItem}/>
        { this.renderContent() }
      </div>
    )
  }

  renderContent() {
    switch (this.state.selectedMenuItem) {
      case navigation.tradeAsset:
        return (
          <TradeAsset />
        )
      break;
      case navigation.tradeHistory:

      break;
    }
  }

   //Tab Selection Callback from Tabs component
   selectedItem = (item) => {
    this.setState({
      selectedMenuItem: item
    })
  }

}

const mapStateToProps = (state) => {
  return {
    app: getCurrentApp(state)
  }
}

export default Trade