import { supabase } from '$lib/supabaseClient'
import { redirect } from '@sveltejs/kit'

export const load = async ({ params }) => {

    let { data: profiles, error } = await supabase
    .from('profiles')
    .select(
        'user_id'
    )
    .eq(`username`, params.username)
    .single()  
    
    let user_id = profiles?.user_id

    if (error || !profiles?.user_id)
        throw redirect(303, '/')

    return {
        user: GetProfile(params),
        comments: GetComments(user_id),
        posts: GetPosts(user_id),
    }
}


async function GetProfile(params){
    let { data: profiles, error } = await supabase
    .from('profiles')
    .select(
        '*'
    )
    .eq(`username`, params.username)
    .single()   

    return profiles
}

async function GetComments(user_id){
    let { data: comments, error } = await supabase
    .from('comments')
    .select('*, profiles(username), posts(title, post_id, profiles(username))')
    .eq(`user_id`, user_id)
    .neq('deleted', true)
    .order(`created_at`, {ascending: false})


    return comments
}

async function GetPosts(user_id){
    let { data: posts, error } = await supabase
    .from('posts')
    .select(`title, deleted, post_id, created_at, profiles(username)`)
    .eq(`user_id`, user_id)
    .neq('deleted', true)
    .order('created_at', { ascending: false })
    
    

    console.log(posts);
    console.log(error);

    return posts
}