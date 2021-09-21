// A full description of a project.
Vue.component('project-description', {
  props:{
    project:{ type:Object, default:null },
  },
  render(h) {
    const p = this.project
    if (!p) return
    return h(
      'div',
      { class:'project-description' },
      [
        h( // Name.
          'h2',
          { class:'name' },
          p.name,
        ),
        h( // The first link, to spare a click.
          'iframe',
          { attrs:{ src:p.urls[0] } },
        ),
        h( // Links.
          'div',
          p.urls.map(u => h('div', [
            h('a', { class:'link-info', attrs:{ href:u } }, u)
          ])),
        ),
        typeof marked == 'function' ? h( // Description.
          'p',
          {
            domProps:{ innerHTML: marked.parseInline(p.description) },
            class:'description',
          },
        ) : h(
          'p',
          { class:'description' },
          p.description,
        ),
        h( // Images.
          'div',
          p.images.map(im => h(
            'img',
            { attrs: { src:`assets/img/${im}` } },
            // TODO: Make a carousel of images, not a list.
            //   ...Wait, if a carousel is just a sequence of images with a thingy to select the currently-centered one, then can't we make our own, small, component?
            //   ...Bootstrap has a carousel.
          )),
        ),
        h( // Hide.
          'button',
          {
            on:{ click: () => this.$emit('viewproject', null) },
            class:'btn btn-primary btn-lg fw-bold',
          },
          'Learn less ←',
        ),
      ]
    )
  },
})