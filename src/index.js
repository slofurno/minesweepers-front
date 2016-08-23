import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from 'modules/index'
const store = createStore(rootReducer, applyMiddleware(thunk))
//store.subscribe(() => console.log(store.getState()))

import App from 'containers/app'
import { updateBoard } from 'modules/board'

fetch("http://dev.snake.press/api/games")
  .then(res => res.json())
  .then(xs => connect(xs[0]))
  .catch(err => console.error(err))

function connect(game) {
  let state = {}
  let socket = new WebSocket(`ws://dev.snake.press/ws?gameid=${game}&token=123`)
  store.dispatch({type: 'SOCKET_CONNECTED', socket})
  socket.onmessage = e => update(JSON.parse(e.data))
}

function update(action) {
  switch(action.type) {
  case "init":
    return store.dispatch(updateBoard(action.state))

  case "update":
    return innerUpdate(action.update)
  }
}

function innerUpdate(update) {
  switch(update.type) {
  case "reveal":
    return store.dispatch(updateBoard(update.squares))
  }
}

render(<Provider store={store}><App/></Provider>, document.getElementById('root'))
