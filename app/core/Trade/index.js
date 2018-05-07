import React, { Component } from 'react'
import { connect } from 'react-redux'

class Trade extends Component {

  constructor (props) {
    super()
    this.state = {
      dbInit: false
    }
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', width: '100%' }}>
        <h6>Trading View Placeholder</h6>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    app: getCurrentApp(state)
  }
}

export default Trade