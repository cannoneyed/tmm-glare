export const force = d3.layout.force()
  .charge(-300)
  .linkDistance(50)
  .size([width, height])
