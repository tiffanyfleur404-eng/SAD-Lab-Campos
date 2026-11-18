export interface Student {
  id: string | number;
  student_id: string;
  full_name: string;
  program: string;
  year_level: string;
  email: string;
  created_at?: string;
}

export type ProgramType = 'BSCS' | 'BSIT' | 'BSIS' | 'BSECE' | 'BSBA' | 'Other';
export type YearLevelType = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
