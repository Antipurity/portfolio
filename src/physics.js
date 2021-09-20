

// Vue-integrated physics.
Vue.component('world', {
  props:{
    _class:{ type: String, default: 'block' },
    gravityX:{ type: Number, default: 0, },
    gravityY:{ type: Number, default: 1, },
    bounded:{ type: Boolean, default: true },
    allowDragging:{ type: Boolean, default: true },
  },
  inject:['oncollision'],
  render(h) {
    this.engine.gravity.x = this.gravityX
    this.engine.gravity.y = this.gravityY
    return h('span',
      { class: this._class, style:{ position: 'relative' }, },
      [
        h('div', {
          style:{ position: 'absolute', left: 0, top: 0 },
          ref: 'overlay',
        }),
        ...this.$slots.default,
      ])
  },
  data() {
    const views = [], links = new Map
    this.engine = Matter.Engine.create({
      enableSleeping: true,
    })
    this.runner = Matter.Runner.create()
    this.worldViews = views
    this.links = links
    this.updateViews = function() {
      const transforms = views.map(view => {
        // Rotate, then translate by in-world position, plus the static-layout movement since creation.
        const body = view.body
        if (body.isSleeping) return
        const x1 = body.position.x, y1 = body.position.y
        const firstPos = view.initialPos
        const x2 = x1 - firstPos.x
        const y2 = y1 - firstPos.y
        return `translate(${x2 | 0}px,${y2 | 0}px) rotate(${body.angle}rad)`
      })
      for (let i = 0; i < views.length; ++i)
        if (transforms[i]) views[i].$el.style.transform = transforms[i]
      // Rotate+scale constraint images.
      links.forEach((constraint, el) => {
        const pA = Matter.Constraint.pointAWorld(constraint)
        const pB = Matter.Constraint.pointBWorld(constraint)
        const dx = pB.x - pA.x
        const dy = pB.y - pA.y
        const distance = Math.hypot(dy, dx)
        const angle = Math.atan2(dy, dx)
        el.style.position = 'absolute'
        el.style.transformOrigin = '0 0'
        el.style.transform = ` translate(${pA.x | 0}px,${pA.y | 0}px) rotate(${angle}rad) scale(${distance/100},1)`
      })
    }
    this.unboundConstraints = Object.create(null)
    this.edges = []
    return {}
  },
  async mounted() {
    await new Promise(requestAnimationFrame)
    Matter.Runner.start(this.runner, this.engine)
    Matter.Events.on(this.runner, 'afterUpdate', this.updateViews)

    // Add rects around the edges.
    _updateWorldBounds(this, this.bounded)

    // Also react to transitions inside <obj>ects like they're moving physical parts.
    //   The assumed density is 1.
    const trackedElems = new Map
    function trackTransitions() {
      const mult = 1e-3
      for (let [el, last] of trackedElems) {
        if (!el.parentNode) { trackedElems.delete(el);  continue }
        const rect = el.getBoundingClientRect(), pRect = el.parentNode.getBoundingClientRect()
        const x = rect.x - pRect.x + rect.width/2
        const y = rect.y - pRect.y + rect.height/2
        const dx = x - last.x, dy = last.y
        const ddx = dx - last.dx, ddy = dy - last.dy
        const area = rect.width * rect.height
        const forceX = area * ddx * mult, forceY = area * ddy * mult
        Matter.Body.applyForce(last.obj.body, { x, y }, { x: forceX, y: forceY })
        last.x = x, last.y = y, last.dx = dx, last.dy = dy
      }
      if (trackedElems.size)
        requestAnimationFrame(trackTransitions)
    }
    this.$el.ontransitionstart = evt => {
      const el = evt.target
      if (evt.propertyName !== 'transform' || !el || !(el instanceof Element)) return
      if (trackedElems.has(el)) return
      const obj = _getObjAtElem(el)
      if (!obj) return
      const rect = el.getBoundingClientRect(), pRect = el.parentNode.getBoundingClientRect()
      const wasEmpty = !trackedElems.size
      trackedElems.set(el, {
        x: rect.x - pRect.x + rect.width/2,
        y: rect.y - pRect.y + rect.height/2,
        dx: 0,
        dy: 0,
        obj,
      })
      if (wasEmpty)
        requestAnimationFrame(trackTransitions)
    }
    this.$el.ontransitionend = evt => {
      if (evt.propertyName !== 'transform' || !(evt.target instanceof Element)) return
      trackedElems.delete(evt.target)
    }

    // Also some mouse constraints.
    if (this.allowDragging) {
      const mouse = Matter.Mouse.create(this.$el)
      // What the fuck, Matter.js. Why prevent scrolling?
      //   https://github.com/liabru/matter-js/blob/master/src/core/Mouse.js
      this.$el.removeEventListener('mousewheel', mouse.mousewheel)
      this.$el.removeEventListener('DOMMouseScroll', mouse.mousewheel)
      const mouseConstraint = Matter.MouseConstraint.create(this.engine, {
        mouse,
        constraint:{
          damping: .9,
          stiffness: .05,
        },
      })
      Matter.Composite.add(this.engine.world, mouseConstraint)
    }

    // On resize, update the bounding boxes of all objects.
    this.resizeObs = new ResizeObserver(() => {
      _updateWorldBounds(this, this.bounded)
      this.worldViews.forEach(_updatePhysObject) // TODO: Why does this result in position mismatch?
    })
    this.resizeObs.observe(this.$el)
    if (this.collisionHandler)
      Matter.Events.off(this.engine, 'collisionStart', this.collisionHandler), this.collisionHandler = null
    if (this.oncollision)
      Matter.Events.on(this.engine, 'collisionStart', this.collisionHandler = evt => {
        for (let i = 0; i < evt.pairs.length; ++i) {
          const ac = evt.pairs[i].activeContacts
          for (let j = 0; j < ac.length; ++j)
            this.oncollision(this, ac[j].vertex.x, ac[j].vertex.y)
        }
      })
  },
  beforeDestroy() {
    this.resizeObs.unobserve(this.$el)
    Matter.Events.off(this.runner, 'afterUpdate', this.updateViews)
    Matter.Runner.stop(this.runner)
    Matter.Engine.clear(this.engine)
  },
  provide() { return { world: this } },
})



function _updateWorldBounds(obj, bounded) {
  // Creates 4 rects.
  const comp = Matter.Composite, world = obj.engine.world
  obj.edges.forEach(e => comp.remove(world, e))
  obj.edges.length = 0
  if (bounded) {
    const extra = 500
    const w = obj.$el.offsetWidth, h = obj.$el.offsetHeight
    const r = (x,y,w,h,opt) => Matter.Bodies.rectangle(x+w/2,y+h/2,w,h,opt)
    const opt = { isStatic: true }
    obj.edges.push(
      r(-extra, -extra, w + 2*extra, extra, opt),
      r(-extra, h, w + 2*extra, extra, opt),
      r(-extra, 0, extra, h, opt),
      r(w, 0, extra, h, opt),
    )
    obj.edges.forEach(e => comp.add(world, e))
  }
}



Vue.component('obj', {
  props:{
    _class:{ type: String, default: 'block' },
    static:{ type: Boolean, default: false, },
    density:{ type: Number, default: 1, },
    restitution:{ type: Number, default: .3, },
    friction:{ type: Number, default: .7, },
    frictionAir:{ type: Number, default: .0003, },
    frictionStatic:{ type: Number, default: .9, },
  },
  render(h) {
    if (this.body) {
      this.body.density = this.density
      this.body.friction = this.friction
      this.body.frictionAir = this.frictionAir
      this.body.frictionStatic = this.frictionStatic
      this.body.restitution = this.restitution
      this.body.isStatic = this.static
    }
    return h('span', { class:this._class }, this.$slots.default)
  },
  async mounted() {
    this.$el._vueObj = this
    await new Promise(requestAnimationFrame)
    this.body = Matter.Body.create({})
    this.initialPos = null
    const pos = _getStaticElemPos(this.$el, this.world.$el)
    const w = this.$el.offsetWidth, h = this.$el.offsetHeight
    pos.x += w/2, pos.y += h/2
    this.initialPos = pos
    Matter.Body.set(this.body, {
      angle: 0,
      position: Matter.Vector.create(pos.x, pos.y),
    })
    _updatePhysObject(this)
    Matter.Composite.add(this.world.engine.world, this.body)
    this.world.worldViews.push(this)
  },
  beforeDestroy() {
    const arr = this.world.worldViews
    if (arr.indexOf(this) >= 0) arr.splice(arr.indexOf(this), 1)
    Matter.Composite.remove(this.world.engine.world, this.body)
  },
  inject: ['world'],
})



function _updatePhysObject(obj) {
  const el = obj.$el, body = obj.body
  // Create the body, with rounded corners if present (only non-percentage, equal for each corner).
  const w = el.offsetWidth, h = el.offsetHeight
  const style = getComputedStyle(el)
  const vertices = []
  const angle = body.angle || 0
  function vertex(x, y) {
    const last = vertices[vertices.length-1]
    // Ah yes, translate vertices automatically, but don't rotate them. Quality physics engine.
    ;[x, y] = [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)]
    if (!last || Math.abs(x - last.x) > 1e-4 || Math.abs(y - last.y) > 1e-4)
      vertices.push({ x, y })
  }
  function corner(prop, cx, cy, i, vertices = 16) {
    let rad = parseFloat(style[prop], 10) || 0
    const x = cx*w/2, y = cy*h/2
    if (rad) {
      rad = Math.min(rad, w/2 - 1e-4)
      rad = Math.min(rad, h/2 - 1e-4)
      const centerX = x - cx * rad, centerY = y - cy * rad
      for (let j = 0; j < vertices; ++j) {
        const dx = Math.cos((i + j / (vertices-1)) * Math.PI / 2)
        const dy = Math.sin((i + j / (vertices-1)) * Math.PI / 2)
        vertex(centerX + dx*rad, centerY + dy*rad)
      }
    } else vertex(x, y)
  }
  corner('borderTopLeftRadius', -1, -1, 2) // -W,-H+R and -W+R,-H
  corner('borderTopRightRadius', 1, -1, 3) // W-R,-H and W,-H+R
  corner('borderBottomRightRadius', 1, 1, 4) // W,H-R and W-R,H
  corner('borderBottomLeftRadius', -1, 1, 5) // -W+R,H and -W,H-R
  Matter.Body.set(body, {
    // See https://brm.io/matter-js/docs/classes/Body.html
    density: obj.density,
    friction: obj.friction,
    frictionAir: obj.frictionAir,
    frictionStatic: obj.frictionStatic,
    restitution: obj.restitution,
    isStatic: obj.static,
  })
  Matter.Body.setVertices(body, vertices)
}



Vue.component('constraint', {
  props:{
    _class:{ type: String, default: '' },
    name:{ type: String, required: true },
    damping:{ type: Number, default: .05, },
    stiffness:{ type: Number, default: .5, },
  },
  render(h) {
    if (this.constraint)
      this.constraint.damping = this.damping, this.constraint.stiffness = stiffness
    return h('span', { class: this._class, style:{ width: '0px', height: '0px' } }, this.$slots.default)
  },
  async mounted() {
    if (this.constraint) return
    this.$el._vueConstraint = this
    const con = this.world.unboundConstraints
    if (con[this.name]) {
      const that = con[this.name];  delete con[this.name]
      this.other = that, that.other = this
      await new Promise(requestAnimationFrame)
      await new Promise(requestAnimationFrame)
      this.inBody = _getObjAtElem(this.$el)
      that.inBody = _getObjAtElem(that.$el)
      this.constraint = that.constraint = Matter.Constraint.create({
        bodyA: this.inBody ? this.inBody.body : undefined,
        bodyB: that.inBody ? that.inBody.body : undefined,
        pointA: this.inBody ? _getElemOffset(this.$el, this.inBody.$el) : _getStaticElemPos(this.$el, this.world.$el),
        pointB: that.inBody ? _getElemOffset(that.$el, that.inBody.$el) : _getStaticElemPos(that.$el, that.world.$el),
        damping: this.damping,
        stiffness: this.stiffness,
      })
      const el = document.createElement('div')
      el.className = 'dot'
      this.link = that.link = this.world.$refs.overlay.appendChild(el)
      this.world.links.set(this.link, this.constraint)
      Matter.Composite.add(this.world.engine.world, this.constraint)
    } else
      con[this.name] = this
  },
  beforeDestroy() {
    if (this.constraint) {
      Matter.Composite.remove(this.world.engine.world, this.constraint)
      if (this.other) {
        const that = this.other
        that.other = undefined, that.constraint = undefined
      }
      if (this.link)
        this.link.remove(),
        this.world.$refs.overlay.removeChild(this.link),
        this.link = that.link = undefined
    }
  },
  inject: ['world'],
})



function _getObjAtElem(el) {
  while (el && el._vueObj === undefined) el = el.parentNode
  return el && el._vueObj
}
function _getStaticElemPos(el, until = null) {
  let x = 0, y = 0, n = 0
  while (!until ? el !== until : (el && el !== until && until.contains(el))) {
    const style = getComputedStyle(el)
    x += el.offsetLeft - parseFloat(style.marginLeft)
    y += el.offsetTop - parseFloat(style.marginTop)
    el = el.offsetParent
    ++n
  }
  if (el !== until) x -= el.offsetLeft, y -= el.offsetTop
  return { x, y }
}
function _getElemOffset(from, to) {
  const r1 = from.getBoundingClientRect(), r2 = to.getBoundingClientRect()
  const x = r2.x - r1.x + (r2.width - r1.width) / 2
  const y = r2.y - r1.y + (r2.height - r1.height) / 2
  return { x, y }
}