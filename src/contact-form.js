// A form to contact us with.



Vue.component('contact-form', {
  props: ['value'], // If true, hide the form.
  render(h) {
    if (!this.value) setTimeout(() => this.$el && this.$el.scrollIntoView(true), 10)
    return h(
      'div',
      { class:this.value ? '' : 'oneScreen' },
      [
        h(
          'transition-group',
          { props:{name:'slide'},  style:{ width:'100%', maxWidth:'50rem', margin:'auto' } },
          this.value ? [] : [
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
                    class:'col btn btn-primary',
                    style:{ margin:'0 5px 0 5px' },
                    // TODO: On button click, only succeed if not empty and {subject,text}'s JSON length is <=20000, and on success, `fetch('https://alefedo-mailer.herokuapp.com', { method:'POST', mode:'cors', body:JSON.stringify({ subject, text }) }).then(console.log)`. Make `this.$refs.sender.value` a part of the text, if present.
                    //   TODO: Display progress when sending (along with an explanation of why it could be taking so long: someone else could be sending right now, so, wait), along with error and success messages.
                  },
                  'Send',
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
          ],
        )
      ],
    )
  },
})