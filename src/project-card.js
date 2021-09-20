// A card for many projects.
//   See `./project-info.js` for where the data comes from.
Vue.component('project-card', {
  props:{
    project: Object,
    expanded: Boolean,
  },
  render(h) {
    const p = this.project
    // TODO: (Style: put the image as the card's background, have a big bold title, a one-line description, and the button.)
    return h(
      'div',
      { class:'project-card' },
      [
        h(
          'h1',
          p.name,
        ),
        p.images[0] ? h(
          'img',
          { attrs: { src:`assets/img/${p.images[0]}` } },
        ) : '',
        h(
          'p',
          p.description.slice(0, p.description.indexOf('\n'))
        ),
        h(
          'button',
          { class:'btn btn-primary btn-lg fw-bold' },
          'Learn more →',
          // TODO: (We probably want to expand the card into a full description, inline, smoothly... Yeah, that sounds appealing visually.)
          //   (p.description should be parsed as Markdown.)
          //   (p.urls[0] should be in an <iframe> and a link; the rest in links.)
        ),
      ],
    )
  },
})