// A card for many projects.
//   See `./project-info.js` for where the data comes from.
Vue.component('project-card', {
  props:{
    project: Object,
    expanded: Boolean,
  },
  render(h) {
    const p = this.project
    return h(
      'div',
    )
    // TODO: What do we put here? (p.name, p.images[0], p.description.slice(0, p.description.indexOf('\n'))… And "Learn more→"…)
    //   (Put the image as the card's background, have a big bold title, a one-line description, and the button.)
    // (We probably want to expand the card into a full description, inline, smoothly... Yeah, that sounds appealing.)
    //   (p.description should be parsed as Markdown.)
    //   (p.urls[0] should be in an <iframe> and a link; the rest in links.)
  },
})