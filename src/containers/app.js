import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { keys, squareClicked } from 'modules/board'
import makePannable from 'pannable'

const BOMB = '💣'
const FLAG = '⚐'
const preventDefault = e => e.preventDefault()

const Square = ({neighbors, onClick, type, revealed, flagged}) => {
  let content = false
  let className = 'square'

  if (flagged) {
    content = FLAG
  } else if (revealed) {
    className += ' revealed'

    if (type == 'bomb') {
      content = BOMB
    } else if (neighbors > 0) {
      content = '' + neighbors
    }
  }

  return (
    <div className={className} onClick={onClick} onContextMenu={onClick}>{content}</div>
  )
}

class App extends Component {
  render() {
    const SIZE = 40
    const HEIGHT = ((window.innerHeight - 80) / 40 | 0) * 40
    const WIDTH = (window.innerWidth / 40 | 0) * 40
    const { board, squareClicked, panX, panY } = this.props

    const cols = WIDTH / SIZE | 0
    const rows = HEIGHT / SIZE | 0
    const j0 = panY / SIZE | 0
    const i0 = panX / SIZE | 0

    const xs = []
    for (let j = j0; j < j0 + rows; j++) {
      for (let i = i0; i < i0 + cols; i++) {
        xs.push([i,j])
      }
    }

   const boardStyle = {
     width: WIDTH,
     height: HEIGHT
   }

    return (
      <div>
        <div className="container" style={boardStyle}>
          {
            xs.map((pos,i) => {
              const square = board.squares[pos]
              return (
                <Square key={pos} {...square} onClick={e => squareClicked(pos, e)} />
              )
            })
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return state
}

export default connect(mapStateToProps, {squareClicked})(makePannable(App))
