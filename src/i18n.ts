// src/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

// สร้างตัวกำหนดค่า i18next
i18n
  // ใช้ backend เพื่อโหลดไฟล์ JSON จาก public/locales
  .use(HttpBackend)
  // ผสานรวมกับ React
  .use(initReactI18next) 
  .init({
    // ภาษาสำรอง (Default Language)
    fallbackLng: 'en',
    // ภาษาที่รองรับทั้งหมด
    supportedLngs: ['en', 'th'],
    // ภาษาที่จะใช้เริ่มต้น
    lng: 'th', // กำหนดให้เริ่มต้นที่ภาษาไทย หรือ 'en' ก็ได้

    debug: false, // ปิดเมื่อนำไปใช้งานจริง

    // การตั้งค่าสำหรับการโหลดไฟล์คำแปล
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', 
    },

    // การตั้งค่าการทำงาน (Namespaces และ Keys)
    ns: ['translation'],
    defaultNS: 'translation',
    
    interpolation: {
      escapeValue: false, // อนุญาตให้ใช้ HTML ในข้อความแปลได้ (เช่น <span>)
    },
    
    // การตั้งค่าการแคชของเบราว์เซอร์
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;