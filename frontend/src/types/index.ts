export type PropertyType = 'terrace' | 'semi_detached' | 'bungalow' | 'gcb' | 'cluster' | 'conservation';
export type Tenure = 'freehold' | '999_leasehold' | '99_leasehold';
export type FloodRisk = 'low' | 'medium' | 'high';
export type BuyerType = 'SC' | 'PR' | 'foreigner' | 'company' | 'unknown';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Property {
  id: string;
  address: string;
  postalCode: string;
  district: number;
  propertyType: PropertyType;
  tenure: Tenure;
  landAreaSqft: number;
  landAreaSqm: number;
  builtUpSqft: number | null;
  builtUpSqm: number | null;
  coordinates: Coordinates;
  streetName: string;
  unitNumber: string | null;
}

export interface URAZone {
  propertyId: string;
  zoneCode: string;
  zoneLabel: string;
  isGcba: boolean;
  gcbaName: string | null;
  masterPlanYear: number;
}

export interface DevelopmentParams {
  maxStoreys: number;
  maxHeightMetres: number;
  siteCoveragePct: number;
  frontSetbackMetres: number;
  sideSetbackMetres: number;
  rearSetbackMetres: number;
  maxGfaFormula: string;
  maxGfaSqm: number | null;
  plotRatio: number | null;
  notes: string[];
}

export interface Transaction {
  id: string;
  propertyId: string;
  transactionDate: string;
  salePrice: number;
  landAreaSqft: number;
  builtUpSqft: number | null;
  psfLand: number;
  psfBuiltUp: number | null;
  buyerType: BuyerType;
  projectName: string | null;
  tenure: Tenure;
}

export interface RiskFlags {
  propertyId: string;
  floodRisk: FloodRisk;
  floodRiskSource: string;
  isTreeConservationArea: boolean;
  treeConservationNotes: string | null;
  isConservationProperty: boolean;
  conservationGrade: string | null;
  conservationAuthority: string | null;
  hasRoadReserve: boolean;
  roadReserveAffectedSqft: number | null;
  roadReserveNotes: string | null;
}

export interface ABSDRate {
  buyerProfile: string;
  ratePercent: number;
  notes: string | null;
}

export interface OwnershipRules {
  scEligible: boolean;
  prEligible: boolean;
  foreignerEligible: boolean;
  foreignerRestrictions: string | null;
  companyEligible: boolean;
  absdRates: ABSDRate[];
  bsdNote: string;
  requiresLandDealApproval: boolean;
  specialConditions: string[];
}

export interface PropertyIntelligenceCard {
  property: Property;
  uraZone: URAZone;
  developmentParams: DevelopmentParams;
  transactions: Transaction[];
  riskFlags: RiskFlags;
  ownershipRules: OwnershipRules;
  lastUpdated: string;
}

export interface SearchResult {
  id: string;
  address: string;
  postalCode: string;
  propertyType: PropertyType;
  district: number;
  lat?: number;
  lng?: number;
}
