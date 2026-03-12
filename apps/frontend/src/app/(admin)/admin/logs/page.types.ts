import type { ErrorLog } from '@/lib/hooks/useLogs';


export interface LogsTableProps {
  logs: ErrorLog[];
}

export interface LogRowProps {
  log: ErrorLog;
}
