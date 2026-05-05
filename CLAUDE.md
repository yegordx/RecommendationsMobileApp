# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React Native + Expo mobile client for a news recommender system. This is one part of a larger system:

- **Backend API** — ASP.NET Core 8, runs at `http://localhost:5241` (or `http://<wifi-ip>:5241` from a physical device)
- **Recommendation API** — Python FastAPI at `http://localhost:8000` (internal, not called by mobile)
- **Database** — PostgreSQL 16 with pgvector (Docker)

## Tech Stack

- React Native with Expo SDK
- TypeScript
- React Navigation (bottom tab + stack navigator)
- AsyncStorage for JWT token persistence

## Commands

```bash
npx expo start             # start dev server (opens QR for Expo Go)
npx expo start --android   # launch Android emulator
npx expo start --ios       # launch iOS simulator (macOS only)
npx tsc --noEmit           # type-check without emitting
npx eslint .               # lint
```

## App Structure

Recommended source layout once initialized:

```
src/
  api/          # axios/fetch wrappers, one file per resource (auth, posts, tags, recommendations)
  components/   # shared UI (PostCard, Avatar, ScreenHeader, TabBar)
  screens/      # one file per screen (FeedScreen, SearchScreen, CreatePostScreen, ProfileScreen, LoginScreen, RegisterScreen)
  navigation/   # RootNavigator (auth stack + main tab navigator)
  store/        # auth state (token, userId, name) — React Context or Zustand
  hooks/        # usePosts, useInteractions, useAuth, etc.
  constants/    # colors, spacing, typography tokens
```

Screens:

- **Feed** — main screen, paginated post list, like/save interactions
- **Search** — search posts, browse KeyTag categories
- **Create Post** — simple textarea + publish button (stub)
- **Profile** — user's own posts, edit profile
- **Login** — email + password
- **Register** — name, email, password + KeyTag interest selection

Navigation: bottom tab bar (pill-shaped floating), swipe between tabs. Auth stack (Login/Register) is separate from the main tab navigator; the root navigator swaps between them based on token presence.

UI design mockups are in `designs/` (FYPjpg.jpg, Profile.jpg, Search.jpg).

## Backend API Contract

Base URL: `http://localhost:5241` (Windows/emulator) or `http://<wifi-ip>:5241` (Expo Go on physical phone).

Store the JWT token from login/register in AsyncStorage, send it as `Authorization: Bearer <token>` on all authenticated endpoints.

### Auth (no token needed)

```
POST /api/auth/register
Body: { name: string, email: string, password: string, keyTagIds?: number[] }
Response: { token: string, userId: number, name: string, email: string }

POST /api/auth/login
Body: { email: string, password: string }
Response: { token: string, userId: number, name: string, email: string }
```

### Posts

```
GET  /api/posts?page=1&pageSize=20       → PostResponse[]    (public)
GET  /api/posts/{id}                     → PostResponse      (public)
POST /api/posts                          → PostResponse      (auth)
     Body: { body: string }
DELETE /api/posts/{id}                   → 204               (auth, owner only)
```

PostResponse shape:

```ts
type PostResponse = {
  id: number;
  body: string;
  ownerId: number;
  ownerName: string;
  createdAt: string; // ISO 8601
  clusterTags: { id: number; name: string }[];
};
```

### Interactions (auth)

```
POST /api/interactions
Body: { postId: number, interactionType: number, viewDurationSeconds?: number }
Response: InteractionResponse

GET /api/interactions/my → InteractionResponse[]
```

InteractionType enum:

- 1 = View
- 2 = Click
- 3 = Like
- 4 = Dislike
- 5 = Save

### Tags (public read)

```
GET /api/tags/keys                     → { id: number, name: string }[]
GET /api/tags/clusters?keyTagId=<id>   → { id: number, name: string, keyTagId: number }[]
```

KeyTags are broad categories (e.g. Sports, Tech). ClusterTags are mid-level topics under each KeyTag. Users select KeyTagIds at registration to seed their interest profile.

### Recommendations (auth)

```
GET /api/recommendations/fyp?count=20  → PostResponse[]
```

Returns personalized feed ordered by relevance + freshness. Falls back to trending posts for new users.

## Design System

### Global

- **Color scheme**: dark theme only. Background `#1a1a1a` (near-black), card background `#242424`, text white `#ffffff`, secondary text `#888888`.
- **Typography**: bold large title top-left ("сегодня"), section labels in small uppercase gray (`ЛЕНТА ПУБЛИКАЦИЙ`, `ПОПУЛЯРНЫЕ ТЕМЫ`, `ВАШИ ЗАПИСИ`).
- **Corner radius**: cards have ~12px radius. Bottom nav pill has ~28px radius (very rounded). Avatar has ~18px radius (squircle shape, not circle).
- **Accent color**: blue `#4A90E2` used for hashtag text, trending arrow icons, and avatar border gradient.
- **Logo**: flower logo in `assets/logo.png`. Used in auth screens (Login/Register) as the app logo. The header of every main screen shows the text "сегодня" (bold, white, large) top-left — NOT the logo image.

### Header (all main screens)

```
[сегодня]  (bold, ~28px, white, top-left)
[• АКТИВНОСТЬ]  (small, gray, below title — blue dot prefix)
                                    [🔔]  [⚙️]  (top-right icons)
```

- Bell (notifications) and gear (settings) icons are always top-right on every main screen.
- These are NOT part of the bottom tab bar — they are in the screen header.

### Bottom Tab Bar

Pill-shaped floating bar, dark background (`#2a2a2a`), sits above the bottom safe area. Four tabs:

```
[ ⊞ Feed ]  [ 🔍 Search ]  [ + Create ]  [ 👤 Profile ]
```

- **Active tab**: the icon+background gets a white filled pill highlight (white bg, dark icon).
- **Inactive tabs**: icon only, gray color, no background.
- **Create (+) button**: same size as other tabs in the bar — it is NOT oversized or a floating FAB. It's a `+` text/icon, same pill style as others when active.
- Navigation between tabs supports swipe gesture as well as tap.

### Feed Screen

```
Header (сегодня / АКТИВНОСТЬ / bell / gear)

Section label: ЛЕНТА ПУБЛИКАЦИЙ  (small, gray, uppercase)

PostCard:
┌─────────────────────────────────────┐
│ [Avatar]  @username        2ч назад │
│                                     │
│  Post body text, multi-line,        │
│  white, regular weight              │
│                                     │
│  #hashtag1  #hashtag2  (blue)       │
│                                     │
│  ♡ 1.2K    💬 256                  │
└─────────────────────────────────────┘
```

- **Avatar**: square with rounded corners (~18px radius), filled with a solid color (auto-generated from username initial), shows first letter of username in white. No real photo.
- **Username**: `@handle` format, white, bold.
- **Timestamp**: top-right of card, small gray text (`2ч назад`, `5ч назад`).
- **Post body**: white text, no truncation for short posts. Wrap naturally.
- **Hashtags**: blue (`#4A90E2`), below body text.
- **Like icon** (♡): outline heart when not liked. Filled red/accent heart when liked (toggled by tap). Count next to it.
- **Comment icon** (💬): speech bubble, gray. Count next to it. Tapping a comment opens post detail (not yet implemented — stub is fine).
- Cards have subtle border or slightly lighter bg than screen background.
- Feed is a `FlatList`, paginated (`page` + `pageSize=20`), pull-to-refresh supported.

### Search Screen

```
Header (сегодня / АКТИВНОСТЬ / bell / gear)

[ 🔍  Поиск по контенту... ]  (search input, dark bg, rounded, full width)

Section label: ПОПУЛЯРНЫЕ ТЕМЫ  (small, gray, uppercase)

┌─────────────────────────────────┐
│  #дизайн_системы           ↗   │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  #путешествия2024          ↗   │
└─────────────────────────────────┘
```

- Search bar: dark rounded input, gray placeholder, search icon on left.
- Trending topics list: full-width rows, dark card bg, hashtag name on left, blue trending arrow (`↗`) on right.
- Tapping a trending topic filters the feed by that hashtag (or navigates to filtered results).
- Topics are `ClusterTag` names from `GET /api/tags/clusters`.

### Profile Screen

```
Header (сегодня / АКТИВНОСТЬ / bell / gear)

         [Avatar — large squircle, ~80px, gradient border]
              @user_profile
         «Исследователь, творец и любитель кофе»

    256          1.2K          130
   посты      подписчики    подписки

  [ Редактировать профиль ]  (white pill button, full width)

Section label: ВАШИ ЗАПИСИ  (small, gray, uppercase)

PostCard (same as Feed cards, but only user's own posts)
```

- **Avatar**: large squircle (~80px), purple-to-blue gradient border/glow, person icon placeholder if no photo.
- **Username**: `@handle`, white, bold, centered.
- **Bio**: italic gray text, centered, below username.
- **Stats row**: three columns — посты / подписчики / подписки. Numbers bold white, labels small gray.
- **Edit Profile button**: white background, dark text, fully rounded pill, full-width (with horizontal padding).
- **Posts section**: same `PostCard` component as Feed, filtered to `ownerId == currentUserId`.
- The Profile tab is active when on this screen (white pill in bottom nav on the Profile icon).

### Login Screen

```
[Flower logo — centered, large]
[App name or tagline]

[ Email input ]
[ Password input ]

[ Войти ]  (primary button)

[ Нет аккаунта? Зарегистрироваться ]  (link)
```

- Full dark background, logo centered upper half.
- Inputs: dark rounded, white text, gray placeholder.
- Primary button: white bg, dark text, fully rounded.

### Register Screen

Same layout as Login plus:

- Name input (above email)
- After basic fields: scrollable list of `KeyTag` chips to select interests (fetched from `GET /api/tags/keys`)
- Selected chips highlighted with accent color
- `keyTagIds` sent with register request

### Create Post Screen (stub)

```
[ Textarea — "Что у вас нового?" placeholder, dark, full width, tall ]

[ Опубликовать ]  (primary button, bottom)
```

- Simple screen, no media upload yet.
- On submit: `POST /api/posts` with `{ body }`, navigate back to Feed on success.

## Auth Flow

1. Check AsyncStorage for token on app start
2. If token present → navigate to Feed; if not → navigate to Login
3. On login/register success → save `{ token, userId, name, email }` to AsyncStorage
4. On 401 response → clear token, redirect to Login
5. No refresh token yet — token expiry is 60 minutes (from `JwtSettings.ExpiryMinutes` in backend)
