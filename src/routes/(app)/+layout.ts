export const ssr = false
import type { LayoutLoad } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const load: LayoutLoad = async (event) => {
    const { session, supabaseClient } = await getSupabase(event)

    if (!session) {
        return {
            session,
            currentUser: { username: 'null', avatar_url: 'placeholder.jpg' },
        }
    }

    const { data: currentUser } = await supabaseClient
        .from('profiles')
        .select('username, avatar_url')
        .eq('user_id', session.user.id)
        .single()

    return {
        session,
        currentUser: {
            username: currentUser?.username,
            avatar_url: currentUser?.avatar_url ?? 'placeholder.jpg',
        },
    }
}
