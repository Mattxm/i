<script>
    import TextArea from '$lib/TextArea.svelte'
    let selectedPicture = user // default profile picture
    import user from '$lib/assets/user.jpg'
    import userr from '$lib/assets/userr.jpg'
    import userg from '$lib/assets/userg.jpg'
    import userb from '$lib/assets/userb.jpg'
    const profilePictures = [user, userr, userg, userb]

    let website = ''
</script>

<div class="mb-2 text-right">
    <button
        class=" secondary-text items-center "
        on:click={() => {
            console.log('test')
        }}
    >
        save all
    </button>
</div>

<div class="flex flex-wrap">
    {#each profilePictures as picture}
        <button on:click={() => (selectedPicture = picture)}>
            <img
                class="m-2 h-16 w-16 rounded-full border-4 border-transparent hover:border-thirdary"
                src={picture}
                alt="profile icon"
                class:selected={selectedPicture === picture}
            />
        </button>
    {/each}
</div>

<div class="space-y-4">
    <TextArea placeholder="Bio" rows={7} />

    <input
        bind:value={website}
        type="text"
        name="website"
        id="website"
        placeholder="Website"
        class={`w-full rounded-sm border border-thirdary bg-neutral-100 p-2 placeholder:text-neutral-400 focus:outline-none dark:bg-primary-dark`}
    />
</div>

<style>
    .selected {
        @apply border-white;
    }
</style>
