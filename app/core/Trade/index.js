import React, { Component } from 'react'
import { connect } from 'react-redux'

import Tabs from './Tabs'

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
      <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', width: '100%' }}>
        <Tabs selectedItem={this.selectedItem} setItem={this.state.selectedMenuItem}/>
      </div>
    )
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