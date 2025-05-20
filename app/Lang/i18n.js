import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import vn from './vn.json';
i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'vn',
    fallbackLng: 'vn',
    resources: {
        en: en,
        vn: vn,
    },
    interpolation: {
        escapeValue: false // react already safes from xss
    }
});

export default i18n;