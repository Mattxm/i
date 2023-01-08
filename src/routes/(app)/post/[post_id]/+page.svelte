<script>
    import timeBetween from '$lib/timeBetween'
    import {
        LinkIcon,
        ShareIcon,
        SquareIcon,
        ThumbsDownIcon,
        ThumbsUpIcon,
        XIcon,
    } from 'svelte-feather-icons'
    import Comment from '$lib/comment.svelte'
    import { marked } from 'marked'
    import { page } from '$app/stores'
    import { supabase } from '$lib/supabaseClient'
    import { goto } from '$app/navigation'
    import {
        Dialog,
        DialogDescription,
        DialogOverlay,
        DialogTitle,
    } from '@rgossiaux/svelte-headlessui'

    let source = ``
    marked.setOptions({ gfm: true, breaks: true })
    $: contentmd = marked.parse(post?.content)
    $: markdown = marked.parse(source)
    $: post = $page.data.post
    $: dateposted = new Date(post.created_at).toLocaleString() ?? null
    $: tags = post.tags ? post.tags.split(',') : []
    let ShowPreview = false
    let DeleteOpen = false
    let EditOpen = false

    let EditText = ''

    async function DeletePost() {
        const id = (await supabase.auth.getUser()).data.user?.id

        // const { data, error } = await supabase
        //     .from('posts')
        //     .delete()
        //     .eq('post_id', post?.post_id)
        //     .eq('user_id', id)

        const { data, error } = await supabase
            .from('posts')
            .update({ deleted: true })
            .eq('post_id', post?.post_id)

        if (!error) {
            await goto(`/post/${post.post_id}`)
        }
    }
    async function EditPost() {
        const { data, error } = await supabase
            .from('posts')
            .update([
                {
                    content: EditText,
                },
            ])
            .eq('post_id', post.post_id)

        if (!error) post.content = EditText
    }

    let submitting = false
    let submittedcomment
    async function CreateComment() {
        if (submitting) return

        if (source.length == 0) return

        submitting = true

        const id = (await supabase.auth.getUser()).data.user?.id
        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    content: source,
                    post_id: post?.post_id,
                    user_id: id,
                },
            ])
            .select(`*, profiles(username, avatar_url)`)
            .single()

        if (!error) {
            source = ''
        }

        submittedcomment = data
        submitting = false
    }
</script>

<Dialog
    open={DeleteOpen}
    on:close={() => (DeleteOpen = false)}
    class="fixed inset-0"
>
    <DialogOverlay class="fixed inset-0 z-0 bg-black bg-opacity-25" />
    <div
        class="pointer-events-none fixed inset-0 flex items-center justify-center overflow-y-auto"
    >
        <div
            class=" pointer-events-auto relative overflow-hidden rounded-md bg-secondary-light p-4 dark:bg-secondary-dark"
        >
            <button
                on:click={() => (DeleteOpen = false)}
                class="absolute top-0 right-0 mr-4 mt-4"
            >
                <XIcon size="24" />
            </button>
            <DialogTitle class="text-lg">Delete Post</DialogTitle>
            <div
                class="mb-2 flex h-px bg-secondary-light dark:bg-secondary-dark "
            />
            <DialogDescription class="">
                Are you sure you want to permanently delete this post?
            </DialogDescription>
            <div class="mt-2 text-right">
                <button
                    class="c-text px-2 py-0.5"
                    on:click={() => (DeleteOpen = false)}
                >
                    Cancel
                </button>
                <button
                    class=" rounded-sm bg-red-500 px-2 py-0.5 hover:bg-red-600 "
                    on:click={() => {
                        DeleteOpen = false
                        DeletePost()
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
</Dialog>

<Dialog
    open={EditOpen}
    on:close={() => (EditOpen = false)}
    class="fixed inset-0"
>
    <DialogOverlay class="fixed inset-0 z-0 bg-black bg-opacity-25" />
    <div
        class="pointer-events-none fixed inset-0 flex items-center justify-center overflow-y-auto"
    >
        <div
            class=" pointer-events-auto relative w-full max-w-xl overflow-hidden rounded-md bg-secondary-light p-4 dark:bg-secondary-dark"
        >
            <button
                on:click={() => {
                    EditOpen = false
                }}
                class="absolute top-0 right-0 mr-4 mt-4"
            >
                <XIcon size="24" />
            </button>
            <DialogTitle class="text-lg">Edit Post</DialogTitle>
            <div
                class="mb-2 flex h-px bg-secondary-light dark:bg-secondary-dark "
            />
            <DialogDescription class="">
                Make changes to your post.
            </DialogDescription>
            <div>
                <textarea
                    bind:value={EditText}
                    class=" box-border w-full overflow-hidden overflow-y-scroll border border-thirdary bg-primary-light px-1 text-black outline-none dark:bg-primary-dark dark:text-white"
                    name="edit"
                    id="edit"
                    rows="10"
                />
            </div>
            <div class="mt-2 text-right">
                <button
                    class="c-text px-2 py-0.5"
                    on:click={() => (EditOpen = false)}
                >
                    Cancel
                </button>
                <button
                    class=" rounded-sm bg-green-500 px-2 py-0.5 hover:bg-green-600 "
                    on:click={() => {
                        EditOpen = false
                        EditPost()
                    }}
                >
                    Save
                </button>
            </div>
        </div>
    </div>
</Dialog>

<div class="mx-auto flex min-h-screen max-w-4xl px-2 md:px-4">
    <div class="mt-4 flex flex-1 flex-col">
        <span class="flex text-sm text-neutral-400">
            <span class="">
                {#if post.deleted}
                    Deleted by user
                {:else}Created by
                    <a href={`/user/${post.profiles.username}`}>
                        {post.profiles.username}
                    </a>
                {/if}
                - posted {timeBetween(post.created_at)}
            </span>
        </span>
        <span class="pb-2 text-lg">{post.title}</span>
        <div class="markdown">{@html contentmd}</div>
        <div class="mt-4 flex">
            {#each tags as Tag}
                <div
                    class="mr-2 rounded-md border border-green-600 px-1 text-sm text-neutral-200"
                >
                    {Tag}
                </div>
            {/each}
        </div>

        <span class="mt-4 flex items-center space-x-4">
            <!-- <button class="secondary-text flex items-center">
                <ThumbsUpIcon size="16" />
            </button>
            <button class="secondary-text flex items-center">
                <ThumbsDownIcon size="16" />
            </button> -->
            <div class="relative">
                <button
                    on:click={() => {
                        navigator.clipboard.writeText(window.location.href)
                    }}
                    class="secondary-text peer flex items-center"
                >
                    <LinkIcon size="16" />
                </button>
                <div class="tooltip">
                    <span class="whitespace-nowrap">Copy Link</span>
                </div>
            </div>

            <button
                on:click={() => {
                    document.getElementById('comments')?.scrollIntoView(true)
                }}
                class="secondary-text flex items-center"
            >
                <SquareIcon size="16" />
                <span class="ml-2 text-sm">{post.comments.length} comments</span
                >
            </button>

            <button
                on:click={() => {
                    DeleteOpen = true
                }}
                class={`${
                    $page.data?.session?.user?.id == post?.user_id
                        ? 'visible'
                        : 'invisible'
                } secondary-text flex items-center text-sm`}
            >
                delete
            </button>
            <button
                on:click={() => {
                    EditOpen = true
                    EditText = post.content
                }}
                class={`${
                    $page.data?.session?.user?.id == post?.user_id
                        ? 'visible'
                        : 'invisible'
                } secondary-text flex items-center text-sm`}
            >
                edit
            </button>
        </span>

        <div class="my-4 h-px bg-thirdary" />

        <div class="flex">
            <form
                on:submit|preventDefault={CreateComment}
                class="flex w-full flex-col break-words px-4"
            >
                <label for="commentbox">Post a comment</label>
                <textarea
                    bind:value={source}
                    name="commentbox"
                    placeholder=""
                    rows="4"
                    class="box-border overflow-hidden border border-thirdary bg-primary-light px-1 text-black outline-none dark:bg-primary-dark dark:text-white"
                />
                <span class="mt-2 w-full space-x-2 text-right text-sm">
                    <button
                        on:click|preventDefault={() => {
                            ShowPreview = !ShowPreview
                        }}
                        class=""
                        >{`${ShowPreview ? 'Hide' : 'Show'} Preview`}</button
                    >
                    <button class="">Comment</button>
                </span>
            </form>
        </div>

        <div
            hidden={!ShowPreview}
            class="markdown mt-4 w-full max-w-full break-all rounded-sm bg-neutral-800 py-4 px-4"
        >
            <span>Comment Preview</span>
            <div class="mb-4 h-px bg-thirdary" />
            {@html markdown}
            {markdown}
        </div>

        <div id="comments" class="mt-4 space-y-2">
            <span>Comments</span>

            <div class={`${!submittedcomment && 'hidden'} `}>
                <Comment comment={submittedcomment} />
            </div>

            {#each post.comments as comment}
                <Comment {comment} />
            {/each}
        </div>
    </div>
</div>
