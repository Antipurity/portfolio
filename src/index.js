import './physics.js'
import './canvas.js'


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
    title: 'software engineer',
    business: 'builds stuff',
  },
})



// Intermittently, update the description randomly.
function pick(a) { return a[Math.random() * a.length | 0] }
setTimeout(function f() {
  // TODO: More descriptive & concrete things.
  app.title = pick([
    'software engineer',
    'developer',
    'person',
  ])
  setTimeout(f, Math.random() * 20000)
}, Math.random() * 20000)
setTimeout(function f() {
  // TODO: More descriptive & concrete things.
  app.business = pick([
    'builds stuff',
    'delivers code',
    'creates experiences',
  ])
  setTimeout(f, Math.random() * 20000)
}, Math.random() * 20000)