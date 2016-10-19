export default function user(state = {id: "", token: ""}, action) {
  switch(action.type) {
  case "USER_SET":
    return action.user
  default:
    return state
  }
}

function setUser(user) {
  return {
    type: "USER_SET",
    user
  }
}

const storage_key = 'minesweepers_user'

export function getUser() {
  return (dispatch) => {
    const stored = localStorage.getItem(storage_key)
    if (stored) {
      const user = JSON.parse(stored)
      dispatch(setUser(user))
    } else {
      fetch('/api/users', {method: 'POST'})
        .then(res => res.json())
        .then(user => {
          localStorage.setItem(storage_key, JSON.stringify(user))
          return dispatch(setUser(user))
        })
    }
  }
}

