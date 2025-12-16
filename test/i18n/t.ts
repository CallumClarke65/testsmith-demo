import en from './resources/en.json';

const translations = { en };
let currentLocale = 'en';

export function t(key: string): string {
  const locale = getLocale();
  return key.split('.').reduce(
    (o, i) => o?.[i],
    translations[locale]
  );
}


export function setLocale(locale: string) {
  currentLocale = locale;
}

export function getLocale() {
  return currentLocale;
}
