import React, { Component } from 'react'
import styles from './style.css'

import { withStyles } from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import ListSubheader from 'material-ui/List/ListSubheader'
import Divider from 'material-ui/Divider'

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
  { id: 1, viewMnemonic: { id: 1, title: 'View Mnemonic Phrase'}, title: 'View Mnemonic Phrase' },
  { id: 2, deleteWallet: { id: 2, title: 'Delete Wallet'}, title: 'Delete Wallet' }
]

const aboutSettingsOptions = [
  { id: 0, feedback: { id: 0, title: 'Feedback' }, title: 'Reset PIN' },
  { id: 1, bug: { id: 1, title: 'Bug Reporting' }, title: 'Reset PIN' },
  { id: 2, blog: { id: 2, title: 'Blog' }, title: 'Reset PIN' }
]

const font = "'Lato', sans-serif"

const materialStyles = theme => ({
  root: {
    width: '100%'
  },
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  }
})

const listHeaderStyle = {
  fontFamily: font,
  color: '#777777',
  fontSize: '0.7rem',
  fontWeight: '700',
  letterSpacing: '0.1rem'
}

const listItemStyle = {
  fontFamily: font,
  color: '#222222',
  fontSize: '0.9rem',
  fontWeight: '300',
  marginTop: '0.4rem'
}

const appBarStyle = {
  height: '5.5rem',
  backgroundImage: 'linear-gradient(to bottom right, #07237A 0%, #0153B6 100%)'
}

const appBarTitleStyle = {
  fontFamily: font,
  fontSize: '1.25rem',
  fontWeight: '300'
}

function Transition(props) {
  return <Slide direction="up" {...props} />
}

class Settings extends Component {

  constructor (props) {
    super()
    this.state = {
      open: props.open,
      itemOpen: false,
      selectedItem: userSettingsOptions[0]
    }
    this.toggleSettingsDrawer = this.toggleSettingsDrawer.bind(this)
    this.handleItemClick = this.handleItemClick.bind(this)
    this.handleSettingsContentOpen = this.handleSettingsContentOpen.bind(this)
    this.handleSettingsContentClose = this.handleSettingsContentClose.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.open !== this.props.open) {
      this.setState ({
        open: nextProps.open
      })
    }
  }

  render () {
    return (
      <Drawer anchor="right"
              open={this.state.open}
              onClose={this.toggleSettingsDrawer(false)}>
          <div
            className={materialStyles.root}
            tabIndex={0}
            role="button"
            style={{width: '15rem'}}
            onKeyDown={this.toggleSettingsDrawer(false)}>
              <List
                component="nav"
                subheader={<ListSubheader component="div" style={listHeaderStyle}>USER SETTINGS</ListSubheader>}>
                { this.renderUserSettings() }
              </List>
          </div>
          { this.renderSettingsItem() }
      </Drawer>
    )
  }

  renderUserSettings() {
    return userSettingsOptions.map((item, index) => {
      return (
        <ListItem button key={ index } onClick={() => this.handleItemClick(item) }>
          <h6 style={listItemStyle}>{item.title}</h6>
        </ListItem>
      )
    })
  }

  renderAboutSettings() {
    return aboutSettingsOptions.map((item, index) => {
      return (
        <ListItem button key={ index }>
          <h6 style={listItemStyle}>{item.title}</h6>
        </ListItem>
      )
    })
  }

  renderSettingsItem() {
    return (
      <Dialog
          fullScreen
          open={this.state.itemOpen}
          onClose={this.handleSettingsContentClose}
          transition={Transition}>
          <AppBar className={materialStyles.appBar} style={appBarStyle}>
            <Toolbar style={{paddingTop: '2rem'}}>
              <IconButton color="inherit" onClick={this.handleSettingsContentClose} style={{outline: 'none'}} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={materialStyles.flex} style={appBarTitleStyle}>
                { this.state.selectedItem.title }
              </Typography>
            </Toolbar>
          </AppBar>
          <div id={styles.contentContainer}>
            { this.renderSettingsItemContent() }
          </div>
      </Dialog>
    )
  }

  renderSettingsItemContent() {
    switch (this.state.selectedItem.id) {
      case 0:
        return (
          <div style={{ width: '60%' }}>
            <ResetPIN close={this.handleSettingsContentClose} />
          </div>
        )
      break
      case 1:
        return (
          <div style={{ width: '60%' }}>
            <ViewMnemonic />
          </div>
        )
      break
      case 2:
        return (
          <div style={{ width: '60%' }}>
            <DeleteWallet />
          </div>
        )
      break;
    }
  }

  toggleSettingsDrawer = (open) => () => {
    this.setState({
      open
    })
    this.props.setOpen(open)
  }

  handleItemClick (selectedItem) {
    this.setState({
      selectedItem
    })
    this.handleSettingsContentOpen()
  }

  handleSettingsContentOpen() {
    this.setState({
      itemOpen : true
    })
  }

  handleSettingsContentClose() {
    this.setState({
      itemOpen : false
    })
  }

}

export default Settings