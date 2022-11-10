<script>
    import { supabase } from '$lib/supabaseClient'
    import { goto } from '$app/navigation'
    import {
        Listbox,
        ListboxButton,
        ListboxOptions,
        ListboxOption,
    } from '@rgossiaux/svelte-headlessui'
    import { CheckIcon } from 'svelte-feather-icons'

    let title = ''
    let content = ''

    const taglist = [
        { id: 1, name: 'Other' },
        { id: 2, name: 'Ipsum' },
        { id: 3, name: 'Entertainment' },
        { id: 4, name: 'Sports' },
        { id: 5, name: 'Politics' },
        { id: 6, name: 'Gaming' },
        { id: 7, name: 'Technology' },
        { id: 7, name: 'Art' },
    ]
    let tag = taglist[0]
    async function CreatePost() {
        const id = (await supabase.auth.getUser()).data.user?.id

        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    title: title,
                    content: content,
                    tags: tag.name,
                    user_id: id,
                },
            ])
            .select()
            .single()

        if (data) {
            await goto(`/post/${data.post_id}`)
        }
    }
</script>

<div
    class="mx-auto mt-2 flex max-w-4xl justify-center text-black dark:text-white"
>
    <div
        class="flex flex-1 flex-col rounded-sm bg-neutral-100 p-4 dark:bg-neutral-800"
    >
        <span class="flex-1 text-center text-lg">New Post</span>
        <div class="my-2 h-px bg-thirdary" />
        <form on:submit|preventDefault={CreatePost} class="flex flex-col">
            <label for="title">Title</label>
            <input
                bind:value={title}
                type="text"
                name="title"
                id="title"
                class={`w-full rounded-sm border border-thirdary bg-neutral-100 p-1 text-sm text-black focus:bg-white focus:outline-none dark:bg-primary-dark dark:text-white dark:focus:bg-secondary-dark`}
            />

            <label for="content">Content</label>
            <textarea
                bind:value={content}
                name="content"
                id="content"
                rows="6"
                class={`w-full rounded-sm border border-thirdary bg-neutral-100 p-1 text-sm text-black focus:bg-white focus:outline-none dark:bg-primary-dark dark:text-white dark:focus:bg-secondary-dark`}
            />

            <Listbox
                value={tag}
                on:change={(e) => {
                    tag = e.detail
                }}
                class="relative"
            >
                <ListboxButton>{tag.name}</ListboxButton>
                <ListboxOptions
                    class="absolute w-screen max-w-xxs border border-thirdary bg-secondary-light p-1 dark:bg-secondary-dark"
                >
                    {#each taglist as posttag}
                        <ListboxOption
                            value={posttag}
                            disabled={posttag?.disabled}
                            class={({ active }) =>
                                `${
                                    active ? 'bg-red-400' : ''
                                } flex rounded-sm px-2 py-0.5`}
                            let:selected
                        >
                            <div class="w-6">
                                {#if selected}
                                    <CheckIcon size="20" />
                                {/if}
                            </div>

                            {posttag.name}
                        </ListboxOption>
                    {/each}
                </ListboxOptions>
            </Listbox>

            <span class="mt-4 text-right text-sm">
                <button class="rounded-sm border border-thirdary px-2 py-1"
                    >Submit Post</button
                >
            </span>
        </form>
    </div>
</div>
