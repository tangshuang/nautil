/**
 * form
 */

import { Component, Navigate, Model, connect } from 'nautil'
import { Section, Input, Button } from 'nautil/components'

import { depoContext, depo } from '../depo.js'

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
    this.form = new FormModel()
    this.form.watch('*', this.update)
    this.form.watch('*', () => console.log('changed'))

    // edit, request data from backend api
    const { navigation } = this.attrs
    const filldata = async () => {
      const { id } = navigation.state.params
      if (id) {
        const data = await depo.request('person', { id })
        this.form.restore(data)
      }
    }
    navigation.on('*', filldata)
    filldata()
  }

  submit = this.submit.bind(this)
  async submit() {
    const error = this.form.validate()
    if (error) {
      alert('fix errors first!')
      return
    }

    const data = this.form.plaindata()
    console.log(data)
    await depo.save('update_person', data)
  }

  render() {
    return (
      <Section>
        <Section>
          <Navigate to="home">
            <Button>Home</Button>
          </Navigate>
          <Navigate to="page4" params={{ id: 1 }}>
            <Button>Fill Data</Button>
          </Navigate>
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

const ConnectedPage4 = connect({
  depo: depoContext,
  navigation: Navigate.Context,
})(Page4)

export default ConnectedPage4
