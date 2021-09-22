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
          'transition-group',
          { props:{ name:'fade' } }, // It looks cursed.
          [
            this.viewedProject ? h(
              'project-description',
              {
                key: this.viewedProject.name,
                on:{ viewproject:pChange },
                props:{ project: this.viewedProject },
              },
            ) : undefined,
            h(
              'world',
              { key:'project-cards', props:{ _class:'projects' } },
              ps.map(p => h('project-card', { props:{ project:p, expanded:false }, on:{viewproject:pChange} }))
            ),
          ],
        ),
      ]
    )
  },
})