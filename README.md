# 🚨 Sanjeevani(RoadSOS) — Emergency Response App

> *Because every second counts when lives are at stake.*

Sanjeevani is a real-time emergency response mobile application built for road accident scenarios. When an accident happens — whether you're the victim or a bystander — RoadSOS immediately alerts emergency contacts, notifies nearby services, shares your live location, and even detects accidents automatically using your phone's sensors.

---

## 📖 Table of Contents

- [The Problem We're Solving](#the-problem-were-solving)
- [How It Works](#how-it-works)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Setting Up Android Studio](#setting-up-android-studio)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Auto Accident Detection](#auto-accident-detection)
- [Live Tracking](#live-tracking)
- [SMS & Call System](#sms--call-system)
- [Firebase Integration](#firebase-integration)
- [Multi-Country Support](#multi-country-support)
- [Demo APK](#demo-apk)
- [Known Limitations](#known-limitations)
- [Future Roadmap](#future-roadmap)

---

## 🆘 The Problem We're Solving

Every year, millions of road accidents go unresponded for critical minutes simply because:

- The victim is unconscious and cannot call for help
- Bystanders don't know which number to call
- Emergency contacts have no idea where the accident happened
- By the time help is notified, location information is lost

**Sanjeevani(RoadSOS) solves all of this in under 10 seconds.**

---

## 🔄 How It Works

### Flow 1 — "I Need Help" (You are the victim)

```
User opens app → Presses SOS button
        ↓
Chooses "I Need Help"
        ↓
10-second countdown begins (can cancel if accidental)
        ↓
Countdown ends → System automatically:
  ├── 📨 SMS 1 sent → Emergency contacts + Nearby services
  │         "🚨 [Name] needs help at [Location]"
  │
  ├── 📨 SMS 2 sent → Emergency contacts + Nearby services
  │         "📍 Track live: https://roadsos-backend.onrender.com/track/SESSION_ID"
  │
  ├── 📞 Native dialer opens 
  │
  └── 📡 Live tracking session starts
            → Location updates every 5 seconds (Phase 1)
            → Contacts can watch on browser — no app needed
```

### Flow 2 — "Someone Else Needs Help" (You are a bystander)

```
User opens app → Presses SOS button
        ↓
Chooses "Someone Else Needs Help"
        ↓
10-second countdown begins
        ↓
SMS sent → Nearby services ONLY
        "🚨 Incident reported at [Location]. Please respond."

No personal contacts, no call, no tracking
(You're a bystander — services handle it)
```

### Flow 3 — Auto Detection (Phone detects accident itself)

```
Phone sensors running in background
        ↓
Accelerometer + Gyroscope + GPS speed analyzed continuously
        ↓
Accident scoring system fires (score ≥ 80)
        ↓
Full-screen alert appears on ANY screen user is on
Phone vibrates strongly
        ↓
10-second countdown
  ├── User taps "I'm Safe" → cancel, 30 sec cooldown, resume monitoring
  └── No response / taps "Need Help" → Full "I Need Help" flow triggers
        (SMS + Tracking + Call — all automatic)
```

---

## ✨ Features

### 🚨 Emergency SOS
- One-tap SOS button on home screen
- Two distinct flows: victim vs bystander
- 10-second cancellable countdown before sending
- Offline fallback — uses native SMS if no internet

### 📡 Live Tracking
- Real-time GPS location shared with emergency contacts
- Browser-based tracking page — **contacts don't need the app**
- Three tracking phases to save battery
- 60-minute hard timeout with 5-minute warning + Extend option
- Resolve button on browser page for contacts to mark safe
- Full session summary saved to Firestore on end

### 🤖 Auto Accident Detection
- Multi-signal weighted scoring system
- Triggers alert only when combined score ≥ 80 (reduces false alarms)
- Score decays to 0 if no new events in 10 seconds
- 30-second cooldown after false alarm before resuming
- Built-in simulator panel for testing all crash scenarios

### 📨 SMS System (Twilio)
- Automated SMS to emergency contacts AND nearby services
- Messages kept under 160 characters (avoids multi-part SMS charges)
- Offline fallback: opens native SMS app

### 📞 Call System
- Native device dialer — no VoIP, no API cost
- Automatically dialer opens 

### 🔔 In-App Notifications
- Slide-down banner notifications for all key events

### 🌍 Nearby Services
- Shows current location on map
- Displays nearby emergency services (hospitals, police, ambulance)
- Services fetched based on user's real-time GPS location

### 🔐 Authentication
- Firebase Authentication
- Email/password login and signup
- Onboarding screen on first launch (auto detection permission)
- Phone number country code detected at signup — system auto-configures for that country(future)

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React Native + Expo SDK 54 | Mobile app framework |
| Expo Router (file-based) | Navigation |
| TypeScript | Type safety |
| Zustand | Global state management |
| expo-location | GPS tracking |
| expo-sensors | Accelerometer + Gyroscope |
| expo-battery | Battery level reporting |
| expo-network | Network status detection |
| Firebase Auth | User authentication |
| Android Studio | Native build (APK) |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| Firebase Admin SDK | Realtime DB + Firestore |
| Firebase Realtime Database | Live tracking session data |
| Firebase Firestore | Session summaries (permanent) |
| Twilio | SMS sending |
| Render | Cloud hosting |

---

## 📁 Project Structure

```
RoadSOS/
├── frontend/                          # React Native app
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   └── signup.tsx
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── sos.tsx                # 🚨 Main SOS screen
│   │   │   ├── contacts.tsx
│   │   │   ├── services.tsx           # Nearby emergency services
│   │   │   ├── tracking.tsx           # Live tracking status
│   │   │   └── settings.tsx
│   │   ├── emergency/
│   │   │   ├── whoNeedsHelp.tsx
│   │   │   ├── confirmation.tsx
│   │   │   └── details.tsx
│   │   ├── onboarding.tsx
│   │   └── _layout.tsx
│   │
│   ├── components/
│   │   ├── sos/
│   │   │   ├── SOSButton.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── AccidentAlertModal.tsx
│   │   │   ├── AlertStatus.tsx
│   │   │   └── SimulatorPanel.tsx
│   │   ├── ui/
│   │   │   ├── BellNotification.tsx
│   │   │   ├── NotificationBanner.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Button.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── LoginBackground.tsx
│   │
│   ├── hooks/
│   │   ├── useSoS.ts
│   │   ├── useTracking.ts
│   │   ├── useAccidentDetection.ts
│   │   ├── useLocation.ts
│   │   ├── useNotification.ts
│   │   └── useAuth.ts
│   │
│   ├── services/
│   │   └── location/
│   │       ├── gpsService.ts
│   │       └── motionService.ts
│   │
│   ├── store/
│   │   ├── sosStore.ts
│   │   └── notificationStore.ts
│   │
│   └── constants/
│       ├── api.ts                     # API_BASE_URL → Render
│       ├── color.ts
│       └── strings.ts
│
├── backend/                           # Node.js API
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── sosController.js
│   │   │   └── trackingController.js
│   │   ├── services/
│   │   │   ├── smsService.js
│   │   │   ├── callService.js
│   │   │   └── trackingService.js
│   │   ├── config/
│   │   │   ├── firebaseAdmin.js
│   │   │   └── emergencyNumbers.js    # Numbers per country (IN/BD/MM)
│   │   └── routes/
│   │       ├── sosRoutes.js
│   │       └── trackingRoutes.js
│   ├── public/
│   │   └── track.html                 # Browser tracking page
│   ├── server.js
│   └── .env
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, you need to install these tools. If you have never done this before — don't worry, every step is explained below.

- Node.js v18+
- Android Studio
- A Firebase project (free)
- A Twilio account (free trial)
- Git

---

## 🤖 Setting Up Android Studio

This section is for people who have never used Android Studio before. Read every step carefully.

### Step 1 — Download Android Studio

1. Go to **https://developer.android.com/studio**
2. Click **Download Android Studio**
3. Run the installer — click Next on everything, use default settings
4. When installation finishes, open Android Studio

### Step 2 — Install Android SDK

When Android Studio opens for the first time it shows a setup wizard:

1. Click **Next** on the welcome screen
2. Choose **Standard** installation type → click Next
3. Accept all license agreements → click Finish
4. Wait for it to download the Android SDK (takes 5–15 min depending on internet)
5. When done, click **Finish**

### Step 3 — Create a Virtual Device (Emulator)

A virtual device is a fake Android phone that runs on your computer. You need this to test the app without a real phone.

1. In Android Studio, click **More Actions** (or go to **Tools → Device Manager**)
2. Click **Create Device**
3. Choose a phone — select **Pixel 7** → click Next
4. Choose a system image:
   - Click **Download** next to **API 33 (Android 13)** or **API 34 (Android 14)**
   - Wait for download to finish
   - Select it → click Next
5. Click **Finish**
6. You will now see your virtual device listed — click the **▶ Play button** to start it
7. Wait for the phone to fully boot (takes 1–2 min first time)

> ✅ You will see a virtual Android phone appear on your screen. This is your emulator.

### Step 4 — Set Up Environment Variables for Android

Android Studio needs to know where the SDK is installed.

**On Windows:**
1. Search for **Environment Variables** in Start menu
2. Click **Edit the system environment variables**
3. Click **Environment Variables** button
4. Under **System Variables** click **New**:
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\YourName\AppData\Local\Android\Sdk`
   
   *(Replace YourName with your actual Windows username)*
5. Find the **Path** variable → click Edit → click New → add:
   ```
   %ANDROID_HOME%\platform-tools
   ```
6. Click OK on everything

**On Mac:**
```bash
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc
```

### Step 5 — Verify Setup

Open a terminal and run:
```bash
adb devices
```

You should see your emulator listed:
```
List of devices attached
emulator-5554   device
```

If you see this — Android Studio is set up correctly. ✅

### Using a Real Android Phone Instead of Emulator

If you prefer to test on your actual phone:

1. On your Android phone go to **Settings → About Phone**
2. Tap **Build Number** 7 times (yes, really) — this enables Developer Mode
3. Go back to **Settings → Developer Options**
4. Enable **USB Debugging**
5. Connect your phone to your computer with a USB cable
6. A popup appears on your phone asking to trust the computer — tap **Allow**
7. Run `adb devices` in terminal — your phone should appear

---

## 🔧 Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/RoadSOS.git
cd RoadSOS
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder (see [Environment Variables](#environment-variables) section).

Start the backend:
```bash
node server.js
```

You should see:
```
✅ Server running on port 5000
✅ Firebase connected
```

### 3. Frontend setup

```bash
cd frontend
npm install --legacy-peer-deps
```

Open `constants/api.ts` and set the backend URL:
```ts
export const API_BASE_URL = 'https://roadsos-backend.onrender.com';
```

### 4. Build and run the app

Make sure your emulator is running (the virtual phone is visible on screen) or your real phone is connected.

Then run:
```bash
npx expo run:android
```

**What this command does:**
- First time: takes 5–10 minutes — it compiles the entire app with native code
- Automatically installs the app on your emulator or connected phone
- Opens the app when done

> ⚠️ **Important:** Always use `npx expo run:android` — NOT `npx expo start`. The app uses native phone features (sensors, battery, GPS) that only work with a proper build.

**After the first build**, you can use this for faster reloads:
```bash
npx expo start --dev-client
```

### 5. 📱 Demo APK

A pre-built APK is available for anyone to install and test without setting up anything.

**Install instructions:**
1. Enable installing from unknown sources on your Android phone:
   - Go to **Settings → Security** (or **Settings → Apps → Special App Access**)
   - Enable **Install unknown apps** or **Unknown sources**
2. Download `Sanjeevani.apk` to your phone
3. Open the file from your Downloads folder
4. Tap **Install**
5. Open the app and grant location permissions when asked

APK- https://drive.usercontent.google.com/download?id=1rV5xYiOX-HzGZOKgXLrCTJdHYFYedxD5&export=download

> ⚠️ The demo APK connects to our test backend on Render. SMS goes to our test number only. Auto detection simulation works fully.

> Ensure to put your test number in .env and uncomment one of services in emergencyNumbers.js.

----

## 🔑 Environment Variables

Create a file called `.env` inside the `backend/` folder. Copy this exactly and fill in your values:

```env
# Server
PORT=5000

# Backend URL — your Render deployment URL
BACKEND_URL=https://roadsos-backend.onrender.com

# Twilio — get these from twilio.com/console
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# Test number — this number receives all SMS during development
TEST_EMERGENCY_NUMBER=+91xxxxxxxxxx

# Firebase — get from Firebase Console → Project Settings → Service Accounts
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com

# JWT
JWT_SECRET=any_random_long_string_here
```

---

## 📡 API Reference

All API calls go to `https://roadsos-backend.onrender.com`

### Auth Endpoints
```
POST /api/auth/login
POST /api/auth/signup
```

### SOS Endpoints
```
POST /api/sos/trigger      → Full SOS (SMS + call queue)
POST /api/sos/bystander    → Incident report (nearby services only)
```

### Tracking Endpoints
```
POST /api/tracking                      → Create session
POST /api/tracking/:id/update           → Update location
POST /api/tracking/:id/end              → End session
POST /api/tracking/:id/extend           → Extend +30 min
GET  /api/tracking/:id                  → Get session data
GET  /track/:id                         → Browser tracking page
```

### Emergency Services Endpoints
```
GET  /api/emergency/nearby                              → Nearby services
GET  /api/emergency/hospitals/nearest?lat=x&lng=y      → Nearest hospitals
GET  /api/emergency/ambulances/nearest?lat=x&lng=y     → Nearest ambulances
```

### User Endpoints
```
GET  /api/user/profile
GET  /api/user/:id
GET  /api/user/:id/sos-history
```

---

## 🤖 Auto Accident Detection

The detection system runs continuously in the background when enabled. It uses a **weighted multi-signal scoring system** to avoid false alarms:

| Signal | Score Added | Threshold |
|--------|-------------|-----------|
| High impact (accelerometer) | +40 | > 2.5g force |
| Rapid deceleration (GPS) | +30 | > 20 km/h drop |
| Rotation anomaly (gyroscope) | +20 | > 3.0 magnitude |
| Post-impact inactivity | +40 | No movement 20s after impact |

Alert triggers only when **total score ≥ 80**.

```
Phone dropped alone      → score 40  → NO alert ✅
Hard braking alone       → score 30  → NO alert ✅
Full crash (all signals) → score 130 → ALERT 🚨
```

### Testing Without Crashing Your Car

The app has a **Simulator Panel** on the SOS screen with  pre-built scenarios:

| Scenario | Score | Triggers? |
|----------|-------|-----------|
| Full Crash | 130 | ✅ Yes |
| Highway Crash | 130 | ✅ Yes |
| Vehicle Rollover | 130 | ✅ Yes |
| Low Speed Crash | 80 | ✅ Yes |
| Phone Drop | 40 | ❌ No |
| Hard Braking | 30 | ❌ No |
| Bumpy Road | 0 | ❌ No |

---

## 📍 Live Tracking

When SOS is triggered, contacts receive a link:
```
https://roadsos-backend.onrender.com/track/SESSION_ID
```

Opening this in any browser shows:
- 🗺️ Live map with person's location
- 📍 Movement trail
- 🔴 Phase banner (Critical / Reduced / Passive)
- 🔋 Battery + network status
- ⏱️ Duration counter
- ✅ Resolve button for contacts to mark safe

### Tracking Phases

| Phase | Duration | Update Interval |
|-------|----------|-----------------|
| Phase 1 — Critical | 0–20 min | Every 5 seconds |
| Phase 2 — Reduced | 20–40 min | Every 15 seconds |
| Phase 3 — Passive | 40–60 min | Every 60 seconds |

---

## 🔐 Firebase Integration

### Authentication
- Email/password login via Firebase Auth
- Phone number country code detected at signup(future)
- System automatically configures emergency numbers for that country(future)


### Realtime Database
-Stores live tracking data — location updates in real time.
-Data get deleted after 24 hours(privacy)

### Firestore
Stores permanent session summaries — only saved once when session truly ends, not on every phase change.

### Firebase Setup (Step by Step)

1. Go to **https://console.firebase.google.com**
2. Click **Create a project** → give it a name → click Continue
3. Disable Google Analytics (not needed) → click **Create project**
4. In left sidebar click **Authentication** → **Get started** → enable **Email/Password**
5. In left sidebar click **Realtime Database** → **Create database** → choose your region → **Start in test mode**
6. In left sidebar click **Firestore Database** → **Create database** → **Start in test mode**
7. Click the ⚙️ gear icon → **Project settings** → **Service accounts** tab
8. Click **Generate new private key** → download the JSON file
9. Copy the values from that JSON file into your `backend/.env`

---

## 🌍 Multi-Country Support

RoadSOS is built for international use. During signup, the user's phone number country code is detected automatically. The system then routes SMS to the correct emergency services for that country.

| Country | Code | Emergency Services |
|---------|------|--------------------|
| India | IN | Police (100), Ambulance (108), Highway Patrol (1033) |
| Bangladesh | BD | Police (999), Ambulance (999) |
| Myanmar | MM | Police (199), Ambulance (192) |

We have files for this but implementation is in future roadmap.

---

## ⚠️ Known Limitations

| Limitation | Reason |
|------------|--------|
| SMS goes to test number only | Twilio trial account — real numbers need production Twilio |
| Auto detection needs Android Studio build | expo-sensors not available in Expo Go |
| Render backend may take 30s to wake up | Free tier sleeps after 15 min inactivity |
| India/Bangladesh/Myanmar only | Other countries can be added to emergencyNumbers.js |
| Android only | iOS build not yet configured |

---

## 🔮 Future Roadmap

- [ ] **iOS support** — iPhone build
- [ ] **DLT registration** for India (required for production SMS delivery)
- [ ] **Contacts screen** wired to backend — user adds real personal emergency contacts
- [ ] **Push notifications** — contacts notified when emergency is resolved
- [ ] **Real-time map in app** — not just browser
- [ ] **Multi-language SMS** — messages sent in user's local language
- [ ] **More countries** — expand beyond IN/BD/MM
- [ ] **Voice SOS** — trigger emergency by saying a keyword

---

## 👥 Team

Built with ❤️ for road safety.

- **Frontend Team** — React Native UI, navigation, components, Firebase Auth
- **Backend Team** — API, SMS integration, Firebase Realtime DB, Firestore, tracking logic

---



---

> *"In an emergency, the difference between life and death can be a single minute. RoadSOS is that minute."*
