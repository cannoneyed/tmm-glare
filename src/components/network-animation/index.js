/**
 * Particle Network Animation
 * Inspiration: https://github.com/JulianLaval/canvas-particle-network
*/

export default function initNetworkAnimation(element) {

  // let ParticleNetworkAnimation
  // let PNA
  // ParticleNetworkAnimation = PNA = function() {}

  class ParticleNetworkAnimation {
    constructor(element) {
      this.$el = element

      this.container = element
      this.canvas = document.createElement('canvas')
      this.sizeCanvas()
      this.container.appendChild(this.canvas)
      this.ctx = this.canvas.getContext('2d')
      this.particleNetwork = new ParticleNetwork(this)
    }

    sizeCanvas = () => {
      this.canvas.width = this.container.offsetWidth
      this.canvas.height = this.container.offsetHeight
    }
  }

  class Particle {
    constructor(parent, x, y) {
      this.network = parent
      this.canvas = parent.canvas
      this.ctx = parent.ctx
      this.particleColor = returnRandomArrayitem(this.network.options.particleColors)
      this.radius = getLimitedRandom(1.5, 2.5)
      this.opacity = 0
      this.x = x || Math.random() * this.canvas.width
      this.y = y || Math.random() * this.canvas.height
      this.velocity = {
        x: (Math.random() - 0.5) * parent.options.velocity,
        y: (Math.random() - 0.5) * parent.options.velocity
      }
    }

    update = () => {
      if (this.opacity < 1) {
        this.opacity += 0.01
      } else {
        this.opacity = 1
      }
      // Change dir if outside map
      if (this.x > this.canvas.width + 100 || this.x < -100) {
        this.velocity.x = -this.velocity.x
      }
      if (this.y > this.canvas.height + 100 || this.y < -100) {
        this.velocity.y = -this.velocity.y
      }

      // Update position
      this.x += this.velocity.x
      this.y += this.velocity.y
    }

    draw = () => {
      // Draw particle
      this.ctx.beginPath()
      this.ctx.fillStyle = this.particleColor
      this.ctx.globalAlpha = this.opacity
      this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
      this.ctx.fill()
    }
  }

  class ParticleNetwork {
    constructor(parent) {
      this.options = {
        velocity: 1, // the higher the faster
        density: 13000, // the lower the denser
        netLineDistance: 200,
        netLineColor: '#929292',
        particleColors: ['#4886bf', '#eab33e', '#c72b1f' ]
      }
      this.canvas = parent.canvas
      this.ctx = parent.ctx

      this.init()
    }

    init = () => {
      // Create particle objects
      this.createParticles(true)

      // Update canvas
      this.animationFrame = requestAnimationFrame(this.update)
    }

    createParticle = () => {
      return new Particle(this)
    }

    createParticles = (isInitial) => {
      // Initialise / reset particles
      this.particles = []
      var quantity = this.canvas.width * this.canvas.height / this.options.density

      if (isInitial) {
        var counter = 0
        clearInterval(this.createIntervalId)
        this.createIntervalId = setInterval(() => {
          if (counter < quantity - 1) {
            // Create particle object
            this.particles.push(this.createParticle())
          } else {
            clearInterval(this.createIntervalId)
          }
          counter++
        }, 250)
      } else {
        // Create particle objects
        for (var i = 0; i < quantity; i++) {
          this.particles.push(this.createParticle())
        }
      }
    }

    update = () => {
      if (!this.canvas) {
        cancelAnimationFrame(this.animationFrame)
        return
      }

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.globalAlpha = 1

      // Draw connections
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = this.particles.length - 1; j > i; j--) {
          const p1 = this.particles[i]
          const p2 = this.particles[j]

          // check very simply if the two points are even a candidate for further measurements
          let distance = Math.min(Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y))
          if (distance > this.options.netLineDistance) {
            continue
          }

          // the two points seem close enough, now let's measure precisely
          distance = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) +
            Math.pow(p1.y - p2.y, 2)
          )
          if (distance > this.options.netLineDistance) {
            continue
          }

          this.ctx.beginPath()
          this.ctx.strokeStyle = this.options.netLineColor
          this.ctx.globalAlpha = (this.options.netLineDistance - distance) / this.options.netLineDistance * p1.opacity * p2.opacity
          this.ctx.lineWidth = 0.7
          this.ctx.moveTo(p1.x, p1.y)
          this.ctx.lineTo(p2.x, p2.y)
          this.ctx.stroke()
        }
      }

      // Draw particles
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].update()
        this.particles[i].draw()
      }

      if (this.options.velocity !== 0) {
        this.animationFrame = requestAnimationFrame(this.update)
      }
    }
  }

  const pna = new ParticleNetworkAnimation(element)
  return pna
}


function getLimitedRandom(min, max, roundToInteger) {
  var number = Math.random() * (max - min) + min
  if (roundToInteger) {
    number = Math.round(number)
  }
  return number
}

function returnRandomArrayitem(array) {
  return array[Math.floor(Math.random() * array.length)]
}
