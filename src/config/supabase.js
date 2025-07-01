import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://iqhqgxifwofaaxzwhdoj.supabase.co'
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY
//export const supabase = createClient(supabaseUrl, supabaseKey)

export const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    },
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Para acessar as funções edge
export const supabaseFunctionsUrl = `${supabaseUrl}/functions/v1`;