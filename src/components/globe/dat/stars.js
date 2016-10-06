import * as THREE from 'three'

export default { init }

function init(scene) {
  scene.fog = new THREE.FogExp2( 0x000000, 0.0003 )

  const starQty = 4500
  const geometry = new THREE.SphereGeometry(1000, 100, 50)

  const materialOptions = {
    size: 1.0,
    opacity: 0.7,
    sizeAttenuation: false,
  }

  const starStuff = new THREE.PointsMaterial(materialOptions)

  for (var i = 0; i < starQty; i++) {
    const starVertex = new THREE.Vector3()
    starVertex.x = Math.random() * 2000 - 1000
    starVertex.y = Math.random() * 2000 - 1000
    starVertex.z = Math.random() * 2000 - 1000

    geometry.vertices.push(starVertex)
  }


  const stars = new THREE.Points(geometry, starStuff)
  scene.add(stars)
}
