import { GET as getOverview } from './apps/web/app/api/control-center/overview/route';
import { GET as getAssets } from './apps/web/app/api/control-center/assets/route';
import { GET as getTelemetry } from './apps/web/app/api/control-center/assets/[id]/telemetry/route';
import { NextRequest } from 'next/server';

async function verify() {
  console.log('Verifying Core APIs...');

  // Mock Request
  const createRequest = (url: string) => new NextRequest(new URL(url, 'http://localhost'));

  try {
    // 1. Overview
    console.log('Testing /api/control-center/overview...');
    const overviewRes = await getOverview();
    const overviewData = await overviewRes.json();
    console.log('Overview Status:', overviewRes.status);
    console.log('Overview Data:', overviewData);
    if (overviewRes.status !== 200 || !overviewData.activeAlerts) throw new Error('Overview failed');

    // 2. Assets
    console.log('Testing /api/control-center/assets...');
    const assetsRes = await getAssets(createRequest('http://localhost/api/control-center/assets?query=well'));
    const assetsData = await assetsRes.json();
    console.log('Assets Status:', assetsRes.status);
    console.log('Assets Data Length:', assetsData.length);
    if (assetsRes.status !== 200 || !Array.isArray(assetsData)) throw new Error('Assets failed');

    // 3. Telemetry
    console.log('Testing /api/control-center/assets/well-101/telemetry...');
    const telemetryRes = await getTelemetry(createRequest('http://localhost/api/control-center/assets/well-101/telemetry?window=1h'), { params: { id: 'well-101' } });
    const telemetryData = await telemetryRes.json();
    console.log('Telemetry Status:', telemetryRes.status);
    console.log('Telemetry Series Length:', telemetryData.series?.length);
    if (telemetryRes.status !== 200 || !telemetryData.series) throw new Error('Telemetry failed');

    console.log('SUCCESS: Core APIs Verified');
  } catch (error) {
    console.error('FAILED:', error);
    process.exit(1);
  }
}

verify();
