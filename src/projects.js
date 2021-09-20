// A component for all projects.
import './project-card.js'
import { projects } from './project-info.js'



Vue.component('projects', {
  render(h) {
    const ps = projects
    // TODO: Style: put them all in a flexbox, like an album.
    return h(
      'div',
      { class:'projects' },
      ps.map(p => h('project-card', { props:{ project:p, expanded:false } }))
    )
  },
})