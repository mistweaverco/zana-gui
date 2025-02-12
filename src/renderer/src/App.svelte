<script lang="ts">
  import Navigation from './Navigation.svelte'
  import InstalledView from './views/installed.svelte'
  import { useActiveView } from './stores'
  const activeView = useActiveView()
</script>

<Navigation />

<section class="main-content container">
  {#if $activeView === 'installed'}
    <InstalledView />
  {/if}
</section>
