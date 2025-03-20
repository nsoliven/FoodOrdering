import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log('Supabase secret key:', supabaseServiceRoleKey);

export const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
  },
});

export default supabase;