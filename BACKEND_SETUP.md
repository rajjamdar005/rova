# ROVA Backend Setup - Complete ✅

## Status: Backend Infrastructure Ready

### ✅ Completed Components

#### 1. Mosquitto MQTT Broker (Docker)
- **Status**: Running
- **Ports**:
  - `1883`: Standard MQTT (for ESP32-S3 devices)
  - `9001`: WebSocket (for React Native app)
- **Container**: `rova-mosquitto`
- **Config**: `mosquitto/config/mosquitto.conf`

**Verify Running**:
```bash
docker ps | grep mosquitto
# Should show: rova-mosquitto (up)
```

**Test Connection**:
```bash
# Subscribe to test topic
docker exec rova-mosquitto mosquitto_sub -t "rova/test" -v

# In another terminal, publish
docker exec rova-mosquitto mosquitto_pub -t "rova/test" -m "Hello ROVA"
```

#### 2. MQTT Explorer (Optional GUI)
- **Status**: Running
- **Access**: http://localhost:4000
- **Use**: Visual MQTT client for debugging/testing

#### 3. OTA Update Infrastructure
- **Lambda Function**: `ota-lambda/index.js`
- **Manifest Example**: `ota-lambda/manifest.example.json`
- **S3 Bucket**: `rova-firmware` (to be created in AWS)
- **Status**: Ready to deploy

**Deploy OTA**:
```bash
cd ota-lambda
npm install
zip -r function.zip index.js node_modules/ package.json
# Upload to AWS Lambda
```

---

## MQTT Topic Schema (iOS & Android Compatible)

### Device → App (ESP32 publishes, App subscribes)
```
Topic: rova/{device_id}/status
Frequency: Every 60 seconds
Payload:
{
  "battery": 78,
  "wifi_rssi": -62,
  "current_widget": "cricket",
  "uptime_s": 302400,
  "firmware": "1.0.2",
  "ip": "192.168.1.47"
}
```

### App → Device (App publishes, ESP32 subscribes)

**Commands**:
```
Topic: rova/{device_id}/cmd
Payload:
{
  "action": "widget_next" | "widget_prev" | "widget_set" | "brightness" | "sleep" | "wake" | "reboot",
  "value": <int or string>
}
```

**UPI Alerts**:
```
Topic: rova/{device_id}/upi_alert
Payload:
{
  "amount": "1250",
  "sender": "Rahul Kumar",
  "app": "gpay",
  "ts": 1748123456
}
```

**Configuration**:
```
Topic: rova/{device_id}/config
Payload:
{
  "brightness": 64,
  "widgets_enabled": ["clock", "weather", "cricket", "upi"],
  "widgets_order": ["clock", "weather", "cricket", "upi"],
  "city_lat": 19.076,
  "city_lon": 72.877,
  "city_name": "Mumbai",
  "cricket_team": "India",
  "clock_24h": true,
  "sleep_start": "22:30",
  "sleep_end": "07:00",
  "lang": "en"
}
```

**OTA Updates**:
```
Topic: rova/{device_id}/ota
Payload:
{
  "action": "check" | "install",
  "version": "1.0.4",
  "url": "https://s3.../firmware.bin",
  "sha256": "abc123..."
}
```

---

## Network Configuration

### Local Development
- **Mosquitto URL**: `mqtt://localhost:1883` (ESP32)
- **WebSocket URL**: `ws://localhost:9001` (React Native)

### Production (DigitalOcean/AWS)
- **Mosquitto URL**: `mqtt://YOUR_SERVER_IP:1883` (ESP32)
- **WebSocket URL**: `ws://YOUR_SERVER_IP:9001` (React Native)

**Important**: React Native needs your computer's local IP (not localhost) when testing on physical device:
```bash
# Find your IP
ipconfig getifaddr en0  # macOS
ip addr show           # Linux
ipconfig               # Windows
```

Example: `ws://192.168.1.100:9001`

---

## Management Commands

### Start Backend
```bash
cd /Users/siddhirajjamdar/Desktop/rova
docker-compose up -d
```

### Stop Backend
```bash
docker-compose down
```

### View Logs
```bash
docker logs -f rova-mosquitto
```

### Restart Mosquitto
```bash
docker-compose restart mosquitto
```

### Monitor Live Messages
```bash
docker exec rova-mosquitto mosquitto_sub -t 'rova/#' -v
```

---

## Next Steps for App Integration

### Phase 1: MQTT Service (React Native)
Create `src/services/mqtt.ts`:
```typescript
import mqtt from 'mqtt';

const BROKER_URL = 'ws://192.168.1.100:9001'; // Change to your IP
const client = mqtt.connect(BROKER_URL);

client.on('connect', () => {
  console.log('Connected to Mosquitto');
  client.subscribe('rova/+/status');
});

client.on('message', (topic, message) => {
  console.log('Received:', topic, message.toString());
});

export const publishCommand = (deviceId: string, action: string, value?: any) => {
  client.publish(`rova/${deviceId}/cmd`, JSON.stringify({ action, value }));
};
```

### Phase 2: ESP32-S3 Client
```cpp
#include <WiFi.h>
#include <PubSubClient.h>

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  client.setServer("192.168.1.100", 1883);
  client.setCallback(mqttCallback);
  
  // Subscribe to commands
  client.subscribe("rova/DEVICE_ID/cmd");
  client.subscribe("rova/DEVICE_ID/config");
  
  // Publish status every 60s
  publishStatus();
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  // Handle incoming messages
}
```

---

## Production Deployment (Optional)

### DigitalOcean Droplet ($5/month)
```bash
# 1. Create Ubuntu droplet
# 2. SSH and install Docker
curl -fsSL https://get.docker.com | sh

# 3. Upload files
scp -r mosquitto docker-compose.yml root@YOUR_IP:/root/rova/

# 4. Start services
cd /root/rova
docker-compose up -d

# 5. Configure firewall
ufw allow 1883/tcp
ufw allow 9001/tcp
ufw enable
```

### AWS IoT Core (Alternative)
If you outgrow Mosquitto (>1000 devices), migrate to AWS IoT Core:
- Unlimited scalability
- Built-in device management
- $1 per million messages
- Same MQTT protocol

---

## Troubleshooting

### Can't connect from React Native
1. Check firewall: `sudo ufw status`
2. Verify IP address is correct (not 127.0.0.1)
3. Test WebSocket: Open browser to `ws://YOUR_IP:9001`
4. Check logs: `docker logs rova-mosquitto`

### Can't connect from ESP32
1. Ping test: `ping YOUR_IP`
2. Check Wi-Fi connection
3. Verify port 1883 is open
4. Test with mosquitto_pub/sub from another machine

### Messages not persisting
1. Check `mosquitto/data/` directory permissions
2. Verify `persistence true` in config
3. Restart container: `docker-compose restart`

---

## Backend Complete ✅

Backend infrastructure is ready for ROVA:
- ✅ Mosquitto MQTT broker running (iOS & Android compatible)
- ✅ WebSocket support for React Native
- ✅ MQTT Explorer GUI available
- ✅ OTA Lambda function ready to deploy
- ✅ Topic schema documented
- ✅ Local & production deployment guides

**Next**: Implement MQTT service in React Native app
