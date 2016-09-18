export default () => {
  return new Promise(resolve => {
    require.ensure([], () => {
      resolve({
        d3: require('d3')
      })
    })
  })
}
