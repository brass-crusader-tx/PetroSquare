import { getBasins, getAssets, getAISummary, getOverlays } from '../lib/gis/service';

async function test() {
  console.log('--- Testing Basins ---');
  const basins = await getBasins();
  console.log(`Basins found: ${basins.length}`);
  console.log(JSON.stringify(basins[0], null, 2));

  console.log('\n--- Testing Assets (Permian) ---');
  const assets = await getAssets({ basin_id: 'b-permian' });
  console.log(`Assets in Permian: ${assets.length}`);
  if (assets.length > 0) {
      console.log(JSON.stringify(assets[0], null, 2));
  }

  console.log('\n--- Testing AI Summary ---');
  const summary = await getAISummary('b-permian');
  console.log('Summary found:', !!summary);
  if (summary) {
      console.log(`Confidence: ${summary.confidence_score}`);
  }
}

test().catch(console.error);
