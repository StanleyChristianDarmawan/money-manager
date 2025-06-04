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

## Test Login

To allow instructors or testers to log in without being added manually to Google Auth platform:

* **Email:** `test@gmail.com`
* **Password:** `12345678`

> ⚠️ This is for demo/testing only. Do not share Email and Password to others.

---

## Gemini API Key

```ts
// Example usage (e.g. in prompt.ts):
const GEMINI_API_KEY = "123456";
```

> ⚠️ This is for demo/testing only. Do not share API keys to others.

---

## Getting Started Locally

### 1. Clone the Repository

```bash
git https://github.com/StanleyChristianDarmawan/money-manager
cd money-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

* Create a new project at [Firebase Console](https://console.firebase.google.com)
* Enable **Google Sign-In** under Authentication > Sign-in method
* Enable **Realtime Database** in test mode
* Add your Firebase config to a file like `firebaseConfig.ts`:

```ts
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 4. Run the App

```bash
npx expo start
```