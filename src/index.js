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
    message: 'Hello Vue!',
    count: 0,
    text: '',
    items: [1,2,3,4],
  },
  methods:{
    shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        var tmp = a[i]
        Vue.set(a, i, a[j])
        Vue.set(a, j, tmp)
      }
    },
  },
})