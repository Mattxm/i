import { supabase } from '$lib/supabaseClient'
import { redirect } from '@sveltejs/kit'

export const load = async ({ params }) => {
    
    return {
        post: GetPost(params),
        comments: GetComments(params)
    }
}

async function GetPost(params){
    let { data: post, error } = await supabase
        .from('posts')
        .select(
            '*, profiles(avatar_url, username)'
        )
        .eq('post_id', params.post_id)
        .single()

    return post
}

async function GetComments(params){
    let { data: comments, error } = await supabase
        .from('comments')
        .select(
            '*, profiles(avatar_url, username)'
        )
        .eq('post_id', params.post_id)

        console.log(comments);
        return comments
}
