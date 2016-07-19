const DOMURL = window.URL || window.webkitURL || window

const generateIcon = (color) => {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">
    <g fill="${color}">
      <path d="M19 2h-14c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2zm-7 3.3c1.49 0 2.7 1.21 2.7 2.7 0 1.49-1.21 2.7-2.7 2.7-1.49 0-2.7-1.21-2.7-2.7 0-1.49 1.21-2.7 2.7-2.7zm6 10.7h-12v-.9c0-2 4-3.1 6-3.1s6 1.1 6 3.1v.9z"></path>
    </g>
  </svg>`
}

export default function generateImageUrl({ type }) {
  const colorMap = {
    me: '#56D7C6',
    other: '#999',
    selected: '#B96CFF',
  }

  const color = colorMap[type] || colorMap.general

  const img = new Image() // eslint-disable-line
  const svg = new Blob([generateIcon(color)], {type: 'image/svg+xml;charset=utf-8'})
  return DOMURL.createObjectURL(svg)
}
