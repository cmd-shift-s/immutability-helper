
// recursive function
function set(context, commands, prop, target) {
  Object.keys(commands).forEach(cmd => {
    if (cmd === '$set') {
      context[prop] = Object.assign({}, context[prop], {[target]: commands[cmd]})
    } else {
      // recursive call
      set(context, commands[cmd], target, cmd)
    }
  })
}

function update(state, commands) {

  // soft copy
  const nextState = Object.assign({}, state)

  Object.keys(commands).forEach(cmd => {
    set(nextState, commands[cmd], cmd, cmd)
  })

  return nextState
}

module.exports = update
