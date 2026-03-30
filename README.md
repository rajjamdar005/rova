# ROVA Backend - Mosquitto MQTT Broker

## Overview
This directory contains the backend infrastructure for ROVA, primarily the Mosquitto MQTT broker that handles all communication between the companion app and ESP32-S3 devices.

## Architecture
```
Android App (MQTT.js) ←→ Mosquitto (WebSocket:9001) ←→ ESP32-S3 (MQTT:1883)
```

## Quick Start

### 1. Start Mosquitto Broker
```bash
docker-compose up -d
```

This starts:
- **Mosquitto** on ports 1883 (MQTT) and 9001 (WebSocket)
- **MQTT Explorer** on port 4000 (optional, for debugging)

### 2. Verify Mosquitto is Running
```bash
docker ps | grep mosquitto
docker logs rova-mosquitto
```

### 3. Test Connection

#### From Command Line (MQTT client)
```bash
# Subscribe to all ROVA topics
mosquitto_sub -h localhost -p 1883 -t "rova/#" -v

# Publish test message
mosquitto_pub -h localhost -p 1883 -t "rova/test/status" -m '{"battery": 85}'
```

#### From React Native App
The app will connect via WebSocket on `ws://YOUR_SERVER_IP:9001`

### 4. MQTT Explorer (GUI)
Open http://localhost:4000 in browser to view/test MQTT messages visually.

## MQTT Topic Schema

### Device → App (ESP32 publishes, App subscribes)
```
rova/{device_id}/status
Payload: {
  "battery": 78,
  "wifi_rssi": -62,
  "current_widget": "cricket",
  "uptime_s": 302400,
  "firmware": "1.0.2",
  "ip": "192.168.1.47"
}
Frequency: Every 60 seconds
```

### App → Device (App publishes, ESP32 subscribes)
```
rova/{device_id}/cmd
Payload: {
  "action": "widget_next" | "widget_prev" | "widget_set" | "brightness" | "sleep" | "wake" | "reboot",
  "value": <int or string, depends on action>
}

rova/{device_id}/upi_alert
Payload: {
  "amount": "1250",
  "sender": "Rahul Kumar",
  "app": "gpay",
  "ts": 1748123456
}

rova/{device_id}/config
Payload: {
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

rova/{device_id}/ota
Payload: {
  "action": "check" | "install",
  "version": "1.0.4",
  "url": "https://s3.../firmware.bin",
  "sha256": "abc123..."
}
```

## Configuration

### Mosquitto Config (`mosquitto/config/mosquitto.conf`)
- Port 1883: Standard MQTT for ESP32-S3
- Port 9001: WebSocket for React Native
- Anonymous access enabled (add auth for production)
- Persistence enabled (messages survive restarts)

### Production Considerations

#### Add Authentication
```conf
# In mosquitto.conf
allow_anonymous false
password_file /mosquitto/config/passwd

# Create password file
docker exec -it rova-mosquitto mosquitto_passwd -c /mosquitto/config/passwd rovauser
```

#### Add TLS/SSL (for production)
```conf
listener 8883
protocol mqtt
cafile /mosquitto/certs/ca.crt
certfile /mosquitto/certs/server.crt
keyfile /mosquitto/certs/server.key

listener 9443
protocol websockets
cafile /mosquitto/certs/ca.crt
certfile /mosquitto/certs/server.crt
keyfile /mosquitto/certs/server.key
```

#### ACL (Access Control)
```conf
acl_file /mosquitto/config/acl.conf

# acl.conf example:
# App can read device status, write commands
user rovaapp
topic read rova/+/status
topic write rova/+/cmd
topic write rova/+/config
topic write rova/+/upi_alert

# Device can write status, read commands
user rovadevice
topic write rova/+/status
topic read rova/+/cmd
topic read rova/+/config
topic read rova/+/upi_alert
```

## Deployment Options

### Option 1: Local Development
```bash
docker-compose up -d
# Access at localhost:1883 (MQTT) and localhost:9001 (WebSocket)
```

### Option 2: DigitalOcean Droplet ($5/month)
```bash
# 1. Create Ubuntu droplet
# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Upload docker-compose.yml and mosquitto config
scp -r mosquitto docker-compose.yml root@YOUR_IP:/root/rova/

# 4. Start services
cd /root/rova
docker-compose up -d

# 5. Configure firewall
ufw allow 1883/tcp
ufw allow 9001/tcp
ufw enable
```

### Option 3: AWS EC2 (t3.micro free tier)
Same as DigitalOcean, use Ubuntu AMI.

### Option 4: Mosquitto Cloud Services
- **HiveMQ Cloud** (free tier: 100 devices)
- **CloudMQTT** (free tier: 10 connections)

## Monitoring

### View Live Messages
```bash
docker logs -f rova-mosquitto
```

### Check Broker Stats
```bash
docker exec rova-mosquitto mosquitto_sub -t '$SYS/#' -v
```

### Connection Count
```bash
docker exec rova-mosquitto mosquitto_sub -t '$SYS/broker/clients/connected' -C 1
```

## Troubleshooting

### Can't Connect from React Native
1. Check server IP (use `ifconfig` or `ipconfig`)
2. Ensure port 9001 is open
3. Try from browser: `ws://YOUR_IP:9001`
4. Check firewall rules

### Can't Connect from ESP32
1. Ensure port 1883 is open
2. Check ESP32 can ping server
3. Verify Wi-Fi connection on device

### Messages Not Persisting
1. Check `mosquitto/data/` directory permissions
2. Verify `persistence true` in config
3. Check disk space

## Scaling

### Current Capacity
- Mosquitto can handle **10,000+ concurrent connections** on basic hardware
- Perfect for <1000 ROVA devices

### If You Outgrow Mosquitto
- **EMQX** (better clustering, 1M+ connections)
- **HiveMQ** (enterprise-grade, cloud-native)
- **AWS IoT Core** (unlimited, pay-per-message)

## Next Steps
1. ✅ Mosquitto broker running
2. ⏳ Implement MQTT service in React Native app
3. ⏳ Implement MQTT client on ESP32-S3
4. ⏳ Set up OTA infrastructure (S3 + Lambda)
