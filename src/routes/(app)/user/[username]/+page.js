import { supabase } from '$lib/supabaseClient'

export const load = async ({params}) => {
 
    let { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .eq(`username`, params.username)
    .single()

    console.log(users);
    return {
        user: users
    }

}