import React, { Component } from 'react'
import styles from './style.css'

import { withStyles } from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import { MenuList, MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
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
  { id: 0, feedback: { id: 0, title: 'Feedback' }, title: 'Feedback' },
  { id: 1, bug: { id: 1, title: 'Bug Reporting' }, title: 'Bug Reporting' },
  { id: 2, blog: { id: 2, title: 'Blog' }, title: 'Blog' }
]

const font = "'Lato', sans-serif"

const materialStyles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawerPaper: {
    position: 'absolute',
    width: 210,
    zIndex: 0
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white
      }
    }
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
  fontSize: '0.8rem',
  fontWeight: '400',
  marginTop: '0.4rem'
}

const appBarStyle = {
  height: '5.5rem',
  backgroundImage: 'linear-gradient(to bottom right, #07237A 0%, #0153B6 100%)'
}

const appBarTitleStyle = {
  fontFamily: font,
  fontSize: '1rem',
  fontWeight: '400',
  letterSpacing: '0.1rem',
  paddingRight: '2rem'
}

function Transition(props) {
  return <Slide direction="up" {...props} />
}

class Settings extends Component {

  constructor (props) {
    super()
    this.state = {
      open: props.open,
      selectedItem: userSettingsOptions[0]
    }
    this.toggleSettingsDrawer = this.toggleSettingsDrawer.bind(this)
    this.handleItemClick = this.handleItemClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.open !== this.props.open) {
      this.setState ({
        open: nextProps.open
      })
    }
  }

  render() {
    return (
      <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.closeSettings}
          transition={Transition}>
          <div id={styles.mainContainer}>
            <AppBar position='absolute' className={materialStyles.appBar} style={appBarStyle}>
              <Toolbar style={{paddingTop: '2rem'}}>
                <IconButton color="inherit" onClick={this.closeSettings} style={{outline: 'none'}} aria-label="Close">
                  <CloseIcon />
                </IconButton>
                <div style={{width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
                  <Typography variant="title" color="inherit" style={appBarTitleStyle}>
                    SETTINGS
                  </Typography>
                </div>
              </Toolbar>
            </AppBar>
            { this.renderSettingsDrawer() }
            <div className={styles.contentContainer}>
              { this.renderSettingsItemContent() }
            </div>
          </div>
      </Dialog>
    )
  }

  renderSettingsDrawer() {
    return (
      <div
        role='button'
        style={{width: '12rem', marginRight: '3rem'}}
        onKeyDown={this.toggleSettingsDrawer(false)}>
          <MenuList>
            { this.renderUserSettings() }
          </MenuList>
      </div>
    )
  }

  renderUserSettings() {
    return userSettingsOptions.map((item, index) => {
      const isSelected = this.state.selectedItem.id === index ? true : false
      return (
        <MenuItem selected={ isSelected }
                  className={ materialStyles.menuItem }
                  key={ index }
                  disableRipple={ true }
                  onClick={() => this.handleItemClick(item) }>
                    <h6 style={listItemStyle}>{item.title}</h6>
        </MenuItem>
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

  renderSettingsItemContent() {
    switch (this.state.selectedItem.id) {
      case 0:
        return (
          <div style={{ width: '90%' }}>
            <ResetPIN />
          </div>
        )
      break
      case 1:
        return (
          <div style={{ width: '90%' }}>
            <ViewMnemonic />
          </div>
        )
      break
      case 2:
        return (
          <div style={{ width: '90%' }}>
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

  closeSettings = () =>  {
    this.setState({
      open: false
    })
    this.props.setOpen(false)
  }

  handleItemClick (selectedItem) {
    this.setState({
      selectedItem
    })
  }

}

export default Settings