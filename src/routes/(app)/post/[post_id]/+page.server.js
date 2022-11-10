import { supabase } from '$lib/supabaseClient'
import { redirect } from '@sveltejs/kit'
import { data } from 'autoprefixer'

export const load = async ({ params }) => {
    let { data: post, error } = await supabase
        .from('posts')
        .select(
            '*, profiles(username, avatar_url), comments(*, profiles(username, avatar_url))'
        )
        .eq('post_id', params.post_id)
        .single()

    if (error) throw redirect(301, '/')

    if (post.deleted)
        return {
            post: {
                deleted: post.deleted,
                post_id: post.post_id,
                created_at: post.created_at,
                content: 'deleted',
                tags: post.tags,
                title: post.title,
                comments: post.comments,
                profiles: { username: 'deleted', avatar_url: null },
            },
        }

    return {
        post: post,
    }
}
