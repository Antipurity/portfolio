// A component for all projects.
import './project-card.js'
import './project-description.js'
import { projects } from './project-info.js'



Vue.component('projects', {
  props:{
    project:{ type:Object, default:null },
  },
  data() {
    return { viewedProject: this.project }
  },
  render(h) {
    const ps = projects
    const pChange = project => {
      this.viewedProject = project
      this.$el.scrollIntoView(true)
    }
    return h(
      'p',
      { domProps:{ id:'projects' } },
      [
        h(
          'project-description',
          {
            on:{ viewproject:pChange },
            props:{ project: this.viewedProject },
          },
          // TODO: Make this transition properly/fancily.
        ),
        h(
          'world',
          { props:{ _class:'projects' } },
          ps.map(p => h('project-card', { props:{ project:p, expanded:false }, on:{viewproject:pChange} }))
        ),
      ]
    )
  },
})