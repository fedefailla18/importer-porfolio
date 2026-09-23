import { Client } from '@stomp/stompjs';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';

import { useAppDispatch } from '../redux/hooks';
import { fetchBinanceSyncJobs } from '../redux/slices/syncJobsSlice';

interface SyncStatusMessage {
  portfolioName: string | null;
  status: 'COMPLETED' | 'FAILED' | 'JOB_FINISHED' | 'JOB_CRASHED';
  message: string;
  /** Present for job-model messages (Binance full sync) — a "go refetch" ping, not full state. */
  jobId: string | null;
}

const WS_URL = 'http://localhost:9080/ws';

export const useSyncNotifications = (token: string | null) => {
  const clientRef = useRef<Client | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as WebSocket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/user/queue/sync-status', frame => {
          const data: SyncStatusMessage = JSON.parse(frame.body);
          switch (data.status) {
            case 'COMPLETED':
              toast.success(
                `Sync completed for ${data.portfolioName}. Refresh the portfolio to see new data.`,
                { autoClose: 8000 }
              );
              break;
            case 'FAILED':
              toast.error(`Sync failed for ${data.portfolioName}: ${data.message}`, {
                autoClose: 10000,
              });
              break;
            case 'JOB_FINISHED':
              // Job-tracked Binance full sync — SyncJobsPanel's own polling shows per-type
              // status (COMPLETED/FAILED, with retry); just refresh it a beat sooner.
              dispatch(fetchBinanceSyncJobs());
              break;
            case 'JOB_CRASHED':
              dispatch(fetchBinanceSyncJobs());
              toast.error(`A sync job crashed unexpectedly: ${data.message}`, { autoClose: 10000 });
              break;
            default:
              break;
          }
        });
      },
      onStompError: frame => {
        // silent — user may not have connected Binance yet
        console.debug('WebSocket STOMP error', frame.headers['message']);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [token]);
};
