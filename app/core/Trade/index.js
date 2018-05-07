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
      <div>
        <h4>Trading View Placeholder</h4>
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