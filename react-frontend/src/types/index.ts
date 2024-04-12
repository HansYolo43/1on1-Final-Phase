// src/types/index.ts
export interface Contact {
    id: number;
    username: string;
    email: string;
    // Add other fields as necessary
  }

export interface addContact {
    username: string;
    email: string;
    // Add other fields as necessary
  }
  
export interface Event {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    // Add other fields as necessary
}
  
export interface Calendard {
    owner_id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    // Add other fields as necessary
}