/**
 * form
 */

import { Component, Model, Navigate } from 'nautil'
import { Section, Input, Button } from 'nautil/components'
import { inject } from 'nautil/operators'

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
    this.form = new FormModel()
  }

  onMounted() {
    this.form.watch('*', this.update)
    navigation.on('*', this.filldata)
    this.filldata()
  }

  onUnmount() {
    this.form.unwatch('*', this.update)
    navigation.off('*', this.filldata)
  }

  async submit() {
    const error = this.form.validate()
    if (error) {
      alert('fix errors first!')
      return
    }

    const data = this.form.plaindata()
    await depo.save('update_person', data)
  }

  async filldata() {
    const { id } = navigation.state.params
    if (id) {
      const data = await depo.request('person', { id })
      this.form.restore(data)
    }
  }

  render() {
    const Link = inject('navigation', navigation)(Navigate)
    return (
      <Section>
        <Section>
          <Link to="home">
            <Button>Home</Button>
          </Link>
          <Link to="page4" params={{ id: 1 }}>
            <Button>Fill Data</Button>
          </Link>
        </Section>
        <Section>
          <Section><Input placeholder="Name" value={this.form.get('name')} onChange={e => this.form.set('name', e.target.value)} /></Section>
          <Section>{this.form.message('name')}</Section>
        </Section>
        <Section>
          <Section><Input type="number" placeholder="Age" value={this.form.get('age')} onChange={e => this.form.set('age', e.target.value)} /></Section>
          <Section>{this.form.message('age')}</Section>
        </Section>
        <Section>
          <Button onHint={this.submit}>Submit</Button>
        </Section>
      </Section>
    )
  }
}

export default Page4
