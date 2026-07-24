// --- 공통 ---
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiErrorBody {
  statusCode: number;
  message: string;
  error: string;
}

// --- 계약서 분석 도메인 ---
export type ContractStatus = 'COMPLETED' | 'FAILED' | 'ANALYZING';
export type InputSource = 'text_paste' | 'text_special_terms';
export type InputMode = 'full' | 'special_terms';
export type PropertyType = 'apartment' | 'officetel' | 'villa' | 'oneroom' | 'unknown';
export type ContractType = 'monthly' | 'lease' | 'semi_lease' | 'unknown';
export type Severity = 'danger' | 'warning';
export type ClauseType = 'danger' | 'warning' | 'safe';
export type RiskGrade = 'safe' | 'warning' | 'danger' | 'critical';

export interface ContractExtraction {
  lessor_name: string | null;
  lessee_name: string | null;
  property_address: string | null;
  property_type: PropertyType;
  contract_type: ContractType;
  deposit: number | null;
  monthly_rent: number | null;
  contract_start: string | null;
  contract_end: string | null;
  special_terms: string[];
}

export interface MissingCheckItem {
  item: string;
  severity: Severity;
  description: string;
}

export interface Clause {
  id: string;
  original_text: string;
  type: ClauseType;
  reason: string;
  law_reference: string;
  suggestion: string;
  request_guide: string;
}

export interface FraudRiskIndicator {
  indicator: string;
  severity: Severity;
  description: string;
}

export interface FraudRisk {
  detected: boolean;
  indicators: FraudRiskIndicator[];
}

export interface AnalysisResult {
  contract_valid: boolean;
  input_mode: InputMode;
  is_truncated: boolean;
  extraction: ContractExtraction | null;
  missing_check: MissingCheckItem[];
  clauses: Clause[];
  fraud_risk: FraudRisk | null;
  summary: string;
  risk_score: number;
  risk_grade: RiskGrade;
}

export interface Contract {
  id: string;
  status: ContractStatus;
  original_text: string;
  input_source: InputSource;
  analysis_result: AnalysisResult | null;
}

// --- 시세 진단 도메인 ---
export type TransactionType = 'sale' | 'jeonse' | 'monthly';
export type MarketPropertyType = 'apartment' | 'officetel' | 'villa';
export type RiskLevel = 'safe' | 'warning' | 'unknown';

export interface MarketCheckRequest {
  transactionType: TransactionType;
  propertyType: MarketPropertyType;
  amount: number;
  monthlyRent?: number;
  sido: string;
  sigungu: string;
}

export interface MarketCheckResult {
  available: boolean;
  sampleCount: number;
  marketMedianAmount: number | null;
  marketMedianMonthlyRent: number | null;
  diffPercent: number | null;
  riskLevel: RiskLevel;
  message: string;
}
