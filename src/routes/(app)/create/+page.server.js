import { supabase } from '$lib/supabaseClient'

export const actions = {
    test: async ({ request }) => {
        const formData = await request.formData()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        console.log(user)
        console.log(formData)
    },
}
