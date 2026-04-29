import { Client } from '@stomp/stompjs';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';

interface SyncStatusMessage {
  portfolioName: string;
  status: 'COMPLETED' | 'FAILED';
  message: string;
}

const WS_URL = 'http://localhost:9080/ws';

export const useSyncNotifications = (token: string | null) => {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as WebSocket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/user/queue/sync-status', frame => {
          const data: SyncStatusMessage = JSON.parse(frame.body);
          if (data.status === 'COMPLETED') {
            toast.success(
              `Sync completed for ${data.portfolioName}. Refresh the portfolio to see new data.`,
              { autoClose: 8000 }
            );
          } else {
            toast.error(`Sync failed for ${data.portfolioName}: ${data.message}`, {
              autoClose: 10000,
            });
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
