# 🚀 DevLens AI

> 🧠 AI-powered code reviewer: analiza código, detecta errores y mejora calidad automáticamente.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express](https://img.shields.io/badge/Express.js-black)
![React](https://img.shields.io/badge/React-blue)
![Vite](https://img.shields.io/badge/Vite-purple)
![AI](https://img.shields.io/badge/AI-Gemini-orange)

---

## ✨ Features

* 🔍 Análisis de código con IA
* ⚠️ Detección de bugs y vulnerabilidades
* 📊 Score de calidad
* 🧑‍💻 Nivel del desarrollador
* 💡 Código mejorado automáticamente

---

## ⚙️ Tech Stack

* **Backend:** Node.js + Express + Gemini AI
* **Frontend:** React + Vite

---

## 🚀 Quick Start

```bash
git clone https://github.com/tu-usuario/dev-lens-ia.git
cd dev-lens-ia
```

### Backend

```bash
cd backend
npm install
node src/index.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 Cómo funciona

1. El usuario envía código desde el frontend
2. El backend lo procesa y normaliza
3. Se analiza con IA (Gemini)
4. Se generan:

   * 📊 Score
   * ⚠️ Issues
   * 💡 Recomendaciones
5. El resultado se muestra en la UI

---

## 📡 API

**POST** `/api/analyze`

```json
{
  "code": "your code here"
}
```

---

## 🌐 Deploy (VPS)

```bash
pm2 start src/index.js --name devlens-api
pm2 save
```

---

## 👨‍💻 Author

Edison Salinas 🚀
