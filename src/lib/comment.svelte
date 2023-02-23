<script>
    import timeBetween from '$lib/timeBetween'
    import { HeartIcon, MinimizeIcon } from 'svelte-feather-icons'
    import { page } from '$app/stores'
    import { supabase } from '$lib/supabaseClient'
    import { marked } from 'marked'
    import TextArea from './TextArea.svelte'
    marked.setOptions({ gfm: true, breaks: true })

    export let comment = {
        profiles: { avatar_url: '', username: '' },
        content: '',
        created_at: Date(),
        deleted: false,
    }
    $: contentmd = marked.parse(comment?.content)
    let open = !comment.deleted
    let collapsed = false
    let replies = []
    let editText = comment.content
    let editOpen = false

    async function EditComment() {}

    async function DeleteComment() {
        const { data, error } = await supabase
            .from('comments')
            .update([
                {
                    deleted: true,
                    content: 'deleted',
                },
            ])
            .eq('comment_id', comment?.comment_id)

        if (!error) comment.content = 'deleted'
    }
</script>

<div class="flex rounded-sm bg-primary-light p-2 dark:bg-primary-dark">
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
                {#if comment.deleted}
                    deleted
                {:else}
                    <a
                        href={`/user/${comment.profiles.username}`}
                        class="text-blue-400"
                    >
                        {comment.profiles.username}
                    </a>
                {/if}
                <span class="ml-1"> {timeBetween(comment.created_at)}</span>
                <span
                    class={`flex-1 text-right text-neutral-400 ${
                        open ? 'invisible' : 'visible'
                    }`}
                >
                    {`hidden (${replies.length + 1})`}
                </span>
            </summary>

            {#if editOpen}
                <TextArea
                    value={editText}
                    rows={2}
                    on:changedoi={(v) => {
                        editText = v.detail
                    }}
                />
            {:else}
                <pre
                    class=" overflow-x-auto whitespace-pre-wrap break-words">{comment.content}</pre>
            {/if}

            <div class="flex w-full space-x-2 text-sm text-neutral-400">
                {#if $page.data?.session?.user?.id == comment.user_id}
                    <button on:click={DeleteComment}> delete </button>
                    <button on:click={() => (editOpen = !editOpen)}>
                        {editOpen ? 'cancel' : 'edit'}
                    </button>
                    {#if editOpen}
                        <button on:click={EditComment}> save </button>
                    {/if}
                {/if}
                <button>
                    {`${collapsed ? 'show' : 'hide'} `}replies
                </button>
                <button> reply </button>
            </div>
        </details>
    </div>
</div>
