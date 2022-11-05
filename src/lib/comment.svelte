<script>
    import timeBetween from '$lib/timeBetween'
    import { MinimizeIcon } from 'svelte-feather-icons'

    export let comment = {
        profiles: { username: '', avatar_url: '' },
        content: '',
        created_at: Date(),
    }

    let open = true
    let collapsed = false
    let replies = [{}, {}]
</script>

<div class="flex rounded-sm bg-neutral-800 p-2">
    <button
        on:click={() => (open = !open)}
        class="group flex w-4 justify-center pr-2"
    >
        <span
            class="h-full w-0.5 rounded-full bg-neutral-400 group-hover:bg-white"
        />
    </button>
    <div class="flex w-full flex-col">
        <details bind:open class="flex  w-full space-y-2">
            <summary
                on:click|preventDefault
                class="relative flex list-none text-sm"
            >
                <a
                    href={`/user/${comment.profiles.username}`}
                    class="text-blue-400"
                >
                    {comment.profiles.username}
                </a>
                - {timeBetween(comment.created_at)}
                <span
                    class={`flex-1 text-right text-neutral-400 ${
                        open ? 'invisible' : 'visible'
                    }`}
                >
                    {`${replies.length} replies`}
                </span>
            </summary>
            <div>{@html comment.content}</div>
            <div class="flex w-full space-x-2 text-sm text-neutral-400">
                <button class="">
                    {`${collapsed ? 'Show' : 'Hide'} `} Replies
                </button>
                <button class=""> Reply </button>
            </div>
        </details>
    </div>
</div>
