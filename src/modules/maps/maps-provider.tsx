'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { isGoogleMapsConfigured, MAPS_PLACEHOLDER_MESSAGES } from './maps.config';
import { loadGoogleMapsApi } from './maps.service';
import type { MapsProviderState } from './maps.types';

interface MapsContextValue extends MapsProviderState {
  retryLoad: () => void;
}

const MapsContext = createContext<MapsContextValue | null>(null);

const UNCONFIGURED_STATE: MapsProviderState = {
  status: 'unconfigured',
  google: null,
  error: null,
  isConfigured: false,
};

export function MapsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MapsProviderState>(() =>
    isGoogleMapsConfigured()
      ? { status: 'idle', google: null, error: null, isConfigured: true }
      : UNCONFIGURED_STATE,
  );

  const loadMaps = useCallback(async () => {
    if (!isGoogleMapsConfigured()) {
      setState(UNCONFIGURED_STATE);
      return;
    }

    setState((prev) => ({
      ...prev,
      status: 'loading',
      error: null,
      isConfigured: true,
    }));

    try {
      const googleMaps = await loadGoogleMapsApi();
      setState({
        status: 'ready',
        google: googleMaps,
        error: null,
        isConfigured: true,
      });
    } catch {
      setState({
        status: 'error',
        google: null,
        error: MAPS_PLACEHOLDER_MESSAGES.loadError,
        isConfigured: true,
      });
    }
  }, []);

  useEffect(() => {
    if (isGoogleMapsConfigured()) {
      void loadMaps();
    }
  }, [loadMaps]);

  const value = useMemo<MapsContextValue>(
    () => ({
      ...state,
      retryLoad: loadMaps,
    }),
    [state, loadMaps],
  );

  return <MapsContext.Provider value={value}>{children}</MapsContext.Provider>;
}

export function useMaps(): MapsContextValue {
  const context = useContext(MapsContext);

  if (!context) {
    throw new Error('useMaps must be used within MapsProvider');
  }

  return context;
}
