import { useMemo } from 'react'

const translations = {
    en: {
        column_reorder: 'This column is fixed and can’t be reordered.',
        column_hidden: 'This column is fixed and can’t be hidden.',
    },
    no: {
        column_reorder: 'Denne kolonnen er fast og kan ikke flyttes.',
        column_hidden: 'Denne kolonnen er fast og kan ikke skjules.',
    },
}

export function useTranslations(locale: 'no' | 'en' = 'en') {
    return useMemo(() => translations[locale] ?? translations.en, [locale])
}
