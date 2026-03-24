"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ENDPOINTS } from "@/services/endpoints";
import { useAuthStore } from "@/stores/authStore";
import type { LivePosition } from "@/types";

const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_DELAY = 30000;

interface PositionsPayload {
  positions: LivePosition[];
  timestamp: string;
  hl_count: number;
  bybit_count: number;
}

export default function usePositionsStream() {
  const [positions, setPositions] = useState<LivePosition[]>([]);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [hlCount, setHlCount] = useState(0);
  const [bybitCount, setBybitCount] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectDelay = useRef(RECONNECT_DELAY);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();
  const mountedRef = useRef(true);
  const accessToken = useAuthStore((s) => s.accessToken);

  const connect = useCallback(() => {
    if (!mountedRef.current || !accessToken) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const url = `${ENDPOINTS.TRANSPARENCY.POSITIONS_WS}?token=${accessToken}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        reconnectDelay.current = RECONNECT_DELAY;
      };

      ws.onmessage = (event) => {
        try {
          const data: PositionsPayload = JSON.parse(event.data);
          setPositions(data.positions);
          setLastUpdate(data.timestamp);
          setHlCount(data.hl_count);
          setBybitCount(data.bybit_count);
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = (e) => {
        setConnected(false);
        wsRef.current = null;
        // Don't reconnect on auth failure (4001)
        if (e.code === 4001) return;
        if (mountedRef.current) {
          reconnectTimer.current = setTimeout(() => {
            reconnectDelay.current = Math.min(
              reconnectDelay.current * 1.5,
              MAX_RECONNECT_DELAY
            );
            connect();
          }, reconnectDelay.current);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      if (mountedRef.current) {
        reconnectTimer.current = setTimeout(connect, reconnectDelay.current);
      }
    }
  }, [accessToken]);

  useEffect(() => {
    mountedRef.current = true;
    if (accessToken) {
      connect();
    }

    return () => {
      mountedRef.current = false;
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [connect, accessToken]);

  const hlPositions = positions.filter((p) => p.exchange === "hyperliquid");
  const bybitPositions = positions.filter((p) => p.exchange === "bybit");

  return {
    positions,
    hlPositions,
    bybitPositions,
    connected,
    lastUpdate,
    hlCount,
    bybitCount,
  };
}
