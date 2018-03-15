// recursive function
function update(state, commands) {
  const context = {}

  // 나머지 프로퍼티들을 복사
  Object.keys(state)
    .filter(prop => !commands.hasOwnProperty(prop))
    .forEach(prop => {
      context[prop] = state[prop]
    })

  return Object.entries(commands)
    .reduce((ctx, [prop, value]) => {
      if (prop === '$set') {
        return value
      } else if (prop === '$merge') {
        return Object.assign({}, state, value)
      }

      if (state.hasOwnProperty(prop)) {
        ctx[prop] = update(state[prop], value)
      }

      return ctx
    }, context)
}

module.exports = update
