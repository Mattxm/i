<script lang="ts">
    import {
        ArrowDownIcon,
        ArrowUpIcon,
        ChevronDownIcon,
        ChevronRightIcon,
        ChevronLeftIcon,
        ChevronsLeftIcon,
        ChevronsRightIcon,
        CheckIcon,
        FilterIcon,
        SlidersIcon,
        ChevronUpIcon,
    } from 'svelte-feather-icons'
    import timeBetween from '$lib/timeBetween'
    export let post: any = {}
    $: tags = post.tags.split(',')
    $: commentcount = post.comments[0].count
    let expanded = false
</script>

<li
    class={`flex flex-col rounded-sm border-t border-thirdary bg-neutral-100 py-2 px-4 dark:bg-neutral-800`}
>
    <div class="mx-auto flex w-full max-w-4xl flex-col">
        <span class="flex w-full">
            <a
                href={`/post/${post.post_id}`}
                class="visited:text-neutral-900 hover:underline dark:visited:text-neutral-200"
                >{post.title}</a
            >
            <span class="flex-1" />
            <span class="flex items-center space-x-2 text-sm text-neutral-400">
                <a href={`/user/${post.profiles.username}`} class=""
                    >{post.profiles.username}</a
                >
                <span class="">{timeBetween(post.created_at)}</span>
            </span>
        </span>

        <span>
            <a
                href={`/post/${post.post_id}`}
                class="text-sm text-neutral-400 hover:underline"
                >{commentcount == 1
                    ? `${commentcount} comment`
                    : `${commentcount} comments`}</a
            >
        </span>

        <span class="flex">
            <ul class="mt-2 flex flex-1 space-x-2">
                {#each tags as tag}
                    <li
                        class="rounded-lg bg-green-500 px-2 text-center text-sm"
                    >
                        {tag}
                    </li>
                {/each}
            </ul>
            <div class="flex items-center align-middle">
                <button on:click={() => (expanded = !expanded)} class="c-text">
                    {#if expanded}
                        <ChevronUpIcon />
                    {:else}
                        <ChevronDownIcon />
                    {/if}
                </button>
            </div>
        </span>

        <div hidden={!expanded}>
            <div class="my-4 h-px bg-thirdary" />
            <p>
                {post.content}
            </p>
        </div>
    </div>

    <p class="hidden">{post.content}</p>
</li>
