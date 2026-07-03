export type PriorityId = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export type StateGroup =
  | 'backlog'
  | 'unstarted'
  | 'started'
  | 'completed'
  | 'cancelled';

export type Theme = 'dark' | 'light';

export type Page =
  | 'home'
  | 'yourwork'
  | 'projects'
  | 'issues'
  | 'inbox'
  | 'chat'
  | 'wiki'
  | 'ai'
  | 'settings';

export interface Member {
  initials: string;
  color: string;
  name: string;
}

export interface LabelDef {
  name: string;
  color: string;
}

export interface StateDef {
  id: string;
  name: string;
  group: StateGroup;
  color: string;
}

export interface DueInfo {
  label: string;
  over: boolean;
}

export interface SubTask {
  t: string;
  done: boolean;
}

export interface CommentSeed {
  u: string;
  t: string;
  at: string;
}

export interface Issue {
  key: string;
  title: string;
  priority: PriorityId;
  state: string;
  labels: string[];
  due: DueInfo | null;
  assignees: string[];
  est: number;
  created: string;
  desc: string[];
  sub: SubTask[];
  comments: CommentSeed[];
}
