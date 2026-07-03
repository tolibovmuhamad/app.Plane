import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type * as React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { issuesRaw, members, navConfig, settingsNav, statesList } from './data';
import type { SettingsSection } from './data';
import { Avatars, AvatarStack, LabelPills, Pills } from './primitives';
import type { AvatarItem } from './primitives';
import { CheckIcon, Icon, PriorityIcon, StateIcon } from './icons';
import type { Issue, Page, PriorityId, StateDef, Theme } from './types';
import { useAuthStore } from '@/stores/auth.store';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { useSession } from '@/features/auth/useSession';
import { authApi } from '@/api/endpoints/auth';
import { workspacesApi } from '@/api/endpoints/workspaces';
import { projectsApi } from '@/api/endpoints/projects';
import { statesApi } from '@/api/endpoints/states';
import { labelsApi } from '@/api/endpoints/labels';
import { membersApi } from '@/api/endpoints/members';
import { usersApi } from '@/api/endpoints/users';
import { aiApi } from '@/api/endpoints/ai';
import type { AiTone } from '@/api/endpoints/ai';
import { projectMembersApi } from '@/api/endpoints/projectMembers';
import type { ProjectRole } from '@/api/endpoints/projectMembers';
import { invitesApi } from '@/api/endpoints/invites';
import { notificationsApi } from '@/api/endpoints/notifications';
import { issuesApi } from '@/api/endpoints/issues';
import { commentsApi } from '@/api/endpoints/comments';
import { parseApiError } from '@/lib/apiError';
import type { ApiIssue, IssueRef, Notification as ApiNotification, State as ApiState } from '@/api/types';

/** Роли участника воркспейса (как в контракте бэкенда). */
type WsRole = 'admin' | 'member' | 'guest';

const AVATAR_COLORS = ['#6366F1', '#0EA5E9', '#22C55E', '#F59E0B', '#EC4899', '#8B5CF6', '#EF4444', '#14B8A6'];
function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

/** Разбирает ссылку-приглашение `/invites/:token` из адреса страницы. */
function parseInviteToken(): string | null {
  const m = window.location.pathname.match(/^\/invites\/([^/]+)\/?$/);
  return m ? decodeURIComponent(m[1]) : null;
}

/** Убирает `/invites/:token` из адреса, не перезагружая страницу. */
function clearInviteUrl(): void {
  if (parseInviteToken()) window.history.replaceState(null, '', '/');
}

/** ISO-дата → "Jul 04". */
function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  } catch {
    return iso;
  }
}

/** ISO-дата → относительное «5m / 2h / 3d / Jul 04». */
function relTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const sec = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (sec < 60) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d`;
  return fmtDate(iso);
}

/** Палитра точек проектов (бэкенд цвет не хранит — назначаем по порядку). */
const PROJECT_COLORS = ['#6366F1', '#0EA5E9', '#22C55E', '#F59E0B', '#EC4899', '#8B5CF6'];
const projectColor = (i: number): string => PROJECT_COLORS[i % PROJECT_COLORS.length];

/** "Ada Lovelace" → "AL", "Ada" → "AD". */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0] || '?').slice(0, 2).toUpperCase();
}

const themeBase: Record<Theme, Record<string, string>> = {
  dark: {
    '--bg-app': '#0B0C0E',
    '--bg-surface': '#131417',
    '--bg-elevated': '#1A1C20',
    '--border': '#26282D',
    '--border-strong': '#33363C',
    '--text-primary': '#E7E9EC',
    '--text-secondary': '#9AA0A8',
    '--text-muted': '#6B7178',
    '--shadow': '0 16px 48px -12px rgba(0,0,0,.6)',
  },
  light: {
    '--bg-app': '#FFFFFF',
    '--bg-surface': '#F7F8FA',
    '--bg-elevated': '#FFFFFF',
    '--border': '#E9EAEE',
    '--border-strong': '#DADCE2',
    '--text-primary': '#16181B',
    '--text-secondary': '#5C6169',
    '--text-muted': '#8A9099',
    '--shadow': '0 16px 40px -14px rgba(20,22,30,.22)',
  },
};

function hexToRgb(hex: string): [number, number, number] {
  let h = (hex || '').replace('#', '');
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rootStyle(theme: Theme, accent: string): CSSProperties {
  const [r, g, b] = hexToRgb(accent);
  const dk = (x: number) => Math.round(x * 0.88);
  return {
    ...themeBase[theme],
    '--accent': accent,
    '--accent-hover': `rgb(${dk(r)},${dk(g)},${dk(b)})`,
    '--accent-subtle': `rgba(${r},${g},${b},.13)`,
    fontFamily: 'Geist, system-ui, sans-serif',
    background: 'var(--bg-app)',
    color: 'var(--text-primary)',
    minHeight: '100vh',
    fontSize: '13px',
    lineHeight: 1.5,
    WebkitFontSmoothing: 'antialiased',
    letterSpacing: '-0.006em',
  } as CSSProperties;
}

export interface IssueRow {
  key: string;
  title: string;
  priorityIcon: ReactNode;
  stateIcon: ReactNode;
  labelPills: ReactNode;
  avatars: ReactNode;
  due: string | null;
  dueColor: string;
  dueBg: string;
  open: () => void;
}

interface UseTaskFlowOptions {
  accent?: string;
  theme?: Theme;
  startInApp?: boolean;
}

function dueColorOf(i: Issue): string {
  return i.due && i.due.over ? '#EF4444' : 'var(--text-muted)';
}
function dueBgOf(i: Issue): string {
  return i.due && i.due.over ? 'rgba(239,68,68,.10)' : 'transparent';
}

export function useTaskFlow(opts: UseTaskFlowOptions = {}) {
  const accent = opts.accent ?? '#6366F1';
  const { login, register, logout } = useSession();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  // Уже есть валидный refresh-токен в localStorage → открываем приложение сразу.
  const bootAuthed = useState(() => opts.startInApp || useAuthStore.getState().isAuthenticated)[0];
  // Ссылка-приглашение `/invites/:token` в адресе → отдельный экран приёма инвайта.
  const [inviteToken] = useState<string | null>(parseInviteToken);

  const [view, setView] = useState<'auth' | 'app' | 'invite'>(
    inviteToken ? 'invite' : bootAuthed ? 'app' : 'auth',
  );
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [theme, setTheme] = useState<Theme>(opts.theme === 'light' ? 'light' : 'dark');
  const [loading, setLoading] = useState(bootAuthed);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selIdx, setSelIdx] = useState(0);
  const [listView, setListView] = useState<'list' | 'board'>('list');
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [stateOverrides, setStateOverrides] = useState<Record<string, string>>({});
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dragCol, setDragCol] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [extraComments, setExtraComments] = useState<Record<string, { u: string; t: string; at: string }[]>>({});
  const [subToggles, setSubToggles] = useState<Record<string, boolean>>({});
  const [statusMenu, setStatusMenu] = useState(false);
  const [page, setPage] = useState<Page>('home');
  const [settingsSection, setSettingsSection] = useState<SettingsSection>('general');
  const [wsMenuOpen, setWsMenuOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<WsRole>('member');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteNotice, setInviteNotice] = useState<string | null>(null);
  const [invitePicked, setInvitePicked] = useState(false);
  const [inviteQueryDebounced, setInviteQueryDebounced] = useState('');
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [projName, setProjName] = useState('');
  const [projIdentifier, setProjIdentifier] = useState('');
  const [projIdEdited, setProjIdEdited] = useState(false);
  const [projError, setProjError] = useState<string | null>(null);
  const [projFieldErrors, setProjFieldErrors] = useState<Record<string, string>>({});
  const [createWsOpen, setCreateWsOpen] = useState(false);
  const [wsName, setWsName] = useState('');
  const [wsSlugInput, setWsSlugInput] = useState('');
  const [wsSlugEdited, setWsSlugEdited] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const [wsFieldErrors, setWsFieldErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState<AiTone>('professional');
  const [aiMessages, setAiMessages] = useState<{ id: string; role: 'user' | 'ai'; text: string }[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiCopiedId, setAiCopiedId] = useState<string | null>(null);
  const [projMembersOpen, setProjMembersOpen] = useState(false);
  const [pmUserId, setPmUserId] = useState('');
  const [pmRole, setPmRole] = useState<ProjectRole>('member');
  const [pmError, setPmError] = useState<string | null>(null);
  const [inviteAcceptError, setInviteAcceptError] = useState<string | null>(null);
  const [deleteWsOpen, setDeleteWsOpen] = useState(false);
  const [deleteWsError, setDeleteWsError] = useState<string | null>(null);
  const [createIssueOpen, setCreateIssueOpen] = useState(false);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [issuePriority, setIssuePriority] = useState('none');
  const [issueStateId, setIssueStateId] = useState('');
  const [issueError, setIssueError] = useState<string | null>(null);
  const [deleteIssueTarget, setDeleteIssueTarget] = useState<{ id: string; key: string } | null>(null);
  const [deleteIssueError, setDeleteIssueError] = useState<string | null>(null);

  const paletteInputRef = useRef<HTMLInputElement>(null);

  const issuesData = useMemo<Issue[]>(
    () => issuesRaw.map((i) => (stateOverrides[i.key] ? { ...i, state: stateOverrides[i.key] } : i)),
    [stateOverrides],
  );
  const issueByKey = useCallback((k: string) => issuesData.find((i) => i.key === k) ?? null, [issuesData]);
  const stateById = useCallback((id: string): StateDef | undefined => statesList.find((s) => s.id === id), []);

  const runSkeleton = useCallback(() => {
    setTimeout(() => setLoading(false), 950);
  }, []);

  const openPalette = useCallback(() => {
    setPaletteOpen(true);
    setQuery('');
    setSelIdx(0);
    setTimeout(() => paletteInputRef.current?.focus(), 20);
  }, []);

  const flatPalette = useCallback(() => {
    const q = query.trim().toLowerCase();
    const nav = [
      { type: 'nav', icon: 'issues', label: 'Go to My Issues' },
      { type: 'nav', icon: 'home', label: 'Go to Home' },
      { type: 'nav', icon: 'inbox', label: 'Go to Notifications', hint: '3 unread' },
      { type: 'action', icon: 'plus', label: 'Create new issue', hint: 'C' },
      { type: 'action', icon: 'theme', label: 'Toggle theme' },
    ].filter((c) => !q || c.label.toLowerCase().includes(q));
    const issues = issuesData
      .filter((i) => !q || i.title.toLowerCase().includes(q) || i.key.toLowerCase().includes(q))
      .slice(0, q ? 6 : 4)
      .map((i) => ({ type: 'issue', key: i.key, label: i.title, priority: i.priority as PriorityId }));
    return [...nav, ...issues];
  }, [query, issuesData]);

  // Latest-state ref so the keydown listener binds once but reads fresh values.
  const live = useRef({ view, openKey, paletteOpen, flatPalette, selIdx, openPalette });
  live.current = { view, openKey, paletteOpen, flatPalette, selIdx, openPalette };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = live.current;
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === 'k') {
        e.preventDefault();
        if (s.view === 'app') s.openPalette();
        return;
      }
      if (s.openKey && !s.paletteOpen && k === 'escape') {
        e.preventDefault();
        setOpenKey(null);
        return;
      }
      if (s.paletteOpen) {
        const flat = s.flatPalette();
        if (k === 'escape') {
          e.preventDefault();
          setPaletteOpen(false);
        } else if (k === 'arrowdown') {
          e.preventDefault();
          if (flat.length) setSelIdx((i) => (i + 1 + flat.length) % flat.length);
        } else if (k === 'arrowup') {
          e.preventDefault();
          if (flat.length) setSelIdx((i) => (i - 1 + flat.length) % flat.length);
        } else if (k === 'enter') {
          e.preventDefault();
          setPaletteOpen(false);
        }
        return;
      }
      if (
        s.view === 'app' &&
        k === '/' &&
        document.activeElement &&
        document.activeElement.tagName !== 'INPUT'
      ) {
        e.preventDefault();
        s.openPalette();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Показываем скелетон при загрузке приложения с уже поднятой сессией.
  useEffect(() => {
    if (bootAuthed) runSkeleton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // После перезагрузки в памяти только refresh-токен → тянем профиль (запрос
  // на /auth/me при отсутствии access-токена сам пройдёт через refresh-and-retry).
  useEffect(() => {
    if (bootAuthed && !useAuthStore.getState().user) {
      authApi
        .me()
        .then(setUser)
        .catch(() => {
          /* сессия протухла — client.ts уже уводит на экран входа */
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitAuth = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError(null);
      setFieldErrors({});
      setSubmitting(true);
      try {
        if (mode === 'register') {
          await register({ email: email.trim(), password: pass, display_name: name.trim() });
        } else {
          await login({ email: email.trim(), password: pass });
        }
        setSubmitting(false);
        // Пришли по ссылке-приглашению → остаёмся на экране инвайта, где теперь
        // (уже авторизованному) покажется кнопка «Accept invitation».
        if (inviteToken) return;
        setView('app');
        setPage('home');
        setLoading(true);
        runSkeleton();
      } catch (err) {
        const parsed = parseApiError(err);
        setAuthError(parsed.message);
        setFieldErrors(parsed.fieldErrors);
        setSubmitting(false);
      }
    },
    [mode, email, pass, name, login, register, runSkeleton, inviteToken],
  );

  const doLogout = useCallback(async () => {
    await logout();
    setView('auth');
    setMode('login');
    setName('');
    setEmail('');
    setPass('');
    setAuthError(null);
    setFieldErrors({});
    setOpenKey(null);
    setPaletteOpen(false);
    setPage('home');
  }, [logout]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  const toggleGroup = useCallback(
    (id: string) => setCollapsed((c) => ({ ...c, [id]: !c[id] })),
    [],
  );
  const openIssue = useCallback((key: string) => setOpenKey(key), []);
  const closeIssue = useCallback(() => setOpenKey(null), []);

  const onDragStart = (key: string, colId: string) => (e: React.DragEvent) => {
    setDragKey(key);
    setDragCol(colId);
    try {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', key);
    } catch {
      /* noop */
    }
  };
  const onDragEnd = () => {
    setDragKey(null);
    setDragCol(null);
  };
  const onColDragOver = (colId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    try {
      e.dataTransfer.dropEffect = 'move';
    } catch {
      /* noop */
    }
    if (dragCol !== colId) setDragCol(colId);
  };
  const onColDrop = (colId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragKey) {
      setStateOverrides((o) => ({ ...o, [dragKey]: colId }));
      setDragKey(null);
      setDragCol(null);
    }
  };

  const addComment = (e: React.FormEvent) => {
    e.preventDefault();
    const key = openKey;
    const txt = draft.trim();
    if (!key || !txt) return;
    setDraft('');
    setExtraComments((ec) => ({ ...ec, [key]: [...(ec[key] || []), { u: 'al', t: txt, at: 'just now' }] }));
  };
  const toggleSub = (key: string, idx: number) => {
    const k = key + '#' + idx;
    setSubToggles((s) => ({ ...s, [k]: !s[k] }));
  };
  const subDone = (issueKey: string, x: { done: boolean }, idx: number) => {
    const k = issueKey + '#' + idx;
    return subToggles[k] !== undefined ? subToggles[k] : x.done;
  };

  const isRegister = mode === 'register';

  // ---- воркспейсы и проекты (реальные данные через TanStack Query) ----
  const inApp = view === 'app';
  const currentWorkspaceSlug = useWorkspaceStore((s) => s.currentWorkspaceSlug);
  const setWorkspace = useWorkspaceStore((s) => s.setWorkspace);
  const currentProjectId = useWorkspaceStore((s) => s.currentProjectId);
  const setProject = useWorkspaceStore((s) => s.setProject);

  const workspacesQ = useQuery({ queryKey: ['workspaces'], queryFn: workspacesApi.list, enabled: inApp });
  const workspaces = useMemo(() => workspacesQ.data ?? [], [workspacesQ.data]);
  const currentWs =
    workspaces.find((w) => w.slug === currentWorkspaceSlug) ?? workspaces[0] ?? null;

  // Выбираем первый воркспейс по умолчанию, как только список загрузился.
  useEffect(() => {
    if (currentWs && currentWorkspaceSlug !== currentWs.slug) setWorkspace(currentWs.slug);
  }, [currentWs, currentWorkspaceSlug, setWorkspace]);

  const projectsQ = useQuery({
    queryKey: ['workspaces', currentWs?.slug, 'projects'],
    queryFn: () => projectsApi.list(currentWs!.slug),
    enabled: inApp && !!currentWs,
  });
  const projectsData = useMemo(() => projectsQ.data ?? [], [projectsQ.data]);
  const currentProject = projectsData.find((p) => p.id === currentProjectId) ?? null;
  const currentProjectIdx = currentProject
    ? projectsData.findIndex((p) => p.id === currentProject.id)
    : 0;

  const openProject = useCallback(
    (id: string) => {
      setProject(id);
      setPage('issues');
    },
    [setProject],
  );

  const isOwner = !!(currentWs && user && currentWs.owner_id === user.id);

  const rowOf = useCallback(
    (i: Issue): IssueRow => ({
      key: i.key,
      title: i.title,
      priorityIcon: <PriorityIcon p={i.priority} />,
      stateIcon: <StateIcon st={stateById(i.state)!} />,
      labelPills: <LabelPills ids={i.labels} />,
      avatars: <Avatars ids={i.assignees} />,
      due: i.due ? i.due.label : null,
      dueColor: dueColorOf(i),
      dueBg: dueBgOf(i),
      open: () => openIssue(i.key),
    }),
    [stateById, openIssue],
  );

  // ---- list groups ----
  const groups = statesList
    .map((st) => {
      const items = issuesData.filter((i) => i.state === st.id);
      const open = !collapsed[st.id];
      return {
        id: st.id,
        name: st.name,
        color: st.color,
        icon: <StateIcon st={st} />,
        count: items.length,
        open,
        chevron: open ? 'rotate(90deg)' : 'rotate(0deg)',
        toggle: () => toggleGroup(st.id),
        issues: items.map(rowOf),
      };
    })
    .filter((g) => g.count > 0);

  // ---- board columns ----
  const boardCols = statesList.map((st) => {
    const items = issuesData.filter((i) => i.state === st.id);
    return {
      id: st.id,
      name: st.name,
      color: st.color,
      icon: <StateIcon st={st} />,
      count: items.length,
      colBg: dragCol === st.id && dragKey ? 'var(--bg-surface)' : 'transparent',
      colBorder: dragCol === st.id && dragKey ? '1px dashed var(--accent)' : '1px solid transparent',
      onDragOver: onColDragOver(st.id),
      onDrop: onColDrop(st.id),
      empty: items.length === 0,
      cards: items.map((i) => ({
        ...rowOf(i),
        opacity: dragKey === i.key ? 0.4 : 1,
        onDragStart: onDragStart(i.key, st.id),
        onDragEnd,
      })),
    };
  });

  // ---- issue detail ----
  let detail: ReturnType<typeof buildDetail> | null = null;
  function buildDetail(i: Issue) {
    const st = stateById(i.state)!;
    const extra = extraComments[i.key] || [];
    const comments = [...(i.comments || []), ...extra];
    const subs = (i.sub || []).map((x, idx) => {
      const done = subDone(i.key, x, idx);
      return {
        t: x.t,
        done,
        icon: <CheckIcon done={done} />,
        toggle: () => toggleSub(i.key, idx),
        color: done ? 'var(--text-muted)' : 'var(--text-primary)',
        deco: done ? 'line-through' : 'none',
      };
    });
    const doneCount = subs.filter((x) => x.done).length;
    return {
      key: i.key,
      title: i.title,
      priorityIcon: <PriorityIcon p={i.priority} />,
      priorityLabel: ({ urgent: 'Urgent', high: 'High', medium: 'Medium', low: 'Low', none: 'No priority' } as const)[i.priority],
      stateIcon: <StateIcon st={st} />,
      stateName: st.name,
      labelPills: <LabelPills ids={i.labels} />,
      hasLabels: (i.labels || []).length > 0,
      desc: i.desc || [],
      subs,
      hasSub: subs.length > 0,
      subDone: doneCount,
      subTotal: subs.length,
      subPct: subs.length ? Math.round((doneCount / subs.length) * 100) + '%' : '0%',
      comments: comments.map((c) => {
        const m = members[c.u] || { initials: '', color: '#333', name: '' };
        return { initials: m.initials, avColor: m.color, name: m.name, t: c.t, at: c.at };
      }),
      commentCount: comments.length,
      assignees: (i.assignees || []).map((id) => {
        const m = members[id] || { initials: '', color: '#333', name: '' };
        return { initials: m.initials, color: m.color, name: m.name };
      }),
      est: i.est,
      created: i.created,
      due: i.due ? i.due.label : null,
      dueColor: i.due && i.due.over ? '#EF4444' : 'var(--text-primary)',
      statusMenu,
      toggleStatusMenu: () => setStatusMenu((v) => !v),
      statusOptions: statesList.map((x) => ({
        name: x.name,
        icon: <StateIcon st={x} />,
        active: x.id === i.state,
        bg: x.id === i.state ? 'var(--bg-surface)' : 'transparent',
        choose: () => {
          setStateOverrides((o) => ({ ...o, [i.key]: x.id }));
          setStatusMenu(false);
        },
      })),
    };
  }
  if (openKey) {
    const i = issueByKey(openKey);
    if (i) detail = buildDetail(i);
  }

  // ================= РЕАЛЬНЫЕ ЗАДАЧИ (страница Issues) =================
  const qc = useQueryClient();

  // ================= ПРИЁМ ПРИГЛАШЕНИЯ (`/invites/:token`) =================
  const inviteQ = useQuery({
    queryKey: ['invite', inviteToken],
    queryFn: () => invitesApi.get(inviteToken!),
    enabled: !!inviteToken,
    retry: false,
    staleTime: Infinity,
  });

  // Подставляем e-mail из приглашения в форму входа (принять инвайт может только он).
  useEffect(() => {
    const em = inviteQ.data?.email;
    if (em && !isAuthed) setEmail((cur) => cur || em);
  }, [inviteQ.data, isAuthed]);

  const acceptInviteMutation = useMutation({
    mutationFn: () => invitesApi.accept(inviteToken!),
    onSuccess: async () => {
      // Новый воркспейс появился в списке — обновляем и делаем его текущим.
      await qc.invalidateQueries({ queryKey: ['workspaces'] });
      const slug = inviteQ.data?.workspace.slug;
      if (slug) setWorkspace(slug);
      clearInviteUrl();
      setInviteAcceptError(null);
      setView('app');
      setPage('home');
      setLoading(true);
      runSkeleton();
    },
    onError: (err) => {
      const p = parseApiError(err);
      setInviteAcceptError(`${p.message}${p.status ? ` [${p.code} · HTTP ${p.status}]` : ''}`);
    },
  });
  const dismissInvite = () => {
    clearInviteUrl();
    setView(isAuthed ? 'app' : 'auth');
    if (isAuthed) {
      setPage('home');
      setLoading(true);
      runSkeleton();
    }
  };
  const issuesPageActive = view === 'app' && page === 'issues' && !!currentWs && !!currentProject;
  const homeActive = view === 'app' && page === 'home' && !!currentWs;
  const inboxActive = view === 'app' && page === 'inbox' && !!currentWs;
  const wsSlug = currentWs?.slug ?? '';
  const projId = currentProject?.id ?? '';
  const FALLBACK_STATE: StateDef = { id: '', name: '—', group: 'unstarted', color: '#9AA0A8' };

  const statesQ = useQuery({
    queryKey: ['ws', wsSlug, 'proj', projId, 'states'],
    queryFn: () => statesApi.list(wsSlug, projId),
    enabled: issuesPageActive,
  });
  const labelsQ = useQuery({
    queryKey: ['ws', wsSlug, 'proj', projId, 'labels'],
    queryFn: () => labelsApi.list(wsSlug, projId),
    enabled: issuesPageActive,
  });
  const membersQ = useQuery({
    queryKey: ['ws', wsSlug, 'members'],
    queryFn: () => membersApi.list(wsSlug),
    enabled: inApp && !!currentWs,
  });
  const issuesQ = useQuery({
    queryKey: ['ws', wsSlug, 'proj', projId, 'issues'],
    queryFn: () => issuesApi.listGroupedByState(wsSlug, projId),
    enabled: issuesPageActive,
  });

  const realStates = useMemo<ApiState[]>(
    () => (statesQ.data ?? []).slice().sort((a, b) => a.order - b.order),
    [statesQ.data],
  );
  const realStateById = (id: string): ApiState | undefined => realStates.find((s) => s.id === id);
  const labelsMap = useMemo(() => {
    const m: Record<string, { name: string; color: string }> = {};
    (labelsQ.data ?? []).forEach((l) => (m[l.id] = { name: l.name, color: l.color }));
    return m;
  }, [labelsQ.data]);
  const membersMap = useMemo(() => {
    const m: Record<string, { name: string; avatarUrl: string | null }> = {};
    (membersQ.data ?? []).forEach((mm) => (m[mm.user_id] = { name: mm.user.display_name, avatarUrl: mm.user.avatar_url }));
    return m;
  }, [membersQ.data]);

  const resolveAssignees = (iss: ApiIssue): AvatarItem[] =>
    (iss.assignees ?? []).map((a: IssueRef) => {
      if (typeof a === 'string') {
        const m = membersMap[a];
        const name = m?.name ?? '';
        return { initials: name ? initialsOf(name) : '?', color: colorFor(a), avatarUrl: m?.avatarUrl ?? null, name };
      }
      const uid = a.user_id ?? a.id ?? a.user?.id ?? '';
      const m = uid ? membersMap[uid] : undefined;
      const name = m?.name ?? a.display_name ?? a.user?.display_name ?? '';
      const avatarUrl = m?.avatarUrl ?? a.avatar_url ?? a.user?.avatar_url ?? null;
      return { initials: name ? initialsOf(name) : '?', color: colorFor(uid || name || '?'), avatarUrl, name };
    });
  const resolveLabels = (iss: ApiIssue): { name: string; color: string }[] =>
    (iss.labels ?? [])
      .map((l: IssueRef) => {
        if (typeof l === 'string') return labelsMap[l] ?? { name: '', color: '#888' };
        const d = l.id ? labelsMap[l.id] : undefined;
        return { name: l.name ?? d?.name ?? '', color: l.color ?? d?.color ?? '#888' };
      })
      .filter((x) => x.name);
  const dueOf = (iss: ApiIssue): { label: string; over: boolean } | null => {
    if (!iss.due_date) return null;
    const d = new Date(iss.due_date);
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    return { label: fmtDate(iss.due_date), over: !iss.completed_at && d < midnight };
  };
  const issueKeyOf = (iss: ApiIssue): string => `${currentProject?.identifier ?? '?'}-${iss.sequence_id}`;

  const rowOfReal = (iss: ApiIssue): IssueRow => {
    const st = realStateById(iss.state_id);
    const due = dueOf(iss);
    return {
      key: issueKeyOf(iss),
      title: iss.title,
      priorityIcon: <PriorityIcon p={iss.priority} />,
      stateIcon: <StateIcon st={st ?? FALLBACK_STATE} />,
      labelPills: <Pills items={resolveLabels(iss)} />,
      avatars: <AvatarStack items={resolveAssignees(iss)} />,
      due: due ? due.label : null,
      dueColor: due && due.over ? '#EF4444' : 'var(--text-muted)',
      dueBg: due && due.over ? 'rgba(239,68,68,.10)' : 'transparent',
      open: () => openIssue(iss.id),
    };
  };

  const allReal = useMemo<ApiIssue[]>(() => {
    const flat = (issuesQ.data?.groups ?? []).flatMap((g) => g.issues);
    return flat.map((iss) => (stateOverrides[iss.id] ? { ...iss, state_id: stateOverrides[iss.id] } : iss));
  }, [issuesQ.data, stateOverrides]);

  const patchMutation = useMutation({
    mutationFn: (v: { id: string; stateId: string }) =>
      issuesApi.update(wsSlug, projId, v.id, { state_id: v.stateId }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['ws', wsSlug, 'proj', projId, 'issues'] }),
  });
  const patchState = (id: string, stateId: string) => {
    setStateOverrides((o) => ({ ...o, [id]: stateId }));
    patchMutation.mutate({ id, stateId });
  };
  const realOnColDrop = (colId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const key = dragKey;
    setDragKey(null);
    setDragCol(null);
    if (key) patchState(key, colId);
  };

  // ---- создание задачи (New issue / Add issue) ----
  const createIssueMutation = useMutation({
    mutationFn: (v: { title: string; state_id: string; description?: string; priority?: string }) =>
      issuesApi.create(wsSlug, projId, v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ws', wsSlug, 'proj', projId, 'issues'] });
      setCreateIssueOpen(false);
      setIssueTitle('');
      setIssueDesc('');
      setIssueError(null);
    },
    onError: (err) => setIssueError(parseApiError(err).message),
  });
  const openNewIssue = (stateId?: string) => {
    setIssueTitle('');
    setIssueDesc('');
    setIssuePriority('none');
    setIssueStateId(stateId || realStates[0]?.id || '');
    setIssueError(null);
    setCreateIssueOpen(true);
  };
  const submitCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const title = issueTitle.trim();
    const stateId = issueStateId || realStates[0]?.id || '';
    setIssueError(null);
    if (!title) {
      setIssueError('Введите название задачи.');
      return;
    }
    if (!stateId) {
      setIssueError('В проекте нет статусов — создайте статус, прежде чем добавлять задачи.');
      return;
    }
    createIssueMutation.mutate({
      title,
      state_id: stateId,
      description: issueDesc.trim() || undefined,
      priority: issuePriority,
    });
  };

  // ---- удаление задачи ----
  const deleteIssueMutation = useMutation({
    mutationFn: (id: string) => issuesApi.remove(wsSlug, projId, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ws', wsSlug, 'proj', projId, 'issues'] });
      setDeleteIssueTarget(null);
      setDeleteIssueError(null);
      setOpenKey(null); // закрываем панель задачи
    },
    onError: (err) => setDeleteIssueError(parseApiError(err).message),
  });

  const realGroups = realStates
    .map((st) => {
      const items = allReal.filter((i) => i.state_id === st.id);
      const open = !collapsed[st.id];
      return {
        id: st.id,
        name: st.name,
        color: st.color,
        icon: <StateIcon st={st} />,
        count: items.length,
        open,
        chevron: open ? 'rotate(90deg)' : 'rotate(0deg)',
        toggle: () => toggleGroup(st.id),
        issues: items.map(rowOfReal),
      };
    })
    .filter((g) => g.count > 0);

  const realBoardCols = realStates.map((st) => {
    const items = allReal.filter((i) => i.state_id === st.id);
    return {
      id: st.id,
      name: st.name,
      color: st.color,
      icon: <StateIcon st={st} />,
      count: items.length,
      colBg: dragCol === st.id && dragKey ? 'var(--bg-surface)' : 'transparent',
      colBorder: dragCol === st.id && dragKey ? '1px dashed var(--accent)' : '1px solid transparent',
      onDragOver: onColDragOver(st.id),
      onDrop: realOnColDrop(st.id),
      empty: items.length === 0,
      cards: items.map((iss) => ({
        ...rowOfReal(iss),
        opacity: dragKey === iss.id ? 0.4 : 1,
        onDragStart: onDragStart(iss.id, st.id),
        onDragEnd,
      })),
    };
  });

  const openReal = issuesPageActive ? allReal.find((i) => i.id === openKey) ?? null : null;
  const commentsQ = useQuery({
    queryKey: ['ws', wsSlug, 'proj', projId, 'issue', openReal?.id, 'comments'],
    queryFn: () => commentsApi.list(wsSlug, projId, openReal!.id),
    enabled: !!openReal,
  });
  const commentMutation = useMutation({
    mutationFn: (body: string) => commentsApi.create(wsSlug, projId, openReal!.id, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['ws', wsSlug, 'proj', projId, 'issue', openReal?.id, 'comments'] }),
  });
  const addCommentReal = (e: React.FormEvent) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t || !openReal) return;
    setDraft('');
    commentMutation.mutate(t);
  };

  if (openReal) {
    const st = realStateById(openReal.state_id);
    const assignees = resolveAssignees(openReal);
    const labels = resolveLabels(openReal);
    const due = dueOf(openReal);
    const cmts = (commentsQ.data ?? [])
      .filter((c) => !c.deleted_at)
      .map((c) => {
        const nm = c.author?.display_name ?? '';
        return { initials: nm ? initialsOf(nm) : '?', avColor: colorFor(c.author_id || nm), name: nm || 'User', t: c.body, at: fmtDate(c.created_at) };
      });
    detail = {
      key: issueKeyOf(openReal),
      title: openReal.title,
      priorityIcon: <PriorityIcon p={openReal.priority} />,
      priorityLabel: ({ urgent: 'Urgent', high: 'High', medium: 'Medium', low: 'Low', none: 'No priority' } as const)[openReal.priority],
      stateIcon: <StateIcon st={st ?? FALLBACK_STATE} />,
      stateName: st?.name ?? '—',
      labelPills: <Pills items={labels} />,
      hasLabels: labels.length > 0,
      desc: openReal.description ? openReal.description.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean) : [],
      subs: [],
      hasSub: false,
      subDone: 0,
      subTotal: 0,
      subPct: '0%',
      comments: cmts,
      commentCount: cmts.length,
      assignees: assignees.map((a) => ({ initials: a.initials, color: a.color, name: a.name ?? '' })),
      est: openReal.estimate_points ?? 0,
      created: fmtDate(openReal.created_at),
      due: due ? due.label : null,
      dueColor: due && due.over ? '#EF4444' : 'var(--text-primary)',
      statusMenu,
      toggleStatusMenu: () => setStatusMenu((v) => !v),
      statusOptions: realStates.map((x) => ({
        name: x.name,
        icon: <StateIcon st={x} />,
        active: x.id === openReal.state_id,
        bg: x.id === openReal.state_id ? 'var(--bg-surface)' : 'transparent',
        choose: () => {
          patchState(openReal.id, x.id);
          setStatusMenu(false);
        },
      })),
    };
  }

  const issuesLoading = statesQ.isLoading || issuesQ.isLoading || labelsQ.isLoading || membersQ.isLoading;

  // ================= HOME (реальные данные по всем проектам воркспейса) =================
  // Задачи/статусы/метки тянем по каждому проекту (ключи совпадают с Issues —
  // кеш общий, поэтому открытие задачи с Home попадает в готовый кеш), участники —
  // на уровне воркспейса (membersQ выше).
  // На Inbox тоже фан-аутим задачи по проектам — чтобы по issue_id из уведомления
  // определить проект и открыть задачу (у уведомления есть issue_id, но нет project_id).
  const homeIssueQs = useQueries({
    queries: (homeActive || inboxActive ? projectsData : []).map((p) => ({
      queryKey: ['ws', wsSlug, 'proj', p.id, 'issues'],
      queryFn: () => issuesApi.listGroupedByState(wsSlug, p.id),
    })),
  });
  const homeStateQs = useQueries({
    queries: (homeActive ? projectsData : []).map((p) => ({
      queryKey: ['ws', wsSlug, 'proj', p.id, 'states'],
      queryFn: () => statesApi.list(wsSlug, p.id),
    })),
  });
  const homeLabelQs = useQueries({
    queries: (homeActive ? projectsData : []).map((p) => ({
      queryKey: ['ws', wsSlug, 'proj', p.id, 'labels'],
      queryFn: () => labelsApi.list(wsSlug, p.id),
    })),
  });

  const homeStateMap: Record<string, ApiState> = {};
  homeStateQs.forEach((q) => (q.data ?? []).forEach((s) => (homeStateMap[s.id] = s)));
  const homeLabelMap: Record<string, { name: string; color: string }> = {};
  homeLabelQs.forEach((q) => (q.data ?? []).forEach((l) => (homeLabelMap[l.id] = { name: l.name, color: l.color })));
  const homeIdentifierByProject: Record<string, string> = {};
  projectsData.forEach((p) => (homeIdentifierByProject[p.id] = p.identifier));

  const homeAllIssues = homeIssueQs
    .flatMap((q) => (q.data?.groups ?? []).flatMap((g) => g.issues))
    .map((i) => (stateOverrides[i.id] ? { ...i, state_id: stateOverrides[i.id] } : i));

  const isMine = (iss: ApiIssue): boolean =>
    !!user &&
    (iss.assignees ?? []).some((a) => {
      const id = typeof a === 'string' ? a : a.user_id ?? a.id ?? a.user?.id ?? '';
      return id === user.id;
    });
  const isDone = (iss: ApiIssue): boolean => {
    if (iss.completed_at) return true;
    const g = homeStateMap[iss.state_id]?.group;
    return g === 'completed' || g === 'cancelled';
  };

  const homeRowOf = (iss: ApiIssue): IssueRow => {
    const st = homeStateMap[iss.state_id];
    const due = dueOf(iss);
    const labels = (iss.labels ?? [])
      .map((l) => {
        if (typeof l === 'string') return homeLabelMap[l] ?? { name: '', color: '#888' };
        const d = l.id ? homeLabelMap[l.id] : undefined;
        return { name: l.name ?? d?.name ?? '', color: l.color ?? d?.color ?? '#888' };
      })
      .filter((x) => x.name);
    return {
      key: `${homeIdentifierByProject[iss.project_id] ?? '?'}-${iss.sequence_id}`,
      title: iss.title,
      priorityIcon: <PriorityIcon p={iss.priority} />,
      stateIcon: <StateIcon st={st ?? FALLBACK_STATE} />,
      labelPills: <Pills items={labels} />,
      avatars: <AvatarStack items={resolveAssignees(iss)} />,
      due: due ? due.label : null,
      dueColor: due && due.over ? '#EF4444' : 'var(--text-muted)',
      dueBg: due && due.over ? 'rgba(239,68,68,.10)' : 'transparent',
      open: () => {
        setProject(iss.project_id);
        setOpenKey(iss.id);
        setPage('issues');
      },
    };
  };

  const homeMine = homeAllIssues.filter((i) => isMine(i) && !isDone(i));
  const homeAssignedRows = homeMine.map(homeRowOf);
  const homeDueSoonRows = homeMine
    .filter((i) => i.due_date)
    .sort((a, b) => new Date(a.due_date as string).getTime() - new Date(b.due_date as string).getTime())
    .map(homeRowOf);
  const homeLoading = homeActive && homeIssueQs.some((q) => q.isLoading);
  const homeGreeting = (() => {
    const h = new Date().getHours();
    const word = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    const first = (user?.display_name ?? '').trim().split(/\s+/)[0];
    return `${word}${first ? ', ' + first : ''}`;
  })();

  // ================= INBOX (уведомления воркспейса) =================
  // Тянем всегда, пока открыто приложение (для бейджа на колокольчике), с мягким
  // поллингом — новые уведомления (например, назначенная тебе задача) появятся сами.
  const notifQ = useQuery({
    queryKey: ['ws', wsSlug, 'notifications'],
    queryFn: () => notificationsApi.list(wsSlug),
    enabled: inApp && !!currentWs,
    refetchInterval: 45_000,
  });
  const unreadCount = notifQ.data?.unread_count ?? 0;

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(wsSlug, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ws', wsSlug, 'notifications'] }),
  });
  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(wsSlug),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ws', wsSlug, 'notifications'] }),
  });

  // issue_id → { projectId, key } из фан-аута homeIssueQs → чтобы открыть задачу.
  const notifIssueLoc: Record<string, { projectId: string; key: string }> = {};
  homeIssueQs.forEach((q) =>
    (q.data?.groups ?? []).forEach((g) =>
      g.issues.forEach((i) => {
        notifIssueLoc[i.id] = {
          projectId: i.project_id,
          key: `${homeIdentifierByProject[i.project_id] ?? '?'}-${i.sequence_id}`,
        };
      }),
    ),
  );

  const openNotification = (n: ApiNotification) => {
    if (!n.is_read) markReadMutation.mutate(n.id);
    const loc = n.issue_id ? notifIssueLoc[n.issue_id] : undefined;
    if (loc) {
      // Переходим в проект задачи и открываем её — так приглашённый «входит в проект».
      setProject(loc.projectId);
      setOpenKey(n.issue_id);
      setPage('issues');
    }
  };

  const notifVerb: Record<ApiNotification['type'], string> = {
    issue_assigned: 'assigned you',
    comment_added: 'commented on',
    mentioned: 'mentioned you in',
  };

  const inboxItems = (notifQ.data?.data ?? []).map((n) => {
    const loc = n.issue_id ? notifIssueLoc[n.issue_id] : undefined;
    const actorName = n.actor?.display_name || 'Someone';
    return {
      id: n.id,
      actorName,
      initials: initialsOf(actorName),
      color: colorFor(n.actor_id),
      avatarUrl: n.actor?.avatar_url ?? null,
      verb: notifVerb[n.type],
      target: loc ? loc.key : n.issue_id ? 'an issue' : 'your workspace',
      at: relTime(n.created_at),
      isRead: n.is_read,
      canOpen: !!loc,
      open: () => openNotification(n),
    };
  });

  // ================= SETTINGS (реальные данные воркспейса) =================
  const settingsActive = view === 'app' && page === 'settings';
  const settingsMembersActive = settingsActive && settingsSection === 'members' && !!currentWs;

  // Тот же queryKey, что и на страницах Issues/Home → общий кеш.
  const settingsMembersQ = useQuery({
    queryKey: ['ws', wsSlug, 'members'],
    queryFn: () => membersApi.list(wsSlug),
    enabled: settingsMembersActive,
  });

  const roleLabel = (r: string): string => (r ? r.charAt(0).toUpperCase() + r.slice(1) : '—');

  const settingsMembers = (settingsMembersQ.data ?? []).map((m) => ({
    id: m.user_id,
    name: m.user.display_name || m.user.email,
    email: m.user.email,
    role: roleLabel(m.role),
    initials: m.user.display_name ? initialsOf(m.user.display_name) : (m.user.email[0] || '?').toUpperCase(),
    color: colorFor(m.user_id),
    avatarUrl: m.user.avatar_url,
    isYou: !!user && m.user_id === user.id,
    isOwner: !!(currentWs && currentWs.owner_id === m.user_id),
  }));
  const settingsMembersLoading = settingsMembersActive && settingsMembersQ.isLoading;
  const settingsMembersError = settingsMembersActive && settingsMembersQ.isError;

  const settingsNavItems = settingsNav.map((n) => {
    const active = n.id === settingsSection;
    return {
      id: n.id,
      label: n.label,
      icon: <Icon name={n.icon} />,
      active,
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      weight: active ? 600 : 450,
      bg: active ? 'var(--accent-subtle)' : 'transparent',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setSettingsSection(n.id);
      },
    };
  });
  const settingsSectionTitle = settingsNav.find((n) => n.id === settingsSection)?.label ?? 'General';

  const workspaceSlugStr = currentWs?.slug ?? '';
  const workspaceUrl = `taskflow.app/${workspaceSlugStr || 'workspace'}`;

  // ================= УЧАСТНИКИ ВОРКСПЕЙСА / ИНВАЙТ =================
  const wsMembers = membersQ.data ?? [];
  const myMember = user ? wsMembers.find((m) => m.user_id === user.id) : undefined;
  const myRole = myMember?.role ?? (isOwner ? 'owner' : 'member');
  const canManageMembers = myRole === 'owner' || myRole === 'admin' || isOwner;
  const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  const invalidateMembers = () => qc.invalidateQueries({ queryKey: ['ws', wsSlug, 'members'] });

  const inviteMutation = useMutation({
    mutationFn: (v: { email: string; role: WsRole }) =>
      membersApi.invite(wsSlug, { email: v.email, role: v.role }),
    onSuccess: (inv) => {
      invalidateMembers();
      setInviteEmail('');
      setInviteError(null);
      setInviteNotice(`Приглашение отправлено на ${inv.email} (${inv.role}). Участник появится после принятия.`);
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error('[invite] failed:', err);
      const p = parseApiError(err);
      setInviteNotice(null);
      setInviteError(`${p.message}${p.status ? ` [${p.code} · HTTP ${p.status}]` : ''}`);
    },
  });
  const roleMutation = useMutation({
    mutationFn: (v: { userId: string; role: WsRole }) => membersApi.updateRole(wsSlug, v.userId, v.role),
    onSuccess: invalidateMembers,
  });
  const removeMutation = useMutation({
    mutationFn: (userId: string) => membersApi.remove(wsSlug, userId),
    onSuccess: invalidateMembers,
  });

  const submitInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const em = inviteEmail.trim();
    if (!em) return;
    inviteMutation.mutate({ email: em, role: inviteRole });
  };
  const openInvite = () => {
    setInviteOpen(true);
    setWsMenuOpen(false);
    setInviteError(null);
    setInviteNotice(null);
    setInvitePicked(false);
    setInviteQueryDebounced('');
  };

  // Дебаунс ввода email → строка для поиска юзеров (подсказки).
  useEffect(() => {
    if (!inviteOpen) return;
    const id = setTimeout(() => setInviteQueryDebounced(inviteEmail.trim()), 250);
    return () => clearTimeout(id);
  }, [inviteEmail, inviteOpen]);

  const userSearchQ = useQuery({
    queryKey: ['users-search', inviteQueryDebounced],
    queryFn: () => usersApi.search(inviteQueryDebounced),
    enabled: inviteOpen && !invitePicked && inviteQueryDebounced.length >= 2,
    retry: false,
    staleTime: 30_000,
  });
  const inviteSuggestions =
    inviteOpen && !invitePicked
      ? (userSearchQ.data ?? [])
          .filter((u) => !wsMembers.some((m) => m.user_id === u.id)) // уже в воркспейсе — не предлагаем
          .map((u) => {
            const nm = u.display_name || u.email;
            return {
              id: u.id,
              name: nm,
              email: u.email,
              initials: u.display_name ? initialsOf(u.display_name) : (u.email[0] || '?').toUpperCase(),
              color: colorFor(u.id),
              avatarUrl: u.avatar_url,
              pick: () => {
                setInviteEmail(u.email);
                setInvitePicked(true);
              },
            };
          })
      : [];

  const membersList = wsMembers.map((m) => {
    const nm = m.user?.display_name ?? '';
    const isWsOwner = !!currentWs && m.user_id === currentWs.owner_id;
    return {
      userId: m.user_id,
      name: nm || m.user?.email || 'User',
      email: m.user?.email ?? '',
      initials: nm ? initialsOf(nm) : (m.user?.email ?? '?').slice(0, 2).toUpperCase(),
      color: colorFor(m.user_id),
      avatarUrl: m.user?.avatar_url ?? null,
      role: m.role,
      roleLabel: isWsOwner ? 'Owner' : cap(m.role),
      isSelf: !!user && m.user_id === user.id,
      isOwner: isWsOwner,
      canEdit: canManageMembers && !isWsOwner,
      setRole: (role: WsRole) => roleMutation.mutate({ userId: m.user_id, role }),
      remove: () => removeMutation.mutate(m.user_id),
    };
  });

  // ================= УЧАСТНИКИ ПРОЕКТА =================
  const projMembersActive = projMembersOpen && !!currentWs && !!currentProject;
  const projMembersQ = useQuery({
    queryKey: ['ws', wsSlug, 'proj', projId, 'members'],
    queryFn: () => projectMembersApi.list(wsSlug, projId),
    enabled: projMembersActive,
  });
  const invalidateProjMembers = () =>
    qc.invalidateQueries({ queryKey: ['ws', wsSlug, 'proj', projId, 'members'] });
  const addProjMemberMutation = useMutation({
    mutationFn: (v: { userId: string; role: ProjectRole }) =>
      projectMembersApi.add(wsSlug, projId, { user_id: v.userId, role: v.role }),
    onSuccess: () => {
      invalidateProjMembers();
      setPmUserId('');
      setPmError(null);
    },
    onError: (err) => {
      const p = parseApiError(err);
      setPmError(`${p.message}${p.status ? ` [${p.code} · HTTP ${p.status}]` : ''}`);
    },
  });
  const removeProjMemberMutation = useMutation({
    mutationFn: (userId: string) => projectMembersApi.remove(wsSlug, projId, userId),
    onSuccess: invalidateProjMembers,
  });
  const openProjMembers = () => {
    setProjMembersOpen(true);
    setPmError(null);
    setPmUserId('');
  };
  const submitAddProjMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pmUserId) return;
    addProjMemberMutation.mutate({ userId: pmUserId, role: pmRole });
  };

  const projMembers = projMembersQ.data ?? [];
  const projMemberIds = new Set(projMembers.map((m) => m.user_id));
  const projectMembersList = projMembers.map((m) => {
    const nm = m.user?.display_name ?? '';
    const isSelf = !!user && m.user_id === user.id;
    return {
      userId: m.user_id,
      name: nm || m.user?.email || 'User',
      email: m.user?.email ?? '',
      initials: nm ? initialsOf(nm) : (m.user?.email ?? '?').slice(0, 2).toUpperCase(),
      color: colorFor(m.user_id),
      avatarUrl: m.user?.avatar_url ?? null,
      roleLabel: cap(m.role),
      isSelf,
      canRemove: canManageMembers && !isSelf,
      remove: () => removeProjMemberMutation.mutate(m.user_id),
    };
  });
  // Кого можно добавить — участники воркспейса, которых ещё нет в проекте.
  const addableWsMembers = wsMembers
    .filter((m) => !projMemberIds.has(m.user_id))
    .map((m) => {
      const nm = m.user?.display_name ?? '';
      return { userId: m.user_id, name: nm || m.user?.email || 'User', email: m.user?.email ?? '' };
    });

  // ================= AI-ПОМОЩНИК (чат) =================
  const aiUid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
  const aiGenerateMutation = useMutation({
    mutationFn: (v: { prompt: string; tone: AiTone }) => aiApi.generateDescription(v),
    onSuccess: (r) => {
      setAiMessages((m) => [...m, { id: aiUid(), role: 'ai', text: r.text }]);
      setAiError(null);
    },
    onError: (err) => {
      const p = parseApiError(err);
      setAiError(`${p.message}${p.status ? ` [${p.code} · HTTP ${p.status}]` : ''}`);
    },
  });
  const askAi = (prompt: string) => {
    const p = prompt.trim();
    if (!p || aiGenerateMutation.isPending) return;
    setAiError(null);
    setAiMessages((m) => [...m, { id: aiUid(), role: 'user', text: p }]);
    setAiPrompt('');
    aiGenerateMutation.mutate({ prompt: p, tone: aiTone });
  };
  const submitAi = (e: React.FormEvent) => {
    e.preventDefault();
    askAi(aiPrompt);
  };
  const copyAiText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text).then(
      () => {
        setAiCopiedId(id);
        setTimeout(() => setAiCopiedId((c) => (c === id ? null : c)), 1800);
      },
      () => {
        /* clipboard недоступен */
      },
    );
  };

  // ================= СОЗДАНИЕ ВОРКСПЕЙСА =================
  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50);
  const createWsMutation = useMutation({
    mutationFn: (v: { name: string; slug: string }) => workspacesApi.create(v),
    onSuccess: (w) => {
      qc.invalidateQueries({ queryKey: ['workspaces'] });
      setWorkspace(w.slug);
      setCreateWsOpen(false);
      setWsName('');
      setWsSlugInput('');
      setWsSlugEdited(false);
      setWsError(null);
      setWsFieldErrors({});
      setPage('projects');
    },
    onError: (err) => {
      const parsed = parseApiError(err);
      setWsError(parsed.message);
      setWsFieldErrors(parsed.fieldErrors);
    },
  });
  const openCreateWorkspace = () => {
    setCreateWsOpen(true);
    setWsMenuOpen(false);
    setWsError(null);
    setWsFieldErrors({});
  };
  const submitCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    const nm = wsName.trim();
    const sl = slugify(wsSlugInput.trim() || wsName.trim());
    setWsError(null);
    setWsFieldErrors({});
    if (!nm || sl.length < 2) return;
    createWsMutation.mutate({ name: nm, slug: sl });
  };

  // ================= СОЗДАНИЕ ПРОЕКТА =================
  const suggestIdentifier = (nm: string) => nm.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
  const createProjectMutation = useMutation({
    mutationFn: (v: { name: string; identifier: string }) => projectsApi.create(wsSlug, v),
    onSuccess: (p) => {
      qc.invalidateQueries({ queryKey: ['workspaces', currentWs?.slug, 'projects'] });
      setCreateProjectOpen(false);
      setProjName('');
      setProjIdentifier('');
      setProjIdEdited(false);
      setProjError(null);
      setProjFieldErrors({});
      setProject(p.id);
      setPage('issues');
    },
    onError: (err) => {
      const parsed = parseApiError(err);
      setProjError(parsed.message);
      setProjFieldErrors(parsed.fieldErrors);
    },
  });
  const openCreateProject = () => {
    if (!currentWs) {
      openCreateWorkspace();
      return;
    }
    setCreateProjectOpen(true);
    setProjError(null);
    setProjFieldErrors({});
  };
  const submitCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const nm = projName.trim();
    const id = projIdentifier.trim().toUpperCase();
    setProjError(null);
    setProjFieldErrors({});
    if (!nm || !id) return;
    createProjectMutation.mutate({ name: nm, identifier: id });
  };
  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => projectsApi.remove(wsSlug, id),
    onSuccess: (_res, id) => {
      qc.invalidateQueries({ queryKey: ['workspaces', currentWs?.slug, 'projects'] });
      if (currentProjectId === id) {
        setProject(null);
        setPage('projects');
      }
      setDeleteTarget(null);
      setDeleteError(null);
    },
    onError: (err) => setDeleteError(parseApiError(err).message),
  });
  const removeProject = (id: string, name: string) => {
    setDeleteError(null);
    setDeleteTarget({ id, name });
  };

  // ---- удаление воркспейса (только владелец) ----
  const deleteWorkspaceMutation = useMutation({
    mutationFn: () => workspacesApi.remove(wsSlug),
    onSuccess: async () => {
      setDeleteWsOpen(false);
      setDeleteWsError(null);
      // Сбрасываем выбор — эффект по умолчанию подхватит первый оставшийся воркспейс,
      // а если их не осталось → сработает онбординг.
      setProject(null);
      setWorkspace(null);
      setPage('home');
      await qc.invalidateQueries({ queryKey: ['workspaces'] });
    },
    onError: (err) => setDeleteWsError(parseApiError(err).message),
  });

  // ---- sidebar nav ----
  const navItems = navConfig.map((n) => {
    const active = n.page === page;
    return {
      label: n.label,
      icon: <Icon name={n.icon} />,
      badge: null as string | null,
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      weight: active ? 600 : 450,
      bg: active ? 'var(--accent-subtle)' : 'transparent',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setPage(n.page as Page);
      },
    };
  });

  const projects = projectsData.map((p, i) => {
    const active = p.id === currentProjectId && page === 'issues';
    return {
      name: p.name,
      identifier: p.identifier,
      dot: projectColor(i),
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      weight: active ? 600 : 450,
      bg: active ? 'var(--bg-elevated)' : 'transparent',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        openProject(p.id);
      },
    };
  });

  // ---- your work ----
  const myWork = issuesData.filter((i) => i.assignees.includes('al'));
  const workload = {
    backlog: myWork.filter((i) => i.state === 'backlog').length,
    notStarted: myWork.filter((i) => i.state === 'todo').length,
    workingOn: myWork.filter((i) => i.state === 'prog' || i.state === 'review').length,
    completed: myWork.filter((i) => i.state === 'done').length,
    canceled: 0,
  };
  const priorityOrder: [PriorityId, string][] = [
    ['urgent', 'Urgent'],
    ['high', 'High'],
    ['medium', 'Medium'],
    ['low', 'Low'],
    ['none', 'No priority'],
  ];
  const priorityCounts = priorityOrder.map(([id, label]) => ({
    id,
    label,
    count: myWork.filter((i) => i.priority === id).length,
  }));
  const priorityMax = Math.max(4, ...priorityCounts.map((c) => c.count));
  const priorityBars = priorityCounts.map((c) => ({
    label: c.label,
    count: c.count,
    h: Math.round((c.count / priorityMax) * 150) + 'px',
  }));
  const priorityAxis = [4, 3, 2, 1, 0]
    .map((n) => ({ n, y: Math.round((1 - n / priorityMax) * 150) + 'px' }))
    .filter((a) => a.n <= priorityMax);

  const stateCats = [
    { name: 'Backlog', count: workload.backlog, color: '#6B7178' },
    { name: 'Unstarted', count: workload.notStarted, color: '#9AA0A8' },
    { name: 'Started', count: workload.workingOn, color: '#EAB308' },
    { name: 'Completed', count: workload.completed, color: '#22C55E' },
    { name: 'Canceled', count: workload.canceled, color: '#EF4444' },
  ];
  const stateTotal = stateCats.reduce((a, c) => a + c.count, 0);
  let acc = 0;
  const stops =
    stateTotal > 0
      ? stateCats
          .filter((c) => c.count > 0)
          .map((c) => {
            const start = (acc / stateTotal) * 360;
            acc += c.count;
            const end = (acc / stateTotal) * 360;
            return `${c.color} ${start}deg ${end}deg`;
          })
          .join(', ')
      : 'var(--border) 0deg 360deg';
  const donutBg = `conic-gradient(${stops})`;

  const assignedCount = myWork.length;
  const createdCount = 0;
  const subscribedCount = assignedCount + 3;

  const projectsGrid = projectsData.map((p, i) => {
    const dot = projectColor(i);
    return {
      name: p.name,
      identifier: p.identifier,
      dot,
      cover: `linear-gradient(135deg, ${dot}59, #14151a 70%)`,
      open: () => openProject(p.id),
      canDelete: canManageMembers,
      remove: () => removeProject(p.id, p.name),
    };
  });

  // ---- palette sections ----
  const flat = flatPalette();
  const navItemsP = flat.filter((c) => c.type !== 'issue');
  const issueItemsP = flat.filter((c) => c.type === 'issue');
  const decorate = (
    arr: ReturnType<typeof flatPalette>,
    offset: number,
  ) =>
    arr.map((c, i) => {
      const gi = offset + i;
      const isIssue = c.type === 'issue';
      return {
        icon: isIssue ? <PriorityIcon p={(c as { priority: PriorityId }).priority} /> : <Icon name={(c as { icon: string }).icon} theme={theme} />,
        label: c.label,
        hint: (c as { hint?: string }).hint || null,
        cmdKey: (c as { key?: string }).key || null,
        bg: gi === selIdx ? 'var(--accent-subtle)' : 'transparent',
        hover: () => setSelIdx(gi),
      };
    });
  const paletteSections: { name: string; items: ReturnType<typeof decorate> }[] = [];
  if (navItemsP.length) paletteSections.push({ name: query ? 'Commands' : 'Jump to', items: decorate(navItemsP, 0) });
  if (issueItemsP.length) paletteSections.push({ name: 'Issues', items: decorate(issueItemsP, navItemsP.length) });

  const today = (() => {
    try {
      return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    } catch {
      return 'Today';
    }
  })();

  const pageName =
    page === 'home'
      ? 'Home'
      : page === 'yourwork'
        ? 'Your Work'
        : page === 'issues'
          ? 'Issues'
          : page === 'projects'
            ? 'Projects'
            : page === 'inbox'
              ? 'Inbox'
              : page === 'wiki'
                ? 'Wiki'
                : page === 'ai'
                  ? 'AI Assistant'
                  : page === 'settings'
                    ? 'Settings'
                    : 'Issues';

  // ---- приглашение (данные для InviteScreen) ----
  const inviteInfo = inviteQ.data
    ? {
        workspaceName: inviteQ.data.workspace.name,
        workspaceInitial: (inviteQ.data.workspace.name || '?').trim().charAt(0).toUpperCase() || '?',
        roleLabel: cap(inviteQ.data.role),
        inviterName: inviteQ.data.invited_by.display_name || inviteQ.data.invited_by.email || 'Someone',
        email: inviteQ.data.email,
      }
    : null;
  const inviteLoadErrText = (() => {
    if (!inviteQ.isError) return null;
    const p = parseApiError(inviteQ.error);
    // Настоящую проблему со связью показываем как есть; всё остальное (нет такого
    // токена / просрочен / серверная ошибка на разборе токена) — как «ссылка недействительна».
    if (p.code === 'NETWORK_ERROR') return p.message;
    return 'This invitation link is invalid or has expired.';
  })();

  return {
    rootStyle: rootStyle(theme, accent),
    theme,
    toggleTheme,
    paletteInputRef,

    // auth
    isAuth: view === 'auth',
    isApp: view === 'app',

    // приглашение по ссылке `/invites/:token`
    isInvite: view === 'invite',
    inviteLoading: inviteQ.isLoading,
    inviteLoadError: inviteLoadErrText,
    inviteData: inviteInfo,
    inviteAuthed: isAuthed,
    acceptInvite: () => acceptInviteMutation.mutate(),
    accepting: acceptInviteMutation.isPending,
    inviteAcceptError,
    dismissInvite,
    isRegister,
    authTitle: isRegister ? 'Create your account' : 'Welcome back',
    authSubtitle: isRegister ? 'Start tracking work in seconds.' : 'Sign in to continue to your workspace.',
    authButton: submitting
      ? isRegister
        ? 'Creating…'
        : 'Signing in…'
      : isRegister
        ? 'Create account'
        : 'Sign in',
    authSwitchText: isRegister ? 'Already have an account?' : "Don't have an account?",
    authSwitchLink: isRegister ? 'Sign in' : 'Sign up',
    authName: name,
    authEmail: email,
    authPass: pass,
    submitting,
    onName: (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
    onEmail: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    onPass: (e: React.ChangeEvent<HTMLInputElement>) => setPass(e.target.value),
    submitAuth,
    toggleMode: () => {
      setMode((m) => (m === 'login' ? 'register' : 'login'));
      setAuthError(null);
      setFieldErrors({});
    },
    authError,
    authNameError: fieldErrors.display_name ?? null,
    authEmailError: fieldErrors.email ?? null,
    authPassError: fieldErrors.password ?? null,
    logout: doLogout,

    // текущий пользователь (из /auth/me либо ответа login/register)
    me: {
      name: user?.display_name ?? 'Загрузка…',
      email: user?.email ?? '',
      role: cap(myRole),
      initials: user ? initialsOf(user.display_name) : '··',
      avatarUrl: user?.avatar_url ?? null,
    },

    // текущий воркспейс/проект (реальные данные)
    workspaceName: currentWs?.name ?? 'Workspace',
    workspaceInitial: (currentWs?.name ?? '?').trim().charAt(0).toUpperCase() || '?',
    currentProjectName: currentProject?.name ?? projectsData[0]?.name ?? 'Project',
    currentProjectDot: projectColor(currentProjectIdx < 0 ? 0 : currentProjectIdx),

    // ---- дропдаун воркспейса + инвайт участников ----
    wsMenuOpen,
    toggleWsMenu: () => setWsMenuOpen((v) => !v),
    closeWsMenu: () => setWsMenuOpen(false),
    openSettings: () => {
      setPage('settings');
      setWsMenuOpen(false);
    },
    memberCount: wsMembers.length,
    canManageMembers,
    inviteOpen,
    openInvite,
    closeInvite: () => setInviteOpen(false),
    inviteEmail,
    onInviteEmail: (e: React.ChangeEvent<HTMLInputElement>) => {
      setInviteEmail(e.target.value);
      setInvitePicked(false);
    },
    inviteSuggestions,
    inviteRole,
    setInviteRole: (r: WsRole) => setInviteRole(r),
    submitInvite,
    inviteSubmitting: inviteMutation.isPending,
    inviteError,
    inviteNotice,
    membersList,
    membersLoading: membersQ.isLoading,

    // ---- участники проекта ----
    projMembersOpen,
    openProjMembers,
    closeProjMembers: () => setProjMembersOpen(false),
    projectMembersName: currentProject?.name ?? 'Project',
    projectMembersList,
    projectMembersLoading: projMembersQ.isLoading,
    projectMemberCount: projMembers.length,
    canManageProjectMembers: canManageMembers,
    addableWsMembers,
    pmUserId,
    setPmUserId: (id: string) => setPmUserId(id),
    pmRole,
    setPmRole: (r: ProjectRole) => setPmRole(r),
    submitAddProjMember,
    addingProjMember: addProjMemberMutation.isPending,
    pmError,

    // ---- создание проекта ----
    createProjectOpen,
    openCreateProject,
    closeCreateProject: () => setCreateProjectOpen(false),
    projName,
    onProjName: (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setProjName(v);
      if (!projIdEdited) setProjIdentifier(suggestIdentifier(v));
    },
    projIdentifier,
    onProjIdentifier: (e: React.ChangeEvent<HTMLInputElement>) => {
      setProjIdEdited(true);
      setProjIdentifier(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10));
    },
    submitCreateProject,
    creatingProject: createProjectMutation.isPending,
    projError,
    projNameError: projFieldErrors.name ?? null,
    projIdentifierError: projFieldErrors.identifier ?? null,

    // ---- создание воркспейса ----
    hasWorkspace: !!currentWs,
    // Новый аккаунт без воркспейсов → онбординг «сначала workspace, потом project».
    // Показываем только после успешной загрузки списка (пустой массив), не во время неё.
    needsOnboarding: inApp && workspacesQ.isSuccess && workspaces.length === 0,
    createWsOpen,
    openCreateWorkspace,
    closeCreateWorkspace: () => setCreateWsOpen(false),
    wsName,
    onWsName: (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setWsName(v);
      if (!wsSlugEdited) setWsSlugInput(slugify(v));
    },
    wsSlugInput,
    onWsSlug: (e: React.ChangeEvent<HTMLInputElement>) => {
      setWsSlugEdited(true);
      setWsSlugInput(slugify(e.target.value));
    },
    submitCreateWorkspace,
    creatingWorkspace: createWsMutation.isPending,
    wsError,
    wsNameError: wsFieldErrors.name ?? null,
    wsSlugError: wsFieldErrors.slug ?? null,

    // ---- удаление проекта (модалка подтверждения) ----
    deleteProjectOpen: !!deleteTarget,
    deleteProjectName: deleteTarget?.name ?? '',
    closeDeleteProject: () => {
      setDeleteTarget(null);
      setDeleteError(null);
    },
    confirmDeleteProject: () => {
      if (deleteTarget) deleteProjectMutation.mutate(deleteTarget.id);
    },
    deletingProject: deleteProjectMutation.isPending,
    deleteProjectError: deleteError,

    // ---- удаление воркспейса (модалка подтверждения, только владелец) ----
    deleteWorkspaceOpen: deleteWsOpen,
    openDeleteWorkspace: () => {
      setDeleteWsError(null);
      setDeleteWsOpen(true);
    },
    closeDeleteWorkspace: () => {
      setDeleteWsOpen(false);
      setDeleteWsError(null);
    },
    confirmDeleteWorkspace: () => deleteWorkspaceMutation.mutate(),
    deletingWorkspace: deleteWorkspaceMutation.isPending,
    deleteWorkspaceError: deleteWsError,

    // shell / pages
    page,
    setPage,
    pageName,
    navItems,
    projects,
    loading: issuesPageActive ? issuesLoading : loading,
    loaded: issuesPageActive ? !issuesLoading : !loading,
    groups: issuesPageActive ? realGroups : groups,
    isList: listView === 'list',
    isBoard: listView === 'board',
    setListViewList: () => setListView('list'),
    setListViewBoard: () => setListView('board'),
    listBtnBg: listView === 'list' ? 'var(--bg-elevated)' : 'transparent',
    listBtnColor: listView === 'list' ? 'var(--text-primary)' : 'var(--text-muted)',
    boardBtnBg: listView === 'board' ? 'var(--bg-elevated)' : 'transparent',
    boardBtnColor: listView === 'board' ? 'var(--text-primary)' : 'var(--text-muted)',
    boardCols: issuesPageActive ? realBoardCols : boardCols,

    // ---- создание задачи ----
    canCreateIssue: issuesPageActive,
    createIssueOpen,
    openNewIssue,
    closeCreateIssue: () => setCreateIssueOpen(false),
    issueTitle,
    onIssueTitle: (e: React.ChangeEvent<HTMLInputElement>) => setIssueTitle(e.target.value),
    issueDesc,
    onIssueDesc: (e: React.ChangeEvent<HTMLTextAreaElement>) => setIssueDesc(e.target.value),
    issuePriority,
    setIssuePriority: (p: string) => setIssuePriority(p),
    issueStateId,
    setIssueStateId: (id: string) => setIssueStateId(id),
    issueStateOptions: realStates.map((s) => ({ id: s.id, name: s.name, color: s.color })),
    issuePriorityOptions: [
      { id: 'none', label: 'No priority' },
      { id: 'low', label: 'Low' },
      { id: 'medium', label: 'Medium' },
      { id: 'high', label: 'High' },
      { id: 'urgent', label: 'Urgent' },
    ],
    submitCreateIssue,
    creatingIssue: createIssueMutation.isPending,
    issueError,

    // ---- удаление задачи (кнопка в панели задачи + подтверждение) ----
    canDeleteIssue: !!openReal,
    requestDeleteIssue: () => {
      if (openReal) {
        setDeleteIssueError(null);
        setDeleteIssueTarget({ id: openReal.id, key: issueKeyOf(openReal) });
      }
    },
    deleteIssueOpen: !!deleteIssueTarget,
    deleteIssueKey: deleteIssueTarget?.key ?? '',
    closeDeleteIssue: () => {
      setDeleteIssueTarget(null);
      setDeleteIssueError(null);
    },
    confirmDeleteIssue: () => {
      if (deleteIssueTarget) deleteIssueMutation.mutate(deleteIssueTarget.id);
    },
    deletingIssue: deleteIssueMutation.isPending,
    deleteIssueError,

    // detail
    detail,
    detailOpen: !!detail,
    closeIssue,
    draft,
    onDraft: (e: React.ChangeEvent<HTMLInputElement>) => setDraft(e.target.value),
    addComment: openReal ? addCommentReal : addComment,

    // page flags
    isIssuesPage: page === 'issues',
    isHomePage: page === 'home',
    isYourWorkPage: page === 'yourwork',
    isProjectsPage: page === 'projects',
    isInboxPage: page === 'inbox',
    isProjectPage: page === 'issues',
    isStandardSidebar: page === 'home' || page === 'yourwork' || page === 'issues' || page === 'projects' || page === 'inbox',
    isWikiPage: page === 'wiki',
    isAiPage: page === 'ai',
    isSettingsPage: page === 'settings',
    goHome: () => setPage('home'),

    // inbox / уведомления
    openInbox: () => setPage('inbox'),
    unreadCount,
    hasUnread: unreadCount > 0,
    inboxItems,
    inboxLoading: inboxActive && (notifQ.isLoading || homeIssueQs.some((q) => q.isLoading)),
    inboxEmpty: !notifQ.isLoading && (notifQ.data?.data.length ?? 0) === 0,
    markAllRead: () => markAllReadMutation.mutate(),
    markingAll: markAllReadMutation.isPending,

    // settings
    settingsSection,
    setSettingsSection,
    settingsNavItems,
    settingsSectionTitle,
    settingsMembers,
    settingsMembersLoading,
    settingsMembersError,
    settingsMembersCount: settingsMembers.length,
    workspaceUrl,
    isOwner,

    // home
    homeGreeting,
    homeLoading,
    homeAssignedRows,
    homeDueSoonRows,
    homeAssignedCount: homeAssignedRows.length,
    homeDueSoonCount: homeDueSoonRows.length,
    today,

    // ---- AI-помощник (чат) ----
    aiPrompt,
    onAiPrompt: (e: React.ChangeEvent<HTMLTextAreaElement>) => setAiPrompt(e.target.value),
    aiTone,
    setAiTone: (t: AiTone) => setAiTone(t),
    submitAi,
    askAi,
    aiGenerating: aiGenerateMutation.isPending,
    aiMessages: aiMessages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      text: msg.text,
      copied: aiCopiedId === msg.id,
      copy: () => copyAiText(msg.id, msg.text),
    })),
    aiHasMessages: aiMessages.length > 0,
    aiError,
    clearAi: () => {
      setAiMessages([]);
      setAiError(null);
      setAiPrompt('');
    },

    // your work
    priorityBars,
    priorityAxis,
    donutBg,
    stateCats,
    assignedCount,
    createdCount,
    subscribedCount,
    workload,

    // projects
    projectsGrid,

    // skeleton
    skeletonGroups: [
      { rows: [{ w: '260px' }, { w: '190px' }, { w: '320px' }, { w: '150px' }] },
      { rows: [{ w: '210px' }, { w: '280px' }, { w: '170px' }] },
      { rows: [{ w: '240px' }, { w: '300px' }] },
    ],
    replaySkeleton: () => {
      if (issuesPageActive) {
        issuesQ.refetch();
        return;
      }
      setLoading(true);
      runSkeleton();
    },

    // palette
    paletteOpen,
    openPalette,
    closePalette: () => setPaletteOpen(false),
    stop: (e: React.MouseEvent) => e.stopPropagation(),
    query,
    onQuery: (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setSelIdx(0);
    },
    paletteSections,
    paletteEmpty: flat.length === 0,
  };
}

export type TFModel = ReturnType<typeof useTaskFlow>;
