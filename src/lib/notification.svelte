<script lang="ts">
    import { supabase } from '$lib/supabaseClient'
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
        XIcon,
    } from 'svelte-feather-icons'
    import timeBetween from '$lib/timeBetween'
    import { createEventDispatcher } from 'svelte'
    export let notification: any = {}

    $: replyLink = `/post/${notification.ref_post_id}?comment=${notification.ref_comment_id}`

    const dispatch = createEventDispatcher()

    async function DeleteNotification(id: any) {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id)
        if (!error) {
            dispatch('delete')
        }
    }
</script>

<li
    class={`${
        notification?.read
            ? 'border-l border-thirdary'
            : 'border-l border-red-400'
    } my-1 flex py-1 px-2 hover:bg-neutral-800`}
>
    {#if notification?.announcement == false}
        <div class="mr-2 block h-8 w-8">
            <img
                class="rounded-full border border-thirdary"
                src={notification?.profiles?.avatar_url ?? '../user.jpg'}
                height="32px"
                width="32px"
                alt="avatar"
            />
        </div>
    {/if}

    <div class="flex-1 whitespace-normal text-sm">
        <a
            class="flex flex-col"
            href={notification?.link != '' ? notification?.link : replyLink}
        >
            <p>
                {notification?.profiles?.username ?? ''}
                {notification?.message}
            </p>
            <p class="text-neutral-300">
                {notification?.context}
            </p>
        </a>
    </div>
    <div class="flex flex-col items-end text-center">
        <span class="flex-1 text-xs text-neutral-300">
            {timeBetween(notification.created_at, true)}</span
        >

        <button
            on:click={() => {
                DeleteNotification(notification?.id)
            }}
            class="c-text rounded-sm hover:bg-red-400"
            ><XIcon size="20" />
        </button>
    </div>
</li>
