// A component for all projects.
import './project-card.js'
import { projects } from './project-info.js'



Vue.component('projects', {
  render(h) {
    const ps = projects
    return h(
      'world',
      { props:{ _class:'projects' } },
      ps.map(p => h('project-card', { props:{ project:p, expanded:false } }))
    )
  },
})