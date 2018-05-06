import * as Types from './types'

export function setCurrentApp (app) {
  return async dispatch => {
    return {
      type: Types.SET_CURRENT_APP,
      payload: app
    }
  }
}
