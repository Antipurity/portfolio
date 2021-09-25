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
      const el = this.$refs.projectCards.$el
      if (this.$refs && this.$refs.projectCards)
        setTimeout(() => el.scrollIntoView(true), 10), setTimeout(() => el.scrollIntoView(true), 300)
    }
    return h(
      'div',
      [
        h(
          'world',
          { class:'projects-container wholeWidth', domProps:{ id:'projects' } },
          [
            this.$slots.default,
            h(
              'div',
              { key:'project-cards', ref:'projectCards', class:'projects' },
              ps.map(p => h('project-card', { props:{ project:p, expanded:false }, on:{viewproject:pChange} }))
            ),
          ]
        ),
        h(
          'transition-group',
          { ref:'projectCards', props:{ name:'slide' } },
          [
            this.viewedProject ? h(
              'project-description',
              {
                key: this.viewedProject.name,
                ref: 'projectDescription',
                on:{ viewproject:pChange },
                props:{ project: this.viewedProject },
              },
            ) : undefined,
          ],
        ),
      ]
    )
  },
})