"use strict"

fetch("http://dev.snake.press/api/games")
  .then(res => res.json())
  .then(xs => connect(xs[0]))
  .catch(err => console.error(err))

function connect(game) {
  let state = {}
  let ws = new WebSocket(`ws://dev.snake.press/ws?gameid=${game}&token=123`)
  ws.onmessage = e => update(JSON.parse(e.data))

  setTimeout(() => {
    ws.send(JSON.stringify({type: "click", pos: [10,15], right: false}))

  }, 300)
}


function update(state, action) {
  switch(action.type) {
  case "init":
  case "update":
    console.log(action)
  }
}

