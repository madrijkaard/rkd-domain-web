export interface Domain {
  id?: number;
  code: string;
  description: string;
  status?: boolean;
  projectId?: number;
  attributes?: Attribute[];
  relatedDomains?: DomainSummary[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DomainSummary { id: number; code: string; description: string; status?: boolean; }

export interface Attribute {
  id?: number;
  code: string;
  description: string;
  type: AttributeType;
  mandatory: boolean;
  domainId: number;
  option?: Option;
  status?: boolean;
}

export interface Option { id: number; code: string; description: string; values?: OptionValues; status?: boolean; attributeId?: number; }
export interface OptionValues { options: unknown[]; }
export type AttributeType = 'NUMBER' | 'DECIMAL' | 'TEXT' | 'DATE' | 'DATE_TIME' | 'MONEY' | 'OPTION' | 'JSON';
export const ATTRIBUTE_TYPES: AttributeType[] = ['TEXT', 'NUMBER', 'DECIMAL', 'DATE', 'DATE_TIME', 'MONEY', 'OPTION', 'JSON'];
