# ROVA OTA Update Infrastructure

## Overview
Lambda function for serving firmware update manifests to ROVA devices.

## Architecture
```
React Native App → API Gateway → Lambda → S3 → ESP32-S3
```

## Quick Deploy

### 1. Create S3 Bucket
```bash
aws s3 mb s3://rova-firmware --region us-east-1
aws s3 cp manifest.example.json s3://rova-firmware/manifest.json
```

### 2. Deploy Lambda
```bash
npm install
zip -r function.zip index.js node_modules/ package.json
aws lambda create-function \
  --function-name rova-ota-manifest \
  --runtime nodejs18.x \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --environment Variables={FIRMWARE_BUCKET=rova-firmware}
```

### 3. Create API Gateway Endpoint
Endpoint: `https://YOUR_API.execute-api.us-east-1.amazonaws.com/prod/ota/manifest`

## Usage
```bash
curl "https://YOUR_API/ota/manifest?device_id=ROVA-A3F2&current_version=1.0.2"
```

Response:
```json
{
  "latest": "1.0.4",
  "update_available": true,
  "url": "https://presigned-s3-url...",
  "sha256": "...",
  "size": 1245184,
  "changelog": ["..."]
}
```

See full documentation in README.md (to be created).
