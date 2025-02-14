<script lang="ts">
  import './App.css'
  import Navigation from './Navigation.svelte'
  import InstalledView from './views/installed.svelte'
  import RegistryView from './views/registry.svelte'
  import {
    useActiveLocalPackageIndex,
    useActiveRemotePackageIndex,
    useActiveView,
    useLocalInstalledPackages,
    useRegistryPackages
  } from './stores'
  const activeView = useActiveView()
  useLocalInstalledPackages()
  useRegistryPackages()
  useActiveLocalPackageIndex()
  useActiveRemotePackageIndex()
</script>

<Navigation />

<section class="main-content container">
  {#if $activeView === 'installed'}
    <InstalledView />
  {:else if $activeView === 'registry'}
    <RegistryView />
  {:else}
    <h1>404 Not Found</h1>
  {/if}
</section>
