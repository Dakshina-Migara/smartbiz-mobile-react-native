# Smartbiz Mobile 🚀

**Smartbiz Mobile** is a powerful, cross-platform business management application built with React Native. It serves as a mobile companion to the Smartbiz platform, empowering business owners to manage their operations, track sales, and monitor inventory on the go.

---

## ✨ Key Features

- **📊 Dynamic Dashboard**: Get a real-time overview of your business with key performance indicators (KPIs) like total revenue, sales count, and low-stock alerts.
- **📦 Inventory Management**: Seamlessly add, update, and track products. Monitor stock levels and organize items by category.
- **💰 Sales Tracking**: Record new sales transactions, manage customer information, and view detailed sales history.
- **🧾 Invoice Management**: Generate and manage business invoices directly from your mobile device.
- **🔒 Secure Authentication**: Robust login system with token-based authentication to keep your business data safe.

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.84+)
- **UI Library**: [React Native Paper](https://callstack.github.io/react-native-paper/)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: Material Design Icons

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 22.11.0)
- [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment)
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/Dakshina-Migara/smartbiz-mobile-react-native.git
   cd smartbiz-mobile-react-native
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Install iOS dependencies** (macOS only):
   ```sh
   cd ios && pod install && cd ..
   ```

### Running the App

1. **Start Metro Bundler**:
   ```sh
   npm start
   ```

2. **Launch on Android**:
   ```sh
   npm run android
   ```

3. **Launch on iOS**:
   ```sh
   npm run ios
   ```

---

## 📂 Project Structure

```text
src/
├── component/    # Reusable UI components
├── context/      # React Context for state management (Auth, Sales)
├── navigation/   # Navigation configuration (RootNavigator)
├── screens/      # Main application screens (Dashboard, Sales, Inventory, etc.)
└── services/     # API services and business logic
```

---

## 🔧 Configuration

The application connects to the Smartbiz API. You can configure the base URL in `src/services/api.ts`.

- **Android Emulator**: `http://10.0.2.2:8080/api/v1`
- **iOS Simulator / Real Device**: `http://localhost:8080/api/v1`

---

## 📄 License

This project is private and intended for use by Smartbiz administrators and business owners.

