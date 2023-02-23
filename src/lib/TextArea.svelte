<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    export let value = ''
    export let rows = 1

    function textchanged(e) {
        dispatch('changedoi', value)
    }

    function resize(element) {
        const grabber = document.createElement('div')
        grabber.direction = 'south'
        grabber.classList.add('grabber')

        let active = null,
            initialRect = null,
            initialPos = null

        element.appendChild(grabber)
        grabber.addEventListener('mousedown', onMousedown)

        function onMousedown(event) {
            active = event.target
            const rect = element.getBoundingClientRect()
            const parent = element.parentElement.getBoundingClientRect()

            initialRect = {
                width: rect.width,
                height: rect.height,
                bottom: parent.bottom - rect.bottom,
            }
            initialPos = { x: event.pageX, y: event.pageY }
            active.classList.add('selected')
        }

        function onMouseup(event) {
            if (!active) return

            active.classList.remove('selected')
            active = null
            initialRect = null
            initialPos = null
        }

        function onMove(event) {
            if (!active) return

            const direction = active.direction
            let delta

            if (direction.match('south')) {
                delta = event.pageY - initialPos.y
                element.style.height = `${initialRect.height + delta}px`
            }
        }

        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onMouseup)

        return {
            destroy() {
                window.removeEventListener('mousemove', onMove)
                window.removeEventListener('mousemove', onMousedown)
                element.removeChild(grabber)
            },
        }
    }
</script>

<div class="flex flex-col" use:resize>
    <textarea
        bind:value
        on:input={(e) => {
            textchanged(e)
        }}
        class="t box-border flex-1 resize-none overflow-y-scroll rounded-sm border border-thirdary bg-primary-light p-2 text-black outline-none dark:bg-primary-dark dark:text-white"
        name="edit"
        id="edit"
        {rows}
    />
</div>

<style>
    :global(.grabber.selected) {
        @apply bg-neutral-700;
    }
    :global(.grabber) {
        @apply h-3 w-full cursor-s-resize rounded-b-md border-x border-b border-thirdary bg-neutral-600 transition-colors;
    }

    .t::-webkit-scrollbar {
        @apply h-3 w-3;
    }
    .t::-webkit-scrollbar-track {
        @apply bg-transparent;
    }
    .t::-webkit-scrollbar-thumb {
        @apply rounded-md border-thirdary bg-neutral-600 hover:bg-neutral-700;
    }
</style>
