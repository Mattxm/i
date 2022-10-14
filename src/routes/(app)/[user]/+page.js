import { supabase } from '$lib/supabaseClient'

export const load = async ({params}) => {
    console.log(params);
    

    let { data: users, error } = await supabase
    .from('users')
    .select('username')

    return {
        user: users
    }

}