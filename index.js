
// update array end point
function updateArray(state, commands) {
  return Object.entries(commands)
    .reduce((ctx, [cmd, value]) => {
      switch (cmd) {
        case '$splice':
          value.forEach(args => ctx.splice(...args))
          return ctx
        case '$push':
          ctx.push(...value)
          return ctx
        case '$unshift':
          ctx.unshift(...value)
          return ctx
        default:
          throw new Error(`Not Found command: ${cmd}`)
      }
    }, state)
}

// recursive function
function update(state, commands) {

  if (Array.isArray(state)) {
    return updateArray(state, commands)
  }

  const context = {}

  // 나머지 프로퍼티들을 복사
  Object.keys(state)
    .filter(prop => !commands.hasOwnProperty(prop))
    .forEach(prop => {
      context[prop] = state[prop]
    })

  return Object.entries(commands)
    .reduce((ctx, [prop, value]) => {
      if (prop.startsWith('$')) {
        if (prop === '$set') {
          return value
        } else if (prop === '$merge') {
          return Object.assign({}, state, value)
        } else if (prop === '$apply') {
          if (typeof value !== 'function') {
            throw new Error(`Invalid argument: '$apply'는 함수만 받을 수 있습니다.`)
          }

          return value(state)
        } else {
          throw new Error(`Not Found command: ${prop}`)
        }
      }

      if (state.hasOwnProperty(prop)) {
        ctx[prop] = update(state[prop], value)
      }

      return ctx
    }, context)
}

module.exports = update
