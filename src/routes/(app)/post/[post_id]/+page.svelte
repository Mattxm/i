<script>
    import timeBetween from '$lib/timeBetween'
    import {
        LinkIcon,
        ShareIcon,
        SquareIcon,
        ThumbsDownIcon,
        ThumbsUpIcon,
    } from 'svelte-feather-icons'
    import Comment from '$lib/comment.svelte'
    import { marked } from 'marked'
    import { page } from '$app/stores'

    let source = ``
    //marked.setOptions({gfm:true})
    $: markdown = marked.parse(source)
    $: post = $page.data.post
    $: dateposted = new Date(post.created_at).toLocaleString()
    $: tags = post.tags.split(',')
    let ShowPreview = false
</script>

<div class="mx-auto flex min-h-screen max-w-4xl px-2 md:px-4">
    <div class="mt-4 flex flex-1 flex-col">
        <span class="flex text-sm text-neutral-400">
            <span class="">
                Created by
                <a href={`/user/${post.profiles.username}`}>
                    {post.profiles.username}
                </a>
                - {timeBetween(post.created_at)}
            </span>
        </span>
        <span class="pb-2 text-lg">{post.title}</span>
        <p class="">{post.content}</p>
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
            <button class="secondary-text flex items-center">
                <ThumbsUpIcon size="16" />
            </button>
            <button class="secondary-text flex items-center">
                <ThumbsDownIcon size="16" />
            </button>
            <button
                on:click={() => {
                    navigator.clipboard.writeText(window.location.href)
                }}
                class="secondary-text flex items-center"
            >
                <LinkIcon size="16" />
            </button>
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
        </span>

        <div class="my-4 h-px bg-thirdary" />

        <div class="flex">
            <form
                on:submit|preventDefault={() => {}}
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
        </div>

        <div id="comments" class="mt-4 space-y-2">
            <span>Comments</span>

            {#each post.comments as comment}
                <Comment {comment} />
            {/each}
        </div>
    </div>
</div>
