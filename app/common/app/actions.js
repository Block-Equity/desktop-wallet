import * as Types from './types'

export function setCurrentApp (app) {
  return async dispatch => {
    dispatch(setApp(app))
  }
}

export function setApp(app) {
  return {
    type: Types.SET_CURRENT_APP,
    payload: app
  }
}