import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect } from '@sveltejs/kit'

export const load = async (event) => {
    const { session, supabaseClient } = await getSupabase(event)
    if (!session) {
        throw redirect(303, '/')
    }
    return {}
}
