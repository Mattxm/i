<script lang="ts">
    import { supabase } from '$lib/supabaseClient'
    import { signedIn } from '$lib/userStore'

  
    async function signOut() {
      const { error } = await supabase.auth.signOut()
    }
  </script>
  

  <button class="button block" on:click={signOut}>
    Sign Out
  </button>

