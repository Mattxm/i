import { supabase } from '$lib/supabaseClient'

export const load = async ({ params }) => {
    let { data: posts, error } = await supabase
        .from('posts')
        .select(
            '*, profiles(username, avatar_url), comments(*, profiles(username, avatar_url))'
        )
        .eq('post_id', params.post_id)
        .single()
    return {
        post: posts,
    }
}
