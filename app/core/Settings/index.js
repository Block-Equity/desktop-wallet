import React, { Component } from 'react'
import styles from './style.css'

import { withStyles } from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import ListSubheader from 'material-ui/List/ListSubheader'
import Divider from 'material-ui/Divider'

const userSettingsOptions = [
  { title: 'Reset PIN' },
  { title: 'View Mnemonic Phrase'},
  { title: 'Join inflation pools'},
  { title: 'Delete Wallet'}
]

const aboutSettingsOptions = [
  { title: 'Feedback' },
  { title: 'Blog'}
]

const font = "'Lato', sans-serif"

const materialStyles = theme => ({
  root: {
    width: '100%'
  },
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

class Settings extends Component {

  constructor (props) {
    super()
    this.state = {
      open: props.open
    }
    this.toggleSettingsDrawer = this.toggleSettingsDrawer.bind(this)
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
            className={materialStyles}
            tabIndex={0}
            role="button"
            style={{width: '15rem'}}
            onKeyDown={this.toggleSettingsDrawer(false)}>
              <List
                component="nav"
                subheader={<ListSubheader component="div" style={listHeaderStyle}>USER SETTINGS</ListSubheader>}>
                { this.renderUserSettings() }
              </List>
              <Divider />
              <List
                component="nav"
                subheader={<ListSubheader component="div" style={listHeaderStyle}>ABOUT</ListSubheader>}>
                { this.renderAboutSettings() }
              </List>
              <Divider />
          </div>
        </Drawer>
    )
  }

  renderUserSettings() {
    return userSettingsOptions.map((item, index) => {
      return (
        <ListItem button key={index}>
          <h6 style={listItemStyle}>{item.title}</h6>
        </ListItem>
      )
    })
  }

  renderAboutSettings() {
    return aboutSettingsOptions.map((item, index) => {
      return (
        <ListItem button key={index}>
          <h6 style={listItemStyle}>{item.title}</h6>
        </ListItem>
      )
    })
  }

  toggleSettingsDrawer = (open) => () => {
    this.setState({
      open
    })
    this.props.setOpen(open)
  }

}

export default Settings