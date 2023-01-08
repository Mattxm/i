<script>
    import timeBetween from '$lib/timeBetween'
    import { HeartIcon, MinimizeIcon } from 'svelte-feather-icons'
    import { page } from '$app/stores'
    import { supabase } from '$lib/supabaseClient'
    import { marked } from 'marked'
    marked.setOptions({ gfm: true, breaks: true })

    export let comment = {
        profiles: { username: '', avatar_url: '' },
        content: '',
        created_at: Date(),
    }
    $: contentmd = marked.parse(comment?.content)
    let open = true
    let collapsed = false
    let replies = []

    async function DeleteComment() {
        const { data, error } = await supabase
            .from('comments')
            .update([
                {
                    deleted: true,
                },
            ])
            .eq('comment_id', comment?.comment_id)

        if (!error) comment.content = 'deleted'
    }
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
                <span class="ml-1"> {timeBetween(comment.created_at)}</span>
                <span
                    class={`flex-1 text-right text-neutral-400 ${
                        open ? 'invisible' : 'visible'
                    }`}
                >
                    {`${replies.length + 1} comment hidden`}
                </span>
            </summary>
            <div class="markdown">{@html contentmd}</div>
            <div class="flex w-full text-sm text-neutral-400">
                <button
                    on:click={DeleteComment}
                    class={`${
                        $page.data?.session?.user?.id == comment.user_id
                            ? 'flex'
                            : 'hidden'
                    } mr-2`}
                >
                    delete
                </button>
                <button class="mr-2">
                    {`${collapsed ? 'show' : 'hide'} `} replies
                </button>
                <div class="relative">
                    <button class="peer mr-2"> reply </button>
                    <div class="tooltip">
                        <span class="whitespace-nowrap">Disabled</span>
                    </div>
                </div>
            </div>
        </details>
    </div>
</div>
