
import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux'

// Where to redirect not logged in users to try to access app

const openRoutes = ['/login']

export const AuthRoute = ({ component, ...props }) => {
  if (props.path === undefined) {
    return <Route {...props} component={component} />
  }
  if (props.isAuthenticated || openRoutes.includes(props.path)) {
    return <Route {...props} component={component} />
  } else {
    return <Redirect to={'/login'} />
  }
}

AuthRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  path: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired
}

export default connect(state => ({
  isAuthenticated: state.auth.isAuthenticated
}))(AuthRoute)
