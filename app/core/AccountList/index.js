import React, { Component } from 'react'
import styles from './style.css'
import PropTypes from 'prop-types'

import { MenuList, MenuItem } from 'material-ui/Menu'
import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'
import { ListItemIcon, ListItemText } from 'material-ui/List'
import InboxIcon from 'material-ui-icons/MoveToInbox'
import DraftsIcon from 'material-ui-icons/Drafts'
import SendIcon from 'material-ui-icons/Send'

const materialStyles = theme => ({
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
})

const supportedAssetData = [
  { id: 0, stellar: { id: 0,  title: 'Stellar', ticker: 'XLM' }, title: 'Stellar', ticker: 'XLM' },
  { id: 1, pts: { id: 1, title: 'BlockPoints', ticker: 'PTS'}, title: 'BlockPoints', ticker: 'PTS' },
  { id: 2, cadtoken: { id: 2, title: 'CAD Token', ticker: 'CAD'}, title: 'CAD Token', ticker: 'CAD' }
]

class AccountList extends Component {

  constructor (props) {
    super()
    this.state = ({
      itemSelected: supportedAssetData[0]
    })

  }

  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <Paper elevation={1} style={{marginTop: '-0.5rem'}}>
          <MenuList style={{marginTop: '2.5rem', height: '100vh'}}>
            <MenuItem className={materialStyles.menuItem}>
              <ListItemIcon className={materialStyles.icon}>
                <SendIcon />
              </ListItemIcon>
              <ListItemText inset primary="Stellar" />
            </MenuItem>
            <MenuItem className={materialStyles.menuItem}>
              <ListItemIcon className={materialStyles.icon}>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText inset primary="BlockPoints" />
            </MenuItem>
            <MenuItem className={materialStyles.menuItem}>
              <ListItemIcon className={materialStyles.icon}>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText inset primary="CAD" />
            </MenuItem>
          </MenuList>
        </Paper>
      </div>
    )
  }

}

export default AccountList