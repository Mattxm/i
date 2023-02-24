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
    import { page } from '$app/stores'
    import TextArea from '$lib/TextArea.svelte'

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
    $: validtitle = title.length <= 200 && title.length > 0
    $: validcontent = content.length <= 5000 && content.length > 0

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

<svelte:head>
    <title>Create</title>
    <meta name="create page" content="create page content" />
    <html lang="en" />
</svelte:head>

<div
    class="mx-auto flex max-w-7xl flex-col-reverse justify-center px-2 md:flex-row md:space-x-2"
>
    <div class="mt-2 flex flex-1 shadow-md">
        <div
            class=" relative flex flex-1 flex-col space-y-2 rounded-md bg-neutral-100 p-4 dark:bg-secondary-dark"
        >
            <div class="flex w-full items-center border-b border-thirdary">
                <span class="flex-1 text-lg">New Post</span>

                <span class="relative">
                    <button
                        class="peer rounded-sm p-1 transition-colors hover:bg-red-400"
                        on:click={RandomizePost}
                        ><ShuffleIcon size="20" /></button
                    >
                    <div class="tooltip">
                        <span class="whitespace-nowrap">Random</span>
                    </div>
                </span>
            </div>

            <form
                on:submit|preventDefault={CreatePost}
                class="flex flex-col space-y-2"
            >
                <div class="w-screen max-w-xs">
                    <Listbox
                        value={tag}
                        on:change={(e) => {
                            tag = e.detail
                        }}
                        class="relative"
                    >
                        <ListboxButton
                            class="flex w-full items-center rounded-sm border border-thirdary bg-secondary-light px-2 py-1 dark:bg-primary-dark"
                        >
                            <span class="flex-1 text-left">{tag.name}</span>
                            <ChevronDownIcon size="20" />
                        </ListboxButton>
                        <ListboxOptions
                            class="absolute top-0 w-screen max-w-xs rounded-sm border border-thirdary bg-secondary-light pt-1 shadow-md dark:bg-primary-dark"
                        >
                            <div class="px-2">Choose Category</div>
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
                                                posttag.disabled &&
                                                'line-through'
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
                    <label for="title" hidden>Title</label>
                    <span class={`${!validtitle && 'text-red-400'} float-right`}
                        >{title.length}/200</span
                    >
                    <input
                        bind:value={title}
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Title..."
                        class={`w-full rounded-sm border border-thirdary bg-neutral-100 p-2 placeholder:text-neutral-400 focus:outline-none dark:bg-primary-dark`}
                    />
                </div>

                <div class="w-full flex-col text-right">
                    <label for="content" hidden>Content</label>
                    <span class={`${!validcontent && 'text-red-400'}`}
                        >{content.length}/5000</span
                    >
                    <TextArea
                        value={content}
                        rows={10}
                        placeholder="Text..."
                        on:changedoi={(v) => {
                            content = v.detail
                        }}
                    />
                </div>
                <span class="text-right">
                    <button
                        class={`${
                            (!validtitle || !validcategory || !validcontent) &&
                            'cursor-not-allowed text-neutral-400'
                        } rounded-sm border border-thirdary py-0.5 px-2`}
                        >post</button
                    >
                </span>
            </form>
        </div>
    </div>
    <div
        class="mt-2 flex h-fit flex-col space-y-2 rounded-md bg-secondary-dark  p-2 shadow-md md:w-80"
    >
        <span class="pl-1 underline">Usage</span>
        <ul class="space-y-2">
            <li class=" border-l border-red-400 pl-2">
                Submit a text post in a category.
            </li>
            <li class="border-l border-red-400 pl-2">
                Use the random button to generate a test thread.
            </li>
        </ul>
        <span class="pl-1 underline">Rules</span>
        <ul class="space-y-2">
            <li class="border-l border-red-400 pl-2">Behave.</li>
        </ul>
    </div>
</div>
