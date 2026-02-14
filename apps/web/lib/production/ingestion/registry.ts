import { Connector } from './connector.interface';
import { CsvConnector } from './csv-connector';
import { RestConnector } from './rest-connector';
import { OpcUaConnector, MqttConnector, WitsmlConnector } from './stubs';

export type ConnectorType = 'CSV' | 'REST' | 'OPC_UA' | 'MQTT' | 'WITSML';

export class IngestionRegistry {
  private static instance: IngestionRegistry;
  private connectors: Map<ConnectorType, Connector> = new Map();

  private constructor() {
    this.connectors.set('CSV', new CsvConnector());
    this.connectors.set('REST', new RestConnector());
    this.connectors.set('OPC_UA', new OpcUaConnector());
    this.connectors.set('MQTT', new MqttConnector());
    this.connectors.set('WITSML', new WitsmlConnector());
  }

  static getInstance(): IngestionRegistry {
    if (!IngestionRegistry.instance) {
      IngestionRegistry.instance = new IngestionRegistry();
    }
    return IngestionRegistry.instance;
  }

  getConnector(type: ConnectorType): Connector {
    const connector = this.connectors.get(type);
    if (!connector) {
      throw new Error(`Connector type '${type}' not supported`);
    }
    return connector;
  }
}
