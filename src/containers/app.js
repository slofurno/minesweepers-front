import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { keys, squareClicked } from 'modules/board'

const BOMB = '💣'
const FLAG = '⚐'
const noop = e => e.preventDefault()

const Square = ({neighbors, onClick, type, revealed, flagged}) => {
  let content = false
  let className = 'square'
  if (revealed) {
    className += ' revealed'
    if (flagged) {
      content = FLAG
    } else if (type == 'bomb') {
      content = BOMB
    } else if (neighbors > 0) {
      content = '' + neighbors
    }
  }

  return (
    <div className={className} onMouseDown={onClick} onContextMenu={noop}>{content}</div>
  )
}

class App extends Component {
  render() {
    const { board, squareClicked } = this.props
    return (
      <div className="container">
        { keys.map((pos,i) => {
            const props = board.squares[pos]
            return (
              <Square key={i} {...props} onClick={e => squareClicked(pos, e)} />
            )
          })
        }
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return state
}

export default connect(mapStateToProps, {squareClicked})(App)
