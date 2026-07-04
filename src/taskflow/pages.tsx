import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTF } from './context';
import type { IssueRow } from './useTaskFlow';
import { HButton, HDiv, TFSelect } from './primitives';
import { Icon, WikiStackIcon, WikiStickyIcon } from './icons';
import { toast } from './toast';

function shimmer(w: string, h: string, radius: string): CSSProperties {
  return {
    width: w,
    height: h,
    borderRadius: radius,
    background: 'linear-gradient(90deg,var(--bg-surface) 25%,var(--bg-elevated) 40%,var(--bg-surface) 60%)',
    backgroundSize: '400px 100%',
    animation: 'tf-shimmer 1.4s ease-in-out infinite',
  };
}

function DueChip({ row, small }: { row: IssueRow; small?: boolean }): JSX.Element | null {
  if (!row.due) return null;
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: small ? '11px' : '11.5px',
        fontFamily: "'Geist Mono',monospace",
        color: row.dueColor,
        background: row.dueBg,
        padding: '2px 7px',
        borderRadius: '5px',
        flexShrink: 0,
      }}
    >
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
        <rect x={2.5} y={3} width={11} height={11} rx={2} stroke="currentColor" strokeWidth={1.3} />
        <path d="M2.5 6h11M5.5 1.5v2M10.5 1.5v2" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" />
      </svg>
      {row.due}
    </span>
  );
}

/** A single issue line (used by the list view and the Home page). */
function IssueLine({ row, card }: { row: IssueRow; card?: boolean }): JSX.Element {
  return (
    <>
      <span style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {row.priorityIcon}
      </span>
      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: '12px', color: 'var(--text-muted)', width: '58px', flexShrink: 0 }}>
        {row.key}
      </span>
      <span style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {row.stateIcon}
      </span>
      <span
        style={{
          fontSize: '13px',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flex: 1,
          minWidth: '60px',
        }}
      >
        {row.title}
      </span>
      <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>{row.labelPills}</div>
      <DueChip row={row} />
      <div style={{ flexShrink: 0, width: card ? '30px' : '64px', display: 'flex', justifyContent: 'flex-end' }}>{row.avatars}</div>
    </>
  );
}

function IssuesToolbar(): JSX.Element {
  const tf = useTF();
  return (
    <div
      style={{
        height: '44px',
        flexShrink: 0,
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, flexWrap: 'wrap' }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '26px',
          padding: '0 9px',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
        }}
      >
        <span style={{ color: 'var(--text-muted)' }}>Group by</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Status</span>
      </div>
      <div style={{ display: 'flex', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '7px', padding: '2px' }}>
        <button
          onClick={tf.setListViewList}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            height: '22px',
            padding: '0 8px',
            border: 'none',
            borderRadius: '5px',
            background: tf.listBtnBg,
            color: tf.listBtnColor,
            fontSize: '12px',
            fontFamily: 'inherit',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all .14s',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M2.5 4h11M2.5 8h11M2.5 12h11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
          List
        </button>
        <button
          onClick={tf.setListViewBoard}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            height: '22px',
            padding: '0 8px',
            border: 'none',
            borderRadius: '5px',
            background: tf.boardBtnBg,
            color: tf.boardBtnColor,
            fontSize: '12px',
            fontFamily: 'inherit',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all .14s',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <rect x={2} y={2.5} width={4} height={11} rx={1} stroke="currentColor" strokeWidth={1.4} />
            <rect x={10} y={2.5} width={4} height={7} rx={1} stroke="currentColor" strokeWidth={1.4} />
          </svg>
          Board
        </button>
      </div>
      <HButton
        onClick={tf.openProjMembers}
        title="Project members"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '26px',
          padding: '0 9px',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          background: 'var(--bg-surface)',
          color: 'var(--text-secondary)',
          fontFamily: 'inherit',
          fontSize: '12px',
          cursor: 'pointer',
          transition: 'all .14s',
        }}
        hoverStyle={{ color: 'var(--text-primary)', borderColor: 'var(--border-strong)' }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle cx={6} cy={5.5} r={2.5} stroke="currentColor" strokeWidth={1.4} />
          <path d="M1.5 13c0-2.2 1.8-3.4 4.5-3.4S10.5 10.8 10.5 13" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
          <path d="M11 4a2 2 0 0 1 0 3.4M11.5 13c0-1.6-.5-2.7-1.4-3.4" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
        </svg>
        Members
      </HButton>
      <HButton
        onClick={tf.replaySkeleton}
        title="Reload"
        style={{
          width: '28px',
          height: '26px',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          background: 'var(--bg-surface)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all .14s',
        }}
        hoverStyle={{ color: 'var(--text-primary)', borderColor: 'var(--border-strong)' }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M13 8a5 5 0 1 1-1.6-3.7M13 2v3h-3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </HButton>
      <HButton
        onClick={() => tf.openNewIssue()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '26px',
          padding: '0 10px',
          border: 'none',
          borderRadius: '6px',
          background: 'var(--accent)',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 600,
          fontFamily: 'inherit',
          cursor: 'pointer',
          transition: 'background .14s',
        }}
        hoverStyle={{ background: 'var(--accent-hover)' }}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
        </svg>
        New issue
      </HButton>
    </div>
  );
}

function IssuesSkeleton(): JSX.Element {
  const tf = useTF();
  return (
    <div>
      {tf.skeletonGroups.map((g, gi) => (
        <div key={gi}>
          <div
            style={{
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0 16px',
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={shimmer('14px', '14px', '50%')} />
            <div style={shimmer('90px', '10px', '3px')} />
          </div>
          {g.rows.map((r, ri) => (
            <div key={ri} style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px', borderBottom: '1px solid var(--border)' }}>
              <div style={shimmer('14px', '14px', '3px')} />
              <div style={shimmer('14px', '14px', '50%')} />
              <div style={shimmer('52px', '10px', '3px')} />
              <div style={shimmer(r.w, '10px', '3px')} />
              <div style={{ flex: 1 }} />
              <div style={shimmer('44px', '10px', '3px')} />
              <div style={shimmer('22px', '22px', '50%')} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function IssuesList(): JSX.Element {
  const tf = useTF();
  return (
    <div>
      {tf.groups.map((group) => (
        <div key={group.id}>
          <div
            onClick={group.toggle}
            style={{
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0 16px',
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-muted)', transform: group.chevron, transition: 'transform .14s' }}>
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{group.icon}</span>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{group.name}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'Geist Mono',monospace" }}>{group.count}</span>
            <div style={{ flex: 1 }} />
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-muted)' }}>
              <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </div>
          {group.open &&
            group.issues.map((issue) => (
              <HDiv
                key={issue.key}
                onClick={issue.open}
                style={{
                  minHeight: '41px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  padding: '0 16px',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'background .1s',
                }}
                hoverStyle={{ background: 'var(--bg-surface)' }}
              >
                <IssueLine row={issue} />
              </HDiv>
            ))}
        </div>
      ))}
      <div style={{ height: '80px' }} />
    </div>
  );
}

function IssuesBoard(): JSX.Element {
  const tf = useTF();
  return (
    <div style={{ display: 'flex', gap: '12px', padding: '14px 16px', height: '100%', alignItems: 'flex-start', overflowX: 'auto' }}>
      {tf.boardCols.map((col) => (
        <div
          key={col.id}
          onDragOver={col.onDragOver}
          onDrop={col.onDrop}
          style={{
            width: '288px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            background: col.colBg,
            border: col.colBorder,
            borderRadius: '10px',
            padding: '4px',
            transition: 'background .12s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 8px 8px 6px' }}>
            <span style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{col.icon}</span>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{col.name}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'Geist Mono',monospace" }}>{col.count}</span>
            <div style={{ flex: 1 }} />
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
              <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '2px' }}>
            {col.cards.map((card) => (
              <HDiv
                key={card.key}
                draggable
                onDragStart={card.onDragStart}
                onDragEnd={card.onDragEnd}
                onClick={card.open}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '9px',
                  padding: '11px',
                  cursor: 'pointer',
                  opacity: card.opacity,
                  transition: 'border-color .12s,opacity .12s',
                }}
                hoverStyle={{ borderColor: 'var(--border-strong)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '9px' }}>
                  <span style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {card.priorityIcon}
                  </span>
                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: '11.5px', color: 'var(--text-muted)' }}>{card.key}</span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.45, color: 'var(--text-primary)', marginBottom: '11px', textWrap: 'pretty' }}>{card.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '5px', flex: 1, flexWrap: 'wrap' }}>{card.labelPills}</div>
                  <DueChip row={card} small />
                  <div style={{ flexShrink: 0 }}>{card.avatars}</div>
                </div>
              </HDiv>
            ))}
            {col.empty && (
              <div style={{ padding: '20px 8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', border: '1px dashed var(--border)', borderRadius: '9px' }}>
                Drop issues here
              </div>
            )}
            <HButton
              onClick={() => tf.openNewIssue(col.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 8px',
                border: 'none',
                background: 'transparent',
                borderRadius: '7px',
                color: 'var(--text-muted)',
                fontSize: '12.5px',
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'all .12s',
              }}
              hoverStyle={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
              </svg>
              Add issue
            </HButton>
          </div>
        </div>
      ))}
    </div>
  );
}

export function IssuesPage(): JSX.Element {
  const tf = useTF();
  return (
    <>
      <IssuesToolbar />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tf.loading ? <IssuesSkeleton /> : tf.isList ? <IssuesList /> : <IssuesBoard />}
      </div>
    </>
  );
}

const uppercaseLabel: CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '.04em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
};

export function HomePage(): JSX.Element {
  const tf = useTF();
  const rowStyle: CSSProperties = {
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 15px',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'border-color .14s,transform .14s,box-shadow .14s',
    background: 'var(--bg-surface)',
  };
  const rowHover: CSSProperties = {
    borderColor: 'var(--border-strong)',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 16px -8px rgba(0,0,0,.35)',
  };
  const emptyStyle: CSSProperties = {
    padding: '18px 15px',
    border: '1px dashed var(--border)',
    borderRadius: '10px',
    color: 'var(--text-muted)',
    fontSize: '13px',
    background: 'transparent',
  };
  const listBlock = (rows: IssueRow[], count: number, empty: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      {tf.homeLoading && count === 0 ? (
        [0, 1, 2].map((i) => (
          <div key={i} style={{ ...rowStyle, cursor: 'default', gap: '12px' }}>
            <div style={shimmer('16px', '16px', '4px')} />
            <div style={shimmer('45%', '12px', '4px')} />
            <div style={{ flex: 1 }} />
            <div style={shimmer('54px', '12px', '4px')} />
          </div>
        ))
      ) : count === 0 ? (
        <div style={emptyStyle}>{empty}</div>
      ) : (
        rows.map((issue) => (
          <HDiv key={issue.key} onClick={issue.open} style={rowStyle} hoverStyle={rowHover}>
            <IssueLine row={issue} card />
          </HDiv>
        ))
      )}
    </div>
  );
  const sectionHead = (label: string, count: number, color?: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
      <span style={{ ...uppercaseLabel, color: color ?? (uppercaseLabel.color as string) }}>{label}</span>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: MONO }}>{count}</span>
    </div>
  );
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '36px 40px 60px', maxWidth: '980px' }}>
      <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 600, letterSpacing: '-.02em' }}>{tf.homeGreeting}</h1>
      <p style={{ margin: '0 0 24px', color: 'var(--text-secondary)', fontSize: '13.5px' }}>{tf.today} — here's what's on your plate.</p>

      {/* KPI-плитки */}
      <div style={{ display: 'flex', gap: '13px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <KpiTile label="Assigned to you" value={tf.homeStats.assigned} />
        <KpiTile label="Due soon" value={tf.homeStats.dueSoon} />
        <KpiTile label="Overdue" value={tf.homeStats.overdue} tone="danger" />
        <KpiTile label="Completed" value={tf.homeStats.completed} tone="success" />
      </div>

      {/* Дашборд: кольцо завершённости + прогресс по проектам */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '34px', flexWrap: 'wrap' }}>
        <DashCard title="Your completion">
          <CompletionRing pct={tf.completionPct} label="Tasks closed" sub={tf.completionLabel} />
        </DashCard>
        <DashCard title="Projects progress">
          <ProjectProgressList items={tf.projectProgress} />
        </DashCard>
      </div>

      {/* Просрочено — только если есть */}
      {tf.homeOverdueCount > 0 && (
        <div style={{ marginBottom: '34px' }}>
          {sectionHead('Overdue', tf.homeOverdueCount, '#EF4444')}
          {listBlock(tf.homeOverdueRows, tf.homeOverdueCount, '')}
        </div>
      )}

      <div style={{ marginBottom: '34px' }}>
        {sectionHead('Assigned to you', tf.homeAssignedCount)}
        {listBlock(tf.homeAssignedRows, tf.homeAssignedCount, 'Nothing assigned to you right now.')}
      </div>

      <div>
        {sectionHead('Due soon', tf.homeDueSoonCount)}
        {listBlock(tf.homeDueSoonRows, tf.homeDueSoonCount, 'No upcoming due dates.')}
      </div>
    </div>
  );
}

export function InboxPage(): JSX.Element {
  const tf = useTF();
  const rowBase: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '11px',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'border-color .14s,background .14s',
  };
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ height: '56px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px', padding: '0 32px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ width: '17px', height: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <Icon name="inbox" />
        </span>
        <span style={{ fontSize: '16px', fontWeight: 600, flex: 1 }}>Inbox</span>
        {tf.unreadCount > 0 && (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'Geist Mono',monospace" }}>{tf.unreadCount} unread</span>
        )}
        <HButton
          onClick={tf.markAllRead}
          disabled={!tf.hasUnread || tf.markingAll}
          style={{
            height: '30px',
            padding: '0 12px',
            border: '1px solid var(--border)',
            borderRadius: '7px',
            background: 'transparent',
            color: tf.hasUnread ? 'var(--text-secondary)' : 'var(--text-muted)',
            fontSize: '12.5px',
            fontWeight: 500,
            fontFamily: 'inherit',
            cursor: tf.hasUnread ? 'pointer' : 'default',
            opacity: tf.hasUnread ? 1 : 0.5,
            transition: 'all .14s',
          }}
          hoverStyle={tf.hasUnread ? { borderColor: 'var(--border-strong)', color: 'var(--text-primary)' } : {}}
        >
          {tf.markingAll ? 'Marking…' : 'Mark all as read'}
        </HButton>
      </div>

      <div style={{ maxWidth: '760px', padding: '24px 32px 60px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tf.inboxLoading && tf.inboxItems.length === 0 ? (
          [0, 1, 2].map((i) => (
            <div key={i} style={{ ...rowBase, cursor: 'default' }}>
              <div style={shimmer('34px', '34px', '50%')} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', flex: 1 }}>
                <div style={shimmer('280px', '11px', '4px')} />
                <div style={shimmer('90px', '10px', '4px')} />
              </div>
            </div>
          ))
        ) : tf.inboxEmpty ? (
          <div style={{ padding: '64px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              <Icon name="inbox" />
            </span>
            <div style={{ fontSize: '13.5px' }}>You're all caught up.</div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '360px', lineHeight: 1.6 }}>
              When a teammate invites you to a project, assigns you an issue, comments, or mentions you, it shows up here.
            </div>
          </div>
        ) : (
          tf.inboxItems.map((n) => (
            <HDiv
              key={n.id}
              onClick={n.open}
              style={{
                ...rowBase,
                background: n.isRead ? 'transparent' : 'var(--accent-subtle)',
                borderColor: n.isRead ? 'var(--border)' : 'rgba(99,102,241,.35)',
              }}
              hoverStyle={{ borderColor: 'var(--border-strong)', background: n.isRead ? 'var(--bg-surface)' : 'var(--accent-subtle)' }}
            >
              {n.avatarUrl ? (
                <img src={n.avatarUrl} alt={n.actorName} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: n.color, color: '#fff', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {n.initials}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  <strong style={{ fontWeight: 600 }}>{n.actorName}</strong> {n.verb}{' '}
                  <span style={{ fontFamily: "'Geist Mono',monospace", color: 'var(--accent)' }}>{n.target}</span>
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '3px' }}>{n.at}</div>
                {n.isProjectInvite && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <HButton
                      onClick={(e) => { e.stopPropagation(); n.accept?.(); }}
                      disabled={n.inviteBusy}
                      style={{ height: '30px', padding: '0 16px', border: 'none', borderRadius: '7px', background: 'var(--accent)', color: '#fff', fontSize: '12.5px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', opacity: n.inviteBusy ? 0.6 : 1, transition: 'background .14s' }}
                      hoverStyle={{ background: 'var(--accent-hover)' }}
                    >
                      Принять
                    </HButton>
                    <HButton
                      onClick={(e) => { e.stopPropagation(); n.decline?.(); }}
                      disabled={n.inviteBusy}
                      style={{ height: '30px', padding: '0 14px', border: '1px solid var(--border-strong)', borderRadius: '7px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', opacity: n.inviteBusy ? 0.6 : 1, transition: 'all .14s' }}
                      hoverStyle={{ borderColor: 'var(--text-muted)', color: 'var(--text-primary)' }}
                    >
                      Отклонить
                    </HButton>
                  </div>
                )}
              </div>
              {!n.isRead && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: '6px' }} />}
            </HDiv>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: number }): JSX.Element {
  return (
    <div
      style={{
        flex: 1,
        minWidth: '220px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '13px',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={icon} />
      </div>
      <div>
        <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '22px', fontWeight: 600, lineHeight: 1, letterSpacing: '-.02em' }}>{value}</div>
      </div>
    </div>
  );
}

function WorkloadCard({ color, label, value }: { color: string; label: string; value: number }): JSX.Element {
  return (
    <div style={{ flex: 1, minWidth: '140px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ width: '9px', height: '9px', borderRadius: '2.5px', background: color }} />
        <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{label}</span>
      </div>
      <div style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-.02em' }}>{value}</div>
    </div>
  );
}

const MONO = "'Geist Mono',monospace";

/** KPI-плитка: крупное число + подпись; tone красит число (danger/success). */
function KpiTile({ label, value, tone }: { label: string; value: number; tone?: 'default' | 'danger' | 'success' }): JSX.Element {
  const color = tone === 'danger' && value > 0 ? '#EF4444' : tone === 'success' && value > 0 ? '#22C55E' : 'var(--text-primary)';
  return (
    <div style={{ flex: 1, minWidth: '148px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '15px 17px' }}>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '9px' }}>{label}</div>
      <div style={{ fontSize: '27px', fontWeight: 600, lineHeight: 1, letterSpacing: '-.02em', color }}>{value}</div>
    </div>
  );
}

/** Кольцо завершённости: conic-gradient акцент → трек, число в центре. */
function CompletionRing({ pct, label, sub }: { pct: number; label: string; sub: string }): JSX.Element {
  const deg = Math.max(0, Math.min(100, pct)) * 3.6;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
      <div
        style={{
          position: 'relative',
          width: '108px',
          height: '108px',
          borderRadius: '50%',
          background: `conic-gradient(var(--accent) ${deg}deg, var(--border-strong) ${deg}deg 360deg)`,
          flexShrink: 0,
        }}
      >
        <div style={{ position: 'absolute', inset: '13px', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-.02em' }}>{pct}%</span>
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontFamily: MONO }}>{sub}</div>
      </div>
    </div>
  );
}

interface ProjectProgressItem {
  id: string;
  name: string;
  identifier: string;
  color: string;
  total: number;
  done: number;
  pct: number;
}

/** Горизонтальные прогресс-бары по проектам (цвет = проект, длина = % готовности). */
function ProjectProgressList({ items }: { items: ProjectProgressItem[] }): JSX.Element {
  if (items.length === 0) {
    return <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No issues yet.</div>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {items.map((p) => (
        <div key={p.id}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2.5px', background: p.color, flexShrink: 0 }} />
              <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
            </span>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: MONO, flexShrink: 0, marginLeft: '10px' }}>
              {p.done}/{p.total} · {p.pct}%
            </span>
          </div>
          <div style={{ height: '7px', borderRadius: '4px', background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${p.pct}%`, background: p.color, borderRadius: '4px', transition: 'width .3s ease-out' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function DashCard({ title, children }: { title: string; children: ReactNode }): JSX.Element {
  return (
    <div style={{ flex: 1, minWidth: '300px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>{title}</div>
      {children}
    </div>
  );
}

export function YourWorkPage(): JSX.Element {
  const tf = useTF();
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ height: '56px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px', padding: '0 32px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ width: '17px', height: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <Icon name="personPlus" />
        </span>
        <span style={{ fontSize: '16px', fontWeight: 600 }}>Your work</span>
      </div>
      <div style={{ maxWidth: '900px', padding: '28px 32px 60px' }}>
        <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>Overview</div>
        <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <StatCard icon="personCircle" label="Assigned to you" value={tf.assignedCount} />
          <StatCard icon="newpage" label="Created by you" value={tf.createdCount} />
          <StatCard icon="briefcase" label="Completed" value={tf.completedCount} />
        </div>

        {/* Дашборд: кольцо завершённости + прогресс по проектам */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '36px', flexWrap: 'wrap' }}>
          <DashCard title="Your completion">
            <CompletionRing pct={tf.completionPct} label="Tasks closed" sub={tf.completionLabel} />
          </DashCard>
          <DashCard title="Projects progress">
            <ProjectProgressList items={tf.projectProgress} />
          </DashCard>
        </div>

        <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>Workload</div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <WorkloadCard color="#6B7178" label="Backlog" value={tf.workload.backlog} />
          <WorkloadCard color="#3B82F6" label="Not started" value={tf.workload.notStarted} />
          <WorkloadCard color="#EAB308" label="Working on" value={tf.workload.workingOn} />
          <WorkloadCard color="#22C55E" label="Completed" value={tf.workload.completed} />
          <WorkloadCard color="#EF4444" label="Canceled" value={tf.workload.canceled} />
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '320px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>Work items by priority</div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px 20px 12px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ position: 'relative', width: '24px', height: '150px', flexShrink: 0 }}>
                  {tf.priorityAxis.map((ax, i) => (
                    <span
                      key={i}
                      style={{ position: 'absolute', right: 0, top: ax.y, transform: 'translateY(-50%)', fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'Geist Mono',monospace" }}
                    >
                      {ax.n}
                    </span>
                  ))}
                </div>
                <div style={{ flex: 1, position: 'relative', height: '150px', borderLeft: '1px solid var(--border)' }}>
                  {tf.priorityAxis.map((ax, i) => (
                    <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: ax.y, height: '1px', background: 'var(--border)' }} />
                  ))}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '0 6px' }}>
                    {tf.priorityBars.map((bar, i) => (
                      <div key={i} style={{ width: '22px', height: bar.h, background: 'var(--text-primary)', borderRadius: '3px 3px 0 0', opacity: 0.9 }} />
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', paddingLeft: '36px', justifyContent: 'space-around', marginTop: '8px' }}>
                {tf.priorityBars.map((bar, i) => (
                  <span key={i} style={{ fontSize: '10.5px', color: 'var(--text-muted)', width: '44px', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {bar.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '320px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>Work items by state</div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '28px' }}>
              <div style={{ width: '130px', height: '130px', borderRadius: '50%', background: tf.donutBg, flexShrink: 0, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '22px', borderRadius: '50%', background: 'var(--bg-surface)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', flex: 1 }}>
                {tf.stateCats.map((cat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '2.5px', background: cat.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', flex: 1 }}>{cat.name}</span>
                    <span style={{ fontSize: '12.5px', fontFamily: "'Geist Mono',monospace" }}>{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsPage(): JSX.Element {
  const tf = useTF();
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ height: '56px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px', padding: '0 32px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ width: '17px', height: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <Icon name="briefcase" />
        </span>
        <span style={{ fontSize: '16px', fontWeight: 600, flex: 1 }}>Projects</span>
        <HButton
          style={{ width: '30px', height: '30px', border: '1px solid var(--border)', borderRadius: '7px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .14s' }}
          hoverStyle={{ borderColor: 'var(--border-strong)', color: 'var(--text-primary)' }}
        >
          <Icon name="search" />
        </HButton>
        {['Created date', 'Filters'].map((t) => (
          <HButton
            key={t}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', height: '30px', padding: '0 11px', border: '1px solid var(--border)', borderRadius: '7px', background: 'transparent', color: 'var(--text-secondary)', fontFamily: 'inherit', fontSize: '12.5px', cursor: 'pointer', transition: 'all .14s' }}
            hoverStyle={{ borderColor: 'var(--border-strong)', color: 'var(--text-primary)' }}
          >
            <Icon name="newpage" />
            {t}
          </HButton>
        ))}
        <HButton
          onClick={tf.openCreateProject}
          style={{ height: '30px', padding: '0 14px', border: 'none', borderRadius: '7px', background: 'var(--accent)', color: '#fff', fontSize: '12.5px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', transition: 'background .14s' }}
          hoverStyle={{ background: 'var(--accent-hover)' }}
        >
          Add project
        </HButton>
      </div>
      <div style={{ padding: '28px 32px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {tf.projectsLoading && tf.projectsGrid.length === 0 && (
          [0, 1, 2].map((i) => (
            <div key={i} style={{ width: '270px', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-surface)' }}>
              <div style={shimmer('100%', '110px', '0')} />
              <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={shimmer('60%', '13px', '4px')} />
                <div style={shimmer('40px', '11px', '4px')} />
                <div style={shimmer('80%', '12px', '4px')} />
                <div style={shimmer('70px', '22px', '5px')} />
              </div>
            </div>
          ))
        )}
        {!tf.projectsLoading && tf.projectsGrid.length === 0 && (
          <div style={{ width: '100%', padding: '56px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '13.5px' }}>{tf.hasWorkspace ? 'No projects yet.' : 'Create a workspace to get started.'}</div>
            <HButton
              onClick={tf.hasWorkspace ? tf.openCreateProject : tf.openCreateWorkspace}
              style={{ height: '34px', padding: '0 16px', border: 'none', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', transition: 'background .14s' }}
              hoverStyle={{ background: 'var(--accent-hover)' }}
            >
              {tf.hasWorkspace ? 'Create your first project' : 'Create workspace'}
            </HButton>
          </div>
        )}
        {tf.projectsGrid.map((proj) => (
          <HDiv
            key={proj.identifier}
            onClick={proj.open}
            style={{ width: '270px', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-surface)', cursor: 'pointer', transition: 'border-color .14s' }}
            hoverStyle={{ borderColor: 'var(--border-strong)' }}
          >
            <div style={{ height: '110px', background: proj.cover, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '10px', left: '10px', width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2.5px', background: proj.dot }} />
              </div>
              {proj.canDelete && (
                <HButton
                  onClick={(e) => {
                    e.stopPropagation();
                    proj.remove();
                  }}
                  title="Delete project"
                  style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(0,0,0,.4)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .14s' }}
                  hoverStyle={{ background: 'rgba(239,68,68,.85)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 4.5h10M6.5 4V3h3v1M5 4.5l.5 8h5l.5-8" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </HButton>
              )}
            </div>
            <div style={{ padding: '14px 16px 16px' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 600, letterSpacing: '.01em', textTransform: 'uppercase', marginBottom: '2px' }}>{proj.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: "'Geist Mono',monospace", marginBottom: '12px' }}>{proj.identifier}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', color: 'var(--text-muted)', paddingBottom: '12px', borderBottom: '1px solid var(--border)', marginBottom: '12px' }}>
                <span style={{ width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="personCircle" />
                </span>
                No lead
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', height: '22px', padding: '0 9px', borderRadius: '5px', background: 'rgba(34,197,94,.13)', color: '#22C55E', fontSize: '11.5px', fontWeight: 600 }}>
                Joined
              </span>
            </div>
          </HDiv>
        ))}
      </div>
    </div>
  );
}

const AI_TONES: { id: 'professional' | 'friendly' | 'detailed' | 'short'; label: string }[] = [
  { id: 'professional', label: 'Professional' },
  { id: 'friendly', label: 'Friendly' },
  { id: 'detailed', label: 'Detailed' },
  { id: 'short', label: 'Short' },
];

const AI_EXAMPLES = [
  'Экран онбординга: 3 слайда + параллакс при свайпе',
  'Исправить гонку обновления токена при 401',
  'Кэшировать аватары со stale-while-revalidate (24ч)',
  'Пустое состояние для отфильтрованной доски',
];

function AiSpark({ size = 28 }: { size?: number }): JSX.Element {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(150deg,var(--accent),#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
      <span style={{ width: Math.round(size * 0.5), height: Math.round(size * 0.5), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="sparkle" />
      </span>
    </div>
  );
}

export function AiPage(): JSX.Element {
  const tf = useTF();
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [tf.aiMessages.length, tf.aiGenerating]);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Лента диалога */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '740px', margin: '0 auto', padding: '26px 24px 8px' }}>
          {!tf.aiHasMessages && !tf.aiGenerating ? (
            <div style={{ textAlign: 'center', padding: '44px 12px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
                <AiSpark size={52} />
              </div>
              <h1 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 600, letterSpacing: '-.02em' }}>AI assistant</h1>
              <p style={{ margin: '0 auto 28px', maxWidth: '440px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                Опиши задачу в двух словах — соберу полноценное описание в Markdown. Выбери тон и жми Enter.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '10px', textAlign: 'left' }}>
                {AI_EXAMPLES.map((ex) => (
                  <HDiv
                    key={ex}
                    onClick={() => tf.askAi(ex)}
                    style={{ padding: '13px 14px', border: '1px solid var(--border)', borderRadius: '11px', background: 'var(--bg-surface)', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5, cursor: 'pointer', transition: 'all .14s' }}
                    hoverStyle={{ borderColor: 'var(--border-strong)', color: 'var(--text-primary)', transform: 'translateY(-1px)' }}
                  >
                    {ex}
                  </HDiv>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {tf.aiMessages.map((m) =>
                m.role === 'user' ? (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'flex-end', animation: 'tf-fade .18s ease-out' }}>
                    <div style={{ maxWidth: '80%', padding: '10px 14px', background: 'var(--accent-subtle)', border: '1px solid rgba(99,102,241,.28)', borderRadius: '14px 14px 4px 14px', color: 'var(--text-primary)', fontSize: '13.5px', lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} style={{ display: 'flex', gap: '11px', animation: 'tf-fade .18s ease-out' }}>
                    <AiSpark />
                    <div style={{ flex: 1, minWidth: 0, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px 14px 14px 14px', overflow: 'hidden' }}>
                      <div style={{ padding: '15px 17px', fontSize: '13.5px', lineHeight: 1.7, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {m.text}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', padding: '0 12px 11px' }}>
                        <HButton
                          type="button"
                          onClick={m.copy}
                          style={{ height: '26px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--border-strong)', background: m.copied ? 'rgba(34,197,94,.14)' : 'transparent', color: m.copied ? '#22C55E' : 'var(--text-muted)', fontSize: '11.5px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', transition: 'all .14s' }}
                          hoverStyle={{ color: 'var(--text-primary)', borderColor: 'var(--text-muted)' }}
                        >
                          {m.copied ? 'Copied ✓' : 'Copy'}
                        </HButton>
                      </div>
                    </div>
                  </div>
                ),
              )}
              {tf.aiGenerating && (
                <div style={{ display: 'flex', gap: '11px', animation: 'tf-fade .18s ease-out' }}>
                  <AiSpark />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', height: '44px', padding: '0 16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px 14px 14px 14px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <span style={{ width: '14px', height: '14px', border: '2px solid var(--border-strong)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'tf-spin .6s linear infinite' }} />
                    Думаю…
                  </div>
                </div>
              )}
              {tf.aiError && (
                <div style={{ padding: '11px 14px', borderRadius: '10px', border: '1px solid rgba(239,68,68,.35)', background: 'rgba(239,68,68,.08)', color: '#EF4444', fontSize: '12.5px' }}>
                  {tf.aiError}
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>
      </div>

      {/* Композер снизу */}
      <div style={{ flexShrink: 0, borderTop: '1px solid var(--border)', background: 'var(--bg-app)', padding: '12px 24px 18px' }}>
        <div style={{ maxWidth: '740px', margin: '0 auto' }}>
          <form
            onSubmit={tf.submitAi}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: '14px', padding: '8px 8px 8px 14px' }}
          >
            <textarea
              value={tf.aiPrompt}
              onChange={tf.onAiPrompt}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  tf.askAi(tf.aiPrompt);
                }
              }}
              placeholder="Опиши задачу…  (Enter — отправить, Shift+Enter — новая строка)"
              rows={2}
              style={{ width: '100%', maxHeight: '160px', padding: '6px 0', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'inherit', lineHeight: 1.6, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Тон</span>
              <TFSelect
                value={tf.aiTone}
                onChange={(v) => tf.setAiTone(v as 'professional' | 'friendly' | 'detailed' | 'short')}
                style={{ height: '30px', padding: '0 8px', background: 'var(--bg-app)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '12.5px', fontFamily: 'inherit', cursor: 'pointer', outline: 'none' }}
                options={AI_TONES.map((t) => ({ value: t.id, label: t.label }))}
              />
              {tf.aiHasMessages && (
                <HButton
                  type="button"
                  onClick={tf.clearAi}
                  style={{ height: '30px', padding: '0 11px', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'transparent', color: 'var(--text-muted)', fontSize: '12.5px', fontFamily: 'inherit', cursor: 'pointer', transition: 'all .14s' }}
                  hoverStyle={{ color: 'var(--text-primary)', borderColor: 'var(--text-muted)' }}
                >
                  New chat
                </HButton>
              )}
              <div style={{ flex: 1 }} />
              <HButton
                type="submit"
                disabled={tf.aiGenerating || !tf.aiPrompt.trim()}
                title="Send"
                style={{ width: '34px', height: '34px', borderRadius: '9px', border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: tf.aiGenerating || !tf.aiPrompt.trim() ? 0.5 : 1, transition: 'background .14s' }}
                hoverStyle={{ background: 'var(--accent-hover)' }}
              >
                {tf.aiGenerating ? (
                  <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,.45)', borderTopColor: '#fff', borderRadius: '50%', animation: 'tf-spin .6s linear infinite' }} />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 13V3M8 3l-4 4M8 3l4 4" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </HButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  disabled,
  prefix,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  prefix?: string;
  placeholder?: string;
}): JSX.Element {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', height: '38px', padding: '0 12px', background: disabled ? 'var(--bg-surface)' : 'var(--bg-app)', border: '1px solid var(--border-strong)', borderRadius: '6px' }}>
        {prefix && <span style={{ fontSize: '13px', color: 'var(--text-muted)', flexShrink: 0 }}>{prefix}</span>}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          style={{ flex: 1, minWidth: 0, height: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
        />
      </div>
    </div>
  );
}

function ReadonlyField({ label, value, muted, chevron }: { label: string; value: string; muted?: boolean; chevron?: boolean }): JSX.Element {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>{label}</label>
      <div
        style={{
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: chevron ? 'space-between' : 'flex-start',
          padding: '0 12px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: '6px',
          fontSize: '13px',
          color: muted ? 'var(--text-secondary)' : 'var(--text-primary)',
          cursor: chevron ? 'pointer' : 'default',
        }}
      >
        {value}
        {chevron && (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-muted)' }}>
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  );
}

export function SettingsPage(): JSX.Element {
  const tf = useTF();
  const section = tf.settingsSection;
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '36px 40px 60px' }}>
      <div style={{ maxWidth: '760px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '28px' }}>
          <span style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <Icon name={section} />
          </span>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{tf.settingsSectionTitle}</span>
        </div>

        {section === 'general' && <GeneralSection />}
        {section === 'members' && <MembersSection />}
        {section === 'billing' && <BillingSection />}
        {section === 'imports' && (
          <SettingsPlaceholder
            icon="imports"
            title="Imports"
            text="Import issues, projects and comments from Jira, Linear, GitHub or CSV. Importers are not connected for this workspace yet."
          />
        )}
        {section === 'exports' && (
          <SettingsPlaceholder
            icon="exports"
            title="Exports"
            text="Export your workspace data to CSV or JSON. Export jobs you request will be listed here."
          />
        )}
        {section === 'identity' && <IdentitySection />}
      </div>
    </div>
  );
}

function GeneralSection(): JSX.Element {
  const tf = useTF();
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '14px', background: 'linear-gradient(150deg,var(--accent),#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 600, color: '#fff', flexShrink: 0 }}>
          {tf.workspaceInitial}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-.01em', marginBottom: '4px' }}>{tf.workspaceName}</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
            {tf.workspaceUrl}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <EditField label="Workspace name" value={tf.generalName} onChange={tf.onGeneralName} disabled={!tf.canEditWorkspace} placeholder="Название" />
        <ReadonlyField label="Your role" value={tf.me.role} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '18px' }}>
        <EditField label="Workspace URL (slug)" value={tf.generalSlug} onChange={tf.onGeneralSlug} disabled={!tf.canEditWorkspace} prefix="taskflow.app/" placeholder="slug" />
        <ReadonlyField label="Workspace timezone" value="UTC" />
      </div>

      {tf.wsSettingsError && (
        <div style={{ fontSize: '12.5px', color: '#EF4444', marginBottom: '14px' }}>{tf.wsSettingsError}</div>
      )}

      {tf.canEditWorkspace ? (
        <div style={{ display: 'flex', marginBottom: '30px' }}>
          <HButton
            onClick={tf.saveWsSettings}
            disabled={!tf.wsSettingsDirty || tf.wsSettingsSaving}
            style={{ height: '36px', padding: '0 18px', border: 'none', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', opacity: !tf.wsSettingsDirty || tf.wsSettingsSaving ? 0.5 : 1, transition: 'background .14s' }}
            hoverStyle={{ background: 'var(--accent-hover)' }}
          >
            {tf.wsSettingsSaving ? 'Сохранение…' : 'Сохранить изменения'}
          </HButton>
        </div>
      ) : (
        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '30px' }}>
          Менять настройки workspace может только admin или owner.
        </div>
      )}

      {tf.isOwner && (
        <div style={{ border: '1px solid rgba(239,68,68,.35)', background: 'rgba(239,68,68,.06)', borderRadius: '12px', padding: '20px 22px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Delete this workspace</div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Tread carefully — deleting removes all projects, issues, and pages for everyone. This can't be undone.
            </div>
          </div>
          <HButton
            onClick={tf.openDeleteWorkspace}
            style={{ height: '34px', padding: '0 16px', border: '1px solid rgba(239,68,68,.5)', borderRadius: '7px', background: 'transparent', color: '#EF4444', fontSize: '12.5px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0, transition: 'background .14s' }}
            hoverStyle={{ background: 'rgba(239,68,68,.12)' }}
          >
            Delete
          </HButton>
        </div>
      )}
    </>
  );
}

// ─────────────────────────── BILLING ───────────────────────────

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  current?: boolean;
  accent?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/ навсегда',
    tagline: 'Для небольших команд, которые только начинают.',
    features: ['До 5 участников', 'Неограниченно задач', '2 активных проекта', 'Базовые доски и циклы', 'Сообщество-поддержка'],
    current: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$8',
    period: '/ участник в мес.',
    tagline: 'Для растущих команд, которым нужна аналитика.',
    features: ['Неограниченно участников', 'Неограниченно проектов', 'Аналитика и дашборды', 'Приоритетная поддержка', 'Гостевой доступ', 'История активности 1 год'],
    accent: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '$16',
    period: '/ участник в мес.',
    tagline: 'Для компаний с требованиями к безопасности.',
    features: ['Всё из Pro', 'SSO / SAML', 'Аудит-логи', 'Роли и права по проектам', 'SLA 99.9%', 'Выделенный менеджер'],
  },
];

function UsageBar({ label, used, total, unit }: { label: string; used: number; total: number; unit: string }): JSX.Element {
  const pct = Math.min(100, Math.round((used / total) * 100));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '7px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontFamily: "'Geist Mono',monospace", color: 'var(--text-muted)' }}>{used} / {total} {unit}</span>
      </div>
      <div style={{ height: '7px', borderRadius: '4px', background: 'var(--border)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: pct > 85 ? '#EF4444' : 'var(--accent)', borderRadius: '4px' }} />
      </div>
    </div>
  );
}

function BillingSection(): JSX.Element {
  const tf = useTF();
  return (
    <>
      {/* Текущий план */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-surface)', marginBottom: '28px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '11px', background: 'var(--accent-subtle)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="billing" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>Текущий план: <span style={{ color: 'var(--accent)' }}>Free</span></div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Следующее списание отсутствует — вы на бесплатном тарифе.</div>
        </div>
        <HButton
          onClick={() => toast.info('Оплата подключится, когда биллинг включат для workspace')}
          style={{ height: '34px', padding: '0 16px', border: 'none', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontSize: '12.5px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0 }}
          hoverStyle={{ background: 'var(--accent-hover)' }}
        >
          Улучшить план
        </HButton>
      </div>

      {/* Использование */}
      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '14px' }}>Использование в этом месяце</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '18px 20px', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '32px' }}>
        <UsageBar label="Участники" used={tf.settingsMembersCount || 1} total={5} unit="" />
        <UsageBar label="Активные проекты" used={2} total={2} unit="" />
        <UsageBar label="Хранилище файлов" used={0.3} total={1} unit="GB" />
      </div>

      {/* Тарифы */}
      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '14px' }}>Тарифы</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {PLANS.map((p) => (
          <div
            key={p.id}
            style={{
              border: `1px solid ${p.accent ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '12px',
              padding: '20px 18px',
              background: p.accent ? 'var(--accent-subtle)' : 'var(--bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              position: 'relative',
            }}
          >
            {p.accent && (
              <span style={{ position: 'absolute', top: '-9px', left: '18px', fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: '#fff', background: 'var(--accent)', padding: '2px 8px', borderRadius: '6px' }}>
                Популярный
              </span>
            )}
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px', minHeight: '32px' }}>{p.tagline}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-.02em' }}>{p.price}</span>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{p.period}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', flex: 1 }}>
              {p.features.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent)' }}>
                    <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
            <HButton
              onClick={() => (p.current ? undefined : toast.info(`Тариф «${p.name}» подключится, когда включат биллинг`))}
              disabled={p.current}
              style={{
                height: '36px',
                border: p.current ? '1px solid var(--border-strong)' : 'none',
                borderRadius: '8px',
                background: p.current ? 'transparent' : p.accent ? 'var(--accent)' : 'var(--bg-elevated)',
                color: p.current ? 'var(--text-muted)' : p.accent ? '#fff' : 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: p.current ? 'default' : 'pointer',
              }}
              hoverStyle={p.current ? {} : { opacity: 0.9 }}
            >
              {p.current ? 'Текущий план' : `Перейти на ${p.name}`}
            </HButton>
          </div>
        ))}
      </div>
    </>
  );
}

// ─────────────────────────── IDENTITY ───────────────────────────

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }): JSX.Element {
  return (
    <HButton
      onClick={onClick}
      style={{ width: '38px', height: '22px', borderRadius: '11px', border: 'none', background: on ? 'var(--accent)' : 'var(--border-strong)', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background .16s' }}
      hoverStyle={{}}
    >
      <span style={{ position: 'absolute', top: '3px', left: on ? '19px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left .16s' }} />
    </HButton>
  );
}

function IdentityRow({ title, desc, children }: { title: string; desc: string; children: ReactNode }): JSX.Element {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13.5px', fontWeight: 600, marginBottom: '3px' }}>{title}</div>
        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function IdentitySection(): JSX.Element {
  const tf = useTF();
  const [twoFA, setTwoFA] = useState(false);
  const [ssoOnly, setSsoOnly] = useState(false);
  const soon = () => toast.info('Скоро — управление безопасностью появится здесь');

  const btn: CSSProperties = { height: '32px', padding: '0 13px', border: '1px solid var(--border-strong)', borderRadius: '7px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' };

  return (
    <>
      <p style={{ margin: '0 0 24px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '620px' }}>
        Настройки безопасности вашей учётной записи и всего workspace. Здесь вы управляете входом,
        двухфакторной аутентификацией, активными сессиями и корпоративным доступом (SSO). Мы рекомендуем
        включить двухфакторную аутентификацию и, если у вас корпоративный домен, — вход только через SSO.
      </p>

      {/* Аккаунт */}
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '6px' }}>Аккаунт</div>
      <div style={{ marginBottom: '28px' }}>
        <IdentityRow title="Email для входа" desc={`Сейчас: ${tf.me.email || '—'}. Используется для входа и уведомлений.`}>
          <HButton onClick={soon} style={btn} hoverStyle={{ borderColor: 'var(--text-muted)', color: 'var(--text-primary)' }}>Изменить</HButton>
        </IdentityRow>
        <IdentityRow title="Пароль" desc="Последнее изменение неизвестно. Рекомендуем менять пароль раз в 90 дней.">
          <HButton onClick={soon} style={btn} hoverStyle={{ borderColor: 'var(--text-muted)', color: 'var(--text-primary)' }}>Сменить пароль</HButton>
        </IdentityRow>
        <IdentityRow title="Двухфакторная аутентификация (2FA)" desc="Дополнительный код из приложения-аутентификатора при каждом входе. Существенно повышает защиту.">
          <Toggle on={twoFA} onClick={() => { setTwoFA((v) => !v); toast.info(twoFA ? '2FA выключена' : '2FA будет настроена (скоро)'); }} />
        </IdentityRow>
      </div>

      {/* Активные сессии */}
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '6px' }}>Активные сессии</div>
      <div style={{ marginBottom: '28px' }}>
        <IdentityRow title="Chrome · Windows" desc="Этот браузер · активна сейчас · последняя активность только что.">
          <span style={{ fontSize: '11.5px', color: '#22C55E', fontWeight: 600 }}>Текущая</span>
        </IdentityRow>
        <div style={{ paddingTop: '14px' }}>
          <HButton onClick={soon} style={{ ...btn, color: '#EF4444', borderColor: 'rgba(239,68,68,.4)' }} hoverStyle={{ background: 'rgba(239,68,68,.10)' }}>
            Завершить все другие сессии
          </HButton>
        </div>
      </div>

      {/* Корпоративный доступ */}
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '6px' }}>Корпоративный доступ (SSO)</div>
      <div>
        <IdentityRow title="Single Sign-On (SAML / OIDC)" desc="Подключите Google Workspace, Okta или Azure AD, чтобы участники входили через вашего провайдера. Доступно на тарифе Business.">
          <HButton onClick={soon} style={btn} hoverStyle={{ borderColor: 'var(--text-muted)', color: 'var(--text-primary)' }}>Настроить</HButton>
        </IdentityRow>
        <IdentityRow title="Разрешённые домены email" desc="Ограничьте регистрацию в workspace только адресами вашей компании (например, @company.com).">
          <HButton onClick={soon} style={btn} hoverStyle={{ borderColor: 'var(--text-muted)', color: 'var(--text-primary)' }}>Добавить домен</HButton>
        </IdentityRow>
        <IdentityRow title="Требовать вход только через SSO" desc="Запретить вход по паролю — все участники обязаны использовать SSO. Включайте после проверки настройки провайдера.">
          <Toggle on={ssoOnly} onClick={() => { setSsoOnly((v) => !v); soon(); }} />
        </IdentityRow>
      </div>
    </>
  );
}

function roleBadgeColor(role: string): { bg: string; fg: string } {
  const r = role.toLowerCase();
  if (r === 'owner') return { bg: 'rgba(139,92,246,.16)', fg: '#A78BFA' };
  if (r === 'admin') return { bg: 'rgba(99,102,241,.16)', fg: '#818CF8' };
  if (r === 'guest') return { bg: 'rgba(107,113,120,.18)', fg: 'var(--text-secondary)' };
  return { bg: 'rgba(34,197,94,.14)', fg: '#4ADE80' };
}

function MembersSection(): JSX.Element {
  const tf = useTF();

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {tf.settingsMembersCount} {tf.settingsMembersCount === 1 ? 'member' : 'members'} in this workspace
        </span>
      </div>

      <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 130px', gap: '12px', padding: '10px 18px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
          <span>Member</span>
          <span />
          <span>Role</span>
        </div>

        {tf.settingsMembersLoading &&
          [0, 1, 2].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <div style={shimmer('32px', '32px', '50%')} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={shimmer('160px', '11px', '4px')} />
                <div style={shimmer('120px', '10px', '4px')} />
              </div>
            </div>
          ))}

        {tf.settingsMembersError && !tf.settingsMembersLoading && (
          <div style={{ padding: '28px 18px', fontSize: '13px', color: '#EF4444' }}>Couldn't load members. Try again.</div>
        )}

        {!tf.settingsMembersLoading && !tf.settingsMembersError && tf.settingsMembersCount === 0 && (
          <div style={{ padding: '28px 18px', fontSize: '13px', color: 'var(--text-muted)' }}>No members yet.</div>
        )}

        {!tf.settingsMembersLoading &&
          !tf.settingsMembersError &&
          tf.settingsMembers.map((m) => {
            const badge = roleBadgeColor(m.role);
            return (
              <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto 130px', gap: '12px', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  {m.avatarUrl ? (
                    <img src={m.avatarUrl} alt={m.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: m.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, flexShrink: 0 }}>
                      {m.initials}
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</span>
                      {m.isYou && (
                        <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', border: '1px solid var(--border-strong)', borderRadius: '4px', padding: '1px 5px' }}>You</span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.email}</div>
                  </div>
                </div>
                {m.isYou ? (
                  <span />
                ) : m.isFollowing ? (
                  <HButton
                    onClick={m.toggleFollow}
                    disabled={m.followBusy}
                    style={{ justifySelf: 'end', height: '28px', padding: '0 11px', border: '1px solid var(--border-strong)', borderRadius: '7px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0, transition: 'all .14s' }}
                    hoverStyle={{ borderColor: 'rgba(239,68,68,.4)', color: '#EF4444' }}
                  >
                    Following
                  </HButton>
                ) : (
                  <HButton
                    onClick={m.toggleFollow}
                    disabled={m.followBusy}
                    style={{ justifySelf: 'end', height: '28px', padding: '0 12px', border: 'none', borderRadius: '7px', background: 'var(--accent)', color: '#fff', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0, transition: 'background .14s' }}
                    hoverStyle={{ background: 'var(--accent-hover)' }}
                  >
                    Follow
                  </HButton>
                )}
                <span style={{ justifySelf: 'start', fontSize: '11.5px', fontWeight: 600, padding: '3px 9px', borderRadius: '6px', background: badge.bg, color: badge.fg }}>
                  {m.isOwner ? 'Owner' : m.role}
                </span>
              </div>
            );
          })}
      </div>
    </>
  );
}

function SettingsPlaceholder({ icon, title, text }: { icon: string; title: string; text: string }): JSX.Element {
  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)', borderRadius: '12px', padding: '52px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', textAlign: 'center' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        <Icon name={icon} />
      </div>
      <div style={{ fontSize: '15px', fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '420px' }}>{text}</div>
    </div>
  );
}

export function WikiPage(): JSX.Element {
  const tf = useTF();
  return (
    <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
      <div style={{ maxWidth: '660px', margin: '0 auto', padding: '64px 32px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <h1 style={{ margin: '0 0 8px', fontSize: '23px', fontWeight: 600, letterSpacing: '-.02em' }}>Good afternoon, Ada</h1>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{tf.today}</div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>Recents</div>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '44px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ color: 'var(--text-muted)' }}>
              <WikiStackIcon size={26} />
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No recent pages yet.</div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, flex: 1 }}>Your stickies</div>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-muted)', cursor: 'pointer', marginRight: '14px' }}>
              <circle cx={7} cy={7} r={4.5} stroke="currentColor" strokeWidth={1.5} />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
              </svg>
              Add sticky
            </span>
          </div>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '44px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ color: 'var(--text-muted)' }}>
              <WikiStickyIcon size={24} />
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6, maxWidth: '340px' }}>
              Jot down a quick note or an idea worth remembering. Add a sticky to get started.
            </div>
          </div>
        </div>
      </div>

      <HButton
        title="Add sticky"
        style={{ position: 'absolute', bottom: '24px', right: '28px', width: '44px', height: '44px', borderRadius: '50%', border: '1px solid var(--border-strong)', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow)', transition: 'all .14s' }}
        hoverStyle={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
      >
        <WikiStickyIcon size={18} />
      </HButton>
    </div>
  );
}
