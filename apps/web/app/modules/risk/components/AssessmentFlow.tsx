import React, { useState } from 'react';
import { DataPanel, Button, Badge } from '@petrosquare/ui';
import { Jurisdiction, Regulation, Assessment } from '@petrosquare/types';
import { useData } from '../../../../lib/hooks';

export function AssessmentFlow() {
    const { data: jurisdictions } = useData<Jurisdiction[]>('/api/risk/jurisdictions');
    const { data: regulations } = useData<Regulation[]>('/api/risk/regulations');

    // Stub assets
    const assets = [
        { id: 'well-01', name: 'Well 01 (Permian)' },
        { id: 'well-02', name: 'Well 02 (Bakken)' },
        { id: 'fac-01', name: 'Processing Facility A' }
    ];

    const [form, setForm] = useState({
        asset_id: '',
        jurisdiction_id: '',
        regulation_id: '',
        status: 'COMPLIANT' as Assessment['status'],
        notes: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/risk/assessments', {
                method: 'POST',
                body: JSON.stringify({
                    ...form,
                    assessed_by: 'current-user' // Mock user
                })
            });
            if (res.ok) {
                setSuccess(true);
                setForm({ asset_id: '', jurisdiction_id: '', regulation_id: '', status: 'COMPLIANT', notes: '' });
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    // Filter regulations by jurisdiction
    const filteredRegulations = regulations?.filter(r => !form.jurisdiction_id || r.jurisdiction_id === form.jurisdiction_id);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataPanel title="New Compliance Assessment">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1">Asset</label>
                        <select
                            className="w-full bg-surface-highlight/10 border border-border rounded p-2 text-sm text-white focus:border-primary outline-none"
                            value={form.asset_id}
                            onChange={e => setForm({...form, asset_id: e.target.value})}
                            required
                        >
                            <option value="">Select Asset...</option>
                            {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase mb-1">Jurisdiction</label>
                            <select
                                className="w-full bg-surface-highlight/10 border border-border rounded p-2 text-sm text-white focus:border-primary outline-none"
                                value={form.jurisdiction_id}
                                onChange={e => setForm({...form, jurisdiction_id: e.target.value})}
                                required
                            >
                                <option value="">Select Jurisdiction...</option>
                                {jurisdictions?.map(j => <option key={j.id} value={j.id}>{j.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase mb-1">Regulation</label>
                            <select
                                className="w-full bg-surface-highlight/10 border border-border rounded p-2 text-sm text-white focus:border-primary outline-none"
                                value={form.regulation_id}
                                onChange={e => setForm({...form, regulation_id: e.target.value})}
                                required
                                disabled={!form.jurisdiction_id}
                            >
                                <option value="">Select Regulation...</option>
                                {filteredRegulations?.length ? (
                                    filteredRegulations.map(r => <option key={r.id} value={r.id}>{r.title}</option>)
                                ) : (
                                    <option value="mock-reg-id">Mock Regulation (For Development)</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1">Compliance Status</label>
                        <select
                            className="w-full bg-surface-highlight/10 border border-border rounded p-2 text-sm text-white focus:border-primary outline-none"
                            value={form.status}
                            onChange={e => setForm({...form, status: e.target.value as any})}
                            required
                        >
                            <option value="COMPLIANT">Compliant</option>
                            <option value="WARNING">Warning / At Risk</option>
                            <option value="NON_COMPLIANT">Non-Compliant</option>
                            <option value="NOT_APPLICABLE">Not Applicable</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1">Notes / Evidence</label>
                        <textarea
                            className="w-full bg-surface-highlight/10 border border-border rounded p-2 text-sm text-white focus:border-primary outline-none h-24"
                            value={form.notes}
                            onChange={e => setForm({...form, notes: e.target.value})}
                            placeholder="Describe findings..."
                        />
                    </div>

                    <div className="pt-2">
                        <Button type="submit" disabled={submitting} variant={success ? 'secondary' : 'primary'}>
                            {success ? 'Assessment Saved!' : submitting ? 'Saving...' : 'Submit Assessment'}
                        </Button>
                    </div>
                </form>
            </DataPanel>

            <DataPanel title="Recent Assessments">
                <RecentAssessmentsList />
            </DataPanel>
        </div>
    );
}

function RecentAssessmentsList() {
    const { data: assessments, loading } = useData<Assessment[]>('/api/risk/assessments');

    if (loading) return <div className="text-sm text-muted">Loading...</div>;

    return (
        <div className="space-y-2">
            {assessments?.slice(0, 5).map(a => (
                <div key={a.id} className="bg-surface-highlight/5 p-3 rounded border border-border flex justify-between items-center">
                    <div>
                        <div className="text-sm font-medium text-white">{a.asset_id}</div>
                        <div className="text-xs text-muted">Reg: {a.regulation_id}</div>
                    </div>
                    <div className="text-right">
                         <Badge status={a.status === 'COMPLIANT' ? 'live' : a.status === 'NON_COMPLIANT' ? 'critical' : 'warning'}>
                             {a.status}
                         </Badge>
                         <div className="text-[10px] text-muted font-mono mt-1">{new Date(a.assessed_at).toLocaleDateString()}</div>
                    </div>
                </div>
            ))}
            {!assessments?.length && <div className="text-sm text-muted text-center py-4">No assessments yet.</div>}
        </div>
    );
}
