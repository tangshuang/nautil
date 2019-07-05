import { Component } from 'nautil'
import { Section, Text, Button } from 'nautil/components'

export class Page1 extends Component {
  static injectProviders = {
    $i18n: true,
  }

  render() {
    const i18n = this.$i18n
    const t = i18n.t.bind(i18n)
    const changeLanguage = i18n.changeLanguage.bind(i18n)

    return (
      <Section>
        <Text>{t('ILoveTheWorld')}</Text>
        <Button onHint={() => changeLanguage('zh-HK')}>change language</Button>
      </Section>
    )
  }
}
