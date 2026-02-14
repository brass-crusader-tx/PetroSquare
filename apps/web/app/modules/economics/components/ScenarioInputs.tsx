import React from 'react';
import { EconomicsScenarioInput } from '@petrosquare/types';
import { DataPanel } from '@petrosquare/ui';

interface Props {
  input: EconomicsScenarioInput;
  onChange: (input: EconomicsScenarioInput) => void;
  readOnly?: boolean;
}

export function ScenarioInputs({ input, onChange, readOnly }: Props) {

  const update = (section: keyof EconomicsScenarioInput, field: string, value: any) => {
    if (readOnly) return;
    onChange({
      ...input,
      [section]: {
        ...input[section],
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <DataPanel title="General Assumptions" className="bg-surface-highlight/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputGroup label="Start Date" type="date" value={input.general.start_date} onChange={v => update('general', 'start_date', v)} readOnly={readOnly} />
          <InputGroup label="Duration (Years)" type="number" value={input.general.project_duration_years} onChange={v => update('general', 'project_duration_years', Number(v))} readOnly={readOnly} />
          <InputGroup label="Currency" type="text" value={input.general.currency} onChange={v => update('general', 'currency', v)} readOnly={readOnly} />
          <InputGroup label="Discount Rate (%)" type="number" value={input.general.discount_rate_percent} onChange={v => update('general', 'discount_rate_percent', Number(v))} readOnly={readOnly} />
        </div>
      </DataPanel>

      <DataPanel title="Production Profile" className="bg-surface-highlight/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SelectGroup label="Curve Type" value={input.production.curve_type} options={['FLAT', 'DECLINE', 'CUSTOM']} onChange={v => update('production', 'curve_type', v)} readOnly={readOnly} />
          <InputGroup label="Initial Rate (bbl/d)" type="number" value={input.production.initial_rate} onChange={v => update('production', 'initial_rate', Number(v))} readOnly={readOnly} />
          {input.production.curve_type === 'DECLINE' && (
            <InputGroup label="Decline Rate (%/yr)" type="number" value={input.production.decline_rate_percent || 0} onChange={v => update('production', 'decline_rate_percent', Number(v))} readOnly={readOnly} />
          )}
        </div>
      </DataPanel>

      <DataPanel title="Pricing & Market" className="bg-surface-highlight/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SelectGroup label="Price Model" value={input.pricing.oil_price_model} options={['FLAT', 'CURVE']} onChange={v => update('pricing', 'oil_price_model', v)} readOnly={readOnly} />
          {input.pricing.oil_price_model === 'FLAT' && (
            <>
              <InputGroup label="Flat Price ($/bbl)" type="number" value={input.pricing.flat_price || 0} onChange={v => update('pricing', 'flat_price', Number(v))} readOnly={readOnly} />
              <InputGroup label="Escalation (%/yr)" type="number" value={input.pricing.escalation_percent || 0} onChange={v => update('pricing', 'escalation_percent', Number(v))} readOnly={readOnly} />
            </>
          )}
        </div>
      </DataPanel>

      <DataPanel title="Costs & Fiscal" className="bg-surface-highlight/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputGroup label="Capex Initial ($)" type="number" value={input.costs.capex_initial} onChange={v => update('costs', 'capex_initial', Number(v))} readOnly={readOnly} />
          <InputGroup label="Capex Aband. ($)" type="number" value={input.costs.capex_abandonment} onChange={v => update('costs', 'capex_abandonment', Number(v))} readOnly={readOnly} />
          <InputGroup label="Fixed Opex ($/mo)" type="number" value={input.costs.opex_fixed_monthly} onChange={v => update('costs', 'opex_fixed_monthly', Number(v))} readOnly={readOnly} />
          <InputGroup label="Var Opex ($/bbl)" type="number" value={input.costs.opex_variable_per_bbl} onChange={v => update('costs', 'opex_variable_per_bbl', Number(v))} readOnly={readOnly} />
          <InputGroup label="Royalty Rate (%)" type="number" value={input.costs.royalty_rate_percent} onChange={v => update('costs', 'royalty_rate_percent', Number(v))} readOnly={readOnly} />
          <InputGroup label="Tax Rate (%)" type="number" value={input.costs.tax_rate_percent} onChange={v => update('costs', 'tax_rate_percent', Number(v))} readOnly={readOnly} />
        </div>
      </DataPanel>
    </div>
  );
}

function InputGroup({ label, type, value, onChange, readOnly }: { label: string, type: string, value: string | number, onChange: (v: string) => void, readOnly?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted font-mono uppercase">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        readOnly={readOnly}
        className="px-3 py-2 bg-surface border border-border rounded focus:border-primary focus:outline-none text-white text-sm disabled:opacity-50"
      />
    </div>
  );
}

function SelectGroup({ label, value, options, onChange, readOnly }: { label: string, value: string, options: string[], onChange: (v: string) => void, readOnly?: boolean }) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted font-mono uppercase">{label}</label>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={readOnly}
          className="px-3 py-2 bg-surface border border-border rounded focus:border-primary focus:outline-none text-white text-sm disabled:opacity-50 appearance-none"
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
}
