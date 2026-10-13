import { Domain } from './domain';

export interface Project {
  id?: number;
  code: string;
  description: string;
  status?: boolean;
  domains?: Domain[];
  createdAt?: string;
  updatedAt?: string;
}
