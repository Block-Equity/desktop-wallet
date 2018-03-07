import React, { Component } from 'react'

import styles from './style.css'

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
        <ul className="nav nav-pills nav-justified" id="pills-tab" role="tablist">
          { this.renderNavigationItems() }
        </ul>
      </div>
    )
  }

  renderNavigationItems() {
    return navigation.map((item, index) => {
        var idBuilder = `${item.title}-tab`;
        var classNameBuilder = (this.state.itemSelected === index) ? 'nav-link active' : 'nav-link';
        return (
          <li className="nav-item" key={ idBuilder }>
              <a className={ classNameBuilder } href=''
                  onClick={(e) => this.navigationClickHandler(e, index)}>{ item.title }</a>
          </li>
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