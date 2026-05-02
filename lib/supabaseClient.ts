import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Copy .env.local.example to .env.local and fill in your Supabase project keys."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Item = {
  id: string;
  name: string;
  barcode: string;
  category: string | null;
  status: "available" | "checked_out";
  project_id: string | null;
  created_at: string;
};

export type EventCategory = "lecture" | "workshop" | "career" | "social";

export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  category: EventCategory;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  created_at: string;
};

export type Checkout = {
  id: string;
  item_id: string;
  student_name: string;
  student_email: string;
  checked_out_at: string;
  due_at: string | null;
  returned_at: string | null;
  staff_id: string | null;
};
