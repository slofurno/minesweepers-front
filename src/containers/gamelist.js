import React, { Component, PropTypes } from 'react'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'

class GameList extends Component {
  render() {
    const { games } = this.props

    return (
      <ul className="game-list">
        { games.map(x => <li key={x}> <Link to={`/games/${x}`} > {x} </Link> </li>) }
      </ul>
    )
  }
}

export default connect(x => x, {})(GameList)
