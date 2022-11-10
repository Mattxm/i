import { supabase } from '$lib/supabaseClient'
import { page } from '$app/stores'

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ url }) => {
    let query = new URLSearchParams(url.search)
    let searchQuery = query.get('search') ?? ''
    let type = query.get('post')
    console.log(type)
    if (type == 'false') {
        let { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .ilike('username', `%${searchQuery}%`)

        return {
            success: !error,
            type: 1,
            data: profiles,
        }
    } else {
        let { data: posts, error } = await supabase
            .from('posts')
            .select(`*, profiles(*), comments(count)`)
            .ilike('title', `%${searchQuery}%`)
            .order('created_at', { ascending: false })
            .neq('deleted', true)

        return {
            success: !error,
            type: 0,
            data: posts,
        }
    }
}

// export const actions = {
//     search: async ({ request }) => {
//         const formData = await request.formData()
//         console.log(formData)

//         if (formData.get('type') == '0') {
//             let searchString = formData.get('search')
//             //searchString = searchString.trim().split(' ')

//             let { data: posts, error } = await supabase
//                 .from('posts')
//                 .select(`*, profiles(*), comments(count)`)
//                 .textSearch('title, content, tags', searchString, {
//                     type: 'websearch',
//                     config: 'english',
//                 })

//             return {
//                 success: !error,
//                 type: 0,
//                 data: posts,
//             }
//         } else {
//             let { data: profiles, error } = await supabase
//                 .from('profiles')
//                 .select('*')
//                 .ilike('username', `%${formData.get('search')}%`)

//             console.log(profiles)
//             return {
//                 success: !error,
//                 type: 1,
//                 data: profiles,
//             }
//         }
//     },
// }
