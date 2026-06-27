import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Disable Supabase if it is using the default placeholder URL
const isPlaceholder = supabaseUrl.includes("your-project-id") || !supabaseUrl;

export const supabase = !isPlaceholder ? createClient(supabaseUrl, supabaseAnonKey) : null;
