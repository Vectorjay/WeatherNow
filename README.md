# 🌤 WeatherNow - React Native App

A beautiful, production-ready React Native weather app with Codemagic CI/CD for App Store deployment.

---

## 📱 Features

- 🔍 Search weather by city name
- 🌡 Current temperature, feels like, humidity, wind, pressure, visibility
- 🌅 Sunrise & sunset times
- 📅 5-day forecast
- 🎨 Dynamic background colors based on temperature
- 🔄 Pull-to-refresh
- ⌨️ Keyboard-friendly layout

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+
- React Native CLI
- Xcode 14+ (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

### 2. Get an OpenWeatherMap API Key (FREE)

1. Go to [openweathermap.org](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to **API Keys** in your profile
4. Copy your API key

### 3. Install & Run

```bash
# Clone your repo
git clone https://github.com/yourusername/WeatherNow.git
cd WeatherNow

# Install dependencies
npm install

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

### 4. Add Your API Key

In `src/utils/weatherApi.ts`, replace:
```ts
const API_KEY = 'YOUR_API_KEY_HERE';
```
with your actual key. In production, use environment variables (handled automatically by Codemagic).

---

## 🏗 Codemagic CI/CD Setup (App Store)

### Step 1: Push to GitHub/GitLab/Bitbucket

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/WeatherNow.git
git push -u origin main
```

### Step 2: Connect to Codemagic

1. Go to [codemagic.io](https://codemagic.io) and sign in
2. Click **Add application** → select your repo
3. Choose **React Native App** → select `codemagic.yaml`

### Step 3: Configure Signing (iOS)

1. In Codemagic → **Teams → Code signing identities**
2. Upload your:
   - **Distribution Certificate** (.p12 + password)
   - **Provisioning Profile** (App Store Distribution)
3. In `codemagic.yaml`, update `bundle_identifier` to match your Apple Developer bundle ID

### Step 4: App Store Connect API Key

1. In App Store Connect → **Users and Access → Keys**
2. Generate a new API key with App Manager role
3. In Codemagic → **Teams → Integrations → App Store Connect**
4. Add the key (Key ID, Issuer ID, .p8 file)

### Step 5: Add Secret Variables in Codemagic

Go to your app → **Environment variables** → add:

| Variable | Value |
|---|---|
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap API key |
| `APP_STORE_CONNECT_PRIVATE_KEY` | Contents of your .p8 file |
| `APP_STORE_CONNECT_KEY_IDENTIFIER` | Your Key ID |
| `APP_STORE_CONNECT_ISSUER_ID` | Your Issuer ID |

Mark all as **Secure** ✓

### Step 6: Update codemagic.yaml

Replace these placeholders in `codemagic.yaml`:
- `com.yourcompany.weathernow` → your actual bundle ID
- `your@email.com` → your notification email

### Step 7: Build & Ship! 🚀

Push to `main` branch to trigger an automatic build. Codemagic will:
1. Install dependencies
2. Install CocoaPods
3. Inject your API key
4. Sign the app
5. Build the IPA
6. Upload to TestFlight

---

## 📁 Project Structure

```
WeatherNow/
├── App.tsx                    # App entry point
├── src/
│   ├── screens/
│   │   └── HomeScreen.tsx     # Main screen
│   ├── components/
│   │   ├── WeatherCard.tsx    # Current weather display
│   │   └── ForecastCard.tsx   # 5-day forecast cards
│   └── utils/
│       ├── weatherApi.ts      # OpenWeatherMap API calls
│       └── types.ts           # TypeScript interfaces
├── codemagic.yaml             # CI/CD pipeline config
├── ios/                       # iOS native project
└── android/                   # Android native project
```

---

## 🔧 Customization

### Change App Name
- `package.json`: change `"name"`
- `ios/WeatherNow/Info.plist`: change `CFBundleDisplayName`
- `android/app/src/main/res/values/strings.xml`: change `app_name`

### Change Bundle ID
- `ios`: Xcode → Project settings → Bundle Identifier
- `android/app/build.gradle`: `applicationId`
- `codemagic.yaml`: `bundle_identifier` and `BUNDLE_ID`

---

## 🛟 Troubleshooting

**"City not found"** → Check spelling, try the English name of the city

**"Invalid API key"** → Make sure key is activated (can take up to 2 hours after signup)

**Build fails on Codemagic** → Check that all environment variables are set correctly and your signing certificates are valid

---

## 📄 License

MIT
