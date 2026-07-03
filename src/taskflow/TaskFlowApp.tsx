import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './tokens.css';
import { TFContext } from './context';
import { useTaskFlow } from './useTaskFlow';
import type { Theme } from './types';
import { AuthScreen } from './AuthScreen';
import { InviteScreen } from './InviteScreen';
import { Onboarding } from './Onboarding';
import { LeftRail, Sidebar, TopHeader } from './Shell';
import { AiPage, HomePage, InboxPage, IssuesPage, ProjectsPage, SettingsPage, WikiPage, YourWorkPage } from './pages';
import { CommandPalette, CreateIssue, CreateProject, CreateWorkspace, DeleteIssue, DeleteProject, DeleteWorkspace, InviteMembers, IssueDetail, ProjectMembers } from './overlays';
import { useTF } from './context';

function MainContent(): JSX.Element {
  const tf = useTF();
  if (tf.isIssuesPage) return <IssuesPage />;
  if (tf.isHomePage) return <HomePage />;
  if (tf.isInboxPage) return <InboxPage />;
  if (tf.isYourWorkPage) return <YourWorkPage />;
  if (tf.isProjectsPage) return <ProjectsPage />;
  if (tf.isWikiPage) return <WikiPage />;
  if (tf.isAiPage) return <AiPage />;
  if (tf.isSettingsPage) return <SettingsPage />;
  return <IssuesPage />;
}

function AppLayout(): JSX.Element {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <LeftRail />
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--bg-app)' }}>
        <TopHeader />
        <MainContent />
      </main>
    </div>
  );
}

export interface TaskFlowAppProps {
  accent?: string;
  theme?: Theme;
  startInApp?: boolean;
}

function TaskFlowInner({ accent, theme, startInApp }: TaskFlowAppProps): JSX.Element {
  const tf = useTaskFlow({ accent, theme, startInApp });
  return (
    <TFContext.Provider value={tf}>
      <div className="tf-root" data-theme={tf.theme} style={tf.rootStyle}>
        {tf.isInvite && <InviteScreen />}
        {tf.isAuth && <AuthScreen />}
        {tf.isApp && (
          <>
            {tf.needsOnboarding ? (
              <Onboarding />
            ) : (
              <>
                <AppLayout />
                <IssueDetail />
                <CommandPalette />
                <InviteMembers />
                <ProjectMembers />
                <CreateIssue />
                <DeleteIssue />
                <CreateProject />
                <DeleteProject />
                <DeleteWorkspace />
              </>
            )}
            {/* Модалка создания воркспейса нужна и в онбординге, и в приложении. */}
            <CreateWorkspace />
          </>
        )}
      </div>
    </TFContext.Provider>
  );
}

export function TaskFlowApp(props: TaskFlowAppProps): JSX.Element {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TaskFlowInner {...props} />
    </QueryClientProvider>
  );
}

export default TaskFlowApp;
