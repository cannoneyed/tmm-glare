const users = {}

exports.getUsers = () => {
  return users
}

exports.get = (id) => {
  return users[id]
}

exports.set = (user) => {
  users[user.key] = user
}
