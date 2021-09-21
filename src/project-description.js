// A full description of a project.
Vue.component('project-description', {
  props:{
    project:{ type:Object, default:null },
  },
  render(h) {
    const p = this.project
    if (!p) return
    // TODO: Use this in <projects>.
    //   How to plumb the "change the viewed project" business?
    // TODO: Style this. (How?)
    return h(
      'div',
      { class:'project-description' },
      h(
        'h2',
        { class:'name' },
        p.name,
      ),
      typeof marked == 'function' ? h(
        'p',
        {
          domProps:{ innerHTML: marked.parseInline(p.description) },
          class:'description',
        },
      )
      : h(
        'p',
        { class:'description' },
        p.description,
      ),
      h(
        'ul',
        p.urls.map(u => h('a', { attrs:{ href:u } })),
        // TODO: Also use the first URL in an <iframe>.
      ),
      h(
        'div',
        p.images.map(im => h(
          'img',
          { attrs: { src:`assets/img/${im}` } },
          // TODO: Make a carousel of images instead.
        )),
      ),
      h(
        'button',
        { class:'btn btn-primary btn-lg fw-bold' },
        'Learn less ←',
        // TODO: Make this, when pressed, set our .project to null.
      ),
    )
  },
})