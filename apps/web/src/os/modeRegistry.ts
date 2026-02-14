import { ModeId } from './types';
import { ControlCenterMode } from '../modes/controlCenter/ControlCenterMode';
import { GisIntelligenceMode } from '../modes/gisIntelligence/GisIntelligenceMode';
import { MarketIntelligenceMode } from '../modes/marketIntelligence/MarketIntelligenceMode';
import { MarketsTradingMode } from '../modes/marketsTrading/MarketsTradingMode';
import { ProductionReservesMode } from '../modes/productionReserves/ProductionReservesMode';
import { EconomicsMode } from '../modes/economics/EconomicsMode';
import { RiskRegulatoryMode } from '../modes/riskRegulatory/RiskRegulatoryMode';
import { ModeProps } from '../modes/BaseMode';

export const MODE_COMPONENTS: Record<ModeId, React.ComponentType<ModeProps>> = {
  [ModeId.CONTROL_CENTER]: ControlCenterMode,
  [ModeId.GIS_INTELLIGENCE]: GisIntelligenceMode,
  [ModeId.MARKET_INTELLIGENCE]: MarketIntelligenceMode,
  [ModeId.MARKETS_TRADING]: MarketsTradingMode,
  [ModeId.PRODUCTION_RESERVES]: ProductionReservesMode,
  [ModeId.ECONOMICS]: EconomicsMode,
  [ModeId.RISK_REGULATORY]: RiskRegulatoryMode,
};
