<script lang="ts">
    import {
        ArrowDownRightIcon,
        ArrowRightCircleIcon,
        CalendarIcon,
        Link2Icon,
        LinkIcon,
    } from 'svelte-feather-icons'
    import timeBetween from '$lib/timeBetween'
    import { page } from '$app/stores'

    $: user = $page.data.user
    $: posts = $page.data.posts
    $: comments = $page.data.comments
    let description: HTMLElement
    let showDescription = false
    $: descriptionOverflowing = description
        ? description.scrollHeight > description.clientHeight
        : false
    console.log(user)
    $: joinDate = new Date(user.join_date).toLocaleString().split(',')[0]
</script>

<svelte:head>
    <title>{user.username} - Invoke</title>
    <meta name="profile page" content="profile page content" />
    <html lang="en" />
</svelte:head>

<div class="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4">
    <div class="mt-2 flex">
        <div
            class="mr-4 h-16 w-16 flex-none rounded-full bg-thirdary  dark:bg-white"
        >
            <img
                class="rounded-full p-0.5"
                src={$page.data.currentUser.avatar_url}
                height="64px"
                width="64px"
                alt="avatar"
            />
        </div>

        <div class="flex flex-1 flex-col text-left">
            <span class="flex text-lg"
                >{user.username}
                <span class="flex-1 text-right text-sm ">
                    {#if $page.data.session?.user.id == user.user_id}
                        <a
                            class="secondary-text rounded-sm bg-neutral-700 py-0.5 px-1"
                            href="/settings/profile">Customize Profile</a
                        >
                    {/if}
                </span>
            </span>
            <div class="my-1 h-px w-full bg-thirdary" />
            <span class="flex text-sm text-neutral-300">
                <CalendarIcon class="mr-2" size="16" /> Joined: {joinDate}</span
            >
            {#if user.website}
                <span><LinkIcon size="16" />{user.website}</span>
            {/if}
        </div>
    </div>
    <div class="mt-2 flex flex-col">
        {#if user.description}
            <div class="text-sm">
                <div
                    bind:this={description}
                    class={`${
                        showDescription ? '' : 'line-clamp-3'
                    } markdown overflow-hidden`}
                >
                    {user.description}
                </div>
                <button
                    hidden={!descriptionOverflowing}
                    on:click={() => (showDescription = !showDescription)}
                    class={`${showDescription ? 'mt-2' : 'mt-2'} italic `}
                    >{showDescription ? 'Show less' : 'Show more'}</button
                >
            </div>
        {/if}
    </div>
    <div class="mx-auto flex w-full flex-col">
        <span class="mt-4">Recent Posts</span>
        <div class="my-1 h-px w-full bg-thirdary" />
        {#if posts.length > 0}
            {#each posts as post}
                <span class=" flex flex-col overflow-hidden text-sm ">
                    <div>
                        <a
                            href={`/post/${post.post_id}`}
                            class="mr-4 break-words hover:underline"
                            >{post.title}</a
                        >
                    </div>

                    <div class="flex space-x-1">
                        <div class="text-neutral-300">
                            {timeBetween(post.created_at)}
                        </div>
                        <div class="text-neutral-300">in</div>
                        <a
                            class="text-blue-400 hover:underline"
                            href={`/?search=${post.tags}&post=true`}
                            >{post.tags}</a
                        >
                    </div>
                    <div class="flex space-x-1">
                        <span class="text-sm text-neutral-300">
                            <a
                                href={`/post/${post.post_id}`}
                                class=" hover:underline"
                                >{post.comments[0].count == 1
                                    ? `${post.comments[0].count} comment`
                                    : `${post.comments[0].count} comments`}</a
                            >
                        </span>
                    </div>
                </span>
            {/each}
        {:else}
            <div class="text-sm">This user has made no posts.</div>
        {/if}
        <span class="mt-4">Recent Comments</span>
        <div class="my-1 h-px w-full bg-thirdary" />
        {#if comments.length > 0}
            {#each comments as comment}
                <span class="flex flex-col line-clamp-4">
                    <span class="overflow-hidden text-sm text-neutral-300">
                        <a
                            href={`/post/${comment.posts.post_id}`}
                            class="break-words hover:underline"
                        >
                            {comment.posts.title}
                        </a>
                        by
                        <a
                            href={`/user/${comment.posts.profiles.username}`}
                            class="break-words text-blue-400 hover:underline"
                            >{comment.posts.profiles.username}</a
                        >
                        in
                        <a
                            class="text-blue-400 hover:underline"
                            href={`/?search=${comment.posts.tags}&post=true`}
                            >{comment.posts.tags}</a
                        >
                    </span>
                    <div class="pl-2">
                        <pre
                            class=" overflow-x-auto whitespace-pre-wrap break-words">{comment.content}</pre>
                    </div>
                </span>
            {/each}
        {:else}
            <div class="text-sm">This user has made no comments.</div>
        {/if}
    </div>
</div>
