import { supabase } from '$lib/supabaseClient'

export const ssr = false

export const load = async () => {

    let { data: posts, error } = await supabase
    .from('posts')
    .select(`*, profiles(*), comments(count)`)

    console.log(error);
    console.log(posts);
    return {
        posts
    }
}