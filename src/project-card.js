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
          { class:'btn btn-primary btn-lg fw-bold' },
          'Learn more →',
          // TODO: Make this button, on click, open the project in <projects>'s thing.
          // TODO: Have `project-info.js`.
          //   p.name, …p.urls, …p.images, p.description.
          //   (p.description should be parsed as Markdown.)
          //   (p.urls[0] should be in an <iframe> and a link; the rest in links.)
        ),
      ],
    )
  },
})