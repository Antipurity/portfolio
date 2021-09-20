import './physics.js'
import './canvas.js'
import './projects.js'



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
  // TODO: More descriptive & concrete things.
  app.description[1] = pick([
    'software engineer',
    'developer',
    'person',
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
  // TODO: More descriptive & concrete things.
  app.description[3] = pick([
    'builds stuff',
    'delivers code',
    'creates experiences',
  ]), app.description = [...app.description]
  setTimeout(f, Math.random() * 20000)
}, Math.random() * 20000)



// Keep track of `--x` and `--y` CSS variables.
function setMousePosition(evt, remove = false) {
  const elem = evt.target
  if (elem && !(elem instanceof Element)) elem = elem.parentNode
  if (!elem || !(elem instanceof Element)) return
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
function sparksOnCollision(world, x, y) {
  const el = document.createElement('div')
  el.textContent = 'CLANG' // TODO
  el.style.position = 'absolute', el.style.left = x+'px', el.style.top = y+'px'
  world.$el.append(el)
  setTimeout(() => el.remove(), 1000)
  // TODO: Try creating a temporary element at the computed coordinates. ...Or just inside `world.$el`, at `x`/`y`, since the world is position:relative anyway?
  //   Works perfectly.
  // TODO: Style the spark.
}