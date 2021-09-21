// A card for quick project summarization.
//   See `./project-info.js` for where the data comes from.
//   See `./project-description.js` for a component that describes projects in full.
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
          // TODO: Make `projects.js` have a <project-description> at the front, modified on-demand.
          //   (Also, make it transition its height properly on change.)
          // TODO: Make this button, on click, open the project in <projects>'s thing.
        ),
      ],
    )
  },
})