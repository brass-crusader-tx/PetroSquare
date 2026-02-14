import {
  IntelItem,
  IntelEntity,
  IntelTag,
  IntelSignal,
  IntelCollection,
  IntelSignalEvent,
  IntelItemType,
  IntelItemStatus,
  IntelEntityType
} from '@petrosquare/types';

const globalStore = globalThis as unknown as {
  mockIntelItems: IntelItem[];
  mockIntelEntities: IntelEntity[];
  mockIntelTags: IntelTag[];
  mockIntelSignals: IntelSignal[];
  mockIntelCollections: IntelCollection[];
  mockIntelSignalEvents: IntelSignalEvent[];
};

// Seed Data
const SEED_TAGS: IntelTag[] = [
  { id: 'tag-1', org_id: 'org-1', name: 'M&A', color: '#10B981' }, // Green
  { id: 'tag-2', org_id: 'org-1', name: 'Regulation', color: '#EF4444' }, // Red
  { id: 'tag-3', org_id: 'org-1', name: 'Market Update', color: '#3B82F6' }, // Blue
  { id: 'tag-4', org_id: 'org-1', name: 'ESG', color: '#F59E0B' }, // Yellow
];

const SEED_ENTITIES: IntelEntity[] = [
  { id: 'ent-1', org_id: 'org-1', type: 'COMPANY', name: 'ExxonMobil', created_at: new Date().toISOString() },
  { id: 'ent-2', org_id: 'org-1', type: 'BASIN', name: 'Permian Basin', created_at: new Date().toISOString() },
  { id: 'ent-3', org_id: 'org-1', type: 'ASSET', name: 'Project Alpha', created_at: new Date().toISOString() },
  { id: 'ent-4', org_id: 'org-1', type: 'COMMODITY', name: 'Brent Crude', created_at: new Date().toISOString() },
];

const SEED_SIGNALS: IntelSignal[] = [
  {
    id: 'sig-1',
    org_id: 'org-1',
    name: 'M&A Alert',
    rules: [
      { field: 'tag', operator: 'equals', value: 'M&A' }
    ],
    is_enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'sig-2',
    org_id: 'org-1',
    name: 'Permian Watch',
    rules: [
      { field: 'entity', operator: 'equals', value: 'Permian Basin' }
    ],
    is_enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const SEED_ITEMS: IntelItem[] = [
  {
    id: 'item-1',
    org_id: 'org-1',
    type: 'NOTE',
    title: 'Q3 Permian Production Analysis',
    content_text: 'Production in the Permian Basin has shown a steady increase despite rig count stabilization. Key operators are focusing on efficiency gains.',
    author_id: 'user-1',
    status: 'PUBLISHED',
    entities: [SEED_ENTITIES[1]],
    tags: [SEED_TAGS[2]],
    reviews: [],
    published_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    created_at: new Date(Date.now() - 90000000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'item-2',
    org_id: 'org-1',
    type: 'LINK',
    title: 'ExxonMobil announces new carbon capture project',
    content_text: 'Major investment in CCS technology for Gulf Coast operations.',
    source_url: 'https://example.com/news/ccs-project',
    source_name: 'Energy News Daily',
    author_id: 'user-2',
    status: 'IN_REVIEW',
    entities: [SEED_ENTITIES[0], SEED_ENTITIES[2]],
    tags: [SEED_TAGS[3], SEED_TAGS[0]],
    reviews: [
      { id: 'rev-1', item_id: 'item-2', reviewer_id: 'user-1', status: 'APPROVED', created_at: new Date().toISOString() } // Partial approval logic? No, just record
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'item-3',
    org_id: 'org-1',
    type: 'REPORT',
    title: 'Weekly Market Outlook',
    content_text: 'Brent prices expected to remain volatile due to geopolitical tensions.',
    author_id: 'user-1',
    status: 'DRAFT',
    entities: [SEED_ENTITIES[3]],
    tags: [SEED_TAGS[2]],
    reviews: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Initialize Store
if (!globalStore.mockIntelItems) globalStore.mockIntelItems = SEED_ITEMS;
if (!globalStore.mockIntelEntities) globalStore.mockIntelEntities = SEED_ENTITIES;
if (!globalStore.mockIntelTags) globalStore.mockIntelTags = SEED_TAGS;
if (!globalStore.mockIntelSignals) globalStore.mockIntelSignals = SEED_SIGNALS;
if (!globalStore.mockIntelCollections) globalStore.mockIntelCollections = [];
if (!globalStore.mockIntelSignalEvents) globalStore.mockIntelSignalEvents = [];

// Accessors
export const getItems = () => globalStore.mockIntelItems;
export const getEntities = () => globalStore.mockIntelEntities;
export const getTags = () => globalStore.mockIntelTags;
export const getSignals = () => globalStore.mockIntelSignals;
export const getCollections = () => globalStore.mockIntelCollections;
export const getSignalEvents = () => globalStore.mockIntelSignalEvents;

// Mutators
export const setItems = (items: IntelItem[]) => { globalStore.mockIntelItems = items; };
export const setEntities = (entities: IntelEntity[]) => { globalStore.mockIntelEntities = entities; };
export const setTags = (tags: IntelTag[]) => { globalStore.mockIntelTags = tags; };
export const setSignals = (signals: IntelSignal[]) => { globalStore.mockIntelSignals = signals; };
export const setCollections = (collections: IntelCollection[]) => { globalStore.mockIntelCollections = collections; };
export const setSignalEvents = (events: IntelSignalEvent[]) => { globalStore.mockIntelSignalEvents = events; };
