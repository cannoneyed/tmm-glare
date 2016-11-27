/* eslint-disable dot-notation, no-invalid-this */
/**
 * dat.globe Javascript WebGL Globe Toolkit
 * http://dataarts.github.com/dat.globe
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */


import * as THREE from 'three'
import Shaders from './shaders'
import helpers from './helpers'
import stars from './stars'

const DAT = {}
const EARTH_RADIUS = 100
const DEFAULT_DISTANCE = 1000
const DOUBLETAP_ZOOM_DISTANCE = 500

DAT.Globe = function Globe(container, opts = {}) {

  const colorFn = opts.colorFn || (x => {
    const c = new THREE.Color()
    c.setHSL(( 0.6 - ( x * 0.5 ) ), 1.0, 0.5)
    return c
  })
  const imgDir = opts.imgDir || '/globe/'

  // Declare "global" variables
  let camera, scene, renderer, w, h
  let starCamera, starScene
  let mesh, point
  let animationId

  let distance = 100000
  let distanceTarget = opts.distanceTarget || DEFAULT_DISTANCE
  const MAX_DISTANCE = opts.maxDistance || 1300
  const MIN_DISTANCE = opts.minDistance || 300
  const setDistanceTarget = opts.setDistanceTarget || (() => {})

  const curZoomSpeed = 0

  const MAX_ROTATION_VELOCITY = opts.maxRotation || 0.005
  const ROTATION_ACCELERATION = opts.rotationAcceleration || 0.0002
  let rotationVelocity = MAX_ROTATION_VELOCITY

  const rotation = { x: 0, y: 0 }
  let rotationRelease = { x: 0, y: 0 }
  let rotationPaused = false

  let glareLight
  let glareLightTicks = 50
  const glareLightMax = glareLightTicks

  let textureFlare0
  let textureFlare2
  let textureFlare3

  // deltaGlare
  const dGlareUp = -1
  const dGlareDown = 2.5
  let dGlare = 0

  // Initialization function
  function init() {
    rotation.x = Math.PI

    let shader, uniforms, material

    w = container.offsetWidth || window.innerWidth
    h = container.offsetHeight || window.innerHeight

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(30, w / h, 1, 10000)
    camera.position.z = distance
    camera.up.set(0, 1, 0)

    starScene = new THREE.Scene()
    starCamera = new THREE.PerspectiveCamera(75, w / h, 1, 1000)
    starCamera.position.z = distance
    starCamera.up.set(0, 1, 0)

    // Create / add the earth geometry
    let geometry = new THREE.SphereGeometry(EARTH_RADIUS, 20, 15)

    shader = Shaders['earth']
    uniforms = THREE.UniformsUtils.clone(shader.uniforms)

    uniforms['texture'].value = THREE.ImageUtils.loadTexture(imgDir + 'world.jpg')

    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader
    })

    const earthMesh = new THREE.Mesh(geometry, material)
    earthMesh.rotation.y = Math.PI
    scene.add(earthMesh)

    // Add the atmosphere
    shader = Shaders['atmosphere']
    uniforms = THREE.UniformsUtils.clone(shader.uniforms)

    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    })

    mesh = new THREE.Mesh(geometry, material)
    mesh.scale.set( 1.1, 1.1, 1.1 )
    scene.add(mesh)

    // Add the point cloud
    geometry = new THREE.CubeGeometry(0.75, 0.75, 1)
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -0.5))

    point = new THREE.Mesh(geometry)

    // Add the lens flare
    // lens flares
    const textureLoader = new THREE.TextureLoader()

    textureFlare0 = textureLoader.load( 'img/textures/lensflare0.png' )
    textureFlare2 = textureLoader.load( 'img/textures/lensflare2.png' )
    textureFlare3 = textureLoader.load( 'img/textures/lensflare3.png' )

    // check for browser Support
    if (helpers.webGLSupport()) {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      })

    } else {
      renderer = new THREE.CanvasRenderer({
        alpha: true,
        antialias: true,
      })
    }

    stars.init(starScene)

    renderer.autoClear = false
    renderer.setClearColor( 0xffffff, 0 )
    renderer.setSize(w, h)

    renderer.domElement.style.position = 'absolute'

    container.appendChild(renderer.domElement)
  }

  function reinitialize(container) {
    distance = 100000
    container.appendChild(renderer.domElement)
  }

  function addLight( h, s, l, x, y, z ) {
    const light = new THREE.PointLight( 0xffffff, 1.5, 2000 )
    light.color.setHSL( h, s, l )
    light.position.set( x, y, z )
    scene.add( light )

    const flareColor = new THREE.Color( 0xffffff )
    flareColor.setHSL( h, s, l + 0.5 )

    const lensFlare = new THREE.LensFlare( textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor )

    lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending )
    lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending )
    lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending )

    lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending )
    lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending )
    lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending )
    lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending )



    lensFlare.customUpdateCallback = lensFlareUpdateCallback
    lensFlare.position.copy( light.position )

    scene.add( lensFlare )
    return lensFlare
  }

  function lensFlareUpdateCallback( object ) {
    const vecX = -object.positionScreen.x * 2
    const vecY = -object.positionScreen.y * 2

    const percent = (glareLightMax - glareLightTicks) / glareLightMax
    var size = 20 * percent

    for (let f = 0; f < object.lensFlares.length; f++) {
      const flare = object.lensFlares[f]

      flare.x = object.positionScreen.x + vecX * flare.distance
      flare.y = object.positionScreen.y + vecY * flare.distance

      flare.scale = size
      flare.rotation = 0
    }

    object.lensFlares[2].y += 0.025
    object.lensFlares[3].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 )
  }

  function addData(data, opts) {
    let lat, lng, size, color, i, step, colorFnWrapper

    step = 3
    colorFnWrapper = (data, i) => colorFn(data[i + 2])

    if (this._baseGeometry === undefined) {
      this._baseGeometry = new THREE.Geometry()
      for (i = 0; i < data.length; i += step) {
        lat = data[i]
        lng = data[i + 1]
        color = colorFnWrapper(data, i)
        size = 0
        addPoint(lat, lng, size, color, this._baseGeometry)
      }
    }
    if (this._morphTargetId === undefined) {
      this._morphTargetId = 0
    } else {
      this._morphTargetId += 1
    }
    opts.name = opts.name || 'morphTarget' + this._morphTargetId

    const subgeo = new THREE.Geometry()
    for (i = 0; i < data.length; i += step) {
      lat = data[i]
      lng = data[i + 1]
      color = colorFnWrapper(data, i)
      size = data[i + 2]
      size = size * EARTH_RADIUS
      addPoint(lat, lng, size, color, subgeo)
    }
    if (opts.animated) {
      this._baseGeometry.morphTargets.push({
        name: opts.name,
        vertices: subgeo.vertices
      })
    } else {
      this._baseGeometry = subgeo
    }
  }

  function createPoints() {
    if (this._baseGeometry !== undefined) {
      if (this._baseGeometry.morphTargets.length < 8) {
        var padding = 8 - this._baseGeometry.morphTargets.length
        for (var i = 0; i <= padding; i++) {
          this._baseGeometry.morphTargets.push({
            name: 'morphPadding' + i,
            vertices: this._baseGeometry.vertices
          })
        }
      }
      this.points = new THREE.Mesh(this._baseGeometry, new THREE.MeshBasicMaterial({
        color: 0xffffff,
        vertexColors: THREE.FaceColors,
        morphTargets: true
      }))
    }
    scene.add(this.points)
  }

  function addPoint(lat, lng, size, color, subgeo) {
    var phi = (90 - lat) * Math.PI / 180
    var theta = (180 - lng) * Math.PI / 180

    point.position.x = EARTH_RADIUS * Math.sin(phi) * Math.cos(theta)
    point.position.y = EARTH_RADIUS * Math.cos(phi)
    point.position.z = EARTH_RADIUS * Math.sin(phi) * Math.sin(theta)

    point.lookAt(mesh.position)

    point.scale.z = Math.max( size, 0.1 ) // avoid non-invertible matrix
    point.updateMatrix()

    for (var i = 0; i < point.geometry.faces.length; i++) {
      point.geometry.faces[i].color = color
    }

    THREE.GeometryUtils.merge(subgeo, point)
  }

  function zoomDoubleTap() {
    if (distanceTarget >= DEFAULT_DISTANCE - 100) {
      distanceTarget = DOUBLETAP_ZOOM_DISTANCE
    } else {
      distanceTarget = DEFAULT_DISTANCE
    }
  }

  function zoom(delta) {
    const result = distanceTarget -= delta
    if (result > MAX_DISTANCE) {
      distanceTarget = MAX_DISTANCE
    } else if (distanceTarget < MIN_DISTANCE) {
      distanceTarget = MIN_DISTANCE
    } else {
      distanceTarget = result
    }

    setDistanceTarget(distanceTarget)
  }

  function touch(isTouched) {
    rotationPaused = isTouched
  }

  function pan(dx, dy) {
    rotation.y += dy * 2

    const pans = [
      () => rotation.x -= dx * 2,
      () => rotation.x += dx * 2,
    ]
    runOriented(pans, [0, 1, 1, 0])
  }

  function panRelease(velocityX, velocityY) {
    rotationRelease.x += velocityX * 0.05
    rotationRelease.y += velocityY * 0.05
  }

  function triggerGlare() {
    if (!glareLight) {
      glareLight = addLight( 0.55, 0.9, 0.5, 250, 0, -50 )
    }

    glareLightTicks = 50
    dGlare = dGlareUp
  }

  function animate() {
    animationId = requestAnimationFrame(animate)
    render()
  }

  function turnOffRendering() {
    // Remove the glareLight (doesn't look good upon reinitialization)
    scene.remove( glareLight )
    cancelAnimationFrame(animationId)
  }


  function render() {
    zoom(curZoomSpeed)

    const dRotation = rotationPaused ? -1 * ROTATION_ACCELERATION : ROTATION_ACCELERATION

    if (rotationVelocity > 0 && dRotation < 0) {
      rotationVelocity += dRotation
    }
    if (rotationVelocity < MAX_ROTATION_VELOCITY && dRotation > 0) {
      rotationVelocity += dRotation
    }

    const rots = [
      () => rotation.x -= (rotationVelocity + rotationRelease.x),
      () => rotation.x -= (rotationVelocity - rotationRelease.x),
    ]
    runOriented(rots, [0, 1, 1, 0])


    rotation.y += rotationRelease.y

    distance += (distanceTarget - distance) * 0.3

    rotationRelease.x *= 0.95
    rotationRelease.y *= 0.95

    camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y)
    camera.position.y = distance * Math.sin(rotation.y)
    camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y)

    glareLightTicks += dGlare
    if (dGlare !== 0 && glareLightTicks === 0) {
      dGlare = dGlareDown
    }
    if (glareLightTicks === glareLightMax) {
      dGlare = 0
    }

    if (glareLight) {
      glareLight.position.x = camera.position.x / 1.75
      glareLight.position.y = camera.position.y / 1.75
      glareLight.position.z = camera.position.z / 2
    }

    starCamera.position.x = camera.position.x * 0.01
    starCamera.position.y = camera.position.y * 0.01
    starCamera.position.z = distance


    const cams = [
      () => camera.up.set(0, 1, 0),
      () => camera.up.set(0, -1, 0),
    ]
    runOriented(cams, [0, 1, 1, 0])

    camera.lookAt(mesh.position)
    starCamera.lookAt(mesh.position)

    // renderer.render(scene, camera)
    renderer.clear()
    renderer.render(starScene, starCamera)

    renderer.clearDepth()
    renderer.render(scene, camera)
  }

  function runOriented(fns, rots) {
    let yRotations = Math.floor(rotation.y / (Math.PI / 2))
    const mod = yRotations % 4
    const index = mod < 0 ? 4 + mod : mod
    const fnIndex = rots[index]
    fns[fnIndex]()
  }

  init()

  this.reinitialize = reinitialize
  this.turnOffRendering = turnOffRendering
  this.animate = animate

  this.addData = addData
  this.createPoints = createPoints
  this.renderer = renderer
  this.scene = scene
  this.zoom = zoom
  this.zoomDoubleTap = zoomDoubleTap
  this.pan = pan
  this.panRelease = panRelease
  this.touch = touch

  this.triggerGlare = triggerGlare

  return this
}

export default DAT
