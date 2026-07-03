import type { CSSProperties } from 'react';
import { useTF } from './context';
import { FocusInput, HButton, HDiv, TFSelect } from './primitives';

export function IssueDetail(): JSX.Element | null {
  const tf = useTF();
  const d = tf.detail;
  if (!d) return null;
  return (
    <div
      onClick={tf.closeIssue}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(1px)', zIndex: 90, display: 'flex', justifyContent: 'flex-end' }}
    >
      <div
        onClick={tf.stop}
        style={{
          width: 'min(760px,88vw)',
          height: '100%',
          background: 'var(--bg-app)',
          borderLeft: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'tf-fade .16s ease-out',
        }}
      >
        <div style={{ height: '48px', flexShrink: 0, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px' }}>
          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: '12px', color: 'var(--text-muted)' }}>{d.key}</span>
          <div style={{ flex: 1 }} />
          {[
            { title: 'Previous', d: 'M10 4l-4 4 4 4' },
            { title: 'Next', d: 'M6 4l4 4-4 4' },
          ].map((b) => (
            <HButton
              key={b.title}
              title={b.title}
              style={{ width: '28px', height: '28px', border: '1px solid var(--border)', borderRadius: '7px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .14s' }}
              hoverStyle={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d={b.d} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </HButton>
          ))}
          {tf.canDeleteIssue && (
            <HButton
              onClick={tf.requestDeleteIssue}
              title="Delete issue"
              style={{ width: '28px', height: '28px', border: '1px solid var(--border)', borderRadius: '7px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .14s' }}
              hoverStyle={{ background: 'rgba(239,68,68,.12)', color: '#EF4444', borderColor: 'rgba(239,68,68,.4)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 4.5h10M6.5 4V3h3v1M5 4.5l.5 8h5l.5-8" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </HButton>
          )}
          <HButton
            onClick={tf.closeIssue}
            title="Close"
            style={{ width: '28px', height: '28px', border: '1px solid var(--border)', borderRadius: '7px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .14s', marginLeft: '2px' }}
            hoverStyle={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
            </svg>
          </HButton>
        </div>

        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '26px 30px', minWidth: 0 }}>
            <h1 style={{ margin: '0 0 18px', fontSize: '21px', fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.3, textWrap: 'pretty' }}>{d.title}</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '26px' }}>
              {d.desc.map((p, i) => (
                <p key={i} style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.65, color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                  {p}
                </p>
              ))}
            </div>

            {d.hasSub && (
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '11px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Sub-tasks</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'Geist Mono',monospace" }}>
                    {d.subDone}/{d.subTotal}
                  </span>
                  <div style={{ flex: 1, height: '5px', background: 'var(--bg-surface)', borderRadius: '3px', overflow: 'hidden', maxWidth: '160px' }}>
                    <div style={{ height: '100%', width: d.subPct, background: 'var(--accent)', borderRadius: '3px', transition: 'width .25s ease-out' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {d.subs.map((sub, i) => (
                    <HDiv
                      key={i}
                      onClick={sub.toggle}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 6px', borderRadius: '7px', cursor: 'pointer', transition: 'background .12s' }}
                      hoverStyle={{ background: 'var(--bg-surface)' }}
                    >
                      <span style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{sub.icon}</span>
                      <span style={{ fontSize: '13px', color: sub.color, textDecoration: sub.deco }}>{sub.t}</span>
                    </HDiv>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Activity</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'Geist Mono',monospace" }}>{d.commentCount}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '22px' }}>
              {d.comments.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '11px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: c.avColor, color: '#fff', fontSize: '10.5px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {c.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{c.name}</span>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{c.at}</span>
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', textWrap: 'pretty' }}>{c.t}</div>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={tf.addComment} style={{ display: 'flex', gap: '11px', alignItems: 'flex-start' }}>
              {tf.me.avatarUrl ? (
                <img src={tf.me.avatarUrl} alt={tf.me.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#6366F1', color: '#fff', fontSize: '10.5px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {tf.me.initials}
                </div>
              )}
              <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                <FocusInput
                  value={tf.draft}
                  onChange={tf.onDraft}
                  placeholder="Leave a comment…"
                  style={{ flex: 1, height: '36px', padding: '0 12px', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
                  focusStyle={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 3px var(--accent-subtle)' }}
                />
                <HButton
                  type="submit"
                  style={{ height: '36px', padding: '0 14px', border: 'none', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontSize: '12.5px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', transition: 'background .14s' }}
                  hoverStyle={{ background: 'var(--accent-hover)' }}
                >
                  Comment
                </HButton>
              </div>
            </form>
          </div>

          <div style={{ width: '236px', flexShrink: 0, borderLeft: '1px solid var(--border)', padding: '22px 18px', overflowY: 'auto', background: 'var(--bg-surface)' }}>
            <div style={{ position: 'relative', marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Status</div>
              <HButton
                onClick={d.toggleStatusMenu}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', height: '32px', padding: '0 10px', background: 'var(--bg-app)', border: '1px solid var(--border-strong)', borderRadius: '7px', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '13px', cursor: 'pointer', transition: 'border-color .14s' }}
                hoverStyle={{ borderColor: 'var(--text-muted)' }}
              >
                <span style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{d.stateIcon}</span>
                <span style={{ flex: 1, textAlign: 'left', fontWeight: 500 }}>{d.stateName}</span>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-muted)' }}>
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </HButton>
              {d.statusMenu && (
                <div style={{ position: 'absolute', top: '60px', left: 0, right: 0, background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '9px', boxShadow: 'var(--shadow)', padding: '5px', zIndex: 5 }}>
                  {d.statusOptions.map((opt, i) => (
                    <HDiv
                      key={i}
                      onClick={opt.choose}
                      style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '7px 8px', borderRadius: '6px', cursor: 'pointer', background: opt.bg }}
                      hoverStyle={{ background: 'var(--bg-surface)' }}
                    >
                      <span style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{opt.icon}</span>
                      <span style={{ fontSize: '13px' }}>{opt.name}</span>
                    </HDiv>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Priority</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <span style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{d.priorityIcon}</span>
                {d.priorityLabel}
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Assignees</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {d.assignees.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '13px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: a.color, color: '#fff', fontSize: '9.5px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {a.initials}
                    </div>
                    {a.name}
                  </div>
                ))}
              </div>
            </div>

            {d.hasLabels && (
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Labels</div>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>{d.labelPills}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '22px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Estimate</div>
                <div style={{ fontSize: '13px', fontFamily: "'Geist Mono',monospace" }}>{d.est} pts</div>
              </div>
              {d.due && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Due</div>
                  <div style={{ fontSize: '13px', fontFamily: "'Geist Mono',monospace", color: d.dueColor }}>{d.due}</div>
                </div>
              )}
            </div>
            <div style={{ paddingTop: '14px', marginTop: '14px', borderTop: '1px solid var(--border)', fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Created {d.created}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InviteMembers(): JSX.Element | null {
  const tf = useTF();
  if (!tf.inviteOpen) return null;
  const roleSelect: CSSProperties = {
    height: '38px',
    padding: '0 8px',
    background: 'var(--bg-app)',
    border: '1px solid var(--border-strong)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    outline: 'none',
  };
  const roleSelectSmall: CSSProperties = { ...roleSelect, height: '30px', borderRadius: '7px', fontSize: '12.5px' };
  const removeBtn: CSSProperties = {
    width: '30px',
    height: '30px',
    border: '1px solid var(--border)',
    borderRadius: '7px',
    background: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all .14s',
  };
  return (
    <div
      onClick={tf.closeInvite}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh', zIndex: 105 }}
    >
      <div
        onClick={tf.stop}
        style={{ width: '100%', maxWidth: '540px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '12px', boxShadow: 'var(--shadow)', overflow: 'hidden', animation: 'tf-pop .16s ease-out' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '15px 18px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: 600 }}>Invite members</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Add teammates to {tf.workspaceName} by email.</div>
          </div>
          <HButton
            onClick={tf.closeInvite}
            title="Close"
            style={{ width: '28px', height: '28px', border: '1px solid var(--border)', borderRadius: '7px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .14s' }}
            hoverStyle={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
            </svg>
          </HButton>
        </div>

        {tf.canManageMembers ? (
          <form onSubmit={tf.submitInvite} style={{ display: 'flex', gap: '8px', padding: '16px 18px 6px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <FocusInput
                value={tf.inviteEmail}
                onChange={tf.onInviteEmail}
                type="email"
                placeholder="name@company.com"
                autoComplete="off"
                style={{ width: '100%', height: '38px', padding: '0 12px', background: 'var(--bg-app)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                focusStyle={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 3px var(--accent-subtle)' }}
              />
              {tf.inviteSuggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '42px', left: 0, right: 0, background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '8px', boxShadow: 'var(--shadow)', padding: '4px', zIndex: 10, maxHeight: '224px', overflowY: 'auto' }}>
                  {tf.inviteSuggestions.map((s) => (
                    <HDiv
                      key={s.id}
                      onClick={s.pick}
                      style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '7px 8px', borderRadius: '7px', cursor: 'pointer' }}
                      hoverStyle={{ background: 'var(--bg-surface)' }}
                    >
                      {s.avatarUrl ? (
                        <img src={s.avatarUrl} alt={s.name} style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: s.color, color: '#fff', fontSize: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {s.initials}
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.email}</div>
                      </div>
                    </HDiv>
                  ))}
                </div>
              )}
            </div>
            <TFSelect
              value={tf.inviteRole}
              onChange={(v) => tf.setInviteRole(v as 'admin' | 'member' | 'guest')}
              style={roleSelect}
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'member', label: 'Member' },
                { value: 'guest', label: 'Guest' },
              ]}
            />
            <HButton
              type="submit"
              disabled={tf.inviteSubmitting || !tf.inviteEmail.trim()}
              style={{ height: '38px', padding: '0 16px', border: 'none', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', opacity: tf.inviteSubmitting || !tf.inviteEmail.trim() ? 0.6 : 1, transition: 'background .14s' }}
              hoverStyle={{ background: 'var(--accent-hover)' }}
            >
              {tf.inviteSubmitting ? (tf.inviteIsDirectAdd ? 'Adding…' : 'Inviting…') : tf.inviteIsDirectAdd ? 'Add' : 'Invite'}
            </HButton>
          </form>
        ) : (
          <div style={{ padding: '16px 18px 6px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Only workspace owners and admins can invite members.
          </div>
        )}
        {tf.inviteError && <div style={{ padding: '0 18px 6px', fontSize: '12.5px', color: '#EF4444' }}>{tf.inviteError}</div>}
        {tf.inviteNotice && <div style={{ padding: '0 18px 6px', fontSize: '12.5px', color: '#22C55E' }}>{tf.inviteNotice}</div>}
        {tf.inviteLink && (
          <div style={{ display: 'flex', gap: '8px', padding: '2px 18px 12px', alignItems: 'center' }}>
            <input
              readOnly
              value={tf.inviteLink}
              onFocus={(e) => e.currentTarget.select()}
              style={{ flex: 1, height: '34px', padding: '0 10px', background: 'var(--bg-app)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'var(--font-mono, monospace)', outline: 'none', boxSizing: 'border-box' }}
            />
            <HButton
              type="button"
              onClick={tf.copyInviteLink}
              style={{ height: '34px', padding: '0 14px', border: '1px solid var(--border-strong)', borderRadius: '8px', background: tf.inviteLinkCopied ? 'rgba(34,197,94,.14)' : 'transparent', color: tf.inviteLinkCopied ? '#22C55E' : 'var(--text-primary)', fontSize: '12.5px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .14s' }}
              hoverStyle={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              {tf.inviteLinkCopied ? 'Скопировано ✓' : 'Копировать ссылку'}
            </HButton>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--border)', maxHeight: '46vh', overflowY: 'auto', padding: '8px' }}>
          <div style={{ padding: '8px 10px 6px', fontSize: '11px', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Members · {tf.memberCount}
          </div>
          {tf.membersLoading && <div style={{ padding: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>Loading…</div>}
          {tf.membersList.map((m) => (
            <div key={m.userId} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '8px 10px' }}>
              {m.avatarUrl ? (
                <img src={m.avatarUrl} alt={m.name} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: m.color, color: '#fff', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {m.initials}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {m.name}
                  {m.isSelf && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> (you)</span>}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.email}</div>
              </div>
              {!m.isSelf && (
                m.isFollowing ? (
                  <HButton
                    onClick={m.toggleFollow}
                    disabled={m.followBusy}
                    style={{ height: '28px', padding: '0 11px', border: '1px solid var(--border-strong)', borderRadius: '7px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0, transition: 'all .14s' }}
                    hoverStyle={{ borderColor: 'rgba(239,68,68,.4)', color: '#EF4444' }}
                  >
                    Following
                  </HButton>
                ) : (
                  <HButton
                    onClick={m.toggleFollow}
                    disabled={m.followBusy}
                    style={{ height: '28px', padding: '0 12px', border: 'none', borderRadius: '7px', background: 'var(--accent)', color: '#fff', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0, transition: 'background .14s' }}
                    hoverStyle={{ background: 'var(--accent-hover)' }}
                  >
                    Follow
                  </HButton>
                )
              )}
              {m.canEdit ? (
                <>
                  <TFSelect
                    value={m.role}
                    onChange={(v) => m.setRole(v as 'admin' | 'member' | 'guest')}
                    style={roleSelectSmall}
                    options={[
                      { value: 'admin', label: 'Admin' },
                      { value: 'member', label: 'Member' },
                      { value: 'guest', label: 'Guest' },
                    ]}
                  />
                  <HButton onClick={m.remove} title="Remove" style={removeBtn} hoverStyle={{ background: 'rgba(239,68,68,.12)', color: '#EF4444', borderColor: 'rgba(239,68,68,.4)' }}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
                    </svg>
                  </HButton>
                </>
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>{m.roleLabel}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DeleteProject(): JSX.Element | null {
  const tf = useTF();
  if (!tf.deleteProjectOpen) return null;
  return (
    <div
      onClick={tf.closeDeleteProject}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh', zIndex: 101 }}
    >
      <div
        onClick={tf.stop}
        style={{ width: '100%', maxWidth: '420px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '12px', boxShadow: 'var(--shadow)', overflow: 'hidden', animation: 'tf-pop .16s ease-out' }}
      >
        <div style={{ padding: '20px 22px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '12px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'rgba(239,68,68,.14)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                <path d="M3 4.5h10M6.5 4V3h3v1M5 4.5l.5 8h5l.5-8" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600 }}>Delete project</div>
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Удалить проект <strong style={{ color: 'var(--text-primary)' }}>{tf.deleteProjectName}</strong>? Все его задачи будут удалены. Это действие необратимо.
          </div>
          {tf.deleteProjectError && <div style={{ marginTop: '10px', fontSize: '12.5px', color: '#EF4444' }}>{tf.deleteProjectError}</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
          <HButton
            type="button"
            onClick={tf.closeDeleteProject}
            style={{ height: '36px', padding: '0 14px', border: '1px solid var(--border-strong)', borderRadius: '8px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', transition: 'all .14s' }}
            hoverStyle={{ borderColor: 'var(--text-muted)', color: 'var(--text-primary)' }}
          >
            Cancel
          </HButton>
          <HButton
            type="button"
            onClick={tf.confirmDeleteProject}
            disabled={tf.deletingProject}
            style={{ height: '36px', padding: '0 16px', border: 'none', borderRadius: '8px', background: '#EF4444', color: '#fff', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', opacity: tf.deletingProject ? 0.6 : 1, transition: 'background .14s' }}
            hoverStyle={{ background: '#DC2626' }}
          >
            {tf.deletingProject ? 'Deleting…' : 'Delete project'}
          </HButton>
        </div>
      </div>
    </div>
  );
}

export function DeleteWorkspace(): JSX.Element | null {
  const tf = useTF();
  if (!tf.deleteWorkspaceOpen) return null;
  return (
    <div
      onClick={tf.closeDeleteWorkspace}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh', zIndex: 102 }}
    >
      <div
        onClick={tf.stop}
        style={{ width: '100%', maxWidth: '440px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '12px', boxShadow: 'var(--shadow)', overflow: 'hidden', animation: 'tf-pop .16s ease-out' }}
      >
        <div style={{ padding: '20px 22px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '12px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'rgba(239,68,68,.14)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                <path d="M3 4.5h10M6.5 4V3h3v1M5 4.5l.5 8h5l.5-8" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600 }}>Delete workspace</div>
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Удалить воркспейс <strong style={{ color: 'var(--text-primary)' }}>{tf.workspaceName}</strong>? Все проекты,
            задачи и страницы будут удалены для всех участников. Это действие необратимо.
          </div>
          {tf.deleteWorkspaceError && <div style={{ marginTop: '10px', fontSize: '12.5px', color: '#EF4444' }}>{tf.deleteWorkspaceError}</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
          <HButton
            type="button"
            onClick={tf.closeDeleteWorkspace}
            style={{ height: '36px', padding: '0 14px', border: '1px solid var(--border-strong)', borderRadius: '8px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', transition: 'all .14s' }}
            hoverStyle={{ borderColor: 'var(--text-muted)', color: 'var(--text-primary)' }}
          >
            Cancel
          </HButton>
          <HButton
            type="button"
            onClick={tf.confirmDeleteWorkspace}
            disabled={tf.deletingWorkspace}
            style={{ height: '36px', padding: '0 16px', border: 'none', borderRadius: '8px', background: '#EF4444', color: '#fff', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', opacity: tf.deletingWorkspace ? 0.6 : 1, transition: 'background .14s' }}
            hoverStyle={{ background: '#DC2626' }}
          >
            {tf.deletingWorkspace ? 'Deleting…' : 'Delete workspace'}
          </HButton>
        </div>
      </div>
    </div>
  );
}

export function DeleteIssue(): JSX.Element | null {
  const tf = useTF();
  if (!tf.deleteIssueOpen) return null;
  return (
    <div
      onClick={tf.closeDeleteIssue}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh', zIndex: 110 }}
    >
      <div
        onClick={tf.stop}
        style={{ width: '100%', maxWidth: '420px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '12px', boxShadow: 'var(--shadow)', overflow: 'hidden', animation: 'tf-pop .16s ease-out' }}
      >
        <div style={{ padding: '20px 22px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '12px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'rgba(239,68,68,.14)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                <path d="M3 4.5h10M6.5 4V3h3v1M5 4.5l.5 8h5l.5-8" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600 }}>Delete issue</div>
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Удалить задачу <strong style={{ color: 'var(--text-primary)', fontFamily: "'Geist Mono',monospace" }}>{tf.deleteIssueKey}</strong>?
            Она исчезнет из проекта.
          </div>
          {tf.deleteIssueError && <div style={{ marginTop: '10px', fontSize: '12.5px', color: '#EF4444' }}>{tf.deleteIssueError}</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
          <HButton
            type="button"
            onClick={tf.closeDeleteIssue}
            style={{ height: '36px', padding: '0 14px', border: '1px solid var(--border-strong)', borderRadius: '8px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', transition: 'all .14s' }}
            hoverStyle={{ borderColor: 'var(--text-muted)', color: 'var(--text-primary)' }}
          >
            Cancel
          </HButton>
          <HButton
            type="button"
            onClick={tf.confirmDeleteIssue}
            disabled={tf.deletingIssue}
            style={{ height: '36px', padding: '0 16px', border: 'none', borderRadius: '8px', background: '#EF4444', color: '#fff', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', opacity: tf.deletingIssue ? 0.6 : 1, transition: 'background .14s' }}
            hoverStyle={{ background: '#DC2626' }}
          >
            {tf.deletingIssue ? 'Deleting…' : 'Delete issue'}
          </HButton>
        </div>
      </div>
    </div>
  );
}

export function CreateWorkspace(): JSX.Element | null {
  const tf = useTF();
  if (!tf.createWsOpen) return null;
  const label: CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' };
  const inputStyle: CSSProperties = {
    width: '100%',
    height: '38px',
    padding: '0 12px',
    background: 'var(--bg-app)',
    border: '1px solid var(--border-strong)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };
  const focus: CSSProperties = { borderColor: 'var(--accent)', boxShadow: '0 0 0 3px var(--accent-subtle)' };
  const errText: CSSProperties = { fontSize: '11.5px', color: '#EF4444', marginTop: '6px' };
  const disabled = tf.creatingWorkspace || !tf.wsName.trim() || tf.wsSlugInput.trim().length < 2;
  return (
    <div
      onClick={tf.closeCreateWorkspace}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '13vh', zIndex: 100 }}
    >
      <form
        onClick={tf.stop}
        onSubmit={tf.submitCreateWorkspace}
        style={{ width: '100%', maxWidth: '460px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '12px', boxShadow: 'var(--shadow)', overflow: 'hidden', animation: 'tf-pop .16s ease-out' }}
      >
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', fontSize: '15px', fontWeight: 600 }}>Create workspace</div>
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={label}>Workspace name</label>
            <FocusInput value={tf.wsName} onChange={tf.onWsName} autoFocus placeholder="Avengers Squad" style={inputStyle} focusStyle={focus} />
            {tf.wsNameError && <div style={errText}>{tf.wsNameError}</div>}
          </div>
          <div>
            <label style={label}>URL slug</label>
            <FocusInput
              value={tf.wsSlugInput}
              onChange={tf.onWsSlug}
              placeholder="avengers-squad"
              style={{ ...inputStyle, fontFamily: "'Geist Mono',monospace" }}
              focusStyle={focus}
            />
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
              taskflow.app/{tf.wsSlugInput || 'your-workspace'} · a–z, 0–9, «-», 2–50 символов.
            </div>
            {tf.wsSlugError && <div style={errText}>{tf.wsSlugError}</div>}
          </div>
          {tf.wsError && <div style={{ fontSize: '12.5px', color: '#EF4444' }}>{tf.wsError}</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
          <HButton
            type="button"
            onClick={tf.closeCreateWorkspace}
            style={{ height: '36px', padding: '0 14px', border: '1px solid var(--border-strong)', borderRadius: '8px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', transition: 'all .14s' }}
            hoverStyle={{ borderColor: 'var(--text-muted)', color: 'var(--text-primary)' }}
          >
            Cancel
          </HButton>
          <HButton
            type="submit"
            disabled={disabled}
            style={{ height: '36px', padding: '0 16px', border: 'none', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', opacity: disabled ? 0.6 : 1, transition: 'background .14s' }}
            hoverStyle={{ background: 'var(--accent-hover)' }}
          >
            {tf.creatingWorkspace ? 'Creating…' : 'Create workspace'}
          </HButton>
        </div>
      </form>
    </div>
  );
}

export function CreateProject(): JSX.Element | null {
  const tf = useTF();
  if (!tf.createProjectOpen) return null;
  const label: CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' };
  const inputStyle: CSSProperties = {
    width: '100%',
    height: '38px',
    padding: '0 12px',
    background: 'var(--bg-app)',
    border: '1px solid var(--border-strong)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };
  const focus: CSSProperties = { borderColor: 'var(--accent)', boxShadow: '0 0 0 3px var(--accent-subtle)' };
  const errText: CSSProperties = { fontSize: '11.5px', color: '#EF4444', marginTop: '6px' };
  const disabled = tf.creatingProject || !tf.projName.trim() || !tf.projIdentifier.trim();
  return (
    <div
      onClick={tf.closeCreateProject}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '13vh', zIndex: 100 }}
    >
      <form
        onClick={tf.stop}
        onSubmit={tf.submitCreateProject}
        style={{ width: '100%', maxWidth: '460px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '12px', boxShadow: 'var(--shadow)', overflow: 'hidden', animation: 'tf-pop .16s ease-out' }}
      >
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', fontSize: '15px', fontWeight: 600 }}>Create project</div>
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={label}>Project name</label>
            <FocusInput value={tf.projName} onChange={tf.onProjName} autoFocus placeholder="Mobile App" style={inputStyle} focusStyle={focus} />
            {tf.projNameError && <div style={errText}>{tf.projNameError}</div>}
          </div>
          <div>
            <label style={label}>Identifier</label>
            <FocusInput
              value={tf.projIdentifier}
              onChange={tf.onProjIdentifier}
              placeholder="MOB"
              style={{ ...inputStyle, fontFamily: "'Geist Mono',monospace", textTransform: 'uppercase' }}
              focusStyle={focus}
            />
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Ключ задач: {(tf.projIdentifier || 'MOB')}-123 · A–Z, 0–9, до 10 символов.
            </div>
            {tf.projIdentifierError && <div style={errText}>{tf.projIdentifierError}</div>}
          </div>
          {tf.projError && <div style={{ fontSize: '12.5px', color: '#EF4444' }}>{tf.projError}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
          <HButton
            type="button"
            onClick={tf.openInvite}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', height: '36px', padding: '0 12px', border: '1px solid var(--border-strong)', borderRadius: '8px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', transition: 'all .14s' }}
            hoverStyle={{ borderColor: 'var(--text-muted)', color: 'var(--text-primary)' }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx={6} cy={5} r={2.5} stroke="currentColor" strokeWidth={1.4} />
              <path d="M2 13c0-2.2 1.8-4 4-4M11.5 5.5v4M13.5 7.5h-4" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
            </svg>
            Invite members
          </HButton>
          <div style={{ display: 'flex', gap: '8px' }}>
            <HButton
              type="button"
              onClick={tf.closeCreateProject}
              style={{ height: '36px', padding: '0 14px', border: '1px solid var(--border-strong)', borderRadius: '8px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', transition: 'all .14s' }}
              hoverStyle={{ borderColor: 'var(--text-muted)', color: 'var(--text-primary)' }}
            >
              Cancel
            </HButton>
            <HButton
              type="submit"
              disabled={disabled}
              style={{ height: '36px', padding: '0 16px', border: 'none', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', opacity: disabled ? 0.6 : 1, transition: 'background .14s' }}
              hoverStyle={{ background: 'var(--accent-hover)' }}
            >
              {tf.creatingProject ? 'Creating…' : 'Create project'}
            </HButton>
          </div>
        </div>
      </form>
    </div>
  );
}

export function CreateIssue(): JSX.Element | null {
  const tf = useTF();
  if (!tf.createIssueOpen) return null;
  const label: CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' };
  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    background: 'var(--bg-app)',
    border: '1px solid var(--border-strong)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };
  const selectStyle: CSSProperties = { ...inputStyle, height: '38px', cursor: 'pointer' };
  const focus: CSSProperties = { borderColor: 'var(--accent)', boxShadow: '0 0 0 3px var(--accent-subtle)' };
  const disabled = tf.creatingIssue || !tf.issueTitle.trim();
  return (
    <div
      onClick={tf.closeCreateIssue}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh', zIndex: 103 }}
    >
      <form
        onClick={tf.stop}
        onSubmit={tf.submitCreateIssue}
        style={{ width: '100%', maxWidth: '520px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '12px', boxShadow: 'var(--shadow)', overflow: 'hidden', animation: 'tf-pop .16s ease-out' }}
      >
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', fontSize: '15px', fontWeight: 600 }}>New issue</div>
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={label}>Title</label>
            <FocusInput value={tf.issueTitle} onChange={tf.onIssueTitle} autoFocus placeholder="Что нужно сделать?" style={{ ...inputStyle, height: '38px' }} focusStyle={focus} />
          </div>
          <div>
            <label style={label}>Description</label>
            <textarea
              value={tf.issueDesc}
              onChange={tf.onIssueDesc}
              placeholder="Добавьте детали (необязательно)…"
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={label}>Status</label>
              <TFSelect
                value={tf.issueStateId}
                onChange={(v) => tf.setIssueStateId(v)}
                style={selectStyle}
                options={tf.issueStateOptions.map((s) => ({ value: s.id, label: s.name }))}
              />
            </div>
            <div>
              <label style={label}>Priority</label>
              <TFSelect
                value={tf.issuePriority}
                onChange={(v) => tf.setIssuePriority(v)}
                style={selectStyle}
                options={tf.issuePriorityOptions.map((p) => ({ value: p.id, label: p.label }))}
              />
            </div>
          </div>
          {tf.issueError && <div style={{ fontSize: '12.5px', color: '#EF4444' }}>{tf.issueError}</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
          <HButton
            type="button"
            onClick={tf.closeCreateIssue}
            style={{ height: '36px', padding: '0 14px', border: '1px solid var(--border-strong)', borderRadius: '8px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', transition: 'all .14s' }}
            hoverStyle={{ borderColor: 'var(--text-muted)', color: 'var(--text-primary)' }}
          >
            Cancel
          </HButton>
          <HButton
            type="submit"
            disabled={disabled}
            style={{ height: '36px', padding: '0 16px', border: 'none', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', opacity: disabled ? 0.6 : 1, transition: 'background .14s' }}
            hoverStyle={{ background: 'var(--accent-hover)' }}
          >
            {tf.creatingIssue ? 'Creating…' : 'Create issue'}
          </HButton>
        </div>
      </form>
    </div>
  );
}

export function ProjectMembers(): JSX.Element | null {
  const tf = useTF();
  if (!tf.projMembersOpen) return null;
  const roleSelect: CSSProperties = {
    height: '38px',
    padding: '0 8px',
    background: 'var(--bg-app)',
    border: '1px solid var(--border-strong)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    outline: 'none',
  };
  const removeBtn: CSSProperties = {
    width: '30px',
    height: '30px',
    border: '1px solid var(--border)',
    borderRadius: '7px',
    background: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all .14s',
  };
  const canAdd = tf.canManageProjectMembers && tf.addableWsMembers.length > 0;
  return (
    <div
      onClick={tf.closeProjMembers}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh', zIndex: 100 }}
    >
      <div
        onClick={tf.stop}
        style={{ width: '100%', maxWidth: '540px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '12px', boxShadow: 'var(--shadow)', overflow: 'hidden', animation: 'tf-pop .16s ease-out' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '15px 18px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: 600 }}>Project members</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Кто имеет доступ к проекту «{tf.projectMembersName}».</div>
          </div>
          <HButton
            onClick={tf.closeProjMembers}
            title="Close"
            style={{ width: '28px', height: '28px', border: '1px solid var(--border)', borderRadius: '7px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .14s' }}
            hoverStyle={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
            </svg>
          </HButton>
        </div>

        {tf.canManageProjectMembers ? (
          canAdd ? (
            <form onSubmit={tf.submitAddProjMember} style={{ display: 'flex', gap: '8px', padding: '16px 18px 6px' }}>
              <TFSelect
                value={tf.pmUserId}
                onChange={(v) => tf.setPmUserId(v)}
                placeholder="Select a member…"
                style={{ flex: 1, height: '38px', padding: '0 10px', background: 'var(--bg-app)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'inherit', cursor: 'pointer', outline: 'none' }}
                options={tf.addableWsMembers.map((m) => ({ value: m.userId, label: `${m.name}${m.email ? ` · ${m.email}` : ''}` }))}
              />
              <TFSelect
                value={tf.pmRole}
                onChange={(v) => tf.setPmRole(v as 'admin' | 'member' | 'viewer')}
                style={roleSelect}
                options={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'member', label: 'Member' },
                  { value: 'viewer', label: 'Viewer' },
                ]}
              />
              <HButton
                type="submit"
                disabled={tf.addingProjMember || !tf.pmUserId}
                style={{ height: '38px', padding: '0 16px', border: 'none', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', opacity: tf.addingProjMember || !tf.pmUserId ? 0.6 : 1, transition: 'background .14s' }}
                hoverStyle={{ background: 'var(--accent-hover)' }}
              >
                {tf.addingProjMember ? 'Adding…' : 'Add'}
              </HButton>
            </form>
          ) : (
            <div style={{ padding: '16px 18px 6px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Все участники воркспейса уже в проекте. Добавь новых через «Invite members» в воркспейсе.
            </div>
          )
        ) : (
          <div style={{ padding: '16px 18px 6px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Управлять участниками проекта могут только owner/admin воркспейса.
          </div>
        )}
        {tf.pmError && <div style={{ padding: '0 18px 6px', fontSize: '12.5px', color: '#EF4444' }}>{tf.pmError}</div>}

        <div style={{ borderTop: '1px solid var(--border)', maxHeight: '46vh', overflowY: 'auto', padding: '8px' }}>
          <div style={{ padding: '8px 10px 6px', fontSize: '11px', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Members · {tf.projectMemberCount}
          </div>
          {tf.projectMembersLoading && <div style={{ padding: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>Loading…</div>}
          {!tf.projectMembersLoading && tf.projectMembersList.length === 0 && (
            <div style={{ padding: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>Пока никого. Добавь участника выше.</div>
          )}
          {tf.projectMembersList.map((m) => (
            <div key={m.userId} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '8px 10px' }}>
              {m.avatarUrl ? (
                <img src={m.avatarUrl} alt={m.name} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: m.color, color: '#fff', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {m.initials}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {m.name}
                  {m.isSelf && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> (you)</span>}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.email}</div>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>{m.roleLabel}</span>
              {m.canRemove && (
                <HButton onClick={m.remove} title="Remove from project" style={removeBtn} hoverStyle={{ background: 'rgba(239,68,68,.12)', color: '#EF4444', borderColor: 'rgba(239,68,68,.4)' }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
                  </svg>
                </HButton>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CommandPalette(): JSX.Element | null {
  const tf = useTF();
  if (!tf.paletteOpen) return null;
  return (
    <div
      onClick={tf.closePalette}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '14vh', zIndex: 100 }}
    >
      <div
        onClick={tf.stop}
        style={{ width: '100%', maxWidth: '576px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '12px', boxShadow: 'var(--shadow)', overflow: 'hidden', animation: 'tf-pop .16s ease-out' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <svg width="17" height="17" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
            <circle cx={7} cy={7} r={4.5} stroke="currentColor" strokeWidth={1.5} />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
          <FocusInput
            ref={tf.paletteInputRef}
            value={tf.query}
            onChange={tf.onQuery}
            placeholder="Search issues, projects, or run a command…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '15px', fontFamily: 'inherit' }}
          />
          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: '11px', padding: '2px 6px', border: '1px solid var(--border-strong)', borderRadius: '5px', color: 'var(--text-muted)' }}>esc</span>
        </div>
        <div style={{ maxHeight: 'min(56vh,440px)', overflowY: 'auto', padding: '8px' }}>
          {tf.paletteSections.map((section, si) => (
            <div key={si}>
              <div style={{ padding: '6px 8px 4px', fontSize: '11px', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {section.name}
              </div>
              {section.items.map((cmd, ci) => (
                <div
                  key={ci}
                  onMouseEnter={cmd.hover}
                  onClick={tf.closePalette}
                  style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '9px 10px', borderRadius: '8px', cursor: 'pointer', background: cmd.bg, marginBottom: '1px' }}
                >
                  <span style={{ width: '17px', height: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--text-secondary)' }}>{cmd.icon}</span>
                  {cmd.cmdKey && <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>{cmd.cmdKey}</span>}
                  <span style={{ flex: 1, fontSize: '13.5px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cmd.label}</span>
                  {cmd.hint && <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', flexShrink: 0 }}>{cmd.hint}</span>}
                </div>
              ))}
            </div>
          ))}
          {tf.paletteEmpty && (
            <div style={{ padding: '32px 8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No results for "{tf.query}"</div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '9px 16px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontFamily: "'Geist Mono',monospace", padding: '1px 5px', border: '1px solid var(--border-strong)', borderRadius: '4px' }}>↑↓</span> navigate
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontFamily: "'Geist Mono',monospace", padding: '1px 5px', border: '1px solid var(--border-strong)', borderRadius: '4px' }}>↵</span> select
          </span>
        </div>
      </div>
    </div>
  );
}
