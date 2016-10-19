import React, { Component, PropTypes } from 'react'
import { Provider, connect } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import Game from 'containers/game'
import GameList from 'containers/gamelist'

import { getUser } from 'modules/user'
import rootReducer, { fetchGames } from 'modules/index'

const store = createStore(rootReducer, applyMiddleware(thunk))
//store.subscribe(() => console.log(store.getState()))

store.dispatch(getUser())
store.dispatch(fetchGames())

class App extends Component {
  render() {
    return (
      this.props.children
    )
  }
}

class Root extends Component {
  render() {
    const { store, history } = this.props
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={App}>
            <IndexRoute component={GameList}/>
            <Route path="/games/:gameId" component={Game}/>
          </Route>
        </Router>
      </Provider>
    )
  }
}

render(
  <Root store={store} history={browserHistory}/>,
  document.getElementById('root')
)
