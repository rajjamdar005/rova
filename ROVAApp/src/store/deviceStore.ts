import {create} from 'zustand';

export interface DeviceConfig {
  brightness: number;
  widgetsEnabled: string[];
  widgetsOrder: string[];
  cityLat: number;
  cityLon: number;
  cityName: string;
  cricketTeam: string;
  clock24h: boolean;
  sleepStart: string;
  sleepEnd: string;
  lang: 'en' | 'hi';
  upiEnabled: boolean;
  celebrationSounds: boolean;
}

interface DeviceState {
  // Connection
  isConnected: boolean;
  deviceId: string;
  deviceIp: string;

  // Live status (from MQTT heartbeat)
  battery: number;
  wifiRssi: number;
  currentWidget: string;
  uptimeSeconds: number;
  firmware: string;

  // Config (synced to device)
  config: DeviceConfig;

  // Actions
  setConnected: (connected: boolean) => void;
  setDeviceId: (id: string) => void;
  setDeviceIp: (ip: string) => void;
  updateStatus: (status: Partial<DeviceState>) => void;
  setConfig: (config: Partial<DeviceConfig>) => void;
}

export const useDeviceStore = create<DeviceState>(set => ({
  isConnected: false,
  deviceId: '',
  deviceIp: '',
  battery: 0,
  wifiRssi: 0,
  currentWidget: 'clock',
  uptimeSeconds: 0,
  firmware: '1.0.0',
  config: {
    brightness: 64,
    widgetsEnabled: ['clock', 'weather', 'cricket', 'upi'],
    widgetsOrder: ['clock', 'weather', 'cricket', 'upi'],
    cityLat: 19.076,
    cityLon: 72.877,
    cityName: 'Mumbai',
    cricketTeam: 'India',
    clock24h: true,
    sleepStart: '22:30',
    sleepEnd: '07:00',
    lang: 'en',
    upiEnabled: true,
    celebrationSounds: true,
  },
  setConnected: connected => set({isConnected: connected}),
  setDeviceId: id => set({deviceId: id}),
  setDeviceIp: ip => set({deviceIp: ip}),
  updateStatus: status => set(state => ({...state, ...status})),
  setConfig: config =>
    set(state => ({
      config: {...state.config, ...config},
    })),
}));
