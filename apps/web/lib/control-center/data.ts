import {
  ControlAsset,
  Alert,
  Workflow,
  AuditEvent,
  TelemetryPoint,
  Asset,
  AlertStatus,
  AlertSeverity,
  WorkflowStatus,
  ControlCenterAssistResponse,
  ControlCenterAssistSource
} from '@petrosquare/types';
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// --- Mock Data Store ---

// Use globalThis to persist mock data across hot reloads/invocations
const globalStore = globalThis as unknown as {
  mockAssets: ControlAsset[];
  mockAlerts: Alert[];
  mockWorkflows: Workflow[];
  mockAuditLog: AuditEvent[];
};

if (!globalStore.mockAssets) {
  // Initial Assets
  globalStore.mockAssets = [
  {
    id: 'well-101',
    name: 'North Sea Well 101',
    type: 'WELL',
    status: 'ACTIVE',
    latitude: 56.5,
    longitude: 3.2,
    healthScore: 92,
    lastContact: new Date().toISOString(),
    activeAlarms: 0,
    metadata: { basin: 'North Sea', depth: 3000, apiNumber: 'API-101' }
  },
  {
    id: 'pump-202',
    name: 'Booster Pump 202',
    type: 'PUMP',
    status: 'MAINTENANCE',
    latitude: 56.51,
    longitude: 3.22,
    healthScore: 45,
    lastContact: new Date(Date.now() - 3600000).toISOString(),
    activeAlarms: 2,
    metadata: { manufacturer: 'FlowServe' }
  },
  {
    id: 'pipeline-303',
    name: 'Main Export Line A',
    type: 'PIPELINE',
    status: 'ACTIVE',
    latitude: 56.6,
    longitude: 3.5,
    healthScore: 98,
    lastContact: new Date().toISOString(),
    activeAlarms: 0,
    metadata: { capacity: '500kbpd' }
  },
  {
    id: 'facility-404',
    name: 'Alpha Platform',
    type: 'FACILITY',
    status: 'ACTIVE',
    latitude: 56.55,
    longitude: 3.3,
    healthScore: 88,
    lastContact: new Date().toISOString(),
    activeAlarms: 1,
    metadata: { type: 'FPSO' }
  }
  ];
}

if (!globalStore.mockAlerts) {
  // Initial Alerts
  globalStore.mockAlerts = [
  {
    id: 'alert-1',
    title: 'High Vibration Detected',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    assetId: 'pump-202',
    assetName: 'Booster Pump 202',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: 'ANOMALY',
    description: 'Vibration levels exceeded 5mm/s threshold for > 10 mins.'
  },
  {
    id: 'alert-2',
    title: 'Pressure Drop Warning',
    severity: 'MEDIUM',
    status: 'ACKNOWLEDGED',
    assetId: 'facility-404',
    assetName: 'Alpha Platform',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    assigneeId: 'user-1',
    type: 'THRESHOLD',
    description: 'Separator pressure dropped below optimal range.'
  }
  ];
}

if (!globalStore.mockWorkflows) {
  // Initial Workflows
  globalStore.mockWorkflows = [];
}

if (!globalStore.mockAuditLog) {
  // Initial Audit Log
  globalStore.mockAuditLog = [
  {
    id: 'audit-1',
    eventType: 'SYSTEM_CHANGE',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    actorId: 'system',
    details: { message: 'Control Center module initialized' }
  }
  ];
}

const mockAssets = globalStore.mockAssets;
const mockAlerts = globalStore.mockAlerts;
const mockWorkflows = globalStore.mockWorkflows;
const mockAuditLog = globalStore.mockAuditLog;

// --- Helpers ---

export function generateTelemetry(assetId: string, window: '1h' | '24h' | '7d'): TelemetryPoint[] {
  const points: TelemetryPoint[] = [];
  const now = Date.now();
  let interval: number;
  let count: number;

  switch (window) {
    case '1h':
      interval = 60 * 1000; // 1 min
      count = 60;
      break;
    case '24h':
      interval = 15 * 60 * 1000; // 15 min
      count = 96;
      break;
    case '7d':
      interval = 60 * 60 * 1000; // 1 hour
      count = 168;
      break;
    default:
      interval = 60 * 1000;
      count = 60;
  }

  for (let i = 0; i < count; i++) {
    const time = now - (count - 1 - i) * interval;
    // Generate somewhat realistic looking data with sine wave + noise
    const baseValue = 100;
    const noise = Math.random() * 10 - 5;
    const trend = Math.sin(i / 10) * 20;

    points.push({
      timestamp: new Date(time).toISOString(),
      value: Number((baseValue + trend + noise).toFixed(2)),
      unit: 'psi', // Simplified
      tag: 'Pressure',
      quality: Math.random() > 0.95 ? 'UNCERTAIN' : 'GOOD'
    });
  }
  return points;
}

// --- Service Functions ---

export async function getAssets(query?: string, status?: string): Promise<ControlAsset[]> {
  let filtered = [...mockAssets];
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q)
    );
  }
  if (status && status !== 'ALL') {
    filtered = filtered.filter(a => a.status === status);
  }
  return filtered;
}

export async function getAssetById(id: string): Promise<ControlAsset | undefined> {
  const asset = mockAssets.find(a => a.id === id);
  if (asset) {
    // Attach live telemetry snapshot
    return {
      ...asset,
      telemetry: generateTelemetry(id, '1h').slice(-1) // Just the last point
    };
  }
  return undefined;
}

export async function getTelemetry(id: string, window: '1h' | '24h' | '7d'): Promise<TelemetryPoint[]> {
  return generateTelemetry(id, window);
}

export async function getAlerts(status?: string, severity?: string, assetId?: string): Promise<Alert[]> {
  let filtered = [...mockAlerts];
  if (status && status !== 'ALL') filtered = filtered.filter(a => a.status === status);
  if (severity && severity !== 'ALL') filtered = filtered.filter(a => a.severity === severity);
  if (assetId) filtered = filtered.filter(a => a.assetId === assetId);
  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function updateAlert(id: string, updates: Partial<Alert>): Promise<Alert | undefined> {
  const index = mockAlerts.findIndex(a => a.id === id);
  if (index === -1) return undefined;

  mockAlerts[index] = { ...mockAlerts[index], ...updates };
  return mockAlerts[index];
}

export async function createWorkflow(draft: { title: string; description?: string; sourceAlertId?: string; sourceAssetId?: string }, userId: string): Promise<Workflow> {
  const workflow: Workflow = {
    id: `wf-${uuidv4().slice(0, 8)}`,
    title: draft.title,
    description: draft.description,
    status: 'DRAFT',
    steps: [],
    createdAt: new Date().toISOString(),
    createdBy: userId
  };
  mockWorkflows.push(workflow);
  console.log('createWorkflow: Added workflow', workflow.id, 'Total:', mockWorkflows.length);

  // Log creation
  logAuditEvent({
    eventType: 'CREATE_WORKFLOW',
    actorId: userId,
    details: { workflowId: workflow.id, title: workflow.title },
    correlationId: draft.sourceAlertId // correlate with alert if present
  });

  return workflow;
}

export async function simulateWorkflow(id: string): Promise<Workflow | undefined> {
  console.log('simulateWorkflow: Searching for', id, 'in', mockWorkflows.map(w => w.id));
  const wf = mockWorkflows.find(w => w.id === id);
  if (!wf) return undefined;

  // Mock simulation
  wf.simulatedImpact = {
    riskScoreChange: -15,
    costEstimate: 5000,
    timeline: '2 days'
  };
  wf.status = 'SIMULATING'; // transient state

  // Simulate async delay if we were real, but here we just return
  return wf;
}

export async function commitWorkflow(id: string, userId: string): Promise<Workflow | undefined> {
  console.log('commitWorkflow: Searching for', id, 'in', mockWorkflows.map(w => w.id));
  const wf = mockWorkflows.find(w => w.id === id);
  if (!wf) return undefined;

  wf.status = 'COMMITTED';

  // Log commit
  logAuditEvent({
    eventType: 'COMMIT_WORKFLOW',
    actorId: userId,
    details: { workflowId: wf.id, impact: wf.simulatedImpact },
    correlationId: id
  });

  // If linked to an alert, resolve it? Or maybe just add a comment.
  // For now let's say if it has a sourceAlertId, we update that alert status to RESOLVED?
  // Let's keep it simple: just log it.

  return wf;
}

export async function getAuditLog(): Promise<AuditEvent[]> {
  return [...mockAuditLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<AuditEvent> {
  const newEvent: AuditEvent = {
    id: `audit-${uuidv4().slice(0, 8)}`,
    timestamp: new Date().toISOString(),
    ...event
  };
  mockAuditLog.push(newEvent);
  return newEvent;
}

// --- Assist ---

export async function assistQuery(query: string): Promise<ControlCenterAssistResponse> {
  // Mock RAG
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency

  return {
    answer: `Based on the telemetry for **Pump 202**, the vibration spike correlates with a drop in discharge pressure. This suggests a potential **impeller imbalance** or **cavitation**. Recommended action: Inspection of the suction strainer and vibration analysis.`,
    confidence: 0.88,
    sources: [
      { title: 'Pump 202 Maintenance Manual', url: '#', snippet: 'Vibration > 4mm/s requires immediate shutdown.' },
      { title: 'Shift Log 2023-10-12', url: '#', snippet: 'Observed minor fluctuations in suction pressure.' }
    ]
  };
}

export async function getOverviewKPIs() {
  const activeAlerts = mockAlerts.filter(a => a.status === 'ACTIVE').length;
  const criticalAlerts = mockAlerts.filter(a => a.status === 'ACTIVE' && a.severity === 'CRITICAL').length;
  const avgHealth = mockAssets.reduce((acc, curr) => acc + curr.healthScore, 0) / mockAssets.length;

  return {
    activeAlerts,
    criticalAlerts,
    avgHealth: Math.round(avgHealth),
    totalAssets: mockAssets.length
  };
}
