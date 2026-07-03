import { useRef } from 'react';
import { useTF } from './context';
import { HButton, HDiv } from './primitives';

interface BriefUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  avatarUrl: string | null;
  isFollowing: boolean;
  isSelf: boolean;
  follow: () => void;
  unfollow: () => void;
}

function Avatar({ url, initials, color, size }: { url: string | null; initials: string; color: string; size: number }): JSX.Element {
  if (url) {
    return <img src={url} alt={initials} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />;
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, color: '#fff', fontSize: size * 0.38, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function UserRow({ u }: { u: BriefUser }): JSX.Element {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '8px 10px' }}>
      <Avatar url={u.avatarUrl} initials={u.initials} color={u.color} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>
      </div>
      {!u.isSelf &&
        (u.isFollowing ? (
          <HButton
            onClick={u.unfollow}
            style={{ height: '30px', padding: '0 13px', border: '1px solid var(--border-strong)', borderRadius: '7px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0, transition: 'all .14s' }}
            hoverStyle={{ borderColor: 'rgba(239,68,68,.4)', color: '#EF4444' }}
          >
            Following
          </HButton>
        ) : (
          <HButton
            onClick={u.follow}
            style={{ height: '30px', padding: '0 14px', border: 'none', borderRadius: '7px', background: 'var(--accent)', color: '#fff', fontSize: '12.5px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0, transition: 'background .14s' }}
            hoverStyle={{ background: 'var(--accent-hover)' }}
          >
            Follow
          </HButton>
        ))}
    </div>
  );
}

export function ProfileModal(): JSX.Element | null {
  const tf = useTF();
  const fileRef = useRef<HTMLInputElement>(null);
  if (!tf.profileOpen) return null;

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) tf.uploadAvatar(f);
    e.target.value = '';
  };

  const isFollowingTab = tf.profileTab === 'following';
  const list = isFollowingTab ? tf.followingList : tf.followersList;
  const listLoading = isFollowingTab ? tf.followingLoading : tf.followersLoading;

  const tab = (id: 'following' | 'followers', label: string, count: number) => {
    const active = tf.profileTab === id;
    return (
      <HDiv
        onClick={() => tf.setProfileTab(id)}
        style={{ padding: '10px 4px', fontSize: '13px', fontWeight: 600, color: active ? 'var(--accent)' : 'var(--text-secondary)', borderBottom: `2px solid ${active ? 'var(--accent)' : 'transparent'}`, cursor: 'pointer', transition: 'color .14s' }}
        hoverStyle={active ? {} : { color: 'var(--text-primary)' }}
      >
        {label} <span style={{ fontFamily: "'Geist Mono',monospace", color: 'var(--text-muted)' }}>{count}</span>
      </HDiv>
    );
  };

  return (
    <div
      onClick={tf.closeProfile}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh', zIndex: 106 }}
    >
      <div
        onClick={tf.stop}
        style={{ width: '100%', maxWidth: '480px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '12px', boxShadow: 'var(--shadow)', overflow: 'hidden', animation: 'tf-pop .16s ease-out' }}
      >
        {/* Шапка */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '15px 18px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ flex: 1, fontSize: '15px', fontWeight: 600 }}>Профиль</div>
          <HButton
            onClick={tf.closeProfile}
            title="Close"
            style={{ width: '28px', height: '28px', border: '1px solid var(--border)', borderRadius: '7px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .14s' }}
            hoverStyle={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
            </svg>
          </HButton>
        </div>

        {/* Аватар + имя */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 18px' }}>
          <Avatar url={tf.me.avatarUrl} initials={tf.me.initials} color="var(--accent)" size={64} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '16px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tf.me.name}</div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tf.me.email}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onPick} style={{ display: 'none' }} />
              <HButton
                onClick={() => fileRef.current?.click()}
                disabled={tf.avatarUploading}
                style={{ height: '32px', padding: '0 13px', border: 'none', borderRadius: '7px', background: 'var(--accent)', color: '#fff', fontSize: '12.5px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', opacity: tf.avatarUploading ? 0.6 : 1, transition: 'background .14s' }}
                hoverStyle={{ background: 'var(--accent-hover)' }}
              >
                {tf.avatarUploading ? 'Загрузка…' : tf.hasAvatar ? 'Сменить фото' : 'Загрузить фото'}
              </HButton>
              {tf.hasAvatar && (
                <HButton
                  onClick={tf.deleteAvatar}
                  disabled={tf.avatarDeleting}
                  style={{ height: '32px', padding: '0 12px', border: '1px solid var(--border-strong)', borderRadius: '7px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', opacity: tf.avatarDeleting ? 0.6 : 1, transition: 'all .14s' }}
                  hoverStyle={{ borderColor: 'rgba(239,68,68,.4)', color: '#EF4444' }}
                >
                  Удалить
                </HButton>
              )}
            </div>
          </div>
        </div>

        {/* Вкладки Following / Followers */}
        <div style={{ display: 'flex', gap: '20px', padding: '0 18px', borderBottom: '1px solid var(--border)' }}>
          {tab('following', 'Подписки', tf.followingCount)}
          {tab('followers', 'Подписчики', tf.followersCount)}
        </div>

        {/* Список */}
        <div style={{ maxHeight: '40vh', overflowY: 'auto', padding: '8px' }}>
          {listLoading && list.length === 0 ? (
            <div style={{ padding: '18px 10px', fontSize: '13px', color: 'var(--text-muted)' }}>Загрузка…</div>
          ) : list.length === 0 ? (
            <div style={{ padding: '28px 10px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
              {isFollowingTab ? 'Вы пока ни на кого не подписаны.' : 'У вас пока нет подписчиков.'}
            </div>
          ) : (
            list.map((u) => <UserRow key={u.id} u={u} />)
          )}
        </div>
      </div>
    </div>
  );
}
