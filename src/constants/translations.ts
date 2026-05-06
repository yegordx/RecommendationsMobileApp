export type Language = 'ua' | 'en';

export const translations = {
  ua: {
    // ScreenHeader
    profileSettings: 'Налаштування профілю',
    profileSettingsSoon: 'Налаштування профілю поки в розробці',
    comingSoon: 'Незабаром',
    signOut: 'Вийти з акаунта',

    // FeedScreen
    feedSection: 'ЛЕНТА ПУБЛІКАЦІЙ',

    // SearchScreen
    searchPlaceholder: 'Пошук за контентом...',
    searching: 'ПОШУК...',
    results: (n: number) => `РЕЗУЛЬТАТИ: ${n}`,
    popularTopics: 'ПОПУЛЯРНІ ТЕМИ',
    nothingFound: 'Нічого не знайдено',

    // ProfileScreen
    bio: '«Дослідник, творець і любитель кави»',
    statPosts: 'пости',
    statFollowers: 'підписники',
    statFollowing: 'підписки',
    editProfile: 'Редагувати профіль',
    accountAnalytics: 'Аналітика акаунту',
    yourPosts: 'ВАШІ ЗАПИСИ',

    // LoginScreen
    passwordPlaceholder: 'Пароль',
    signIn: 'Увійти',
    noAccount: 'Немає акаунта? Зареєструватися',
    errorTitle: 'Помилка',
    loginFailed: 'Не вдалося увійти',

    // RegisterScreen
    namePlaceholder: "Ім'я",
    interests: 'ІНТЕРЕСИ',
    register: 'Зареєструватися',
    hasAccount: 'Вже є акаунт? Увійти',
    registerFailed: 'Не вдалося зареєструватися',

    // CreatePostScreen
    postPlaceholder: 'Що у вас нового?',
    tagsLabel: 'ТЕГИ',
    addTagPlaceholder: 'Додати тег...',
    publish: 'Опублікувати',
    publishFailed: 'Не вдалося опублікувати',

    // AnalyticsScreen
    back: '← Назад',
    analytics: 'Аналітика',
    totalInteractions: 'Всього взаємодій',
    topicsCount: 'Тем в інтересах',
    interactionsByType: 'ВЗАЄМОДІЇ ЗА ТИПАМИ',
    topTopics: 'ТОП ТЕМИ',
    activityDays: 'АКТИВНІСТЬ ЗА 7 ДНІВ',
    noData: 'Немає даних',
    topicsUnit: 'тем',
    typeLabels: {
      View: 'Перегляди',
      Like: 'Лайки',
      Dislike: 'Дизлайки',
      Save: 'Збережені',
      Click: 'Кліки',
    },
    lineLabels: ['Перегляди', 'Лайки', 'Збережені'],
  },
  en: {
    // ScreenHeader
    profileSettings: 'Profile Settings',
    profileSettingsSoon: 'Profile settings coming soon',
    comingSoon: 'Coming Soon',
    signOut: 'Sign Out',

    // FeedScreen
    feedSection: 'PUBLICATION FEED',

    // SearchScreen
    searchPlaceholder: 'Search by content...',
    searching: 'SEARCHING...',
    results: (n: number) => `RESULTS: ${n}`,
    popularTopics: 'POPULAR TOPICS',
    nothingFound: 'Nothing found',

    // ProfileScreen
    bio: '«Explorer, creator and coffee lover»',
    statPosts: 'posts',
    statFollowers: 'followers',
    statFollowing: 'following',
    editProfile: 'Edit Profile',
    accountAnalytics: 'Account Analytics',
    yourPosts: 'YOUR POSTS',

    // LoginScreen
    passwordPlaceholder: 'Password',
    signIn: 'Sign In',
    noAccount: 'No account? Register',
    errorTitle: 'Error',
    loginFailed: 'Failed to sign in',

    // RegisterScreen
    namePlaceholder: 'Name',
    interests: 'INTERESTS',
    register: 'Register',
    hasAccount: 'Already have an account? Sign In',
    registerFailed: 'Failed to register',

    // CreatePostScreen
    postPlaceholder: "What's new?",
    tagsLabel: 'TAGS',
    addTagPlaceholder: 'Add tag...',
    publish: 'Publish',
    publishFailed: 'Failed to publish',

    // AnalyticsScreen
    back: '← Back',
    analytics: 'Analytics',
    totalInteractions: 'Total interactions',
    topicsCount: 'Topics in interests',
    interactionsByType: 'INTERACTIONS BY TYPE',
    topTopics: 'TOP TOPICS',
    activityDays: 'ACTIVITY FOR 7 DAYS',
    noData: 'No data',
    topicsUnit: 'topics',
    typeLabels: {
      View: 'Views',
      Like: 'Likes',
      Dislike: 'Dislikes',
      Save: 'Saved',
      Click: 'Clicks',
    },
    lineLabels: ['Views', 'Likes', 'Saved'],
  },
};

export type Translations = {
  profileSettings: string;
  profileSettingsSoon: string;
  comingSoon: string;
  signOut: string;
  feedSection: string;
  searchPlaceholder: string;
  searching: string;
  results: (n: number) => string;
  popularTopics: string;
  nothingFound: string;
  bio: string;
  statPosts: string;
  statFollowers: string;
  statFollowing: string;
  editProfile: string;
  accountAnalytics: string;
  yourPosts: string;
  passwordPlaceholder: string;
  signIn: string;
  noAccount: string;
  errorTitle: string;
  loginFailed: string;
  namePlaceholder: string;
  interests: string;
  register: string;
  hasAccount: string;
  registerFailed: string;
  postPlaceholder: string;
  tagsLabel: string;
  addTagPlaceholder: string;
  publish: string;
  publishFailed: string;
  back: string;
  analytics: string;
  totalInteractions: string;
  topicsCount: string;
  interactionsByType: string;
  topTopics: string;
  activityDays: string;
  noData: string;
  topicsUnit: string;
  typeLabels: Record<string, string>;
  lineLabels: string[];
};
