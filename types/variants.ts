export type Evidence = { [key: string]: [number, string] };

export interface ACMGEvidence {
  pvs: Evidence;
  ps: Evidence;
  pm: Evidence;
  pp: Evidence;
  ba: Evidence;
  bs: Evidence;
  bp: Evidence;
}

export interface Variant {
  chromosome: string;
  position: number;
  refAllele: string;
  altAllele: string;
  variantType: string;
  consequence: string;
  acmgClassification: string;
  alleleFreq: number;
  hgvsg: string;
  hgvsc: string;
  hgvsp: string;
  aaChange: string;
  geneName: string;
  pubmedIds: string[];
  associatedDiseases: string[];
  dbSnpid: string;
  transcript: string;
  rationale: ACMGEvidence;
}

