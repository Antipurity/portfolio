/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./contact-form.js":
/*!*************************!*\
  !*** ./contact-form.js ***!
  \*************************/
/***/ (() => {

// A form to contact us with.



Vue.component('contact-form', {
  props: ['value'], // If true, hide the form.
  data() {
    return {
      state: 'idle', // idle, waiting, error, ok
      message: '',
    }
  },
  render(h) {
    if (!this.value) setTimeout(() => this.$el && this.$el.scrollIntoView(true), 10)
    clearTimeout(this.id)
    if (this.state === 'error' || this.state === 'ok')
      this.id = setTimeout(() => { this.state = 'idle', this.message = '' }, 5000)
    return h(
      'div',
      { class:this.value ? '' : 'oneScreen' },
      [
        h(
          'transition-group',
          { props:{name:'slide'},  style:{ width:'100%', maxWidth:'50rem', margin:'auto' } },
          this.value ? [] : [
            h(
              'h2',
              { key:'andjahkdfhasfhk' },
              'Contact me',
            ),
            h(
              'div',
              { key:'a', class:'row mb-3', style:{ margin:'0 -5px 0 -5px' } },
              [
                h(
                  'input',
                  {
                    ref:'from',
                    class:'col form-control',
                    style:{ margin:'0 5px 0 5px' },
                    domProps:{ placeholder:'From: jsmith@example.com', type:'email' },
                  },
                ),
                h(
                  'input',
                  {
                    ref:'subject',
                    class:'col form-control',
                    style:{ margin:'0 5px 0 5px' },
                    domProps:{ placeholder:'Subject', type:'text' },
                  },
                ),
              ],
            ),
            h(
              'textarea',
              {
                key:'b',
                ref:'body',
                class:'form-control mb-3 w-100',
                domProps:{ placeholder:'Text', rows:10 },
              },
            ),
            h(
              'div',
              { key:'c', class:'row', style:{ margin:'0 -5px 0 -5px' } },
              [
                h(
                  'button',
                  {
                    class:['col btn btn-primary', this.state === 'waiting' && 'disabled'],
                    style:{ margin:'0 5px 0 5px' },
                    on:{ click: () => {
                      if (this.state === 'waiting') return
                      const r = this.$refs
                      const obj = {
                        subject: r.subject.value || 'Contacting',
                        text: r.from.value ? 'From: ' + r.from.value + '\n\n' + r.body.value : r.body.value,
                      }
                      if (!obj.text.length)
                        return this.state = 'error', this.message = 'Cannot send an empty message'
                      const msg = JSON.stringify(obj)
                      if (msg.length > 20000)
                        return this.state = 'error', this.message = 'The message is too long; remove ' + (msg.length - 20000) + ' characters'
                      this.state = 'waiting', this.message = 'Taking a while. The queue is probably full; wait a minute.'
                      fetch('https://alefedo-mailer.herokuapp.com', { method:'POST', mode:'cors', body:msg })
                      .then(() => { this.state = 'ok', this.message = 'Sent' })
                      .catch(() => { this.state = 'error', this.message = 'Failed to contact' })
                    } },
                  },
                  [
                    this.state === 'waiting' && h(
                      'div',
                      { key:'tiwitibbot', class:'spinner-border spinner-border-sm text-light' },
                    ),
                    ' Send',
                  ],
                ),
                h(
                  'button',
                  {
                    class:'col btn btn-secondary',
                    style:{ margin:'0 5px 0 5px' },
                    on:{ click: () => { this.$emit('input', !this.hidden) } },
                  },
                  'Don\'t send',
                ),
              ],
            ),
            h(
              'div',
              {
                key: this.message || ' ',
                class: [
                  this.state === 'waiting' ? 'text-secondary' : this.state === 'error' ? 'text-danger' : this.state === 'ok' ? 'text-success' : '',
                  this.state === 'waiting' ? 'explanation-for-waiting' : '',
                ],
              },
              this.message || ' ',
            ),
          ],
        )
      ],
    )
  },
})

/***/ }),

/***/ "./physics.js":
/*!********************!*\
  !*** ./physics.js ***!
  \********************/
/***/ (() => {



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
    this.engine.positionIterations = 8
    this.engine.constraintIterations = 8
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
      this.worldViews.forEach(_updatePhysObject) // TODO: Why does this result in position mismatch? (Eh, unfixed bug, who cares.)
    })
    this.resizeObs.observe(this.$el)
    if (this.collisionHandler)
      Matter.Events.off(this.engine, 'collisionActive', this.collisionHandler), this.collisionHandler = null
    if (this.oncollision)
      Matter.Events.on(this.engine, 'collisionActive', this.collisionHandler = evt => {
        for (let i = 0; i < evt.pairs.length; ++i) {
          // All this internal structure in Matter.js must be bad for performance, via GC pauses.
          // Here, we call `this.oncollision` with 1 point, somewhere in the collided area.
          const c = evt.pairs[i].collision, ac = evt.pairs[i].activeContacts
          let ws = [], wSum = 0
          for (let j = 0; j < ac.length; ++j)
            wSum += ws[j] = Math.random()
          let x = 0, y = 0
          for (let j = 0; j < ac.length; ++j)
            x += ac[j].vertex.x * (ws[j] / wSum),
            y += ac[j].vertex.y * (ws[j] / wSum)
          this.oncollision(this, x, y, c.depth)
        }
      })
  },
  beforeDestroy() {
    if (this.collisionHandler)
      Matter.Events.off(this.engine, 'collisionActive', this.collisionHandler), this.collisionHandler = null
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
    return h('span', { class:this._class, on:this.$options._parentListeners }, this.$slots.default)
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

/***/ }),

/***/ "./project-card.js":
/*!*************************!*\
  !*** ./project-card.js ***!
  \*************************/
/***/ (() => {

// A card for quick project summarization.
//   See `./project-info.js` for where the data comes from.
//   See `./project-description.js` for a component that describes projects in full.
Vue.component('project-card', {
  props:{
    project: Object,
  },
  render(h) {
    const p = this.project
    return h(
      'obj',
      { props:{ _class:'project-card' } },
      [
        h(
          'h2',
          { class:'name' },
          p.name,
        ),
        p.images[0] ? h(
          'img',
          { attrs: { src:`assets/img/${p.images[0]}` } },
        ) : '',
        h(
          'p',
          { class:'description' },
          p.description.split('\n')[0]
        ),
        h(
          'button',
          {
            on:{ click: () => this.$emit('viewproject', this.project) },
            class:'btn btn-primary btn-lg fw-bold',
          },
          'Learn more →',
        ),
      ],
    )
  },
})

/***/ }),

/***/ "./project-description.js":
/*!********************************!*\
  !*** ./project-description.js ***!
  \********************************/
/***/ (() => {

// A full description of a project.
Vue.component('project-description', {
  props:{
    project:{ type:Object, default:null },
  },
  render(h) {
    const p = this.project
    if (!p) return
    return h(
      'div',
      { class:'project-description' },
      [
        h( // Name.
          'h2',
          { class:'name' },
          p.name,
        ),
        p.urls[0] && h( // The first link, to spare a click.
          'iframe',
          { attrs:{ src:p.urls[0] }, ref:'iframe' },
        ),
        h( // Links.
          'div',
          p.urls.filter(u => u).map(u => h('div', [
            h('a', { class:'link-info', attrs:{ href:u } }, u)
          ])),
        ),
        h( // Images.
          'div',
          { class:'images' },
          p.images.map(im => h(
            'img',
            { attrs: { tabindex:0, src:`assets/img/${im}` } },
          )),
        ),
        typeof marked == 'function' ? h( // Description.
          'p',
          {
            domProps:{ innerHTML: marked.parseInline(p.description) },
            class:'description',
          },
        ) : h(
          'p',
          { class:'description' },
          p.description,
        ),
        h( // Hide.
          'button',
          {
            on:{ click: () => this.$emit('viewproject', null) },
            class:'btn btn-primary btn-lg fw-bold',
          },
          'Learn less ←',
        ),
      ]
    )
  },
})

/***/ }),

/***/ "./project-info.js":
/*!*************************!*\
  !*** ./project-info.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "projects": () => (/* binding */ projects)
/* harmony export */ });
let projects = JSON.parse(`[
  {
    "name":"Image Modifier Project",
    "urls":[
      "https://image-modifier-project.herokuapp.com/",
      "https://github.com/Antipurity/image-modifier-project"
    ],
    "images":[
      "pristine-white-canvas.png"
    ],
    "description":"A platform for collaborative editing of a single image, pixel by pixel.\\n\\nUtilizes Julia, PostgreSQL, Docker, and JavaScript to deliver an intuitive and cohesive experience. Of editing one image.\\n\\n(The version deployed on Heroku often fails to start, because Julia is not a good choice for web servers, and [takes up too much RAM](https://discourse.julialang.org/t/large-idle-memory-usage/20368/5).)"
  },
  {
    "name":"2048",
    "urls":[
      "2048.html"
    ],
    "images":[
      "2048.png"
    ],
    "description":"A well-known game, recreated once more.\\n\\nUse arrow keys or arrow buttons to move all blocks, whereupon same-value blocks will combine into one. Last as long as you can; maximize the number that is plotted on the bottom-right.\\n\\nIt uses JavaScript and React. The latter is why its animations are somewhat broken."
  },
  {
    "name":"WebEnv",
    "urls":[
      null,
      "https://github.com/antipurity/webenv"
    ],
    "images":[
      "noexplore-anim.gif",
      "orange-explore-blue-not.png",
      "agent-1.png",
      "agent-2.png",
      "agent-3.png",
      "agent-4.png"
    ],
    "description":"Online training environment for machine learning agents, combining scalability and scope.\\n\\nBold and innovative: intended for training agents on the whole Web directly, without contemporary intermediaries such as [\\"text\\"](https://arxiv.org/abs/2101.00027) or [\\"text-image pairs\\"](https://github.com/openai/CLIP).\\n\\nWritten in JavaScript using Node.js (with an optional bridge to Python), this launches a browser (via Puppeteer), and collects observations and dispatches actions, so that the only thing that users have to worry about is how to go from observations to actions."
  },
  {
    "name":"Conceptual",
    "urls":[
      "https://antipurity.github.io/conceptual",
      "https://github.com/antipurity/conceptual"
    ],
    "images":[
      "conc2.png",
      "conc1.png",
      "conc3.png",
      "conc4.png",
      "conc5.png",
      "conc6.png",
      "conc7.png",
      "conc8.png",
      "conc9.png",
      "conc10.png",
      "conc11.png",
      "conc12.png",
      "conc13.png",
      "conc14.png",
      "conc15.png",
      "conc16.png"
    ],
    "description":"Programming language, runtime environment, ML research platform, etc.\\n\\nContains too many advanced JavaScript manipulations to describe."
  }
]`)

/***/ }),

/***/ "./projects.js":
/*!*********************!*\
  !*** ./projects.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _project_card_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./project-card.js */ "./project-card.js");
/* harmony import */ var _project_card_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_project_card_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _project_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./project-description.js */ "./project-description.js");
/* harmony import */ var _project_description_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_project_description_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _project_info_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./project-info.js */ "./project-info.js");
// A component for all projects.






Vue.component('projects', {
  props:{
    project:{ type:Object, default:null },
  },
  data() {
    return { viewedProject: this.project }
  },
  render(h) {
    const ps = _project_info_js__WEBPACK_IMPORTED_MODULE_2__.projects
    const pChange = project => {
      this.viewedProject = project
      const el = this.$refs.projectCards.$el
      if (this.$refs && this.$refs.projectCards)
        setTimeout(() => el.scrollIntoView(true), 10), setTimeout(() => el.scrollIntoView(true), 300)
    }
    return h(
      'div',
      [
        h(
          'world',
          { class:'projects-container wholeWidth', domProps:{ id:'projects' } },
          [
            this.$slots.default,
            h(
              'div',
              { key:'project-cards', ref:'projectCards', class:'projects' },
              ps.map(p => h('project-card', { props:{ project:p, expanded:false }, on:{viewproject:pChange} }))
            ),
          ]
        ),
        h(
          'transition-group',
          { ref:'projectCards', props:{ name:'slide' } },
          [
            this.viewedProject ? h(
              'project-description',
              {
                key: this.viewedProject.name,
                ref: 'projectDescription',
                on:{ viewproject:pChange },
                props:{ project: this.viewedProject },
              },
            ) : undefined,
          ],
        ),
      ]
    )
  },
})

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./index.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _physics_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./physics.js */ "./physics.js");
/* harmony import */ var _physics_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_physics_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _projects_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projects.js */ "./projects.js");
/* harmony import */ var _contact_form_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./contact-form.js */ "./contact-form.js");
/* harmony import */ var _contact_form_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_contact_form_js__WEBPACK_IMPORTED_MODULE_2__);






Vue.component('block', {
  render(h) { return h('span', { class:'block' }, [this.$slots.default || ' ']) },
})
Vue.component('animated-text', {
  props:['value'],
  render(h) {
    const occured = {}
    return h('transition-group',
      { props: {name:'fade'}, },
      (''+this.value).split('').map(
        (ch, i) => h('block', { key:ch + (occured[ch] = (occured[ch] || 0) + 1) }, ch)))
  },
})
window.app = new Vue({
  el: '#app',
  provide:{
    oncollision: sparksOnCollision,
  },
  data:{
    contactHidden: true,
    description:[
      'A ',
      'software engineer',
      ' that ',
      'builds stuff',
      '.',
    ],
  },
})



// Intermittently, update the description randomly.
function pick(a) { return a[Math.random() * a.length | 0] }
setTimeout(function f() {
  app.description[1] = pick([
    'software engineer',
    'developer',
    'person',
    'full stack developer',
  ]), app.description = [...app.description]
  setTimeout(f, Math.random() * 20000)
}, Math.random() * 20000)
setTimeout(function f() {
  app.description[2] = pick([
    ' that ',
    ' who ',
    ' which ',
  ]), app.description = [...app.description]
  setTimeout(f, Math.random() * 40000)
}, Math.random() * 40000)
setTimeout(function f() {
  app.description[3] = pick([
    'builds stuff',
    'delivers code',
    'creates experiences',
    'finds creative solutions',
  ]), app.description = [...app.description]
  setTimeout(f, Math.random() * 20000)
}, Math.random() * 20000)



// Keep track of `--x` and `--y` CSS variables.
function setMousePosition(evt, remove = false) {
  const elem = evt.target
  if (elem && !(elem instanceof Element)) elem = elem.parentNode
  if (!elem || !(elem instanceof Element)) return
  if (elem.tagName !== 'BUTTON') return // Only using it for this anyway.
  if (!remove) {
    const x = evt.offsetX, y = evt.offsetY
    if (x || y) elem.style.setProperty('--x', x+'px')
    if (x || y) elem.style.setProperty('--y', y+'px')
  } else {
    elem.style.removeProperty('--x')
    elem.style.removeProperty('--y')
  }
}
addEventListener('mouseover', setMousePosition, {passive:true})
addEventListener('mousemove', setMousePosition, {passive:true})
addEventListener('mouseout', evt => {
  setMousePosition(evt, true)
}, {passive:true})



// On collision, make sparks.
function sparksOnCollision(world, x, y, depth) {
  const n = Math.min(3, Math.abs(depth) * Math.random()) | 0
  for (let spark = 0; spark < n; ++spark) {
    const el = document.createElement('div')
    el.className = 'spark'
    el.style.left = x+'px', el.style.top = y+'px'
    const s = (.5+Math.random()*4) * Math.random() * Math.random()
    el.style.transform = `translate(0,0) rotate(0deg) translate(0,0) rotate(0deg) translate(0,0) scale(${s})`
    el.style.opacity = 1
    world.$el.append(el)
    setTimeout(() => {
      el.style.transform = `translate(${f()}px,${f()}px) rotate(${r(721)-360}deg) translate(${f()}px,${f()}px) rotate(${r(721)-360}deg) translate(${f()}px,${f()}px) scale(${s})`
      el.style.opacity = 0
    }, 0)
    setTimeout(() => el.remove(), 1000)
  }
  function f() {
    const s = (.5+Math.random()*(32/n)) * Math.random() * Math.random()
    return (r(501)-250) / Math.sqrt(s)
  }
  function r(n) { return Math.random()*n | 0 }
}
})();

/******/ })()
;
//# sourceMappingURL=main.bundle.js.map