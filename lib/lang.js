import enUS from './lang/en-US'
import cookie from 'react-cookies'
import { getQueryVariable, isBrowser, mergeDeep } from './utils'

/**
 * 在这里配置所有支持的语言
 * 国家-地区
 */
const LANGS = {
  'en-US': enUS
}

export default LANGS

/**
 * 获取当前语言字典
 * 如果匹配到完整的“国家-地区”语言，则显示国家的语言
 * @returns 不同语言对应字典
 */
export function generateLocaleDict(langString) {
  const supportedLocales = Object.keys(LANGS)
  let userLocale

  // 将语言字符串拆分为语言和地区代码，例如将 "zh-CN" 拆分为 "zh" 和 "CN"
  const [language, region] = langString?.split(/[-_]/)

  // 优先匹配语言和地区都匹配的情况
  const specificLocale = `${language}-${region}`
  if (supportedLocales.includes(specificLocale)) {
    userLocale = LANGS[specificLocale]
  }

  // 然后尝试匹配只有语言匹配的情况
  if (!userLocale) {
    const languageOnlyLocales = supportedLocales.filter(locale => locale.startsWith(language))
    if (languageOnlyLocales.length > 0) {
      userLocale = LANGS[languageOnlyLocales[0]]
    }
  }

  // 如果还没匹配到，则返回最接近的语言包
  if (!userLocale) {
    const fallbackLocale = supportedLocales.find(locale => locale.startsWith('en'))
    userLocale = LANGS[fallbackLocale]
  }

  return mergeDeep({}, LANGS['en-US'], userLocale)
}

/**
 * 初始化站点翻译
 * 根据用户当前浏览器语言进行切换
 */
export function initLocale(lang, locale, changeLang, changeLocale) {
  if (isBrowser) {
    const queryLang = getQueryVariable('lang') || loadLangFromCookies()
    let currentLang = lang
    if (queryLang && queryLang !== 'undefined' && queryLang !== lang) {
      currentLang = queryLang
    }

    changeLang(currentLang)
    saveLangToCookies(currentLang)

    const targetLocale = generateLocaleDict(currentLang)
    if (JSON.stringify(locale) !== JSON.stringify(currentLang)) {
      changeLocale(targetLocale)
    }
  }
}
/**
 * 读取语言
 * @returns {*}
 */
export const loadLangFromCookies = () => {
  return cookie.load('lang')
}

/**
 * 保存语言
 * @param newTheme
 */
export const saveLangToCookies = (lang) => {
  cookie.save('lang', lang, { path: '/' })
}
