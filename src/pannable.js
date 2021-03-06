import React, { Component, PropTypes } from 'react'

export default function makePannable(Inner) {
  class Pannable extends Component {
    constructor(props) {
      super(props)
      this.state = {
        panX: 0,
        panY: 0
      }

      this.panX = 0
      this.panY = 0

      this.setStart = this.setStart.bind(this)
      this.startTouch = this.startTouch.bind(this)
      this.mouseUp = this.mouseUp.bind(this)
      this.mouseDown = this.mouseDown.bind(this)
      this.touchMove= this.touchMove.bind(this)
      this.mouseMove = this.mouseMove.bind(this)
      this.handlePan = this.handlePan.bind(this)
    }

    setStart(e) {
      this.start = {x: e.clientX, y: e.clientY}
    }

    mouseUp(e) {
      this.isMouseDown = false
    }

    mouseDown(e) {
      this.isMouseDown = true
      this.setStart(e)
    }

    startTouch(e) {
      this.setStart(e.touches[0])
    }

    touchMove(e) {
      e.preventDefault()
      this.handlePan(e.touches[0])
    }

    mouseMove(e) {
      if (!this.isMouseDown) { return }

      if ((e.buttons & 1) === 0) {
        this.isMouseDown = false
        return
      }

      this.handlePan(e)
    }

    handlePan(e) {
      const { onPan } = this.props
      this.panX = this.panX + e.clientX - this.start.x
      this.panY = this.panY + e.clientY - this.start.y
      let dx = e.clientX - this.start.x
      let dy = e.clientY - this.start.y

      this.setStart(e)

      if (onPan) {
        onPan({panX: this.panX, panY: this.panY, dx, dy})
      } else {
        this.setState({panX: this.panX, panY: this.panY})
      }
    }

    render() {
      const { panX, panY } = this.state

      return (
        <div
          onMouseDown={this.mouseDown}
          onMouseUp={this.mouseUp}
          onMouseMove={this.mouseMove}
          onTouchStart={this.startTouch}
          onTouchMove={this.touchMove}
        >
          <Inner {...this.props} panX={panX} panY={panY}/>
        </div>
      )
    }
  }

  return Pannable
}


