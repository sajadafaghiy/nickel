# نیکل

[![Deploy Astro to GitHub Pages](https://github.com/sajadafaghiy/nickel/actions/workflows/deploy.yml/badge.svg)](https://github.com/sajadafaghiy/nickel/actions/workflows/deploy.yml)

یک وب‌سایت استاتیک فارسی و راست‌به‌چپ برای انتشار خلاصهٔ کتاب، ساخته‌شده با Astro 7. تمام نوشته‌ها فایل Markdown هستند و برای افزودن محتوا نیازی به ویرایش کامپوننت‌ها نیست.

## اجرای محلی

```bash
npm install
npm run dev
```

سپس نشانی نمایش‌داده‌شده در ترمینال (معمولاً `http://localhost:4321`) را باز کنید.

## افزودن خلاصهٔ تازه

یک فایل با نام انگلیسی و پسوند `.md` در `src/content/books/` بسازید:

```md
---
title: «نام کتاب»
author: نام نویسنده
description: توضیح کوتاه برای کارت و موتورهای جست‌وجو
publishedAt: 2026-09-25
featured: false
draft: false
---

## ایدهٔ اصلی

متن خلاصه را اینجا بنویسید.
```

- نام فایل، نشانی صفحه را می‌سازد؛ مثلاً `my-book.md` به `/books/my-book/` تبدیل می‌شود.
- با `draft: true` نوشته در خروجی سایت نمایش داده نمی‌شود.
- تاریخ باید به شکل `YYYY-MM-DD` باشد.

## ساخت و بررسی

```bash
npm run build
npm run preview
```

خروجی استاتیک در پوشهٔ `dist/` ساخته می‌شود.

## انتشار در GitHub Pages

1. این پروژه را در یک مخزن GitHub قرار دهید و شاخهٔ اصلی را `main` بنامید.
2. در GitHub به **Settings → Pages** بروید.
3. زیر **Build and deployment**، گزینهٔ **Source** را روی **GitHub Actions** بگذارید.
4. پروژه را push کنید. گردش‌کار `.github/workflows/deploy.yml` مسیر سایت را برای مخزن‌های معمولی و مخزن‌های `username.github.io` خودکار تنظیم و منتشر می‌کند.

```bash
git init
git add .
git commit -m "Initialize Persian book summaries site"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

به‌جای `USERNAME` و `REPOSITORY` مقادیر مخزن خود را قرار دهید.

## ساختار مهم پروژه

- `src/content/books/`: خلاصه‌ها در قالب Markdown
- `src/content.config.ts`: اعتبارسنجی اطلاعات هر کتاب
- `src/pages/`: صفحهٔ اصلی و مسیر پویای کتاب‌ها
- `src/styles/global.css`: ظاهر فارسی و RTL
- `.github/workflows/deploy.yml`: انتشار خودکار GitHub Pages
"# nickel2" 
