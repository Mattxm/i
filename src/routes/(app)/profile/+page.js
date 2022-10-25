import { supabase } from '$lib/supabaseClient'

export const load = async ({}) => {
    const { data: { user } } = await supabase.auth.getUser()


    let { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user?.id)


    console.log(error);
    return {
        profile
    }

}