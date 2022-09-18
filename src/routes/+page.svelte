<script lang="ts">
    
    import { onDestroy, onMount } from "svelte";

    let mounted = false;
    let x = 0;
    let last_time: number;
    let elapsed = 0
    let duration = 10000
    let frame: number;
    function update(){
        frame = requestAnimationFrame(update);
        const time = window.performance.now();
        elapsed += Math.min(time - last_time, duration - elapsed)
        last_time = time;
    }
    setInterval(()=>{x++}, 1000)
    onMount(()=>{
        last_time = window.performance.now()
        update()
        mounted = true
    })

</script>

<svelte:head>
    <title>Test</title>
	<meta name="main page" content="main page content" />
	<html lang="en" />
</svelte:head>

<div class="h-screen w-screen bg-gray-700 text-white flex flex-col align-middle items-center justify-center">
    
</div>
