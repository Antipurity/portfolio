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
        p.urls[0] && h( // The first link, to spare a click.
          'iframe',
          { attrs:{ src:p.urls[0] }, ref:'iframe' },
        ),
        h( // Links.
          'div',
          p.urls.filter(u => u).map(u => h('div', [
            h('a', { class:'link-info', attrs:{ href:u } }, u)
          ])),
        ),
        h( // Images.
          'div',
          { class:'images' },
          p.images.map(im => h(
            'img',
            { attrs: { tabindex:0, src:`assets/img/${im}` } },
          )),
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