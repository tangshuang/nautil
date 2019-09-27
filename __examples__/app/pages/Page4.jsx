/**
 * form
 */

import { Component, Model } from 'nautil'
import { Section, Input, Button, Navigate } from 'nautil/components'
import { T } from 'nautil/i18n'
import { initialize, pipe, inject, observe } from 'nautil/operators'

import depo from '../depo.js'
import navigation from '../navigation.js'

class FormModel extends Model {
  schema() {
    return {
      name: {
        type: String,
        default: '',
      },
      age: {
        type: Number,
        default: 0,
        validators: [
          {
            validate: v => v <= 12,
            message: 'age should not bigger than 12!',
          },
        ],
        setter: v => +v,
        getter: v => v ? v + '' : ''
      },
    }
  }
}

export class Page4 extends Component {
  onInit() {
    this.submit = this.submit.bind(this)
    this.filldata = this.filldata.bind(this)
  }

  onMounted() {
    this.attrs.navigation.on('*', this.filldata)
    this.filldata()
  }

  onUnmount() {
    this.attrs.navigation.off('*', this.filldata)
  }

  async submit() {
    const { form, depo } = this.attrs
    const error = form.validate()
    if (error) {
      alert('fix errors first!')
      return
    }

    const data = form.plaindata()
    await depo.save('update_person', data)
  }

  async filldata() {
    const { navigation, depo, form } = this.attrs
    const { id } = navigation.state.params
    if (id) {
      const data = await depo.request('person', { id })
      form.restore(data)
    }
  }

  render() {
    const { form } = this.attrs
    return (
      <Section>
        <Section>
          <Navigate to="home">
            <Button><T>home</T></Button>
          </Navigate>
          <Navigate to="page4" params={{ id: 1 }}>
            <Button>Fill Data</Button>
          </Navigate>
        </Section>
        <Section>
          <Section><Input placeholder="Name" $value={[form.get('name'), name => form.set('name', name)]} /></Section>
          <Section>{form.message('name')}</Section>
        </Section>
        <Section>
          <Section><Input type="number" placeholder="Age" $value={[form.get('age'), age => form.set('age', age)]} /></Section>
          <Section>{form.message('age')}</Section>
        </Section>
        <Section>
          <Button onHint={this.submit}>Submit</Button>
        </Section>
      </Section>
    )
  }
}

export default pipe([
  initialize('form', FormModel),
  observe('form'),
  inject('navigation', () => navigation),
  inject('depo', depo),
])(Page4)
