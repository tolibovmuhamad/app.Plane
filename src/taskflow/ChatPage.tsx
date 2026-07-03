import { useEffect, useRef, useState } from 'react';
import { useTF } from './context';
import { HButton, HDiv } from './primitives';

const MONO = "'Geist Mono',monospace";
const QUICK_EMOJI = ['👍', '❤️', '😂', '🎉', '🔥'];

function Avatar({ url, initials, color, size }: { url: string | null; initials: string; color: string; size: number }): JSX.Element {
  if (url) return <img src={url} alt={initials} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, color: '#fff', fontSize: size * 0.4, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {initials}
    </div>
  );
}

/** Левый сайдбар чата — список людей (существующие чаты + взаимные подписчики). */
export function ChatSidebar(): JSX.Element {
  const tf = useTF();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: '48px', flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid var(--border)', fontSize: '14px', fontWeight: 600 }}>
        Сообщения
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {tf.chatLoadingPeople && tf.chatPeople.length === 0 ? (
          <div style={{ padding: '14px 10px', fontSize: '13px', color: 'var(--text-muted)' }}>Загрузка…</div>
        ) : tf.chatPeople.length === 0 ? (
          <div style={{ padding: '24px 12px', fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center' }}>
            Здесь появятся люди, с которыми вы <b>взаимно подписаны</b>. Подпишитесь друг на друга — и сможете общаться.
          </div>
        ) : (
          tf.chatPeople.map((p) => (
            <HDiv
              key={p.key}
              onClick={p.open}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '9px', cursor: 'pointer', background: p.active ? 'var(--accent-subtle)' : 'transparent', transition: 'background .14s' }}
              hoverStyle={{ background: p.active ? 'var(--accent-subtle)' : 'var(--bg-elevated)' }}
            >
              <Avatar url={p.avatarUrl} initials={p.initials} color={p.color} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: p.active ? 'var(--accent)' : 'var(--text-primary)' }}>{p.name}</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{p.hasChat ? 'Открыть чат' : 'Начать чат'}</div>
              </div>
            </HDiv>
          ))
        )}
      </div>
    </div>
  );
}

/** Кнопка записи голосового: тап — старт, ещё тап — стоп и отправка. */
function VoiceButton(): JSX.Element {
  const tf = useTF();
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const stopTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = () => {
        const dur = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        if (blob.size > 0) tf.sendVoice(blob, dur);
      };
      startRef.current = Date.now();
      setSeconds(0);
      rec.start();
      recRef.current = rec;
      setRecording(true);
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      /* доступ к микрофону не дали */
    }
  };
  const stop = () => {
    stopTimer();
    recRef.current?.stop();
    recRef.current = null;
    setRecording(false);
  };
  useEffect(() => () => stopTimer(), []);

  if (recording) {
    return (
      <HButton
        onClick={stop}
        title="Остановить и отправить"
        style={{ height: '38px', padding: '0 12px', border: '1px solid rgba(239,68,68,.5)', borderRadius: '9px', background: 'rgba(239,68,68,.12)', color: '#EF4444', fontSize: '12.5px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}
      >
        <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#EF4444', animation: 'tf-pulse 1s ease-in-out infinite' }} />
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')} · стоп
      </HButton>
    );
  }
  return (
    <HButton
      onClick={start}
      title="Записать голосовое"
      disabled={tf.voiceSending}
      style={{ width: '38px', height: '38px', border: '1px solid var(--border-strong)', borderRadius: '9px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: tf.voiceSending ? 0.6 : 1, transition: 'all .14s' }}
      hoverStyle={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
    >
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <rect x={5.5} y={1.5} width={5} height={8} rx={2.5} stroke="currentColor" strokeWidth={1.4} />
        <path d="M3.5 7.5a4.5 4.5 0 0 0 9 0M8 12v2.5" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
      </svg>
    </HButton>
  );
}

function MessageBubble({ m }: { m: ReturnType<typeof useTF>['chatMessages'][number] }): JSX.Element {
  const [hover, setHover] = useState(false);
  const mine = m.mine;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start', gap: '3px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexDirection: mine ? 'row-reverse' : 'row' }}>
        <div
          style={{
            maxWidth: '440px',
            padding: m.isCall ? '9px 13px' : '8px 12px',
            borderRadius: mine ? '13px 13px 3px 13px' : '13px 13px 13px 3px',
            background: m.isCall ? 'var(--bg-elevated)' : mine ? 'var(--accent)' : 'var(--bg-surface)',
            border: m.isCall ? '1px solid var(--border)' : mine ? 'none' : '1px solid var(--border)',
            color: mine && !m.isCall ? '#fff' : 'var(--text-primary)',
            fontSize: '13.5px',
            lineHeight: 1.5,
            wordBreak: 'break-word',
          }}
        >
          {m.isCall ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--text-secondary)', fontSize: '12.5px' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 3.5c0 5 4.5 9.5 9.5 9.5l1-2-3-1.5-1 1c-1.8-.8-3.2-2.2-4-4l1-1L5 2.5 3 3.5Z" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" /></svg>
              Звонок
            </span>
          ) : m.voiceUrl ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <audio controls src={m.voiceUrl} style={{ height: '32px' }} />
              {m.voiceDuration ? <span style={{ fontSize: '11px', fontFamily: MONO, opacity: 0.8 }}>{m.voiceDuration}s</span> : null}
            </span>
          ) : (
            m.content
          )}
        </div>
        {/* быстрые реакции при наведении */}
        {hover && !m.isCall && (
          <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '2px 4px', boxShadow: 'var(--shadow)' }}>
            {QUICK_EMOJI.map((e) => (
              <HButton
                key={e}
                onClick={() => m.react(e)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: '2px', borderRadius: '5px' }}
                hoverStyle={{ background: 'var(--bg-surface)' }}
              >
                {e}
              </HButton>
            ))}
          </div>
        )}
      </div>
      {/* существующие реакции */}
      {m.reactions.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', flexDirection: mine ? 'row-reverse' : 'row' }}>
          {m.reactions.map((r) => (
            <span key={r.emoji} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11.5px', padding: '1px 7px', borderRadius: '10px', background: r.mine ? 'var(--accent-subtle)' : 'var(--bg-surface)', border: `1px solid ${r.mine ? 'rgba(99,102,241,.35)' : 'var(--border)'}` }}>
              {r.emoji} {r.count > 1 ? r.count : ''}
            </span>
          ))}
        </div>
      )}
      <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: MONO, padding: '0 4px' }}>{m.time}</span>
    </div>
  );
}

export function ChatPage(): JSX.Element {
  const tf = useTF();
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [tf.chatMessages.length, tf.chatHasSelected]);

  if (!tf.chatHasSelected || !tf.chatHeader) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--text-muted)', padding: '24px' }}>
        <div style={{ width: '54px', height: '54px', borderRadius: '15px', background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 16 16" fill="none"><path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2v-7Z" stroke="var(--text-muted)" strokeWidth={1.3} strokeLinejoin="round" /></svg>
        </div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Выберите собеседника</div>
        <div style={{ fontSize: '12.5px', textAlign: 'center', maxWidth: '340px', lineHeight: 1.6 }}>
          Слева — люди, с которыми вы взаимно подписаны. Нажмите на человека, чтобы начать переписку, звонок или голосовое.
        </div>
      </div>
    );
  }

  const h = tf.chatHeader;
  const callBtn = { width: '36px', height: '36px', border: '1px solid var(--border-strong)', borderRadius: '9px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .14s' } as const;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* шапка треда */}
      <div style={{ height: '56px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '11px', padding: '0 18px', borderBottom: '1px solid var(--border)' }}>
        <Avatar url={h.avatarUrl} initials={h.initials} color={h.color} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.name}</div>
        </div>
        <HButton onClick={tf.startAudioCall} disabled={tf.chatCalling} title="Аудиозвонок" style={callBtn} hoverStyle={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
          <svg width="17" height="17" viewBox="0 0 16 16" fill="none"><path d="M3 3.5c0 5 4.5 9.5 9.5 9.5l1-2-3-1.5-1 1c-1.8-.8-3.2-2.2-4-4l1-1L5 2.5 3 3.5Z" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" /></svg>
        </HButton>
        <HButton onClick={tf.startVideoCall} disabled={tf.chatCalling} title="Видеозвонок" style={callBtn} hoverStyle={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
          <svg width="17" height="17" viewBox="0 0 16 16" fill="none"><rect x={1.5} y={4} width={9} height={8} rx={2} stroke="currentColor" strokeWidth={1.3} /><path d="M10.5 7l4-2v6l-4-2" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" /></svg>
        </HButton>
      </div>

      {/* лента сообщений */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tf.chatMessagesLoading && tf.chatMessages.length === 0 ? (
          <div style={{ margin: 'auto', fontSize: '13px', color: 'var(--text-muted)' }}>Загрузка…</div>
        ) : tf.chatMessages.length === 0 ? (
          <div style={{ margin: 'auto', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>Сообщений пока нет. Напишите первым 👋</div>
        ) : (
          tf.chatMessages.map((m) => <MessageBubble key={m.id} m={m} />)
        )}
        <div ref={endRef} />
      </div>

      {/* инпут */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', borderTop: '1px solid var(--border)' }}>
        <input
          value={tf.chatDraft}
          onChange={(e) => tf.onChatDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              tf.submitChatMessage();
            }
          }}
          placeholder="Сообщение…"
          style={{ flex: 1, height: '38px', padding: '0 14px', background: 'var(--bg-app)', border: '1px solid var(--border-strong)', borderRadius: '9px', color: 'var(--text-primary)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none' }}
        />
        <VoiceButton />
        <HButton
          onClick={tf.submitChatMessage}
          disabled={!tf.chatDraft.trim() || tf.chatSending}
          title="Отправить"
          style={{ width: '38px', height: '38px', border: 'none', borderRadius: '9px', background: 'var(--accent)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: !tf.chatDraft.trim() || tf.chatSending ? 0.5 : 1, transition: 'background .14s' }}
          hoverStyle={{ background: 'var(--accent-hover)' }}
        >
          <svg width="17" height="17" viewBox="0 0 16 16" fill="none"><path d="M2 8l12-5.5-4.5 12L7 10l-5-2Z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" /></svg>
        </HButton>
      </div>
    </div>
  );
}
