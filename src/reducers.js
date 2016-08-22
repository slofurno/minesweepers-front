import { combineReducers } from 'redux'

function todo(state = [], action) {
  switch(action.type) {
  default:
    return state
  }
}

function socket(state = null, action) {
  switch(action.type) {

  }
}

const rootReducer = combineReducers({
  todo,
})

export default rootReducer
