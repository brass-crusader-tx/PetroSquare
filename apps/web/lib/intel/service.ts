import {
  IntelItem,
  IntelEntity,
  IntelTag,
  IntelSignal,
  IntelCollection,
  IntelSignalEvent,
  IntelItemType,
  IntelItemStatus,
  IntelReview,
  IntelSignalRule
} from '@petrosquare/types';
import {
  getItems,
  getEntities,
  getTags,
  getSignals,
  getCollections,
  getSignalEvents,
  setItems,
  setEntities,
  setTags,
  setSignals,
  setSignalEvents
} from './data';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// --- Signals Engine ---

function matchRule(item: IntelItem, rule: IntelSignalRule): boolean {
  let fieldVal: string | undefined = '';

  if (rule.field === 'title') fieldVal = item.title;
  else if (rule.field === 'content') fieldVal = item.content_text;
  else if (rule.field === 'source') fieldVal = item.source_name;
  else if (rule.field === 'tag') {
    return item.tags.some(t => {
      if (rule.operator === 'equals') return t.name === rule.value;
      if (rule.operator === 'contains') return t.name.includes(rule.value);
      return false;
    });
  }
  else if (rule.field === 'entity') {
    return item.entities.some(e => {
       if (rule.operator === 'equals') return e.name === rule.value;
       if (rule.operator === 'contains') return e.name.includes(rule.value);
       return false;
    });
  }

  if (!fieldVal) return false;

  const val = fieldVal.toLowerCase();
  const target = rule.value.toLowerCase();

  if (rule.operator === 'equals') return val === target;
  if (rule.operator === 'contains') return val.includes(target);
  if (rule.operator === 'starts_with') return val.startsWith(target);

  return false;
}

export async function evaluateSignals(item: IntelItem) {
  const signals = getSignals().filter(s => s.is_enabled);
  const events = getSignalEvents();
  const newEvents: IntelSignalEvent[] = [];

  for (const signal of signals) {
    // Check if event already exists for this item/signal pair to avoid dupes?
    // Maybe only on status change? Let's keep it simple: evaluate on every save.
    // Assuming strict AND logic for rules in a signal for now? Or OR?
    // Let's assume ANY rule match triggers signal (OR logic) or ALL (AND logic)?
    // Usually signals are precise, so let's go with AND logic (ALL rules must match).

    if (signal.rules.length === 0) continue;

    const allMatch = signal.rules.every(rule => matchRule(item, rule));

    if (allMatch) {
       // Check if already exists
       const exists = events.find(e => e.signal_id === signal.id && e.item_id === item.id);
       if (!exists) {
         const event: IntelSignalEvent = {
           id: `evt-${uuidv4().slice(0, 8)}`,
           signal_id: signal.id,
           signal_name: signal.name,
           item_id: item.id,
           item_title: item.title,
           matched_rules: signal.rules,
           created_at: new Date().toISOString()
         };
         newEvents.push(event);
       }
    }
  }

  if (newEvents.length > 0) {
    setSignalEvents([...events, ...newEvents]);
    console.log(`Generated ${newEvents.length} signal events for item ${item.id}`);
  }
}

// --- Items CRUD ---

export async function getIntelItems(filters?: {
  status?: IntelItemStatus;
  type?: IntelItemType;
  query?: string;
  tag?: string;
  entity?: string;
}) {
  let items = getItems();

  if (filters?.status) {
    items = items.filter(i => i.status === filters.status);
  }
  if (filters?.type) {
    items = items.filter(i => i.type === filters.type);
  }
  if (filters?.tag) {
    items = items.filter(i => i.tags.some(t => t.name === filters.tag || t.id === filters.tag));
  }
  if (filters?.entity) {
    items = items.filter(i => i.entities.some(e => e.name === filters.entity || e.id === filters.entity));
  }
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    items = items.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.content_text.toLowerCase().includes(q)
    );
  }

  return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getIntelItemById(id: string) {
  return getItems().find(i => i.id === id);
}

export async function createIntelItem(draft: Partial<IntelItem>, userId: string) {
  const item: IntelItem = {
    id: `item-${uuidv4().slice(0, 8)}`,
    org_id: 'org-1', // Default org
    type: draft.type || 'NOTE',
    title: draft.title || 'Untitled',
    content_text: draft.content_text || '',
    source_url: draft.source_url,
    source_name: draft.source_name,
    author_id: userId,
    status: 'DRAFT',
    entities: draft.entities || [],
    tags: draft.tags || [],
    reviews: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const items = getItems();
  setItems([item, ...items]);

  await evaluateSignals(item);
  return item;
}

export async function updateIntelItem(id: string, updates: Partial<IntelItem>) {
  const items = getItems();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;

  const updatedItem = {
    ...items[idx],
    ...updates,
    updated_at: new Date().toISOString()
  };

  items[idx] = updatedItem;
  setItems(items);

  await evaluateSignals(updatedItem);
  return updatedItem;
}

export async function deleteIntelItem(id: string) {
    const items = getItems();
    const newItems = items.filter(i => i.id !== id);
    if (newItems.length === items.length) return false;
    setItems(newItems);
    return true;
}

// --- Workflow ---

export async function submitIntelItem(id: string) {
  return updateIntelItem(id, { status: 'IN_REVIEW' });
}

export async function approveIntelItem(id: string, reviewerId: string, comments?: string) {
  const item = await getIntelItemById(id);
  if (!item) return null;

  const review: IntelReview = {
    id: `rev-${uuidv4().slice(0, 8)}`,
    item_id: id,
    reviewer_id: reviewerId,
    status: 'APPROVED',
    comments,
    created_at: new Date().toISOString()
  };

  const reviews = [...item.reviews, review];
  // Auto publish on approval? Or explicit publish step? Prompt says "Review workflow: draft -> in_review -> published with approvals".
  // Let's assume approval -> published.
  return updateIntelItem(id, { status: 'PUBLISHED', published_at: new Date().toISOString(), reviews });
}

export async function rejectIntelItem(id: string, reviewerId: string, comments?: string) {
  const item = await getIntelItemById(id);
  if (!item) return null;

  const review: IntelReview = {
    id: `rev-${uuidv4().slice(0, 8)}`,
    item_id: id,
    reviewer_id: reviewerId,
    status: 'REJECTED',
    comments,
    created_at: new Date().toISOString()
  };

  const reviews = [...item.reviews, review];
  return updateIntelItem(id, { status: 'DRAFT', reviews });
}

// --- Feed & Digest ---

export async function getIntelFeed() {
  return getIntelItems({ status: 'PUBLISHED' });
}

export async function getIntelDigest(date: string) {
  // Aggregate items published on date and signal events created on date
  const start = new Date(date);
  start.setHours(0,0,0,0);
  const end = new Date(date);
  end.setHours(23,59,59,999);

  const published = (await getIntelFeed()).filter(i => {
    if (!i.published_at) return false;
    const d = new Date(i.published_at);
    return d >= start && d <= end;
  });

  const signals = getSignalEvents().filter(e => {
    const d = new Date(e.created_at);
    return d >= start && d <= end;
  });

  return {
    date,
    items: published,
    signals
  };
}

// --- Auxiliary CRUD ---

export async function getIntelTags() { return getTags(); }
export async function createIntelTag(name: string, color?: string) {
    const tag: IntelTag = { id: `tag-${uuidv4().slice(0,6)}`, org_id: 'org-1', name, color };
    setTags([...getTags(), tag]);
    return tag;
}

export async function getIntelEntities() { return getEntities(); }

export async function getIntelSignals() { return getSignals(); }
export async function createIntelSignal(signal: Partial<IntelSignal>) {
    const newSignal: IntelSignal = {
        id: `sig-${uuidv4().slice(0,6)}`,
        org_id: 'org-1',
        name: signal.name || 'New Signal',
        rules: signal.rules || [],
        is_enabled: signal.is_enabled ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    setSignals([...getSignals(), newSignal]);
    return newSignal;
}

export async function getIntelSignalEventsService() { return getSignalEvents(); }
