# قائمة المهام Todo List

تطبيق قائمة المهام مبني باستخدام:
- Node.js
- Express.js
- Handlebars
- Supabase
- Bootstrap 5

## المميزات
- إضافة مهام جديدة
- تعديل حالة المهام (مكتملة/غير مكتملة)
- حذف المهام
- واجهة مستخدم عربية
- تصميم متجاوب

## متطلبات التشغيل
- Node.js
- NPM
- حساب Supabase

## طريقة التثبيت

1. نسخ المستودع
```bash
git clone [رابط المستودع]
cd todo-app
```

2. تثبيت الاعتمادات
```bash
npm install
```

3. إعداد ملف البيئة
قم بإنشاء ملف `.env` وأضف المتغيرات التالية:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
PORT=3000
```

4. تشغيل التطبيق
```bash
npm start
```

## قاعدة البيانات
يجب إنشاء جدول `todos` في Supabase بالأعمدة التالية:
- `id` (BIGSERIAL PRIMARY KEY)
- `title` (TEXT NOT NULL)
- `completed` (BOOLEAN DEFAULT FALSE)
- `created_at` (TIMESTAMPTZ DEFAULT NOW())
