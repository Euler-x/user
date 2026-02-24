"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ENDPOINTS } from "@/services/endpoints";
import type { MarketToken } from "@/types";

const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_DELAY = 30000;

export default function useMarketData() {
  const [tokens, setTokens] = useState<MarketToken[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectDelay = useRef(RECONNECT_DELAY);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(ENDPOINTS.MARKET.WS);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        reconnectDelay.current = RECONNECT_DELAY;
      };

      ws.onmessage = (event) => {
        try {
          const data: MarketToken[] = JSON.parse(event.data);
          setTokens(data);
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
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
      // WebSocket constructor failed — retry
      if (mountedRef.current) {
        reconnectTimer.current = setTimeout(connect, reconnectDelay.current);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [connect]);

  const topGainers = tokens.filter((t) => t.change24h > 0);
  const topLosers = [...tokens].filter((t) => t.change24h < 0).sort((a, b) => a.change24h - b.change24h);

  return { tokens, topGainers, topLosers, connected };
}
