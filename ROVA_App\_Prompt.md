# ROVA Companion App — Complete System Design & Build Prompt
### For: Emergent AI Builder
### Product: ROVA — ₹1,999 Indian Desk Companion (ESP32-S3 based)
### App Type: React Native (Android primary) + React web dashboard
### Version: 1.0

---

## 0. CONTEXT — WHAT IS ROVA

ROVA is a physical desk companion device (like a mini robot with a 1.69" color display) that sits on the user's desk and shows live data — cricket scores, UPI payment alerts, weather, clock. It runs on ESP32-S3, connects to Wi-Fi, and is controlled entirely through this companion app. Think: Alexa but visual, Indian, ₹1,999, no subscription.

The app is the only way to:
- Set up the device on Wi-Fi
- Configure what shows on the screen
- Get UPI alerts forwarded to the device
- Update firmware

Target user: Indian, 18–28, uses GPay/PhonePe, watches IPL, engineering student or WFH professional, aesthetic-conscious, doesn't read manuals.

---

## 1. DESIGN SYSTEM — THE AESTHETIC

### Vibe
**Dark-first. Minimal. Gen-Z but not chaotic.** Think: nothing.studio meets Linear.app meets a Teenage Engineering product interface. Quiet confidence. Every element earns its place. No gradients. No shadows. No rounded pill buttons everywhere. Sharp, considered, a little cold — but warm in the interactions.

The one emotional anchor: **ROVA's face**. The animated robot face is the heart of the app too — it appears as a live preview, as a loader, as a mascot. Everything else is the scaffold around it.

### Color Palette
```
--bg-base:        #0A0A0A   /* near-black, the ground */
--bg-surface:     #111111   /* cards, panels */
--bg-elevated:    #1A1A1A   /* inputs, hover states */
--bg-border:      #222222   /* all borders */

--text-primary:   #F0F0F0   /* headings, important values */
--text-secondary: #888888   /* labels, descriptions */
--text-muted:     #444444   /* placeholders, disabled */

--accent:         #C8FF00   /* ROVA green — the ONE color that pops */
                              /* Use sparingly: CTAs, active states, live indicators */
--accent-dim:     #C8FF0020  /* accent at 12% opacity for backgrounds */

--red:            #FF3B3B   /* errors, offline state */
--amber:          #FFAA00   /* warnings, thinking state */
--blue:           #3B82F6   /* info, linked states */

--white:          #FFFFFF
```

### Typography
```
Display font:  "Neue Haas Grotesk" or fallback "DM Sans" — for headings, big numbers
Body font:     "Geist Mono" — for data, values, device IDs, status text
UI font:       "DM Sans" — for buttons, labels, navigation

Sizes:
  --text-xs:   11px
  --text-sm:   13px
  --text-base: 15px
  --text-lg:   18px
  --text-xl:   24px
  --text-2xl:  32px
  --text-3xl:  48px  /* big clock, big numbers */

Line height: 1.4 for body, 1.1 for headings
Letter spacing: -0.02em for headings, 0.04em for MONO data

Font weight: 400 regular / 500 medium / 600 semibold only. Never 700/800.
```

### Spacing
```
All spacing on a 4px base grid.
Common tokens: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px
Section padding: 24px horizontal, 32px vertical
Card padding: 16px
```

### Border Radius
```
--radius-sm:   4px   /* inputs, small badges */
--radius-md:   8px   /* cards, buttons */
--radius-lg:   12px  /* bottom sheets, modals */
--radius-full: 9999px /* only for pill indicators, never for buttons */
```

### Motion
```
All transitions: 200ms ease-out (snappy, not floaty)
Page transitions: slide-up 240ms (new screen slides up from bottom)
Bottom sheet: spring physics — comes up fast, settles with slight overshoot
Loading states: pulsing opacity (0.4 → 1.0 → 0.4) NOT spinners
Accent interactions: the --accent color flashes briefly on confirm actions
No bounce. No elastic. Nothing that feels like an iOS clone.
```

### Component Style Rules
- **Buttons**: Full-width on mobile. `background: #1A1A1A`, `border: 1px solid #222`, text `#F0F0F0`. Primary action: `background: --accent`, text `#000000` (black on neon green). Never a shadow.
- **Inputs**: `background: #111`, `border: 1px solid #222`. On focus: border becomes `--accent`. No floating labels — label always above.
- **Cards**: `background: #111111`, `border: 1px solid #222222`, `border-radius: 8px`. No shadows.
- **Toggles**: Custom. Track: `#222` off, `--accent` on. Thumb: white circle. No default iOS/Android toggle.
- **Sliders**: Custom track + thumb. Track: `#222` filled with `--accent`. Thumb: `8px × 24px` vertical bar (not circle).
- **Bottom sheets**: Drag handle at top (32px wide, 3px tall, `#333`). Background `#111`. Corner radius 12px top only.
- **Status pills**: `border: 1px solid currentColor`, `background: transparent`. Green for online, red for offline, amber for syncing. Small dot + text.
- **Section headers**: ALL CAPS, `--text-muted`, `--text-xs`, `letter-spacing: 0.08em`. Like: `DEVICE STATUS` / `WIDGETS` / `ALERTS`

---

## 2. INFORMATION ARCHITECTURE

```
App (React Native)
├── Onboarding Flow (shown once, first launch)
│   ├── Screen 1: Welcome — ROVA face animation, tagline
│   ├── Screen 2: Permissions — Notification access (UPI), Location (weather)
│   ├── Screen 3: Wi-Fi Setup — BLE SmartConfig pairing
│   ├── Screen 4: City Setup — search + confirm city
│   └── Screen 5: Done — success state, enter main app
│
└── Main App (tab bar, bottom)
    ├── Tab 1: Home (Dashboard)
    │   ├── Device status card (online/offline, battery, IP)
    │   ├── Live ROVA face preview (mirrored from device)
    │   ├── Current widget showing on device
    │   ├── Last UPI alert (quick view)
    │   └── Quick actions (brightness, sleep toggle)
    │
    ├── Tab 2: Widgets
    │   ├── Widget list (toggle on/off, drag reorder)
    │   ├── Per-widget config (tap to expand)
    │   │   ├── Clock: 12h/24h, Hindu calendar on/off
    │   │   ├── Weather: city, units
    │   │   ├── Cricket: favorite team, celebration sounds on/off
    │   │   └── UPI History: clear history button
    │   └── Preview: small ROVA display preview updates live
    │
    ├── Tab 3: Alerts
    │   ├── UPI alert feed (last 20 credits)
    │   ├── Each entry: amount, sender, timestamp, app icon
    │   ├── UPI listener toggle (on/off with permission state)
    │   └── Empty state: "No alerts yet. Make some money first."
    │
    └── Tab 4: Settings
        ├── Device section
        │   ├── Firmware version + OTA update
        │   ├── Device name (editable)
        │   └── Forget device (reset pairing)
        ├── Display section
        │   ├── Brightness slider
        │   └── Sleep schedule
        ├── App section
        │   ├── Language (EN / हिंदी)
        │   └── Notification permissions status
        └── About
            ├── App version
            ├── Device MAC
            ├── Uptime
            └── Open source licenses
```

---

## 3. COMPLETE SCREEN-BY-SCREEN SPEC

---

### SCREEN: Splash / App Load
**Duration**: 1.2s max, then auto-navigate
**Layout**: Full black screen. Center: ROVA wordmark in `--text-primary` at 32px. Below it in `--text-muted` at 11px: `by EngiiGenius`. No logo. No animation except a subtle fade-in on the wordmark (300ms). If first launch → go to Onboarding. If returning → go to Home.

---

### SCREEN: Onboarding — Step 1 (Welcome)
**Layout**: Full screen dark. Top-right: skip button (`--text-muted`, small).

**Center block**:
- ROVA animated face GIF/Lottie — 120×120px. The idle face animation (blinking). Centered.
- Below it, 24px gap: `"Meet ROVA."` — 32px, `--text-primary`, display font
- Below that, 8px gap: `"Your desk. Smarter."` — 18px, `--text-secondary`
- Below that, 32px gap: small horizontal tag strip:
  - `[🏏 Cricket]` `[💸 UPI]` `[🌤 Weather]` `[⏰ Clock]`
  - Style: border `1px solid #333`, padding `6px 12px`, radius `4px`, text `--text-secondary`, `12px`

**Bottom**: Full-width primary button: `"Let's set it up"` → navigate to Step 2

---

### SCREEN: Onboarding — Step 2 (Permissions)
**Layout**: Top: back arrow. Progress bar: thin 1px line across top, 2/5 filled in `--accent`.

**Content block** (scrollable if needed):
- Heading: `"A few permissions"` — 24px
- Subtext: `"We need these to make ROVA useful. Nothing leaves your phone."` — `--text-secondary`, 14px

**Permission cards** — each is a card `(#111, border #222, radius 8px, padding 16px)`:

Card 1: Notification Access
```
[Bell icon, 20px, --accent]  Notification Access
                              "To detect UPI credits from GPay,
                               PhonePe, Paytm and show them on
                               ROVA."
                              [Allow →]   (tapping opens system settings)
Status: if granted → green pill "Granted" replaces button
```

Card 2: Location (coarse)
```
[Location icon, --accent]   Location
                             "To auto-detect your city for the
                              weather widget."
                             [Allow →]
Status: if granted → green pill "Granted"
```

Note at bottom: `"You can change these anytime in Settings."` — `--text-muted`, 12px

**Bottom**: `"Continue"` button — only active (accent) if notification permission granted. Location is optional (user can set city manually).

---

### SCREEN: Onboarding — Step 3 (Wi-Fi Setup / Pairing)
**Layout**: Progress bar 3/5.

**State machine — this screen has 4 internal states:**

**State A: Pre-scan** (default on arrive)
```
Center: ROVA face with "thinking" animation (eyes flicking)
Heading: "Power on your ROVA"
Subtext: "Hold the power button for 3 seconds until the LED pulses amber."
[illustration: simple line-art of device, arrow pointing to power button]
Bottom button: "My ROVA is on →"  → triggers BLE scan → State B
```

**State B: Scanning** (BLE scanning for ESP32 SmartConfig beacon)
```
Center: pulsing dots animation (3 dots, staggered pulse)
Heading: "Looking for ROVA..."
Subtext: "Make sure you're within 2 meters of the device."
[Cancel] link below in --text-muted
Timeout after 15s → State D (not found)
On found → State C
```

**State C: Found + Enter Wi-Fi**
```
Success micro-animation: ROVA face goes "surprised/happy" briefly
Heading: "Found ROVA!"
Subtext: "Now enter your Wi-Fi password to connect."

Wi-Fi network shown (auto-detected from phone):
[Network name: "MyHomeWiFi"  ✓ ]  ← pre-filled, editable

Password input:
[••••••••••••••      👁]
label above: "WI-FI PASSWORD"

[Connect →]  → triggers SmartConfig broadcast → loading state → on success: Step 4
```

**State D: Not found**
```
Center: ROVA face "error" state (red tint)
Heading: "Couldn't find ROVA"
Subtext: "Make sure the device is powered on and within range."
[Try again]  [Enter manually →]  (manual: shows text input for device IP)
```

---

### SCREEN: Onboarding — Step 4 (City Setup)
**Layout**: Progress bar 4/5.

**Content**:
- ROVA face preview in top-right corner (small, 60×60) showing weather widget mock
- Heading: `"Where are you?"` — 24px
- Subtext: `"ROVA will show live weather for your city."` — `--text-secondary`

**City input with search**:
```
[Search city...                    🔍]
```
- As user types, show dropdown list of matching cities from Open-Meteo geocoding API
- Each result: `City Name` on left, `State, India` on right in `--text-muted`
- On select: input fills, show small weather preview card:
  ```
  [ 🌤  Mumbai  28°C  AQI: 142 ]
  ```
  With live data from Open-Meteo. Confirms the city is valid.

**Bottom**: `"Set city →"` (active only when city selected)

Optional link: `"Skip for now"` — city can be set later in Settings.

---

### SCREEN: Onboarding — Step 5 (Success)
**Layout**: Full screen. Center.

- ROVA face: "happy" animation (bouncing, wide eyes)
- Heading: `"ROVA is ready."` — 32px, display font
- Subtext: `"All set. Your desk companion is live."` — `--text-secondary`
- Below, thin divider, then a preview of what's now showing on the physical device:
  ```
  [ Clock widget preview — showing current IST time ]
  ```
- **Bottom**: `"Open ROVA →"` → navigate to Main App (Home tab)

---

### SCREEN: Home (Tab 1) — Main Dashboard
This is the app's main screen. User lands here every time.

**Layout**: Scroll view. No tab content labels visible until scroll. Status bar transparent.

**Section 1: Device Status Bar** (top, always visible, fixed)
```
ROVA ●  Online          [battery 78%]  [signal ●●●○]
```
- `ROVA` in display font, `--text-primary`
- `● Online` — green dot `--accent`, text `--text-secondary`
- Battery: number + thin custom bar indicator
- If offline: `● Offline` in red, bar turns red, battery hidden

**Section 2: ROVA Live Preview Card**
```
┌─────────────────────────────────────────┐
│                                         │
│         [ROVA FACE ANIMATION]           │
│           120×120px, centered           │
│                                         │
│   Currently showing:  Cricket Widget    │
│   IND 187/4 (18.2)                      │
│                                         │
│   [◀]  Clock · Weather · Cricket · UPI  │ ← carousel dots
└─────────────────────────────────────────┘
```
- Card background: `#111`, border `#222`
- ROVA face is a live mirror of the device state (pushed via MQTT or polled)
- Carousel dots show which widget is currently active on device
- Tapping `[◀]` or `[▶]` sends MQTT command to switch widget on device

**Section 3: Last UPI Alert**
```
LAST PAYMENT
┌─────────────────────────────────────────┐
│  ₹1,250        Rahul Kumar              │
│  via GPay      2 min ago                │
└─────────────────────────────────────────┘
```
- If no alerts yet: muted empty state card: `"No UPI alerts yet"`
- Tapping → navigates to Alerts tab

**Section 4: Quick Controls**
```
QUICK CONTROLS
┌──────────────┐  ┌──────────────┐
│  Brightness  │  │    Sleep     │
│  ━━━━━━━●━━  │  │  [  OFF  ]  │
│     64%      │  │              │
└──────────────┘  └──────────────┘
```
- Brightness: mini version of the slider. Tap to expand to full slider bottom sheet.
- Sleep: toggle. When ON shows scheduled hours.

**Section 5: Cricket (if live match)**
Only visible during live IPL / India match. Pulls from same CricAPI data ROVA uses.
```
LIVE NOW  ● 
┌─────────────────────────────────────────┐
│  🏏  IND vs AUS  •  T20I                │
│  INDIA  187/4  (18.2 ov)               │
│  Need: 43 off 22  •  RRR 11.7          │
└─────────────────────────────────────────┘
```
- Red pulsing `● LIVE` indicator
- Tapping → opens full cricket detail bottom sheet

---

### SCREEN: Widgets (Tab 2)
Configure what shows on ROVA's display and in what order.

**Layout**: List view with drag handles. Section header: `WIDGETS` in all-caps muted style.

**Widget List Item** (each widget):
```
[ ≡ ]  [Widget icon]  Clock                    [ ● ON ]
                       Large time display
```
- `≡` = drag handle (reorder)
- Toggle right side
- Tap anywhere on row → expands inline config (accordion, not navigation)

**Expanded: Clock config**
```
▼  Clock
   
   FORMAT
   [ 12-hour ]  [ 24-hour ▪ ]   ← segmented control, accent on active
   
   ADDITIONAL
   Hindu calendar date    [ OFF ]
   
   PREVIEW
   [ mini display mock showing 14:32 ]
```

**Expanded: Weather config**
```
▼  Weather
   
   CITY
   [  Mumbai, Maharashtra      ✎ ]
   
   AQI ALERT (show alert overlay if AQI > 200)
   [ ON ● ]
   
   PREVIEW
   [ 28°C  🌤  AQI 142 ]
```

**Expanded: Cricket config**
```
▼  Cricket
   
   FAVORITE TEAM
   [ India ▼ ]   ← dropdown: India / Mumbai Indians / CSK / etc.
   
   CELEBRATIONS
   Sound on boundary    [ ON ● ]
   Sound on wicket      [ ON ● ]
   
   PREVIEW
   [ IND 187/4 (18.2) ]
```

**Expanded: UPI History config**
```
▼  UPI Alerts on Screen
   
   STATUS
   ● Notification Access: Granted
   
   TRIGGER APPS
   [✓] GPay   [✓] PhonePe   [✓] Paytm   [✓] BHIM
   
   HISTORY
   Stored alerts: 12     [Clear history]
```

**Bottom of Widgets tab**: 
```
WIDGET ORDER
Drag to reorder. Changes apply instantly.
```

---

### SCREEN: Alerts (Tab 3)
Full UPI alert history feed.

**Layout**: Header with toggle. List below.

**Header**:
```
UPI Alerts

Notification listener  [ ● ON ]
"Monitoring GPay, PhonePe, Paytm, BHIM"
```

**Feed** (most recent first):
```
TODAY

┌─────────────────────────────────────────┐
│  [GPay icon]   ₹1,250                   │
│                Rahul Kumar              │
│                2:34 PM  •  2 min ago    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  [PhonePe icon]  ₹500                   │
│                  Priya S.               │
│                  11:20 AM  •  3 hrs ago │
└─────────────────────────────────────────┘

YESTERDAY

...
```
- Date group headers: `TODAY` / `YESTERDAY` / `MON 12 MAY` — all-caps muted
- Each card: app icon (small, 20px), amount in display font large, sender in secondary, time in muted mono
- Long press on card → delete option

**Empty state**:
```
[ROVA face "sleeping" animation, small]
"No alerts yet."
"Enable notification access and make
 some money first."
```

---

### SCREEN: Settings (Tab 4)
Standard settings layout. Section-grouped list.

**Device Section**
```
DEVICE

Firmware           v1.0.2          [Check for update →]
Device name        ROVA-A3F2       [Edit]
Wi-Fi network      MyHomeWiFi      
Device IP          192.168.1.47    [Copy]
Uptime             3d 14h 22m      
Forget device                      [→]   ← destructive, shown in --red
```

**Display Section**
```
DISPLAY

Brightness
[━━━━━━━━━━━━━━━━━●━━━━━]  64%

Sleep schedule
Auto-off time     [ 10:30 PM ]
Wake time         [  7:00 AM ]
Sleep now                          [→]
```

**App Section**
```
APP

Language          [ English ▼ ]
Notification access  ● Granted    [Open settings →]
Location access      ● Granted    [Open settings →]
```

**About Section**
```
ABOUT

App version       1.0.0
Made by           EngiiGenius
Open source       [View licenses →]
```

---

### BOTTOM SHEET: Brightness Control (expanded from Home quick control)
Drag up from bottom. Full-width slider.
```
┌──────────────────────────────────────┐
│  ——  (drag handle)                   │
│                                      │
│  BRIGHTNESS                          │
│  [━━━━━━━━━━━━━━━━━●━━━━]  64%       │
│                                      │
│  ROVA preview updates in real-time   │
│  [ROVA face shown at current brightness]│
│                                      │
└──────────────────────────────────────┘
```

---

### BOTTOM SHEET: OTA Update
Triggered from Settings → Firmware → Check for update.

**State A: Checking**
```
Checking for updates...
[pulsing dots]
```

**State B: Up to date**
```
[✓ --accent]  You're up to date.
              v1.0.2 is the latest version.
[Close]
```

**State C: Update available**
```
Update available

v1.0.3 → v1.0.4
━━━━━━━━━━━━━━━━

What's new:
• Cricket widget: IPL team colors
• Fixed weather AQI sometimes showing 0
• UPI: added BHIM support

Size: 1.2 MB  •  ~2 min to install

[Install update]  ← primary accent button
[Later]           ← muted link
```

**State D: Installing**
```
Installing update...

[━━━━━━━━━━━━━━●━━━━━━━]  67%

Do not turn off ROVA.
ROVA will restart automatically.
```

**State E: Done**
```
[✓]  Updated to v1.0.4
     ROVA is restarting...

[Close]
```

---

### NOTIFICATION: UPI Alert (system notification when app is background)
Shown as Android notification when app is in background and UPI credit received.

```
[ROVA icon]  ROVA
             ₹1,250 from Rahul Kumar
             Showing on your ROVA now ·  now
```

---

## 4. COMPLETE SYSTEM ARCHITECTURE

### Tech Stack
```
Frontend (Mobile):
  React Native 0.73+
  React Navigation v6 (stack + bottom tabs)
  Zustand — global state management
  React Native Reanimated 3 — all animations
  React Native Gesture Handler — drag reorder, swipe gestures
  React Native MMKV — fast local storage (replaces AsyncStorage)
  MQTT.js — MQTT client over WebSocket
  Lottie React Native — ROVA face animations (JSON Lottie files)
  React Native BLE Manager — SmartConfig pairing
  React Native Push Notification — UPI notification capture
  Axios — HTTP client for weather/cricket APIs

Frontend (Web Dashboard — optional, same feature set):
  Next.js 14 (App Router)
  Tailwind CSS (custom config matching our design tokens)
  Framer Motion — animations
  Zustand — state
  MQTT.js — WebSocket MQTT

Backend (minimal — most logic is local):
  AWS IoT Core (MQTT broker) — free tier
    OR: Mosquitto on a $5 DigitalOcean droplet (self-hosted)
  AWS S3 — firmware binary hosting for OTA
  AWS Lambda — OTA version manifest endpoint (tiny, stateless)
  Open-Meteo — weather API (no backend needed, called directly from app + device)
  CricAPI.com — cricket API (called from device, not app)
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  ANDROID PHONE                                                   │
│                                                                  │
│  ┌──────────────────┐    ┌─────────────────────────────────┐    │
│  │ NotificationList │    │  ROVA Companion App             │    │
│  │ enerService      │───▶│                                 │    │
│  │                  │    │  Zustand Store                  │    │
│  │ Detects UPI      │    │  ├── deviceState                │    │
│  │ notifications    │    │  ├── widgetConfig               │    │
│  │ from GPay etc.   │    │  ├── alertHistory               │    │
│  │                  │    │  └── settingsState              │    │
│  └──────────────────┘    │                                 │    │
│                           │  MQTT Client (MQTT.js)         │    │
│                           │  Connected to: AWS IoT Core    │    │
└───────────────────────────┼─────────────────────────────────┘   │
                            │         │ publish / subscribe        │
                            ▼         ▼                            │
                    ┌──────────────────────┐                       │
                    │  AWS IoT Core        │                       │
                    │  MQTT Broker         │                       │
                    │                      │                       │
                    │  Topics:             │                       │
                    │  rova/{id}/upi_alert │                       │
                    │  rova/{id}/cmd       │                       │
                    │  rova/{id}/status    │                       │
                    │  rova/{id}/config    │                       │
                    └──────────┬───────────┘                       │
                               │                                   │
                               ▼                                   │
                    ┌──────────────────────┐                       │
                    │  ESP32-S3 (ROVA)     │                       │
                    │                      │                       │
                    │  MQTT Client         │                       │
                    │  ├── Receives:       │                       │
                    │  │   upi_alert       │                       │
                    │  │   cmd (widget     │                       │
                    │  │       switch,     │                       │
                    │  │       brightness) │                       │
                    │  │   config update   │                       │
                    │  │                   │                       │
                    │  └── Publishes:      │                       │
                    │      status heartbeat│                       │
                    │      (battery, wifi, │                       │
                    │       current widget)│                       │
                    │                      │                       │
                    │  HTTP Client         │                       │
                    │  ├── Open-Meteo      │                       │
                    │  └── CricAPI         │                       │
                    └──────────────────────┘                       │
```

### MQTT Topic Schema
```
Topic prefix: rova/{device_id}/

DEVICE → APP (device publishes, app subscribes):
  rova/{id}/status
    Payload: {
      "battery": 78,
      "wifi_rssi": -62,
      "current_widget": "cricket",
      "uptime_s": 302400,
      "firmware": "1.0.2",
      "ip": "192.168.1.47"
    }
    Frequency: every 60 seconds

APP → DEVICE (app publishes, device subscribes):
  rova/{id}/cmd
    Payload: {
      "action": "widget_next" | "widget_prev" | "widget_set" | "brightness" | "sleep" | "wake" | "reboot"
      "value": <int or string, depends on action>
    }

  rova/{id}/upi_alert
    Payload: {
      "amount": "1250",
      "sender": "Rahul Kumar",
      "app": "gpay",
      "ts": 1748123456
    }

  rova/{id}/config
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

OTA (app → lambda → device):
  rova/{id}/ota
    Payload: {
      "action": "check" | "install",
      "version": "1.0.4",  // only for install
      "url": "https://...", // signed S3 URL
      "sha256": "abc123..."
    }
```

### Zustand Store Structure
```javascript
// deviceStore.js
{
  // Connection
  isConnected: boolean,
  deviceId: string,
  deviceIp: string,

  // Live status (from MQTT heartbeat)
  battery: number,
  wifiRssi: number,
  currentWidget: string,
  uptimeSeconds: number,
  firmware: string,

  // Config (synced to device)
  config: {
    brightness: number,         // 20-100
    widgetsEnabled: string[],
    widgetsOrder: string[],
    cityLat: number,
    cityLon: number,
    cityName: string,
    cricketTeam: string,
    clock24h: boolean,
    sleepStart: string,        // "HH:MM"
    sleepEnd: string,
    lang: "en" | "hi",
    upiEnabled: boolean,
    celebrationSounds: boolean,
  },

  // Actions
  setConfig: (partial) => void,  // updates local + publishes to rova/{id}/config
  sendCmd: (action, value?) => void,
  setConnected: (bool) => void,
}

// alertStore.js
{
  alerts: [{
    id: string,
    amount: string,
    sender: string,
    app: "gpay" | "phonepe" | "paytm" | "bhim",
    ts: number,
  }],
  addAlert: (alert) => void,
  clearAlerts: () => void,
  removeAlert: (id) => void,
}
```

### Local Storage Schema (MMKV)
```
Key: "device_config"        → JSON: DeviceConfig object
Key: "device_id"            → string: ROVA device ID
Key: "alert_history"        → JSON: Alert[] (max 50, FIFO)
Key: "onboarding_complete"  → boolean
Key: "app_lang"             → "en" | "hi"
Key: "city_data"            → JSON: { name, lat, lon }
```

### API Calls (App-side)
```javascript
// Weather (called from app for city preview during setup)
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}
  &longitude={lon}
  &current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m
  &hourly=uv_index
// No API key needed

// Weather AQI
GET https://air-quality-api.open-meteo.com/v1/air-quality
  ?latitude={lat}
  &longitude={lon}
  &current=pm10,pm2_5,european_aqi
// No API key needed

// City geocoding (for city search in setup + settings)
GET https://geocoding-api.open-meteo.com/v1/search
  ?name={searchTerm}
  &count=5
  &language=en
  &format=json
// No API key needed

// OTA manifest (Lambda function)
GET https://ota.engiigenius.com/rova/manifest.json
Response: {
  "latest": "1.0.4",
  "url": "https://s3.../rova_1.0.4.bin",
  "sha256": "...",
  "size": 1245184,
  "changelog": ["line1", "line2"]
}
```

### UPI Notification Parsing (Android Service)
```javascript
// NotificationListenerService — runs as background service
// Registered in AndroidManifest.xml with BIND_NOTIFICATION_LISTENER_SERVICE

const UPI_APPS = {
  'com.google.android.apps.nbu.paisa.user': 'gpay',
  'com.phonepe.app': 'phonepe',
  'net.one97.paytm': 'paytm',
  'in.org.npci.upiapp': 'bhim',
};

const UPI_PATTERNS = [
  /(?:Rs\.?\s*|₹)\s*([\d,]+(?:\.\d{1,2})?)\s*(?:received|credited|paid to you)/i,
  /You received\s+(?:Rs\.?\s*|₹)([\d,]+)/i,
  /(?:Rs\.?\s*|₹)([\d,]+)\s+(?:has been |)(?:received|credited)/i,
];

const SENDER_PATTERNS = [
  /from\s+([A-Za-z\s]{2,30})(?:\s+via|\s+on|\.|$)/i,
  /by\s+([A-Za-z\s]{2,30})(?:\s+via|\s+on|\.|$)/i,
];

function parseNotification(packageName, title, text) {
  const app = UPI_APPS[packageName];
  if (!app) return null;

  const fullText = `${title} ${text}`;
  let amount = null;
  let sender = "Someone";

  for (const pattern of UPI_PATTERNS) {
    const match = fullText.match(pattern);
    if (match) { amount = match[1].replace(/,/g, ''); break; }
  }

  for (const pattern of SENDER_PATTERNS) {
    const match = fullText.match(pattern);
    if (match) { sender = match[1].trim(); break; }
  }

  if (!amount) return null; // Not a credit notification

  return { amount, sender, app, ts: Date.now() };
}
```

---

## 5. ONBOARDING — BLE SMARTCONFIG FLOW

```
SmartConfig is an ESP-IDF protocol where the phone broadcasts
Wi-Fi credentials over BLE/UDP. The ESP32-S3 listens for this
broadcast and uses the credentials to connect to Wi-Fi.

React Native implementation:
1. Request BLE permissions (Android 12+: BLUETOOTH_SCAN, BLUETOOTH_CONNECT)
2. Scan for BLE advertisements from ESP32-S3 SmartConfig service UUID:
   UUID: 0000FFFF-0000-1000-8000-00805F9B34FB (ESP Touch UUID)
3. Once device found, use ESP SmartConfig library:
   - Encode Wi-Fi SSID + password in SmartConfig packet format
   - Broadcast via BLE
4. Device receives credentials, connects to Wi-Fi, publishes to:
   rova/provision/success with payload { device_id, ip }
5. App receives this MQTT message (subscribed before broadcast)
6. Store device_id in MMKV → provisioning complete

Library: react-native-esptouch or custom BLE implementation
Fallback: Manual IP entry if BLE fails
```

---

## 6. STATE MANAGEMENT FLOWS

### App Launch Flow
```
App opens
  → Check MMKV: "onboarding_complete"?
      NO  → Navigate to Onboarding Stack
      YES → Navigate to Main App (Home Tab)
            → Connect to MQTT broker (device_id from MMKV)
            → Subscribe to rova/{id}/status
            → Render Home with last known state
            → Update as MQTT heartbeats arrive
```

### Config Change Flow (e.g. user changes brightness)
```
User drags brightness slider to 70
  → Zustand: setConfig({ brightness: 70 })
  → Debounce 300ms (avoid spamming while dragging)
  → MQTT publish to rova/{id}/config with full config object
  → Device receives, applies brightness immediately
  → Device sends next heartbeat with updated state
  → App receives heartbeat → confirms sync
```

### UPI Alert Flow
```
PhonePe sends notification: "₹500 received from Priya S."
  → NotificationListenerService.onNotificationPosted fires
  → parseNotification() extracts { amount: "500", sender: "Priya S.", app: "phonepe" }
  → alertStore.addAlert({ ...parsed, id: uuid(), ts: Date.now() })
  → MQTT publish to rova/{id}/upi_alert
  → Device receives → plays jingle → shows overlay for 5s
  → If app in background: fire local Android notification
```

### Widget Reorder Flow
```
User drags Cricket widget above Weather widget
  → React Native Gesture Handler onDragEnd
  → Local list reorders immediately (optimistic)
  → Zustand: setConfig({ widgetsOrder: [...newOrder] })
  → MQTT publish rova/{id}/config
  → Device applies new widget order on next Mode button press
```

---

## 7. ANIMATIONS & MICRO-INTERACTIONS SPEC

### ROVA Face (Lottie)
Create Lottie JSON animations for these states. Each should feel like a character, not just a spinner:
```
idle.json         — slow blink every 4s, occasional yawn
happy.json        — eyes wide, bounce twice, little stars appear
thinking.json     — eyes look left-right, dots pulse below
alert.json        — eyebrows raise, quick head-snap
sleeping.json     — eyes close, zzz floats up
error.json        — red tint on eyes, frown, ! appears
```
Face dimensions in app: 120×120px (Home preview), 80×80px (Onboarding compact), 48×48px (Loading states)

### Page Transitions (React Navigation)
```javascript
// Custom transition: slide up (feels like a native iOS sheet, but darker)
const slideUpTransition = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: { animation: 'timing', config: { duration: 240, easing: Easing.out(Easing.cubic) }},
    close: { animation: 'timing', config: { duration: 200, easing: Easing.in(Easing.cubic) }},
  },
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [{
        translateY: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [layouts.screen.height, 0],
        }),
      }],
    },
  }),
};
```

### UPI Alert — in-app toast
When app is foreground and UPI credit arrives:
```
Slide in from top: 240ms spring
Show for: 3000ms
Slide out to top: 200ms ease-in

Visual:
┌─────────────────────────────────────┐
│  [GPay]  ₹1,250  from Rahul Kumar   │
│          Showing on ROVA now  ●      │
└─────────────────────────────────────┘
Background: #111, border: 1px solid --accent
Accent dot pulses once on appear
```

### Widget Card Drag (Widgets tab)
```
On drag start:
  Scale: 1.0 → 1.03 (200ms spring)
  Background: #1A1A1A → #222 (100ms)
  Shadow: none → subtle (2px #000 at 60% opacity)
  Other items: compress smoothly to make room

On drop:
  Scale: 1.03 → 1.0 (200ms spring with slight overshoot: 1.03 → 1.01 → 1.0)
  MQTT config publish fires (debounced 500ms)
```

### Toggle switch (custom)
```
Off → On:
  Track: #222 → --accent (200ms ease)
  Thumb: slides right 18px (200ms spring, slight overshoot)
  
On → Off:
  Track: --accent → #222 (200ms ease)
  Thumb: slides left 18px (200ms spring)
```

### Loading states
Never a spinner. Always a pulsing opacity:
```javascript
// Pulse animation
Animated.loop(
  Animated.sequence([
    Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
    Animated.timing(opacity, { toValue: 1.0, duration: 700, useNativeDriver: true }),
  ])
)
```
Applied to: skeleton placeholder cards, "Scanning..." state, API loading.

---

## 8. ERROR STATES & EDGE CASES

### Device Offline
```
Home screen: status bar turns red "● Offline"
ROVA face: shows "error" animation
Device preview card shows: "Last seen 5 min ago"
Quick controls greyed out + tooltip: "ROVA is offline"

Retry logic: MQTT auto-reconnects with exponential backoff
  Attempt 1: 2s delay
  Attempt 2: 4s delay
  Attempt 3: 8s delay
  Attempt 4+: 30s delay
  After 5 min offline: show banner "ROVA has been offline for 5 min. 
  Is it powered on?" with [Troubleshoot] link
```

### Wi-Fi Provisioning Failure
```
SmartConfig timeout (15s): show State D (device not found)
Wrong password: device sends error via MQTT → app shows "Wrong password. Try again."
Device already provisioned: show "ROVA is already connected to [NetworkName]"
```

### Cricket API down / No data
```
Cricket widget on device: shows "No match data"
App: cricket section hidden from Home (no error shown, just absent)
```

### Notification Permission Denied
```
Alerts tab: full-screen state:
  [ROVA face neutral]
  "Notification access needed"
  "ROVA can't detect UPI payments without
   reading notifications."
  [Enable in Settings →]  ← opens Android notification access settings
  [Skip for now]
```

### OTA — Low battery
```
If battery < 20%: Install button disabled
Tooltip: "Charge ROVA above 20% before updating"
```

---

## 9. LOCALIZATION (EN / हिंदी)

All UI strings are localized. Two language files:
```
en.json — English (default)
hi.json — Hindi

Key strings in Hindi:
"Meet ROVA" → "ROVA से मिलो"
"Let's set it up" → "शुरू करते हैं"
"Online" → "ऑनलाइन"
"Offline" → "ऑफलाइन"
"₹1,250 from Rahul Kumar" → "₹1,250 राहुल कुमार से"
"Showing on your ROVA now" → "अभी आपके ROVA पर दिख रहा है"
"No alerts yet." → "अभी कोई अलर्ट नहीं।"
"Make some money first." → "पहले कुछ कमाओ।"
```

Font note: Hindi (Devanagari script) requires `Noto Sans Devanagari` — load as a custom font in React Native.

---

## 10. NAVIGATION STRUCTURE (React Navigation)

```javascript
// Root Navigator
<NavigationContainer>
  {onboardingComplete 
    ? <MainTabs />
    : <OnboardingStack />
  }
</NavigationContainer>

// OnboardingStack (Stack Navigator, no header)
<Stack.Screen name="Welcome" />
<Stack.Screen name="Permissions" />
<Stack.Screen name="WiFiSetup" />
<Stack.Screen name="CitySetup" />
<Stack.Screen name="SetupComplete" />

// MainTabs (Bottom Tab Navigator)
// Custom tab bar component — black background, no border, 
// just 4 icons. Active: --accent color. Inactive: #444.
<Tab.Screen name="Home"     icon="grid"    />
<Tab.Screen name="Widgets"  icon="sliders" />
<Tab.Screen name="Alerts"   icon="bell"    />
<Tab.Screen name="Settings" icon="settings"/>

// Modal Screens (shown as bottom sheets over tabs)
// Registered in root Stack Navigator as modal:
<Stack.Screen name="BrightnessSheet"  presentation="modal" />
<Stack.Screen name="OTAUpdateSheet"   presentation="modal" />
<Stack.Screen name="CricketDetail"    presentation="modal" />
<Stack.Screen name="CitySearchSheet"  presentation="modal" />
```

---

## 11. FOLDER STRUCTURE

```
rova-app/
├── src/
│   ├── components/
│   │   ├── ROVAFace/
│   │   │   ├── ROVAFace.tsx          ← Lottie wrapper, accepts state prop
│   │   │   └── animations/           ← .json Lottie files
│   │   ├── DeviceStatusBar.tsx
│   │   ├── WidgetPreview.tsx         ← mini 1.69" display mock
│   │   ├── UPIAlertCard.tsx
│   │   ├── CustomToggle.tsx
│   │   ├── CustomSlider.tsx
│   │   ├── BottomSheet.tsx           ← reusable sheet wrapper
│   │   ├── SectionHeader.tsx         ← CAPS MUTED LABEL component
│   │   └── StatusPill.tsx            ← ● Online / ● Offline
│   │
│   ├── screens/
│   │   ├── onboarding/
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── PermissionsScreen.tsx
│   │   │   ├── WiFiSetupScreen.tsx
│   │   │   ├── CitySetupScreen.tsx
│   │   │   └── SetupCompleteScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── WidgetsScreen.tsx
│   │   ├── AlertsScreen.tsx
│   │   └── SettingsScreen.tsx
│   │
│   ├── sheets/
│   │   ├── BrightnessSheet.tsx
│   │   ├── OTAUpdateSheet.tsx
│   │   ├── CricketDetailSheet.tsx
│   │   └── CitySearchSheet.tsx
│   │
│   ├── store/
│   │   ├── deviceStore.ts            ← Zustand device state
│   │   └── alertStore.ts             ← Zustand alert history
│   │
│   ├── services/
│   │   ├── mqtt.ts                   ← MQTT client singleton
│   │   ├── upiParser.ts              ← notification parsing logic
│   │   ├── weatherApi.ts             ← Open-Meteo calls
│   │   ├── otaApi.ts                 ← OTA manifest fetch
│   │   └── storage.ts                ← MMKV wrapper
│   │
│   ├── hooks/
│   │   ├── useDeviceConnection.ts    ← MQTT connect/disconnect lifecycle
│   │   ├── useUPIListener.ts         ← NotificationListenerService bridge
│   │   └── useCricket.ts             ← cricket data for Home screen
│   │
│   ├── theme/
│   │   ├── colors.ts                 ← all color tokens
│   │   ├── typography.ts             ← font scales
│   │   └── spacing.ts                ← spacing tokens
│   │
│   ├── localization/
│   │   ├── en.json
│   │   └── hi.json
│   │
│   └── navigation/
│       ├── AppNavigator.tsx          ← root navigator
│       ├── OnboardingStack.tsx
│       ├── MainTabs.tsx
│       └── CustomTabBar.tsx          ← custom tab bar component
│
├── android/                          ← standard RN android project
│   └── app/src/main/java/.../
│       └── NotificationService.java  ← NotificationListenerService
│
├── package.json
└── app.json
```

---

## 12. ANDROID MANIFEST REQUIREMENTS

```xml
<!-- AndroidManifest.xml additions -->

<!-- BLE for SmartConfig pairing -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

<!-- Notification listener for UPI detection -->
<uses-permission android:name="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE" />

<!-- Wi-Fi for MQTT and API calls -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />

<!-- Foreground service for MQTT (keep connection alive) -->
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

<!-- NotificationListenerService registration -->
<service
  android:name=".ROVANotificationService"
  android:label="ROVA UPI Alerts"
  android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE">
  <intent-filter>
    <action android:name="android.service.notification.NotificationListenerService" />
  </intent-filter>
  <meta-data
    android:name="android.service.notification.default_filter_types"
    android:value="conversations|alerting" />
</service>
```

---

## 13. KEY DESIGN DECISIONS & RATIONALE

| Decision | Choice | Why |
|----------|--------|-----|
| State management | Zustand | Lightweight, no boilerplate, works great with MMKV |
| MQTT broker | AWS IoT Core | Free tier covers us to 10k devices; auto-scales |
| Local vs cloud MQTT | Cloud (with local fallback) | Phone and device may be on different networks (hotspot, office) |
| No user account required | Auth optional | Reduces friction massively for ₹2k product demographic |
| Config sync strategy | Full config object on every change | Simpler than delta updates; config is tiny (<1KB) |
| Notification parsing | On-device (Android service) | Privacy; no UPI data leaves phone |
| Animation library | Lottie | Designers can create/update ROVA face without code changes |
| Language | React Native not Flutter | Larger ecosystem; easier to find RN devs in India |
| OTA hosting | S3 + Lambda | Dirt cheap; Lambda runs 1M req/month free |

---

## 14. PHASED BUILD ORDER

### Phase 1 (Week 1–2): Foundation
- Project setup, navigation structure, design tokens
- Theme file (colors, typography, spacing)
- Core components: ROVAFace, CustomToggle, CustomSlider, StatusPill
- MMKV storage service
- MQTT service (connect, subscribe, publish)

### Phase 2 (Week 3–4): Onboarding
- All 5 onboarding screens
- BLE SmartConfig integration
- City search with Open-Meteo geocoding
- Onboarding complete → main app navigation

### Phase 3 (Week 5–6): Core Screens
- Home screen (all 5 sections)
- Widgets screen (list + accordion config)
- Settings screen

### Phase 4 (Week 7): UPI + Alerts
- Android NotificationListenerService (Java)
- React Native bridge for notification events
- Alert store + alert feed screen
- MQTT UPI alert publish

### Phase 5 (Week 8): Polish
- All bottom sheets
- OTA update flow
- All error states and empty states
- Hindi localization
- Final animation polish

---

*End of prompt. Build ROVA.*
