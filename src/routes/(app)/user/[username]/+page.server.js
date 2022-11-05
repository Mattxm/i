import { supabase } from '$lib/supabaseClient'

export const load = async ({ params }) => {
    let { data: profiles, error } = await supabase
        .from('profiles')
        .select(
            '*, comments(*, posts(title, post_id, profiles(username))), posts(*, comments(count))'
        )
        .eq(`username`, params.username)
        .single()

    return {
        user: profiles,
    }
}
