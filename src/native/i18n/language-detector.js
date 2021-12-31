import { LanguageDetector } from '../../lib/i18n/language-detector.js'
import { NativeModules, Platform } from 'react-native';

LanguageDetector.getLang = () => {
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
      : NativeModules.I18nManager.localeIdentifier
  return deviceLanguage
}

export { LanguageDetector }
export default LanguageDetector
