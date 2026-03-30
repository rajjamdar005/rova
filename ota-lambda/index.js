// AWS Lambda Function for ROVA OTA Manifest
// This function serves the firmware version manifest to check for updates

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FIRMWARE_BUCKET || 'rova-firmware';
const MANIFEST_KEY = 'manifest.json';

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  try {
    // Handle OPTIONS request (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: '',
      };
    }

    // Get device info from query params (optional, for device-specific updates)
    const deviceId = event.queryStringParameters?.device_id || null;
    const currentVersion = event.queryStringParameters?.current_version || '0.0.0';

    // Fetch manifest from S3
    const manifestData = await s3.getObject({
      Bucket: BUCKET_NAME,
      Key: MANIFEST_KEY,
    }).promise();

    const manifest = JSON.parse(manifestData.Body.toString('utf-8'));

    // Check if update is available
    const latestVersion = manifest.latest;
    const updateAvailable = compareVersions(latestVersion, currentVersion) > 0;

    // Generate presigned URL for firmware download (valid for 1 hour)
    const firmwareUrl = s3.getSignedUrl('getObject', {
      Bucket: BUCKET_NAME,
      Key: manifest.firmware_path,
      Expires: 3600, // 1 hour
    });

    // Response
    const response = {
      latest: manifest.latest,
      current: currentVersion,
      update_available: updateAvailable,
      url: updateAvailable ? firmwareUrl : null,
      sha256: manifest.sha256,
      size: manifest.size,
      changelog: manifest.changelog,
      release_date: manifest.release_date,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
};

// Compare version strings (e.g., "1.0.4" > "1.0.2")
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  return 0;
}
