import map from 'lodash.map'
import range from 'lodash.range'

const nTracks = 12
const unlockedIndexes = [1, 2, 6, 8]

export default function getUnlockedTracks(user) {
  const { connections, from } = user

  const locked = getLocked()
  const unlocked = []

  function unlockATrack(timestamp) {
    const unlockIndex = Math.floor(hashTimestamp(timestamp) * locked.length)
    const toUnlock = locked.splice(unlockIndex, 1)
    unlocked.push(parseInt(toUnlock[0]))
  }

  const connectionTimestamps = map(connections, (timestamp, userId) => {
    return userId !== from && timestamp
  }).filter(timestamp => timestamp)
    .sort()

  map(connectionTimestamps, (timestamp) => {
    if (locked.length === 0) {
      return
    }

    unlockATrack(timestamp)
    unlockATrack(timestamp + 1)
  })

  return unlocked
}


const unlocked = {}
map(range(nTracks), index => {
  unlocked[index] = false
})
map(unlockedIndexes, index => {
  unlocked[index] = true
})

function getLocked() {
  return map(unlocked, (isUnlocked, index) => {
    return !isUnlocked && index
  }).filter(index => index !== false)
}


/* eslint-disable */
function hashTimestamp(input) {
  // Robert Jenkins’ 32 bit integer hash function
  input = ((input + 0x7ED55D16) + (input << 12))  & 0xFFFFFFFF
  input = ((input ^ 0xC761C23C) ^ (input >>> 19)) & 0xFFFFFFFF
  input = ((input + 0x165667B1) + (input << 5))   & 0xFFFFFFFF
  input = ((input + 0xD3A2646C) ^ (input << 9))   & 0xFFFFFFFF
  input = ((input + 0xFD7046C5) + (input << 3))   & 0xFFFFFFFF
  input = ((input ^ 0xB55A4F09) ^ (input >>> 16)) & 0xFFFFFFFF
  return (input & 0xFFFFFFF) / 0x10000000
}
