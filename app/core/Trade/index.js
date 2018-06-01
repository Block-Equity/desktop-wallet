import React, { Component } from 'react'
import { connect } from 'react-redux'

import styles from './style.css'
import TradeAsset from './TradeAsset'
import OpenOrders from './OpenOrders'
import History from './History'
import { ListGroup, ListGroupItem } from 'reactstrap'

const navigation = { tradeAsset: 0, openOrders: 1, tradeHistory: 2 }
const navigationList = [
  {title: 'Trade Asset'},
  {title: 'Open Orders'},
  {title: 'History'}
]
const INITIAL_NAVIGATION_INDEX = navigation.tradeAsset

class Trade extends Component {

  constructor (props) {
    super()
    this.state = {
      dbInit: false,
      selectedMenuItem: INITIAL_NAVIGATION_INDEX
    }
    this.selectedItem = this.selectedItem.bind(this)
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        { this.renderFunctionDrawer() }
        { this.renderContent() }
      </div>
    )
  }

  renderFunctionDrawer() {
    return (
      <div
        role='button'
        className={ styles.drawerContainer }>
          <ListGroup>
            { this.renderTradeFunctions () }
          </ListGroup>
      </div>
    )
  }

  renderTradeFunctions () {
    const listItemStyleNormal = {outline: 'none', borderRadius: '0', borderColor: 'rgba(0, 0, 0, 0.06)', borderRight: '0', borderLeft: '0' }
    const listItemStyleActive = { ...listItemStyleNormal, backgroundColor: '#FAFAFA', color: '#002EC4' }

    return navigationList.map((item, index) => {
      const isSelected = this.state.selectedMenuItem === index ? true : false
      return (
        <ListGroupItem selected={ isSelected }
                  style = { isSelected ? listItemStyleActive : listItemStyleNormal }
                  key={ index }
                  onClick={() => this.selectedItem(index) } action>
                    <h6 className={ styles.drawerItemLabel }>{item.title}</h6>
        </ListGroupItem>
      )
    })
  }

  renderContent() {
    switch (this.state.selectedMenuItem) {
      case navigation.tradeAsset:
        return ( <TradeAsset /> )
      break;
      case navigation.openOrders:
        return ( <OpenOrders /> )
      break;
      case navigation.tradeHistory:
        return ( <History /> )
      break;
    }
  }

   selectedItem = (index) => {
    this.setState({
      selectedMenuItem: index
    })
  }

}

const mapStateToProps = (state) => {
  return {
    app: getCurrentApp(state)
  }
}

export default Trade