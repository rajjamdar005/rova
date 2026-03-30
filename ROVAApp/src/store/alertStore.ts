import {create} from 'zustand';

export interface UPIAlert {
  id: string;
  amount: string;
  sender: string;
  app: 'gpay' | 'phonepe' | 'paytm' | 'bhim';
  ts: number;
}

interface AlertState {
  alerts: UPIAlert[];
  addAlert: (alert: Omit<UPIAlert, 'id'>) => void;
  clearAlerts: () => void;
  removeAlert: (id: string) => void;
}

export const useAlertStore = create<AlertState>(set => ({
  alerts: [],
  addAlert: alert =>
    set(state => ({
      alerts: [
        {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          ...alert,
        },
        ...state.alerts,
      ].slice(0, 50), // Keep max 50 alerts
    })),
  clearAlerts: () => set({alerts: []}),
  removeAlert: id =>
    set(state => ({
      alerts: state.alerts.filter(alert => alert.id !== id),
    })),
}));
