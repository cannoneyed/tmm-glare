export default () => {
  return new Promise(resolve => {
    require.ensure([], () => {
      resolve({
        vis: require('vis')
      })
    })
  })
}
