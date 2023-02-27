<script>
    import timeBetween from '$lib/timeBetween'
    import {
        ArrowDownIcon,
        ArrowUpIcon,
        LinkIcon,
        XIcon,
    } from 'svelte-feather-icons'
    import Comment from '$lib/comment.svelte'
    import { page } from '$app/stores'
    import { supabase } from '$lib/supabaseClient'
    import { goto, invalidate, invalidateAll } from '$app/navigation'
    import {
        Dialog,
        DialogDescription,
        DialogOverlay,
        DialogTitle,
    } from '@rgossiaux/svelte-headlessui'
    import TextArea from '$lib/TextArea.svelte'

    $: post = $page.data.post
    $: comments = $page.data.comments

    $: dateposted = new Date(post.created_at).toLocaleString() ?? null
    $: tags = post.tags ? post.tags.split(',') : []
    let DeleteOpen = false
    let EditOpen = false
    let EditText = ''

    async function DeletePost() {
        const id = (await supabase.auth.getUser()).data.user?.id

        const { data, error } = await supabase
            .from('posts')
            .update({
                deleted: true,
                title: 'deleted',
                content: 'deleted',
                tags: 'deleted',
            })
            .eq('post_id', post?.post_id)

        if (!error) {
            await goto(`/post/${post.post_id}`, { invalidateAll: true })
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

    let newcomment = ''
    let submitting = false
    async function CreateComment() {
        if (submitting) return

        if (newcomment.length == 0) return

        submitting = true

        const id = (await supabase.auth.getUser()).data.user?.id
        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    content: newcomment,
                    post_id: post?.post_id,
                    user_id: id,
                },
            ])
            .select(`*, profiles(username, avatar_url)`)
            .single()

        if (!error) {
            newcomment = ''
        }

        invalidateAll()

        submitting = false
    }
</script>

<svelte:head>
    <title>{post.title} - Invoke</title>
    <meta name="profile page" content="profile page content" />
    <html lang="en" />
</svelte:head>

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
            class=" pointer-events-auto relative overflow-hidden rounded-sm border border-thirdary bg-secondary-light p-4 dark:bg-secondary-dark"
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

<div
    class="mx-auto flex min-h-screen max-w-5xl flex-1 border-thirdary px-2 md:px-4"
>
    <div class="mt-2 flex w-full flex-col ">
        <div class="flex flex-col space-y-1">
            <span class="break-words text-2xl">{post.title}</span>
            <span class="flex text-sm text-neutral-400 ">
                <div class="flex space-x-1 text-base text-neutral-400">
                    <img
                        class="h-5 rounded-full"
                        alt="user avatar"
                        src={post.profiles.avatar_url
                            ? post.profiles.avatar_url
                            : '../user.jpg'}
                    />

                    {#if post.deleted}
                        <span>deleted</span>
                    {:else}
                        <a
                            href={`/user/${post.profiles.username}`}
                            class="hover:underline"
                        >
                            {post.profiles.username}
                        </a>
                    {/if}

                    <div class="relative">
                        <span class="peer">{timeBetween(post.created_at)}</span>
                        <div class="tooltip">
                            <div class="whitespace-nowrap">
                                {new Date(post.created_at)}
                            </div>
                        </div>
                    </div>
                </div>
            </span>

            <div class="flex flex-col">
                {#if !EditOpen}
                    <!-- <div class="markdown">{@html contentmd}</div> -->
                    <pre
                        class=" overflow-x-auto whitespace-pre-wrap break-words border border-thirdary bg-primary-dark p-2">{post.content}</pre>
                {:else}
                    <TextArea
                        value={EditText}
                        rows={EditText.split(/\n/).length + 5}
                        on:changedoi={(v) => (EditText = v.detail)}
                    />
                    <div class="flex items-center space-x-4">
                        <button
                            class="secondary-text flex items-center text-sm"
                            on:click={() => (EditOpen = false)}
                        >
                            cancel
                        </button>
                        <button
                            class=" secondary-text flex items-center text-sm"
                            on:click={() => {
                                EditOpen = false
                                EditPost()
                            }}
                        >
                            save
                        </button>
                    </div>
                {/if}
            </div>
        </div>
        <div class="mt-4 flex">
            {#each tags as Tag}
                <div class="rounded-sm bg-green-600 px-1 text-center text-sm">
                    {Tag}
                </div>
            {/each}
        </div>

        <span class="mt-4 flex items-center space-x-4">
            <button class="secondary-text flex items-center">
                <ArrowUpIcon size="16" />
            </button>
            <span class="secondary-text flex items-center text-sm">0</span>
            <button class="secondary-text flex items-center">
                <ArrowDownIcon size="16" />
            </button>
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
                class="secondary-text flex items-center text-sm"
            >
                {comments.length} comments
            </button>

            {#if !post.deleted && $page.data?.session?.user?.id == post?.user_id}
                <button
                    on:click={() => {
                        DeleteOpen = true
                    }}
                    class="secondary-text flex items-center text-sm"
                >
                    delete
                </button>

                {#if !EditOpen}
                    <button
                        on:click={() => {
                            EditOpen = true
                            EditText = post.content
                        }}
                        class="secondary-text flex items-center text-sm"
                    >
                        edit
                    </button>
                {/if}
            {/if}
        </span>

        <div class="my-4 h-px bg-thirdary" />

        {#if $page.data?.session}
            <div class="flex">
                <form
                    on:submit|preventDefault={CreateComment}
                    class="flex w-full flex-col break-words "
                >
                    <label for="commentbox">Post a comment</label>
                    <TextArea
                        value={newcomment}
                        rows={4}
                        on:changedoi={(v) => {
                            newcomment = v.detail
                        }}
                    />

                    <span class="mt-2 w-full space-x-2 text-right text-sm">
                        <!-- <button
                        on:click|preventDefault={() => {
                            ShowPreview = !ShowPreview
                        }}
                        class=""
                        >{`${ShowPreview ? 'Hide' : 'Show'} Preview`}</button
                    > -->
                        <button class="">Submit</button>
                    </span>
                </form>
            </div>
        {/if}

        <!-- <div
            hidden={!ShowPreview}
            class="markdown mt-4 w-full max-w-full break-all rounded-sm bg-neutral-800 py-4 px-4"
        >
            <span>Comment Preview</span>
            <div class="mb-4 h-px bg-thirdary" />
            {@html markdown}
            {markdown}
        </div> -->

        <div id="comments" class="mt-4 flex flex-col space-y-2">
            <span class="text-lg">Comments</span>
            {#if comments.length > 0}
                {#each comments as comment}
                    <Comment {comment} />
                {/each}
            {:else if $page.data?.session}
                <span class=""
                    >Nothing here, be the first to comment on this post.</span
                >
            {:else}
                <span class="">Login or Sign Up to comment.</span>
            {/if}
        </div>
    </div>
</div>
