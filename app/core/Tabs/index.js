import React, { Component } from 'react'
import styles from './style.css'
import {
  Nav,
  NavItem,
  NavLink }
from 'reactstrap';

const navigation = [
  {title: 'HISTORY'},
  {title: 'SEND'},
  {title: 'RECEIVE'}
]

class Navigation extends Component {

  constructor (props) {
    super()
    this.state = {
      itemSelected: 0
    }
  }

  renderTabs() {
    return (
      <div className={styles.tabContainer}>
        <Nav pills justified={true}>
          { this.renderNavigationItems() }
        </Nav>
      </div>
    )
  }

  renderNavigationItems() {
    return navigation.map((item, index) => {
        var idBuilder = `${item.title}-tab`;
        var classNameBuilder = (this.state.itemSelected === index) ? 'bg-secondary' : '';
        return (
          <NavItem key={ idBuilder }>
              <NavLink className={classNameBuilder} active={this.state.itemSelected === index} href=''
                  onClick={(e) => this.navigationClickHandler(e, index)}>{ item.title }</NavLink>
          </NavItem>
        )
    });
  }

  navigationClickHandler(event, index) {
    event.preventDefault();
    this.setState({
      itemSelected: index
    })
    this.props.selectedItem(index)
  }

  render() {
    return (
      <div>
        { this.renderTabs() }
      </div>
    )
  }

}

export default Navigation;