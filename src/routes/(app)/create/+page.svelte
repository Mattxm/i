<script>
    import { supabase } from '$lib/supabaseClient'
    import { goto } from '$app/navigation'
    import {
        Listbox,
        ListboxButton,
        ListboxOptions,
        ListboxOption,
    } from '@rgossiaux/svelte-headlessui'
    import {
        CheckIcon,
        ChevronDownIcon,
        ShuffleIcon,
    } from 'svelte-feather-icons'
    import { LoremIpsum } from 'lorem-ipsum'

    function RandomizePost() {
        const lorem = new LoremIpsum({
            sentencesPerParagraph: {
                max: 8,
                min: 4,
            },
            wordsPerSentence: {
                max: 16,
                min: 4,
            },
        })
        content = lorem.generateParagraphs(2)
        title = lorem.generateWords(7)
        tag = taglist[1]
    }

    let submitting = false
    let title = ''
    let content = ''
    $: validcategory = tag.id > 0
    $: validtitle = title.length <= 100 && title.length > 0
    $: validcontent = content.length <= 1000 && content.length > 0

    const taglist = [
        { id: 0, name: 'Choose Category', disabled: true },
        { id: 1, name: 'Ipsum', disabled: false },
        { id: 2, name: 'Other', disabled: false },
        { id: 3, name: 'Entertainment', disabled: false },
        { id: 4, name: 'Sports', disabled: false },
        { id: 5, name: 'Politics', disabled: false },
        { id: 6, name: 'Gaming', disabled: false },
        { id: 7, name: 'Technology', disabled: false },
        { id: 8, name: 'Art', disabled: false },
    ]
    let tag = taglist[0]
    async function CreatePost() {
        if (submitting) return

        if (!validtitle || !validcontent || !validcategory) return

        submitting = true
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
        submitting = false
    }
</script>

<div
    class="mx-auto mt-2 flex max-w-2xl justify-center text-black dark:text-white"
>
    <div
        class=" relative flex flex-1 flex-col rounded-sm bg-neutral-100 p-4 dark:bg-neutral-800"
    >
        <div class="flex w-full items-center">
            <span class="flex-1 text-left text-lg">New Post</span>

            <span class="relative">
                <button
                    class="peer rounded-sm p-1 hover:bg-red-500"
                    on:click={RandomizePost}><ShuffleIcon size="20" /></button
                >
                <div class="tooltip">
                    <span class="whitespace-nowrap">Random</span>
                </div>
            </span>
        </div>

        <div class="my-2 h-px bg-thirdary" />

        <form
            on:submit|preventDefault={CreatePost}
            class="flex flex-col space-y-4"
        >
            <div class="w-screen max-w-xxs">
                <Listbox
                    value={tag}
                    on:change={(e) => {
                        tag = e.detail
                    }}
                    class="relative w-full rounded-md bg-secondary-light dark:bg-secondary-dark"
                >
                    <ListboxButton
                        class="flex w-full border border-thirdary px-2 py-1"
                    >
                        <span class="flex-1 text-left">{tag.name}</span>
                        <ChevronDownIcon size="20" />
                    </ListboxButton>
                    <ListboxOptions
                        class="absolute top-0 w-screen max-w-xxs border border-thirdary bg-secondary-light pt-1 dark:bg-secondary-dark"
                    >
                        <div class="px-2">Category</div>
                        <div class="my-0.5 h-px bg-thirdary" />
                        {#each taglist as posttag}
                            {#if posttag.id > 0}
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
                                    <span
                                        class={`${
                                            posttag.disabled && 'line-through'
                                        }`}
                                    >
                                        {posttag.name}
                                    </span>
                                </ListboxOption>
                            {/if}
                        {/each}
                    </ListboxOptions>
                </Listbox>
            </div>
            <div>
                <label for="title">Title</label>
                <span class={`${!validtitle && 'text-red-500'} float-right`}
                    >({title.length}/100)</span
                >
                <input
                    bind:value={title}
                    type="text"
                    name="title"
                    id="title"
                    class={`w-full rounded-sm border border-thirdary bg-neutral-100 p-1 text-sm text-black focus:bg-white focus:outline-none dark:bg-primary-dark dark:text-white dark:focus:bg-secondary-dark`}
                />
            </div>

            <div>
                <label for="content">Content</label>
                <span class={`${!validcontent && 'text-red-500'} float-right`}
                    >({content.length}/1000)</span
                >
                <textarea
                    bind:value={content}
                    name="content"
                    id="content"
                    rows="10"
                    class={`w-full rounded-sm border border-thirdary bg-neutral-100 p-1 text-sm text-black focus:bg-white focus:outline-none dark:bg-primary-dark dark:text-white dark:focus:bg-secondary-dark`}
                />
            </div>
            <span class="border-t border-thirdary pt-2 text-right">
                <button
                    class={`${
                        (!validtitle || !validcategory || !validcontent) &&
                        'cursor-not-allowed'
                    } rounded-sm border border-thirdary py-0.5 px-2`}
                    >Post</button
                >
            </span>
        </form>
    </div>
</div>
