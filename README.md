# Floo

React Native + Expo mobile client for a news recommender. Companion to an ASP.NET Core 8 backend at `http://localhost:5241`.

## Stack

- React Native 0.81 + Expo SDK 54 (New Architecture / Fabric)
- TypeScript
- React Navigation: native-stack + material-top-tabs (with swipe between tabs)
- AsyncStorage for JWT persistence

## Setup

```bash
npm install
cp .env.example .env
# edit .env: set EXPO_PUBLIC_API_URL to a URL reachable from your device
```

For Expo Go on a physical phone, set `EXPO_PUBLIC_API_URL=http://<your-wifi-ip>:5241`. Phone and computer must be on the same Wi-Fi.

For Android emulator / iOS simulator on the same machine, `http://localhost:5241` works.

## Run

```bash
npm start                # Expo dev server (QR for Expo Go)
npm run android          # Android emulator
npm run ios              # iOS simulator (macOS only)
npm run web              # web (limited)
```

## Type-check

```bash
npx tsc --noEmit
```

## Project layout

```
src/
  api/          # backend wrappers (auth, posts, tags, interactions)
  components/   # PostCard, PostDetail, ScreenHeader, CustomTabBar, Avatar
  screens/      # Feed, Search, CreatePost, Profile, Login, Register
  navigation/   # RootNavigator (auth stack ↔ main tabs)
  store/        # AuthContext, TabSwipeContext
  hooks/        # useViewTimeTracker
  constants/    # colors, types
```

See [CLAUDE.md](./CLAUDE.md) for the full backend API contract and design system reference.
