import { ActivityLogsScreen } from '../../../components/ActivityLogsScreen';
import type { SystemActivityLog } from '../../../types';

interface ActivityPageProps {
  logs: SystemActivityLog[];
}

export function ActivityPage({ logs }: ActivityPageProps) {
  return <ActivityLogsScreen logs={logs} />;
}
