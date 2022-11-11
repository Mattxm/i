import type { LayoutServerLoad } from './$types'
import { getServerSession } from '@supabase/auth-helpers-sveltekit'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const load: LayoutServerLoad = async (event) => {
    return {
        session: await getServerSession(event),
    }
}
