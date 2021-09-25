// A form to contact us with.



Vue.component('contact-form', {
  props: ['value'], // If true, hide the form.
  data() {
    return {
      state: 'idle', // idle, waiting, error, ok
      message: '',
    }
  },
  render(h) {
    if (!this.value) setTimeout(() => this.$el && this.$el.scrollIntoView(true), 10)
    clearTimeout(this.id)
    if (this.state === 'error' || this.state === 'ok')
      this.id = setTimeout(() => { this.state = 'idle', this.message = '' }, 5000)
    return h(
      'div',
      { class:this.value ? '' : 'oneScreen' },
      [
        h(
          'transition-group',
          { props:{name:'slide'},  style:{ width:'100%', maxWidth:'50rem', margin:'auto' } },
          this.value ? [] : [
            h(
              'h2',
              { key:'andjahkdfhasfhk' },
              'Contact me',
            ),
            h(
              'div',
              { key:'a', class:'row mb-3', style:{ margin:'0 -5px 0 -5px' } },
              [
                h(
                  'input',
                  {
                    ref:'from',
                    class:'col form-control',
                    style:{ margin:'0 5px 0 5px' },
                    domProps:{ placeholder:'From: jsmith@example.com', type:'email' },
                  },
                ),
                h(
                  'input',
                  {
                    ref:'subject',
                    class:'col form-control',
                    style:{ margin:'0 5px 0 5px' },
                    domProps:{ placeholder:'Subject', type:'text' },
                  },
                ),
              ],
            ),
            h(
              'textarea',
              {
                key:'b',
                ref:'body',
                class:'form-control mb-3 w-100',
                domProps:{ placeholder:'Text', rows:10 },
              },
            ),
            h(
              'div',
              { key:'c', class:'row', style:{ margin:'0 -5px 0 -5px' } },
              [
                h(
                  'button',
                  {
                    class:['col btn btn-primary', this.state === 'waiting' && 'disabled'],
                    style:{ margin:'0 5px 0 5px' },
                    on:{ click: () => {
                      if (this.state === 'waiting') return
                      const r = this.$refs
                      const obj = {
                        subject: r.subject.value || 'Contacting',
                        text: r.from.value ? 'From: ' + r.from.value + '\n\n' + r.body.value : r.body.value,
                      }
                      if (!obj.text.length)
                        return this.state = 'error', this.message = 'Cannot send an empty message'
                      const msg = JSON.stringify(obj)
                      if (msg.length > 20000)
                        return this.state = 'error', this.message = 'The message is too long; remove ' + (msg.length - 20000) + ' characters'
                      this.state = 'waiting', this.message = 'Taking a while. The queue is probably full; wait a minute.'
                      fetch('https://alefedo-mailer.herokuapp.com', { method:'POST', mode:'cors', body:msg })
                      .then(() => { this.state = 'ok', this.message = 'Sent' })
                      .catch(() => { this.state = 'error', this.message = 'Failed to contact' })
                    } },
                  },
                  [
                    this.state === 'waiting' && h(
                      'div',
                      { key:'tiwitibbot', class:'spinner-border spinner-border-sm text-light' },
                    ),
                    ' Send',
                  ],
                ),
                h(
                  'button',
                  {
                    class:'col btn btn-secondary',
                    style:{ margin:'0 5px 0 5px' },
                    on:{ click: () => { this.$emit('input', !this.hidden) } },
                  },
                  'Don\'t send',
                ),
              ],
            ),
            h(
              'div',
              {
                key: this.message || ' ',
                class: [
                  this.state === 'waiting' ? 'text-secondary' : this.state === 'error' ? 'text-danger' : this.state === 'ok' ? 'text-success' : '',
                  this.state === 'waiting' ? 'explanation-for-waiting' : '',
                ],
              },
              this.message || ' ',
            ),
          ],
        )
      ],
    )
  },
})