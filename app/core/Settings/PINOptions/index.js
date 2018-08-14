import React, { Component } from 'react'
import { MemoryRouter, Route } from 'react-router'

import Options from './Options'
import ResetPIN from './ResetPIN'

export default class PINOptions extends Component {
  render () {
    return (
      <MemoryRouter>
        <div>
          <Route exact path='/' component={Options} /> 
          <Route path='/reset-pin' component={ResetPIN} />
        </div>
      </MemoryRouter>
    )
  }
}