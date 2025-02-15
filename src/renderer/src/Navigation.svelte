<script lang="ts">
  import { onMount } from 'svelte'
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
  const searchInputElement = useSearchInputElement()

  const localInstalledPackages = useLocalInstalledPackages()
  const localFilteredPackages = useLocalFilteredPackages()
  const registryPackages = useRegistryPackages()
  const registryFilteredPackages = useRegistryFilteredPackages()

  let activeLocalPackageIndex = useActiveLocalPackageIndex()
  let activeRemotePackageIndex = useActiveRemotePackageIndex()

  let buttonsContainer: HTMLDivElement

  const handleTopButtonsClick = (evt: MouseEvent): void => {
    evt.preventDefault()
    const target = evt.target as HTMLButtonElement
    const root = target.closest('button')

    $activeView = root.dataset.action
  }

  const onSearchFormSubmit = async (evt: Event): Promise<void> => {
    evt.preventDefault()
    $searchInputElement.blur()
    const value = $searchInputElement.value
    if ($activeView === 'installed') {
      $activeLocalPackageIndex = 0
      $localFilteredPackages = $localInstalledPackages.filter((pkg) => {
        return pkg.name.toLowerCase().includes(value.toLowerCase())
      })
    } else if ($activeView === 'registry') {
      const localPackages = await window.zana.loadRegistry()
      $activeRemotePackageIndex = 0
      $registryFilteredPackages = $registryPackages
        .filter((pkg) => {
          return pkg.name.toLowerCase().includes(value.toLowerCase())
        }) // filter already installed packages
        .filter((pkg) => {
          return !localPackages.some((localPkg) => localPkg.source.id === pkg.source.id)
        })
    }
  }

  const selectButton = (direction: 'next' | 'prev'): void => {
    const buttons = buttonsContainer.querySelectorAll('button')
    const activeButton = buttonsContainer.querySelector('.btn-primary') as HTMLButtonElement
    const index = Array.from(buttons).indexOf(activeButton)
    let newIndex = 0
    if (direction === 'next') {
      newIndex = index + 1
    } else {
      newIndex = index - 1
    }
    if (newIndex < 0) {
      newIndex = buttons.length - 1
    } else if (newIndex >= buttons.length) {
      newIndex = 0
    }
    buttons[newIndex].click()
  }

  onMount(() => {
    document.addEventListener('keydown', (evt) => {
      switch (evt.key) {
        case 'Escape':
          if (evt.target === $searchInputElement) {
            evt.preventDefault()
            $searchInputElement.blur()
          }
          break
        case '/':
          if (evt.target !== $searchInputElement) {
            evt.preventDefault()
            $searchInputElement.focus()
          }
          break
        case 'l':
        case 'ArrowRight':
          if (evt.target !== $searchInputElement) {
            selectButton('next')
          }
          break
        case 'h':
        case 'ArrowLeft':
          if (evt.target !== $searchInputElement) {
            selectButton('prev')
          }
          break
      }
    })
  })
</script>

<div class="navbar bg-base-300 sticky top-0 z-10">
  <div class="flex-1" bind:this={buttonsContainer}>
    <button
      class="btn {$activeView === 'installed' ? 'btn-primary' : ''}"
      data-action="installed"
      on:click={handleTopButtonsClick}
    >
      <span class="icon">
        <i class="fa fa-bolt"></i>
      </span>
      <strong>Installed</strong>
    </button>
    <button
      class="btn {$activeView === 'registry' ? 'btn-primary' : ''}"
      data-action="registry"
      on:click={handleTopButtonsClick}
    >
      <span class="icon">
        <i class="fa-solid fa-cloud"></i>
      </span>
      <strong>Registry</strong>
    </button>
  </div>
  <div class="flex-none gap-2">
    <div class="form-control">
      <form on:submit={onSearchFormSubmit}>
        <input
          type="text"
          placeholder="Search"
          bind:this={$searchInputElement}
          class="input input-bordered w-24 md:w-auto"
        />
      </form>
    </div>
  </div>
</div>
