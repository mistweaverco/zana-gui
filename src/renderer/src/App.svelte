<script lang="ts">
  import './App.css'
  import Navigation from './Navigation.svelte'
  import InstalledView from './views/installed.svelte'
  import { useActiveView, useLocalInstalledPackages } from './stores'
  const activeView = useActiveView()
  useLocalInstalledPackages()
</script>

<Navigation />

<section class="main-content container">
  {#if $activeView === 'installed'}
    <InstalledView />
  {/if}
</section>
