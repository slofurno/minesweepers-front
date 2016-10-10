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

const img = new Image();
img.src = '/bomb.png';

const defaultSquare = {
  neighbors: 0,
  type: "empty",
  revealed: true,
}

function drawSquare(ctx, x, y, {neighbors, type, revealed, flagged} = defaultSquare) {
  if (flagged) {
    ctx.drawImage(img, 9 * 40, 0, 40, 40, x * 40, y * 40, 40, 40)
  } else if (revealed) {
    if (type == 'bomb') {
      ctx.drawImage(img, 10 * 40, 0, 40, 40, x * 40, y * 40, 40, 40)
    } else if (neighbors > 0) {
      ctx.drawImage(img, neighbors * 40, 0, 40, 40, x * 40, y * 40, 40, 40)
    } else {
      ctx.fillRect(x*40, y*40, 40, 40);
    }
  } else {
    ctx.drawImage(img, 0, 0, 40, 40, x * 40, y * 40, 40, 40)
  }
}

const CanvasBoard = React.createClass({
  componentDidMount() {
    this.refs.root.appendChild(front_)
  },
  shouldComponentUpdate() {
    return false
  },
  render() {
    return (
      <div ref="root">
      </div>
    )
  }
})


const back_ = document.createElement('canvas');
const back = back_.getContext('2d');
back.fillStyle = "gainsboro";
const front_ = document.createElement('canvas');
const front = front_.getContext('2d');
front.fillStyle = "gainsboro";

global.front = front_;
global.back = back_

class App extends Component {
  render() {
    const SIZE = 40
    const HEIGHT = (window.innerHeight / SIZE | 0) * SIZE
    const WIDTH = (window.innerWidth / SIZE | 0) * SIZE
    const { board, squareClicked, panX, panY } = this.props

    const cols = WIDTH / SIZE | 0
    const rows = HEIGHT / SIZE | 0

    const j1 = panY / SIZE
    const i1 = panX / SIZE

    const j0 = panY / SIZE | 0
    const i0 = panX / SIZE | 0

    front_.width = cols * 40;
    front_.height = rows * 40;

    back_.width = cols * 40;
    back_.height = rows * 40;
    const xs = []

    back.fillRect(0, 0, WIDTH, HEIGHT);

    for(let j = 0; j < rows; j++) {
      for(let i = 0; i < cols ; i++) {
        drawSquare(back, i, j, board.squares[[i + i0, j + j0]])
    //for (let j = j0; j < j0 + rows; j++) {
    //  for (let i = i0; i < i0 + cols; i++) {
        //xs.push([i,j])
      }
    }

    front.fillRect(0, 0, WIDTH, HEIGHT);
    front.drawImage(back_, i1 - i0, j1 - j0);
    front_.onclick = e => {
      e.preventDefault()
      const dx = panX + e.x
      const dy = panY + e.y
      const pos = [dx/SIZE|0, dy/SIZE|0]
      console.log(pos)
      squareClicked(pos, e)
    }

   const boardStyle = {
     width: WIDTH,
     height: HEIGHT
   }

    /*
            xs.map((pos,i) => {
              const square = board.squares[pos]
              return (
                <Square key={pos} {...square} onClick={e => squareClicked(pos, e)} />
              )
            })
    */

    return (
      <div>
        <div className="container" style={boardStyle}>
          <CanvasBoard />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return state
}

export default connect(mapStateToProps, {squareClicked})(makePannable(App))
