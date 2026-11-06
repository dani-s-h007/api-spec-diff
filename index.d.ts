export interface ApiChange {
  type: string;
  message: string;
}

export interface ApiDiffReport {
  hasBreaking: boolean;
  totalChanges: number;
  breakingChanges: ApiChange[];
  nonBreakingChanges: ApiChange[];
}

export declare function compareOpenApiSpecs(oldSpec: any, newSpec: any): ApiDiffReport;

