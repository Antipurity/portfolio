import './physics.js'
import './canvas.js'

import { projects } from './project-info.js'
console.log(projects) // TODO


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