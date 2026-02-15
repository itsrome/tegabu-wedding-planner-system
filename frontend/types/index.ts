export interface Guest {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  side: 'bride' | 'groom' | 'both';
  rsvp_status: 'pending' | 'confirmed' | 'declined';
  plus_ones: number;
  dietary_restrictions?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: number;
  name: string;
  category: 'venue' | 'catering' | 'photography' | 'videography' | 'florist' | 'music' | 'decoration' | 'other';
  contact_person?: string;
  email?: string;
  phone?: string;
  cost: number;
  deposit_paid: number;
  status: 'pending' | 'booked' | 'paid' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetItem {
  id: number;
  category: string;
  item_name: string;
  estimated_cost: number;
  actual_cost: number;
  paid_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetSummary {
  total_estimated: number;
  total_actual: number;
  total_paid: number;
  remaining: number;
}
