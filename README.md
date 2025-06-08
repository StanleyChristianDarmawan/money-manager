# Money Manager App

A mobile daily finance tracking application built with **React Native** and **Firebase**, featuring **Google Sign-In** authentication and **Gemini AI** integration for smart financial recommendation.

---

## Key Features

* ✅ **Google Sign-In Authentication**
* ✅ **Add & Manage Incomes and Expenses**
* ✅ **AI Prompt Page with Gemini API**
* ✅ **Smooth UI Animations**
* ✅ **Data Storage with Firebase Realtime Database**
* ✅ **Mobile-Optimized UI using Expo**

---

## Tech Stack

| Technology       | Description                           |
| ---------------- | ------------------------------------- |
| React Native     | Mobile app development                |
| Expo             | React Native development environment  |
| Firebase         | Backend for Authentication & Database |
| Google Sign-In   | Authentication method                 |
| Gemini API       | AI-based prompt and analysis features |
| React Navigation | Page navigation system                |
| Moti             | Smooth UI animations                  |

---

## Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/StanleyChristianDarmawan/money-manager.git
cd money-manager
```

### 2. Install Dependencies

```bash
npm install
```
### 3. Create .env

```bash
copy .env.example .env
```

### 4. Insert your Gemini API and Firebase Configuration to .env file
```bash
GOOGLE_API_KEY=

FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
```

For test purpose, you can use my temporary firebase and gemini api key but please don't share it to public (Will delete it soon)
```bash
GOOGLE_API_KEY=AIzaSyDe6C5xdVOo_WAITUSU2gipyh-xjcvE6ZU

FIREBASE_API_KEY=AIzaSyDNMfQPpLUubo0vLRV0jZNLA3upmxgWBXw
FIREBASE_AUTH_DOMAIN=money-manager-727dc.firebaseapp.com
FIREBASE_PROJECT_ID=money-manager-727dc
FIREBASE_STORAGE_BUCKET=money-manager-727dc.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=414370947871
FIREBASE_APP_ID=1:414370947871:web:aa1ed00571d0772ea2862a
FIREBASE_MEASUREMENT_ID=G-QZ8TWE1RBX

```

> ⚠️ For demo/testing purpose, we used temporary API keys. <br />
> ⚠️ This is for demo/testing only. Do not share API keys to others.

### 4. Run the App

```bash
npx expo start
```

### 5. Run the API

```
node api-jsonGenerator.js
```