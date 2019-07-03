import { Component } from 'nautil'
import I18n from 'nautil/i18n'
import { Section, Text, Button } from 'nautil/components'

export class Page1 extends Component {
  static injectProps = {
    $i18n: true,
  }

  static validateProps = {
    $i18n: I18n,
  }

  render() {
    const { t, changeLanguage } = this.$i18n
    return (
      <Section>
        <Text>{t('ILoveTheWorld')}</Text>
        <Button onHintEnd={() => changeLanguage('zh-HK')}>change language</Button>
      </Section>
    )
  }
}