<script lang="ts">
  import './App.css'
  import Navigation from './Navigation.svelte'
  import InstalledView from './views/installed.svelte'
  import RegistryView from './views/registry.svelte'
  import {
    useActiveLocalPackageIndex,
    useActiveRemotePackageIndex,
    useActiveView,
    useLocalFilteredPackages,
    useLocalInstalledPackages,
    useRegistryFilteredPackages,
    useRegistryPackages,
    useSearchInputElement
  } from './stores'
  const activeView = useActiveView()
  useActiveLocalPackageIndex()
  useActiveRemotePackageIndex()
  useLocalInstalledPackages()
  useRegistryPackages()
  useLocalFilteredPackages()
  useRegistryFilteredPackages()
  useSearchInputElement()
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
