import React, { Component } from 'react'
import styles from './style.css'

import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Tabs, { Tab } from 'material-ui/Tabs'
import Divider from 'material-ui/Divider'
import { truncate } from 'fs';

const font = "'Lato', sans-serif"

const materialStyles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 2,
    width: '100%',
  },
})

const navigation = [
  {title: 'Trade Asset'},
  {title: 'Open Orders'},
  {title: 'History'}
]

class Navigation extends Component {

  constructor (props) {
    super()
    this.state = {
      itemSelected: props.setItem
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.setItem !== this.props.setItem) {
      this.setState ({
        itemSelected: nextProps.setItem
      })
    }
  }

  renderTabs () {
    return (
      <Paper className={materialStyles.root} elevation={0} style={{borderRadius:'0'}}>
        <Tabs
          value={this.state.itemSelected}
          onChange={this.handleChange}
          indicatorColor='primary'
          textColor='primary'
          centered>
          { this.renderTabItems() }
        </Tabs>
        <Divider light={true}/>
      </Paper>
    )
  }

  renderTabItems() {
    return navigation.map((item, index) => {
        var idBuilder = `${item.title}-tab`;
        return (
          <Tab key={ idBuilder }
              label={ item.title }
              disableRipple={true}
              style={{ fontFamily: font, fontSize: '0.75rem', textTransform: 'none', color: '#1942c9', letterSpacing: '0.04rem', outline: 'none', marginLeft:'2rem', marginRight: '2rem', paddingLeft:'2rem', paddingRight:'2rem' }}/>
        )
    });
  }

  handleChange = (event, value) => {
    this.setState({
      itemSelected: value
    })
    this.props.selectedItem(value)
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

export default Navigation