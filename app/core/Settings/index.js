import React, { Component } from 'react'
import styles from './style.css'

import { withStyles } from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import { MenuList, MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import ListSubheader from 'material-ui/List/ListSubheader'
import Divider from 'material-ui/Divider'
import { ListGroup, ListGroupItem } from 'reactstrap'

//Settings Content
import Button from 'material-ui/Button'
import Dialog from 'material-ui/Dialog'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import CloseIcon from 'material-ui-icons/Close'
import Slide from 'material-ui/transitions/Slide'

//Custom components
import ResetPIN from './ResetPIN'
import ViewMnemonic from './ViewMnemonic'
import DeleteWallet from './DeleteWallet'

//Constants
const userSettingsOptions = [
  { id: 0, resetPIN: { id: 0,  title: 'Reset PIN' }, title: 'Reset PIN' },
  { id: 1, viewMnemonic: { id: 1, title: 'View Phrase'}, title: 'View Phrase' },
  { id: 2, deleteWallet: { id: 2, title: 'Delete Wallet'}, title: 'Delete Wallet' }
]

const aboutSettingsOptions = [
  { id: 0, feedback: { id: 0, title: 'Feedback' }, title: 'Feedback' },
  { id: 1, bug: { id: 1, title: 'Bug Reporting' }, title: 'Bug Reporting' },
  { id: 2, blog: { id: 2, title: 'Blog' }, title: 'Blog' }
]

class Settings extends Component {

  constructor (props) {
    super()
    this.state = {
      selectedItem: userSettingsOptions[0]
    }
    this.handleItemClick = this.handleItemClick.bind(this)
  }

  render() {
    return (
      <div id={styles.mainContainer}>
        { this.renderSettingsDrawer() }
        <div className={styles.contentContainer}>
          { this.renderSettingsItemContent() }
        </div>
      </div>
    )
  }

  renderSettingsDrawer() {
    return (
      <div
        role='button'
        className={ styles.drawerContainer }>
          <ListGroup>
            { this.renderUserSettings() }
          </ListGroup>
      </div>
    )
  }

  renderUserSettings() {
    const listItemStyleNormal = {outline: 'none', borderRadius: '0', borderColor: 'rgba(0, 0, 0, 0.06)', borderRight: '0', borderLeft: '0' }
    const listItemStyleActive = { ...listItemStyleNormal, backgroundColor: '#FAFAFA', color: '#002EC4' }

    return userSettingsOptions.map((item, index) => {
      const isSelected = this.state.selectedItem.id === index ? true : false
      return (
        <ListGroupItem selected={ isSelected }
                  style = { isSelected ? listItemStyleActive : listItemStyleNormal }
                  key={ index }
                  onClick={() => this.handleItemClick(item) }>
                    <h6 className={ styles.drawerItemLabel }>{item.title}</h6>
        </ListGroupItem>
      )
    })
  }

  renderSettingsItemContent() {
    switch (this.state.selectedItem.id) {
      case 0:
        return (
          <ResetPIN />
        )
      break
      case 1:
        return (
          <ViewMnemonic />
        )
      break
      case 2:
        return (
          <DeleteWallet />
        )
      break;
    }
  }

  handleItemClick (selectedItem) {
    this.setState({
      selectedItem
    })
  }

}

export default Settings