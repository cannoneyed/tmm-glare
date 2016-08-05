import React from 'react'

import blind from './_blind'
import theWarehouse from './_theWarehouse'
import someAnimal from './_someAnimal'
import talkingMachine from './_talkingMachine'

const trackRenderingFunctions = [
  blind,
  null,
  theWarehouse,
  null,
  someAnimal,
  null,
  null,
  talkingMachine,
  null,
  null,
  null,
  null,
  null,
].map(Track => () => Track ? <Track /> : null)

export default function getIndividualTrack(index) {
  return trackRenderingFunctions[index]()
}
