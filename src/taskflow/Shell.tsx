import type { CSSProperties, ReactNode } from 'react';
import { useTF } from './context';
import { HButton, HA, HDiv } from './primitives';
import { Icon } from './icons';
import { Logo } from './Brand';
import { ChatSidebar } from './ChatPage';
import { railConfig } from './data';
import type { Page } from './types';

const sectionLabel: CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '.05em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
};

const footerBtn: CSSProperties = {
  width: '28px',
  height: '28px',
  border: '1px solid var(--border)',
  borderRadius: '7px',
  background: 'transparent',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all .14s',
  flexShrink: 0,
};

/** Аватар текущего пользователя: картинка при наличии, иначе кружок с инициалами. */
function UserAvatar({ size, font }: { size: number; font: number }): JSX.Element {
  const tf = useTF();
  const base: CSSProperties = { width: size, height: size, borderRadius: '50%', flexShrink: 0 };
  if (tf.me.avatarUrl) {
    return <img src={tf.me.avatarUrl} alt={tf.me.name} style={{ ...base, objectFit: 'cover' }} />;
  }
  return (
    <div
      style={{
        ...base,
        background: '#6366F1',
        color: '#fff',
        fontSize: font,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {tf.me.initials}
    </div>
  );
}

function UserFooter(): JSX.Element {
  const tf = useTF();
  return (
    <div
      style={{
        padding: '9px 10px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
      }}
    >
      <HDiv
        onClick={tf.openProfile}
        title="Profile"
        style={{ display: 'flex', alignItems: 'center', gap: '9px', flex: 1, minWidth: 0, padding: '3px 4px', margin: '-3px -4px', borderRadius: '8px', cursor: 'pointer', transition: 'background .14s' }}
        hoverStyle={{ background: 'var(--bg-elevated)' }}
      >
        <UserAvatar size={26} font={11} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '12.5px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tf.me.name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tf.me.role}
          </div>
        </div>
      </HDiv>
      <HButton
        onClick={tf.toggleTheme}
        title="Toggle theme"
        style={footerBtn}
        hoverStyle={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
      >
        <Icon name="theme" theme={tf.theme} />
      </HButton>
      <HButton
        onClick={tf.logout}
        title="Sign out"
        style={footerBtn}
        hoverStyle={{ background: 'rgba(239,68,68,.12)', color: '#EF4444', borderColor: 'rgba(239,68,68,.4)' }}
      >
        <Icon name="logout" />
      </HButton>
    </div>
  );
}

function LeftRail(): JSX.Element {
  const tf = useTF();
  const railItems = railConfig.map((r) => {
    const active =
      r.id === 'projects'
        ? tf.page === 'home' || tf.page === 'yourwork' || tf.page === 'issues' || tf.page === 'projects'
        : r.id === tf.page;
    return {
      id: r.id,
      label: r.label,
      icon: <Icon name={r.icon} />,
      bg: active ? 'var(--accent-subtle)' : 'transparent',
      color: active ? 'var(--accent)' : 'var(--text-muted)',
      onClick: () => tf.setPage(r.id as Page),
    };
  });
  return (
    <div
      style={{
        width: '56px',
        flexShrink: 0,
        background: 'var(--bg-app)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 0',
        gap: '5px',
      }}
    >
      <Logo size={30} radius={8} style={{ marginBottom: '8px' }} />
      {railItems.map((r) => (
        <HButton
          key={r.id}
          onClick={r.onClick}
          title={r.label}
          style={{
            width: '38px',
            height: '38px',
            border: 'none',
            borderRadius: '9px',
            background: r.bg,
            color: r.color,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all .14s',
            flexShrink: 0,
          }}
          hoverStyle={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
        >
          {r.icon}
        </HButton>
      ))}
    </div>
  );
}

function WorkspaceMenu(): JSX.Element {
  const tf = useTF();
  const item: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '8px 10px',
    borderRadius: '7px',
    cursor: 'pointer',
    fontSize: '13px',
    color: 'var(--text-primary)',
  };
  const iconBox: CSSProperties = {
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    flexShrink: 0,
  };
  return (
    <>
      <div onClick={tf.closeWsMenu} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
      <div
        style={{
          position: 'absolute',
          top: '52px',
          left: '10px',
          right: '10px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          borderRadius: '10px',
          boxShadow: 'var(--shadow)',
          padding: '6px',
          zIndex: 41,
        }}
      >
        <div style={{ padding: '8px 10px 4px', fontSize: '11.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {tf.me.email}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '4px 10px 10px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(150deg,var(--accent),#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: '#fff', flexShrink: 0 }}>
            {tf.workspaceInitial}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tf.workspaceName}</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{tf.me.role} · {tf.memberCount} members</div>
          </div>
        </div>
        <div style={{ height: '1px', background: 'var(--border)', margin: '2px 0 6px' }} />
        {tf.workspaceSwitcher.length > 1 && (
          <>
            <div style={{ padding: '4px 10px 4px', fontSize: '11px', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Switch workspace
            </div>
            {tf.workspaceSwitcher.map((w) => (
              <HDiv
                key={w.slug}
                onClick={w.switch}
                style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '6px 10px', borderRadius: '7px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)' }}
                hoverStyle={{ background: 'var(--bg-surface)' }}
              >
                <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'linear-gradient(150deg,var(--accent),#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#fff', flexShrink: 0 }}>
                  {w.initial}
                </div>
                <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.name}</span>
                {w.isCurrent && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4.5" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </HDiv>
            ))}
            <div style={{ height: '1px', background: 'var(--border)', margin: '6px 0' }} />
          </>
        )}
        <HDiv onClick={tf.openSettings} style={item} hoverStyle={{ background: 'var(--bg-surface)' }}>
          <span style={iconBox}><Icon name="gear" /></span>
          Settings
        </HDiv>
        <HDiv onClick={tf.openInvite} style={item} hoverStyle={{ background: 'var(--bg-surface)' }}>
          <span style={iconBox}><Icon name="personPlus" /></span>
          Invite members
        </HDiv>
        <HDiv onClick={tf.openCreateWorkspace} style={item} hoverStyle={{ background: 'var(--bg-surface)' }}>
          <span style={iconBox}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
            </svg>
          </span>
          Create workspace
        </HDiv>
        <div style={{ height: '1px', background: 'var(--border)', margin: '6px 0' }} />
        <HDiv onClick={tf.logout} style={{ ...item, color: '#EF4444' }} hoverStyle={{ background: 'rgba(239,68,68,.10)' }}>
          <span style={{ ...iconBox, color: '#EF4444' }}><Icon name="logout" /></span>
          Sign out
        </HDiv>
      </div>
    </>
  );
}

function StandardSidebar(): JSX.Element {
  const tf = useTF();
  return (
    <>
      <div style={{ padding: '10px', borderBottom: '1px solid var(--border)', position: 'relative' }}>
        <HButton
          onClick={tf.toggleWsMenu}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            padding: '7px 8px',
            border: 'none',
            background: 'transparent',
            borderRadius: '7px',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            transition: 'background .14s',
          }}
          hoverStyle={{ background: 'var(--bg-elevated)' }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'linear-gradient(150deg,var(--accent),#8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {tf.workspaceInitial}
          </div>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              flex: 1,
              textAlign: 'left',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {tf.workspaceName}
          </span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-muted)' }}>
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </HButton>
        {tf.wsMenuOpen && <WorkspaceMenu />}
      </div>
      <div style={{ padding: '10px 8px 4px' }}>
        <HButton
          onClick={tf.openPalette}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 9px',
            background: 'var(--bg-app)',
            border: '1px solid var(--border)',
            borderRadius: '7px',
            color: 'var(--text-muted)',
            fontFamily: 'inherit',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'border-color .14s',
          }}
          hoverStyle={{ borderColor: 'var(--border-strong)' }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx={7} cy={7} r={4.5} stroke="currentColor" strokeWidth={1.5} />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
          <span style={{ flex: 1, textAlign: 'left' }}>Search…</span>
          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: '11px', padding: '1px 5px', border: '1px solid var(--border)', borderRadius: '4px' }}>
            ⌘K
          </span>
        </HButton>
      </div>
      <nav style={{ padding: '6px 8px' }}>
        {tf.navItems.map((item, i) => (
          <HA
            key={i}
            href="#"
            onClick={item.onClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 9px',
              borderRadius: '7px',
              textDecoration: 'none',
              color: item.color,
              fontSize: '13px',
              fontWeight: item.weight,
              background: item.bg,
              marginBottom: '1px',
              transition: 'background .14s',
              position: 'relative',
            }}
            hoverStyle={{ background: 'var(--bg-elevated)' }}
          >
            <span style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {item.icon}
            </span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span
                style={{
                  minWidth: '17px',
                  height: '17px',
                  padding: '0 5px',
                  borderRadius: '9px',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.badge}
              </span>
            )}
          </HA>
        ))}
      </nav>
      <div style={{ padding: '14px 17px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={sectionLabel}>Projects</span>
        <svg
          onClick={tf.openCreateProject}
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <title>Create project</title>
          <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ padding: '0 8px', flex: 1, overflowY: 'auto' }}>
        {tf.projects.map((p, i) => (
          <HA
            key={i}
            href="#"
            onClick={p.onClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 9px',
              borderRadius: '7px',
              textDecoration: 'none',
              color: p.color,
              fontSize: '13px',
              fontWeight: p.weight,
              background: p.bg,
              marginBottom: '1px',
              transition: 'background .14s',
            }}
            hoverStyle={{ background: 'var(--bg-elevated)' }}
          >
            <span style={{ width: '16px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2.5px', background: p.dot }} />
            </span>
            <span style={{ flex: 1 }}>{p.name}</span>
            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: '11px', color: 'var(--text-muted)' }}>{p.identifier}</span>
          </HA>
        ))}
      </div>
      <UserFooter />
    </>
  );
}

function SettingsSidebar(): JSX.Element {
  const tf = useTF();
  const items = tf.settingsNavItems;
  return (
    <>
      <div onClick={tf.goHome} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '14px', cursor: 'pointer', flexShrink: 0 }}>
        <span style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <Icon name="arrowLeft" />
        </span>
        <span style={{ fontSize: '14px', fontWeight: 600 }}>Workspace settings</span>
      </div>
      <div style={{ padding: '0 14px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'linear-gradient(150deg,var(--accent),#8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 600,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {tf.workspaceInitial}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tf.workspaceName}</div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{tf.me.role}</div>
        </div>
      </div>
      <div style={{ padding: '16px 17px 6px' }}>
        <span style={sectionLabel}>Administration</span>
      </div>
      <nav style={{ padding: '2px 10px', flex: 1, overflowY: 'auto' }}>
        {items.map((item, i) => (
          <HA
            key={i}
            href="#"
            onClick={item.onClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 9px',
              borderRadius: '7px',
              textDecoration: 'none',
              color: item.color,
              fontSize: '13px',
              fontWeight: item.weight,
              background: item.bg,
              marginBottom: '1px',
              transition: 'background .14s',
            }}
            hoverStyle={{ background: 'var(--bg-elevated)' }}
          >
            <span style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {item.icon}
            </span>
            {item.label}
          </HA>
        ))}
      </nav>
    </>
  );
}

function SimpleSidebar({ title, children }: { title: string; children?: ReactNode }): JSX.Element {
  return (
    <>
      <div
        style={{
          height: '48px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-.01em' }}>{title}</span>
      </div>
      {children}
      <div style={{ flex: 1 }} />
      <UserFooter />
    </>
  );
}

function WikiSidebar(): JSX.Element {
  return (
    <SimpleSidebar title="Wiki">
      <div style={{ padding: '12px 10px 6px' }}>
        <HButton
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '32px',
            padding: '0 10px',
            background: 'var(--bg-app)',
            border: '1px solid var(--border-strong)',
            borderRadius: '7px',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'border-color .14s',
          }}
          hoverStyle={{ borderColor: 'var(--text-muted)' }}
        >
          <span style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <Icon name="newpage" />
          </span>
          New page
        </HButton>
      </div>
      <nav style={{ padding: '6px 10px' }}>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 9px',
            borderRadius: '7px',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: 600,
            background: 'var(--accent-subtle)',
          }}
        >
          <span style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="home2" />
          </span>
          Home
        </a>
      </nav>
      <div style={{ padding: '16px 17px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={sectionLabel}>Collections</span>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
          <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ padding: '0 10px' }}>
        <HA
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            padding: '6px 9px',
            borderRadius: '7px',
            textDecoration: 'none',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            marginBottom: '1px',
            transition: 'background .14s',
          }}
          hoverStyle={{ background: 'var(--bg-elevated)' }}
        >
          <span style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="folder" />
          </span>
          General
        </HA>
      </div>
      <div style={{ padding: '18px 17px 6px' }}>
        <span style={sectionLabel}>Shared</span>
      </div>
      <div style={{ padding: '2px 17px 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>No shared pages</div>
      <div style={{ padding: '18px 17px 6px' }}>
        <span style={sectionLabel}>Private</span>
      </div>
      <div style={{ padding: '2px 17px 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>No private pages</div>
      <div style={{ padding: '18px 17px 6px' }}>
        <span style={sectionLabel}>Archived</span>
      </div>
    </SimpleSidebar>
  );
}

function AiSidebar(): JSX.Element {
  return (
    <SimpleSidebar title="AI">
      <div style={{ padding: '12px 10px 6px', display: 'flex', gap: '8px' }}>
        <HButton
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '32px',
            padding: '0 10px',
            background: 'var(--bg-app)',
            border: '1px solid var(--border-strong)',
            borderRadius: '7px',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'border-color .14s',
          }}
          hoverStyle={{ borderColor: 'var(--text-muted)' }}
        >
          <span style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <Icon name="newpage" />
          </span>
          New chat
        </HButton>
        <HButton
          style={{
            width: '32px',
            height: '32px',
            flexShrink: 0,
            background: 'var(--bg-app)',
            border: '1px solid var(--border-strong)',
            borderRadius: '7px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all .14s',
          }}
          hoverStyle={{ borderColor: 'var(--text-muted)', color: 'var(--text-primary)' }}
        >
          <Icon name="search" />
        </HButton>
      </div>
      <div style={{ padding: '16px 17px 6px' }}>
        <span style={sectionLabel}>Recents</span>
      </div>
      <div style={{ padding: '2px 17px 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>No threads available</div>
    </SimpleSidebar>
  );
}

function Sidebar(): JSX.Element {
  const tf = useTF();
  let inner: ReactNode;
  if (tf.isChatPage) inner = <ChatSidebar />;
  else if (tf.isWikiPage) inner = <WikiSidebar />;
  else if (tf.isAiPage) inner = <AiSidebar />;
  else if (tf.isSettingsPage) inner = <SettingsSidebar />;
  else inner = <StandardSidebar />;
  return (
    <aside
      style={{
        width: '240px',
        flexShrink: 0,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {inner}
    </aside>
  );
}

function TopHeader(): JSX.Element {
  const tf = useTF();
  return (
    <header
      style={{
        height: '48px',
        flexShrink: 0,
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', minWidth: 0 }}>
        <span style={{ color: 'var(--text-muted)' }}>{tf.workspaceName}</span>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        {tf.isProjectPage && (
          <>
            <span style={{ width: '8px', height: '8px', borderRadius: '2.5px', background: tf.currentProjectDot }} />
            <span style={{ color: 'var(--text-secondary)' }}>{tf.currentProjectName}</span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
          </>
        )}
        <span style={{ fontWeight: 600 }}>{tf.pageName}</span>
      </div>
      <div style={{ flex: 1 }} />
      <HButton
        onClick={tf.openPalette}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '30px',
          padding: '0 10px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '7px',
          color: 'var(--text-muted)',
          fontFamily: 'inherit',
          fontSize: '12.5px',
          cursor: 'pointer',
          minWidth: '210px',
          transition: 'border-color .14s',
        }}
        hoverStyle={{ borderColor: 'var(--border-strong)' }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle cx={7} cy={7} r={4.5} stroke="currentColor" strokeWidth={1.5} />
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
        <span style={{ flex: 1, textAlign: 'left' }}>Search or jump…</span>
        <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: '11px', padding: '1px 5px', border: '1px solid var(--border)', borderRadius: '4px' }}>
          ⌘K
        </span>
      </HButton>
      <HButton
        onClick={tf.openInbox}
        title="Inbox"
        style={{
          width: '30px',
          height: '30px',
          border: '1px solid var(--border)',
          borderRadius: '7px',
          background: tf.isInboxPage ? 'var(--accent-subtle)' : 'var(--bg-surface)',
          color: tf.isInboxPage ? 'var(--accent)' : 'var(--text-secondary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'all .14s',
        }}
        hoverStyle={{ color: 'var(--text-primary)', borderColor: 'var(--border-strong)' }}
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <path d="M8 2a3.5 3.5 0 0 0-3.5 3.5c0 3-1.2 4-1.2 4h9.4s-1.2-1-1.2-4A3.5 3.5 0 0 0 8 2Z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
          <path d="M6.6 12a1.5 1.5 0 0 0 2.8 0" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
        </svg>
        {tf.hasUnread && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              minWidth: '15px',
              height: '15px',
              padding: '0 4px',
              borderRadius: '8px',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: '9.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid var(--bg-app)',
            }}
          >
            {tf.unreadCount > 9 ? '9+' : tf.unreadCount}
          </span>
        )}
      </HButton>
      <HDiv
        onClick={tf.openProfile}
        title={tf.me.name}
        style={{ cursor: 'pointer', borderRadius: '50%', display: 'flex' }}
        hoverStyle={{ opacity: 0.85 }}
      >
        <UserAvatar size={28} font={11} />
      </HDiv>
    </header>
  );
}

export { LeftRail, Sidebar, TopHeader };
