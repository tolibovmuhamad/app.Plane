import type { Issue, LabelDef, Member, StateDef } from './types';

export const members: Record<string, Member> = {
  al: { initials: 'AL', color: '#6366F1', name: 'Ada Lovelace' },
  md: { initials: 'MD', color: '#0EA5E9', name: 'Maya Diaz' },
  ps: { initials: 'PS', color: '#22C55E', name: 'Priya Shah' },
  tr: { initials: 'TR', color: '#F59E0B', name: 'Tomás Rivera' },
  nv: { initials: 'NV', color: '#EC4899', name: 'Nina Volkov' },
  jk: { initials: 'JK', color: '#8B5CF6', name: 'Jon Kim' },
};

export const labelDefs: Record<string, LabelDef> = {
  bug: { name: 'bug', color: '#EF4444' },
  feature: { name: 'feature', color: '#6366F1' },
  design: { name: 'design', color: '#8B5CF6' },
  backend: { name: 'backend', color: '#3B82F6' },
  ios: { name: 'iOS', color: '#0EA5E9' },
  perf: { name: 'perf', color: '#F59E0B' },
};

export const statesList: StateDef[] = [
  { id: 'prog', name: 'In Progress', group: 'started', color: '#EAB308' },
  { id: 'review', name: 'In Review', group: 'started', color: '#3B82F6' },
  { id: 'todo', name: 'Todo', group: 'unstarted', color: '#9AA0A8' },
  { id: 'backlog', name: 'Backlog', group: 'backlog', color: '#6B7178' },
  { id: 'done', name: 'Done', group: 'completed', color: '#22C55E' },
];

export const issuesRaw: Issue[] = [
  {
    key: 'MOB-142',
    title: 'Offline mode drops queued mutations on cold start',
    priority: 'urgent',
    state: 'prog',
    labels: ['bug', 'ios'],
    due: { label: 'Jun 29', over: true },
    assignees: ['al', 'md'],
    est: 5,
    created: 'Jun 24',
    desc: [
      'Mutations queued while offline are lost when the app is force-quit before sync completes. The write-ahead log is flushed on background but not persisted to disk.',
      'Steps: go offline → complete 3 issues → force quit → reopen. Expected: mutations replay. Actual: they vanish.',
    ],
    sub: [
      { t: 'Persist WAL to SQLite on background', done: true },
      { t: 'Replay queue on cold start', done: false },
      { t: 'Add integration test for kill-during-sync', done: false },
    ],
    comments: [
      {
        u: 'md',
        t: 'Reproduced on iOS 17.4 — the WAL never hits disk because we flush on `applicationDidEnterBackground` which the OS can skip.',
        at: '2d ago',
      },
      { u: 'al', t: 'Moving the flush to a debounced write. PR up shortly.', at: '5h ago' },
    ],
  },
  {
    key: 'MOB-137',
    title: 'Redesign onboarding carousel with new illustrations',
    priority: 'high',
    state: 'prog',
    labels: ['design', 'feature'],
    due: { label: 'Jul 04', over: false },
    assignees: ['nv'],
    est: 3,
    created: 'Jun 26',
    desc: [
      'Replace the three placeholder onboarding slides with the new illustration set from the brand refresh. Animate the parallax on swipe.',
    ],
    sub: [
      { t: 'Export illustrations @3x', done: true },
      { t: 'Wire parallax transform', done: false },
    ],
    comments: [
      { u: 'nv', t: 'First two illustrations are in Figma, third needs one more review pass.', at: '1d ago' },
    ],
  },
  {
    key: 'MOB-155',
    title: 'Token refresh race condition on 401 retries',
    priority: 'high',
    state: 'prog',
    labels: ['backend'],
    due: null,
    assignees: ['tr', 'ps'],
    est: 8,
    created: 'Jun 25',
    desc: [
      'Concurrent requests that all receive a 401 each kick off their own token refresh, causing the refresh token to rotate multiple times and log the user out.',
    ],
    sub: [
      { t: 'Single-flight the refresh call', done: false },
      { t: 'Queue pending requests behind refresh', done: false },
    ],
    comments: [
      { u: 'tr', t: 'Classic thundering herd. A mutex around refresh + a subscriber queue should fix it.', at: '3d ago' },
    ],
  },
  {
    key: 'MOB-149',
    title: 'Add haptic feedback to swipe-to-complete',
    priority: 'medium',
    state: 'review',
    labels: ['ios'],
    due: { label: 'Jul 02', over: false },
    assignees: ['md'],
    est: 2,
    created: 'Jun 27',
    desc: [
      'Trigger a light impact haptic when a swipe crosses the completion threshold, and a success notification haptic on release.',
    ],
    sub: [
      { t: 'Impact at threshold', done: true },
      { t: 'Success on commit', done: true },
    ],
    comments: [
      { u: 'ps', t: 'Feels great on device. One nit: threshold haptic fires twice if you wobble at the edge.', at: '6h ago' },
    ],
  },
  {
    key: 'MOB-128',
    title: 'Push notification deep-links open wrong project',
    priority: 'high',
    state: 'review',
    labels: ['bug'],
    due: { label: 'Jun 30', over: true },
    assignees: ['al'],
    est: 3,
    created: 'Jun 23',
    desc: [
      'Tapping a push for an issue in Project A sometimes routes to the last-opened project instead. The deep-link parser reads a stale workspace context.',
    ],
    sub: [
      { t: 'Parse project id from payload', done: true },
      { t: 'Reset nav stack before push', done: true },
    ],
    comments: [
      { u: 'al', t: 'Root cause: we resolved the route before the workspace store hydrated. Fixed by awaiting hydration.', at: '1d ago' },
    ],
  },
  {
    key: 'MOB-161',
    title: 'Command palette: fuzzy match on issue keys',
    priority: 'medium',
    state: 'todo',
    labels: ['feature'],
    due: { label: 'Jul 08', over: false },
    assignees: ['tr'],
    est: 3,
    created: 'Jun 28',
    desc: [
      'Let users type "142" or "mob142" and match MOB-142 in the palette. Weight exact key prefix matches above title matches.',
    ],
    sub: [
      { t: 'Normalize key input', done: false },
      { t: 'Score + rank results', done: false },
    ],
    comments: [],
  },
  {
    key: 'MOB-158',
    title: 'Empty state illustration for filtered board view',
    priority: 'low',
    state: 'todo',
    labels: ['design'],
    due: null,
    assignees: ['nv', 'ps'],
    est: 2,
    created: 'Jun 28',
    desc: [
      'When filters return no issues, show a friendly empty state with a "Clear filters" action instead of a blank column.',
    ],
    sub: [
      { t: 'Illustration', done: false },
      { t: 'Clear-filters CTA', done: false },
    ],
    comments: [],
  },
  {
    key: 'MOB-163',
    title: 'Cache avatar images with stale-while-revalidate',
    priority: 'medium',
    state: 'todo',
    labels: ['perf', 'ios'],
    due: { label: 'Jul 11', over: false },
    assignees: ['md'],
    est: 5,
    created: 'Jun 29',
    desc: [
      'Avatars re-fetch on every screen. Add a disk cache with a stale-while-revalidate policy and a 24h max age.',
    ],
    sub: [
      { t: 'Disk cache layer', done: false },
      { t: 'SWR policy', done: false },
    ],
    comments: [],
  },
  {
    key: 'MOB-166',
    title: 'Support markdown tables in issue descriptions',
    priority: 'low',
    state: 'backlog',
    labels: ['feature'],
    due: null,
    assignees: ['jk'],
    est: 5,
    created: 'Jun 20',
    desc: ['Render GitHub-flavored markdown tables in issue descriptions and comments.'],
    sub: [],
    comments: [],
  },
  {
    key: 'MOB-170',
    title: 'Investigate 60fps drop on large boards (Android)',
    priority: 'medium',
    state: 'backlog',
    labels: ['perf'],
    due: null,
    assignees: ['tr', 'al'],
    est: 8,
    created: 'Jun 18',
    desc: [
      'Boards with 200+ cards drop below 60fps while scrolling on mid-tier Android. Profile and identify the bottleneck.',
    ],
    sub: [],
    comments: [],
  },
  {
    key: 'MOB-171',
    title: 'Localize date chips for RTL locales',
    priority: 'none',
    state: 'backlog',
    labels: [],
    due: null,
    assignees: ['ps'],
    est: 2,
    created: 'Jun 15',
    desc: ['Date chips render LTR in Arabic/Hebrew. Mirror the icon and use locale-aware formatting.'],
    sub: [],
    comments: [],
  },
  {
    key: 'MOB-119',
    title: 'Migrate settings screen to new form primitives',
    priority: 'medium',
    state: 'done',
    labels: ['ios'],
    due: null,
    assignees: ['nv'],
    est: 5,
    created: 'Jun 10',
    desc: ['Port the settings screen from the legacy form components to the new primitives.'],
    sub: [
      { t: 'Migrate toggles', done: true },
      { t: 'Migrate pickers', done: true },
    ],
    comments: [{ u: 'nv', t: 'Shipped in 3.4. Closing.', at: '4d ago' }],
  },
  {
    key: 'MOB-124',
    title: 'Fix keyboard overlap on comment composer',
    priority: 'high',
    state: 'done',
    labels: ['bug', 'ios'],
    due: null,
    assignees: ['md', 'al'],
    est: 3,
    created: 'Jun 12',
    desc: ['The keyboard covers the comment input on smaller devices. Add keyboard-avoidance to the composer.'],
    sub: [{ t: 'Keyboard-avoiding view', done: true }],
    comments: [{ u: 'al', t: 'Verified on SE and 15 Pro. Good to go.', at: '5d ago' }],
  },
];

export const navConfig = [
  { id: 'home', label: 'Home', icon: 'home', page: 'home' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox', page: 'inbox' },
  { id: 'projects', label: 'Projects', icon: 'grid', page: 'projects' },
] as const;

export const projectConfig = [
  { name: 'Mobile App', identifier: 'MOB', dot: '#6366F1', active: true },
  { name: 'Web Client', identifier: 'WEB', dot: '#0EA5E9', active: false },
  { name: 'Platform API', identifier: 'API', dot: '#22C55E', active: false },
];

export const railConfig = [
  { id: 'projects', label: 'Projects', icon: 'grid' },
  { id: 'chat', label: 'Chat', icon: 'chat' },
  { id: 'wiki', label: 'Wiki', icon: 'wiki' },
  { id: 'ai', label: 'AI', icon: 'sparkle' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
] as const;

export const settingsNav = [
  { id: 'general', label: 'General', icon: 'general' },
  { id: 'members', label: 'Members', icon: 'members' },
  { id: 'billing', label: 'Billing and plans', icon: 'billing' },
  { id: 'imports', label: 'Imports', icon: 'imports' },
  { id: 'exports', label: 'Exports', icon: 'exports' },
  { id: 'worklogs', label: 'Worklogs', icon: 'worklogs' },
  { id: 'identity', label: 'Identity', icon: 'identity' },
] as const;

export type SettingsSection = (typeof settingsNav)[number]['id'];
