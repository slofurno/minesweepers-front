import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { keys, squareClick, squareRightClick } from 'modules/board'
import makePannable from 'pannable'

const img = new Image();
img.src = '/bomb.png';

const defaultSquare = {
  n: 0,
  s: "empty"
}

const unrevealedSquare = {
  s: "unrevealed"
}

function drawSquare(ctx, x, y, SIZE, {n, s} = defaultSquare) {
  switch (s) {
  case "flagged":
    return ctx.drawImage(img, 9 * 40, 0, 40, 40, x * SIZE, y * SIZE, SIZE, SIZE)
  case "bomb":
    return ctx.drawImage(img, 10 * 40, 0, 40, 40, x * SIZE, y * SIZE, SIZE, SIZE)
  case "empty":
    return n > 0
      ? ctx.drawImage(img, n * 40, 0, 40, 40, x * SIZE, y * SIZE, SIZE, SIZE)
      : ctx.fillRect(x*SIZE, y*SIZE, SIZE, SIZE);
  default:
    ctx.drawImage(img, 0, 0, 40, 40, x * SIZE, y * SIZE, SIZE, SIZE)
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
const front_ = document.createElement('canvas');
const front = front_.getContext('2d');

class Board extends Component {
  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const { board, squareClick, squareRightClick, panned } = this.props
    const { panX, panY } = panned
    const SIZE = board.squareSize

    const HEIGHT = ((window.innerHeight - 30) / SIZE | 0) * SIZE
    const WIDTH = (window.innerWidth  / SIZE | 0) * SIZE
    const cols = WIDTH / SIZE | 0
    const rows = HEIGHT / SIZE | 0

    const jm = panY % SIZE
    const im = panX % SIZE

    const j0 = panY / SIZE | 0
    const i0 = panX / SIZE | 0

    front_.width = cols * SIZE;
    front_.height = rows * SIZE;

    back_.width = cols * 41;
    back_.height = rows * 41;

    back.fillRect(0, 0, WIDTH, HEIGHT);
    back.fillStyle = "whitesmoke";

    for(let j = 0; j < rows + 1; j++) {
      for(let i = 0; i < cols + 1 ; i++) {
        const col = i + i0
        const row = j + j0
        if (row >= board.rows || row < 0 || col >= board.cols || col < 0) {
          drawSquare(back, i, j, SIZE, defaultSquare)
        } else {
          const square = board.squares[[i + i0, j + j0]] || unrevealedSquare
          drawSquare(back, i, j, SIZE, square)
        }
      }
    }

    front.fillRect(0, 0, WIDTH, HEIGHT);
    front.drawImage(back_,-im, -jm);

    const clickHandler = e => {
      const dx = panX + e.nativeEvent.offsetX
      const dy = panY + e.nativeEvent.offsetY
      const pos = [dx/SIZE|0, dy/SIZE|0]
      //fix clicks while panning board
      if (pos[0] == this.lastPos[0] && pos[1] == this.lastPos[1]) {
        squareClick(pos, e)
      }
      this.lastPos = pos;
    }

    const rightClickHandler = e => {
      const dx = panX + e.nativeEvent.offsetX
      const dy = panY + e.nativeEvent.offsetY
      const pos = [dx/SIZE|0, dy/SIZE|0]
      squareRightClick(pos, e)
    }

    const mouseDown = e => {
      const dx = panX + e.nativeEvent.offsetX
      const dy = panY + e.nativeEvent.offsetY
      const pos = [dx/SIZE|0, dy/SIZE|0]
      this.lastPos = pos;
    }

    const boardStyle = {
      width: WIDTH,
      height: HEIGHT
    }

    return (
      <div>
        <div className="container"
          style={boardStyle}
          onClick={clickHandler}
          onContextMenu={rightClickHandler}
          onMouseDown={mouseDown}
        >

          <CanvasBoard />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return state
}

export default connect(mapStateToProps, {squareClick, squareRightClick})(makePannable(Board))
