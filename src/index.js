import './physics.js'
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