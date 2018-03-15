
// recursive function
function set(context, commands, prop) {
  Object.keys(commands).forEach(target => {
    const command = commands[target]
    if(command.hasOwnProperty('$set')) {
      context[prop] = Object.assign({}, context[prop], {[target]: command['$set']})
    } else {
      // TODO context[prop] is undefined.

      set(context[prop], command, target)
    }
  })
}

function update(state, commands) {

  if (commands.hasOwnProperty('$set')) {
    return commands['$set']
  }
  
  // soft copy
  const nextState = Object.assign({}, state)

  Object.keys(commands).forEach(target => {
    set(nextState, commands[target], target)
  })

  return nextState
}

module.exports = update
