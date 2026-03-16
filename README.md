**Smartbiz Mobile** is a premium, high-performance business management solution built with React Native. Designed for efficiency and scale, it empowers business owners to manage operations, monitor inventory, and track financial health in real-time from anywhere in the world.

---

## ✨ Key Features

- **📊 Intelligent Dashboard**: Real-time KPI tracking including total revenue, sales volume, and dynamic trend charts.
- **📦 Advanced Inventory**: Full CRUD operations for products, SKU management, and proactive low-stock alerts.
- **💰 Sales Engine**: Quick-entry sales recording, customer management, and comprehensive transaction history.
- **🧾 Smart Invoicing**: Professional invoice generation and "Invoice Ageing" reports for better cash flow visibility.
- **🤖 AI Assistant**: Global AI Chat integration across all screens to help you navigate data and gain business insights.
- **🔒 Enterprise Security**: Secure token-based authentication (JWT) with persistent session management.

---

## 🛠️ Tech Stack

- **Core**: [React Native](https://reactnative.dev/) (v0.84+) & [React](https://react.dev/) (v19)
- **Styling & UI**: [React Native Paper](https://callstack.github.io/react-native-paper/) (Material Design 3)
- **State Management**: React Context API
- **Navigation**: [React Navigation 7](https://reactnavigation.org/)
- **Networking**: [Axios](https://axios-http.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `>= 22.11.0`
- **Package Manager**: npm
- **Environment**: [React Native CLI Setup](https://reactnative.dev/docs/set-up-your-environment) (Android Studio / Xcode)

### Installation

1.  **Clone & Enter**
    ```bash
    git clone https://github.com/Dakshina-Migara/smartbiz-mobile-react-native.git
    cd smartbiz-mobile-react-native
    ```

2.  **Dependencies**
    ```bash
    npm install
    ```

3.  **iOS Cleanup (macOS only)**
    ```bash
    cd ios && pod install && cd ..
    ```

### Execution

| Command | Action |
| :--- | :--- |
| `npm start` | Start the Metro Bundler |
| `npm run android` | Launch on Android Emulator/Device |
| `npm run ios` | Launch on iOS Simulator (macOS) |

---

## 📂 Project Architecture

```text
src/
├── component/    # Atomic UI components and shared layouts
├── context/      # Global state (Auth, Sales, UI state)
├── navigation/   # Stack and Tab navigation configurations
├── screens/      # Feature-specific screens (Dashboard, Sales, etc.)
└── services/     # API abstraction layer using Axios
```

---

## 🔧 API Configuration

The app is pre-configured to handle both local development and emulator networking. Adjust the base URL in `src/services/api.ts` if needed:

- **Android Emulator**: `http://10.0.2.2:8080/api/v1`
- **iOS / Physical Device**: `http://<YOUR_LOCAL_IP>:8080/api/v1`

---

## 📄 License & Privacy

This is a **private** repository and is the intellectual property of Smartbiz. Unauthorized distribution or copying is strictly prohibited.

