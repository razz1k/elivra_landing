# Лена Разумная — лендинг

Одностраничный personal brand лендинг практикующего психосоматолога. Стек: Vite + vanilla TypeScript.

## Быстрый старт

```bash
npm install
npm run dev
```

Сборка и превью:

```bash
npm run build
npm run preview
```

## Контакты и Telegram

Все CTA «Записаться…», «Задать вопрос» и ссылки в footer берутся из [`src/config.ts`](src/config.ts):

```ts
export const site = {
  telegramUrl: 'https://t.me/PLACEHOLDER',
  whatsappUrl: 'https://wa.me/00000000000',
  instagramUrl: 'https://instagram.com/PLACEHOLDER',
  phone: '+7 (000) 000-00-00',
  phoneHref: 'tel:+70000000000',
  email: 'hello@example.com',
  emailHref: 'mailto:hello@example.com',
}
```

Формы записи нет: кнопки открывают чат в Telegram.

## JavaScript

На первом экране приложение не грузится. Крошечный loader вешает слушатели и подключает `main.ts` только после первого взаимодействия (pointer / touch / key / scroll).

Меню и FAQ работают без JS (checkbox + `<details>`).


Шрифты самохостятся через `@fontsource` (без запроса к Google Fonts):

- заголовки — Cormorant Garamond
- текст — Manrope
- рукописный акцент — Caveat


Плейсхолдеры лежат в `src/assets/images/`:

- `hero-portrait.svg` — первый экран
- `about-portrait.svg` — блок «Обо мне»
- `quote-bg.svg` — эмоциональный блок

Замените файлы на реальные фото (WebP/JPEG) и обновите пути в `index.html`. Рекомендуемый размер hero: ~1200×1500, about: ~1000×1250.

## SEO

В `index.html` замените `https://example.com/` в `canonical` и Open Graph на боевой домен. OG-картинка: `public/og-image.svg` (при желании замените на JPG/PNG 1200×630).

## Страницы

- `/` — лендинг
- `/privacy.html` — политика конфиденциальности (шаблон)
