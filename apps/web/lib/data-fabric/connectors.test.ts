import { expect, test, describe } from "bun:test";
import { IntelConnector } from "./connectors";

describe("IntelConnector", () => {
  test("getDeals returns valid mock data", async () => {
    const deals = await IntelConnector.getDeals();
    expect(Array.isArray(deals)).toBe(true);
    expect(deals.length).toBeGreaterThan(0);

    for (const deal of deals) {
      expect(typeof deal.id).toBe("string");
      expect(typeof deal.buyer).toBe("string");
      expect(typeof deal.seller).toBe("string");
      expect(typeof deal.value_usd_m).toBe("number");
      expect(typeof deal.asset_type).toBe("string");
      expect(typeof deal.date).toBe("string");
      expect(typeof deal.description).toBe("string");

      // Basic date format validation (YYYY-MM-DD)
      expect(deal.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test("getInfrastructure returns valid mock data", async () => {
    const infra = await IntelConnector.getInfrastructure();
    expect(Array.isArray(infra)).toBe(true);
    expect(infra.length).toBeGreaterThan(0);

    for (const item of infra) {
      expect(typeof item.id).toBe("string");
      expect(typeof item.name).toBe("string");
      expect(['PIPELINE', 'TERMINAL', 'REFINERY']).toContain(item.type);
      expect(['OPERATIONAL', 'MAINTENANCE', 'PLANNED']).toContain(item.status);
      expect(typeof item.capacity).toBe("number");
      expect(typeof item.unit).toBe("string");
      expect(typeof item.location).toBe("string");
    }
  });

  test("getRigs returns valid mock data", async () => {
    const rigs = await IntelConnector.getRigs();
    expect(Array.isArray(rigs)).toBe(true);
    expect(rigs.length).toBeGreaterThan(0);

    for (const rig of rigs) {
      expect(typeof rig.region).toBe("string");
      expect(typeof rig.count).toBe("number");
      expect(typeof rig.change_weekly).toBe("number");
      expect(typeof rig.date).toBe("string");
    }
  });
});
