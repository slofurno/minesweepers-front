import React, { Component, PropTypes } from 'react'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'

import { createGame } from 'modules'

class GameList extends Component {
  render() {
    const { games, createGame } = this.props

    return (
      <div>
        <input type="button" onClick={createGame} value="create game"/>
        <ul className="game-list">
          { games.map(x => <li key={x}> <Link to={`/games/${x}`} > {x} </Link> </li>) }
        </ul>
      </div>
    )
  }
}

export default connect(x => x, {createGame})(GameList)
