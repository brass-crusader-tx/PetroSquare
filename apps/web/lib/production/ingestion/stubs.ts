import { Connector, IngestionResult } from './connector.interface';
import { ProductionSeries } from '@petrosquare/types';

export class OpcUaConnector implements Connector {
  async fetch(endpoint: string, options?: any): Promise<IngestionResult> {
    console.log(`[OPC UA] Connecting to ${endpoint}... (Stub)`);
    // Simulate connection
    return {
      data: [],
      errors: ['OPC UA Connector is a stub implementation'],
      metadata: {
        total_records: 0,
        valid_records: 0,
        failed_records: 0,
        source: endpoint,
        timestamp: new Date().toISOString()
      }
    };
  }

  validate(record: any): boolean { return false; }
  normalize(record: any): ProductionSeries | null { return null; }
}

export class MqttConnector implements Connector {
  async fetch(brokerUrl: string, options?: any): Promise<IngestionResult> {
    console.log(`[MQTT] Subscribing to ${brokerUrl}... (Stub)`);
    return {
      data: [],
      errors: ['MQTT Connector is a stub implementation'],
      metadata: {
        total_records: 0,
        valid_records: 0,
        failed_records: 0,
        source: brokerUrl,
        timestamp: new Date().toISOString()
      }
    };
  }

  validate(record: any): boolean { return false; }
  normalize(record: any): ProductionSeries | null { return null; }
}

export class WitsmlConnector implements Connector {
  async fetch(endpoint: string, options?: any): Promise<IngestionResult> {
    console.log(`[WITSML] Querying ${endpoint}... (Stub)`);
    return {
      data: [],
      errors: ['WITSML Connector is a stub implementation'],
      metadata: {
        total_records: 0,
        valid_records: 0,
        failed_records: 0,
        source: endpoint,
        timestamp: new Date().toISOString()
      }
    };
  }

  validate(record: any): boolean { return false; }
  normalize(record: any): ProductionSeries | null { return null; }
}
