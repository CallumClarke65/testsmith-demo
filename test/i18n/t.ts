import en from './resources/en.json';

const translations = { en };
let currentLocale = 'en';

export function t(key: string): string {
  let locale = getLocale();

  if (!translations[locale]) {
    const base = locale.split('-')[0];
    locale = translations[base] ? base : 'en';
  }

  const value = key.split(':').reduce(
    (o, i) => o?.[i],
    translations[locale]
  );

  if (typeof value !== 'string') {
    throw new Error(`Missing translation for key: "${key}"`);
  }

  return value;
}

export function setLocale(locale: string) {
  currentLocale = locale;
}

export function getLocale() {
  return currentLocale;
}
