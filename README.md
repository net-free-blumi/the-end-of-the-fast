# מתי יוצא הצום? (The End of The Fast) ⏳

אתר מתקדם, מדויק ומהיר לחישוב זמני כניסה ויציאה של כל צומות ישראל, עם ספירה לאחור בזמן אמת לפי עיר וזמני רבנו תם.

## 🚀 הרצה מקומית (Local Development)

כדי להריץ את הפרויקט במחשב שלך:

1. **התקנת תלויות**:
   ```bash
   npm install
   ```

2. **הרצת שרת הפיתוח של Vite**:
   ```bash
   npm run dev
   ```
   האתר ייפתח בכתובת: `http://localhost:3000` (או פורט ש-Vite יציג בטרמינל).

> 💡 **הערה חשובה לגבי השגיאה `Failed to load module script MIME type`**:
> שגיאה זו מתרחשת כשמנסים לפתוח ישירות את קובץ ה-HTML בדפדפן (לחיצה כפולה על `index.html` או הגשה דרך שרת קבצים פשוט ללא תמיכת TypeScript/Vite). כדי שהקוד ירוץ במחשב, **חובה להריץ `npm run dev`**.

---

## 🌐 פריסה לאינטרנט בחינם (Deployment)

האתר הוא Client-side SPA טהור וניתן להעלות אותו בחינם תוך שניות:

### פריסה ל-Vercel (מומלץ ביותר):
1. היכנס ל-[vercel.com](https://vercel.com) והתחבר עם GitHub.
2. לחץ **Add New Project** ובחר ב-`the-end-of-the-fast`.
3. לחץ **Deploy** (Vercel יזהה אוטומטית את Vite ויבנה את האתר).

### פריסה ל-Netlify:
1. היכנס ל-[netlify.com](https://netlify.com) והתחבר עם GitHub.
2. בחר את הריפוזיטורי ולחץ **Deploy**.

---

## 🔍 מוכנות מלאה למנועי חיפוש (Google SEO)
הקוד כולל:
- תגיות Meta מלאות בעברית (Title, Description, Keywords).
- Open Graph ו-Twitter Cards לשיתוף מעוצב בוואטסאפ ורשתות.
- מבנה נתונים של גוגל (Schema.org JSON-LD).
- קבצי `robots.txt` ו-`sitemap.xml` בתיקיית `public/`.
