<script lang="ts">
  import { onMount } from 'svelte'
  import {
    useActiveLocalPackageIndex,
    useLocalFilteredPackages,
    useLocalInstalledPackages,
    useRegistryPackages,
    useSearchInputElement
  } from './../stores'
  let loadingModal: HTMLDialogElement
  let infoModal: HTMLDialogElement

  let searchInputElement = useSearchInputElement()
  let localInstalledPackages = useLocalInstalledPackages()
  let localFilteredPackages = useLocalFilteredPackages()
  let registryPackages = useRegistryPackages()

  let activePackageIndex = useActiveLocalPackageIndex()

  let infoModalContent = ''
  let loadingText = 'Downloading registry ...'

  const showInfoModal = (content: string): void => {
    infoModalContent = content
    infoModal.showModal()
  }

  const onLocalPackageItemClick = (evt: MouseEvent): void => {
    const target = evt.target as HTMLElement
    const root = target.closest('.local-package-item')
    const table = root.closest('table')
    const items = table.querySelectorAll('.local-package-item')
    items.forEach((item, i) => {
      if (item === root) {
        $activePackageIndex = i
      }
      item.classList.remove('text-primary-content', 'bg-primary')
    })
    root.classList.add('text-primary-content', 'bg-primary')
  }

  const selectPackage = (direction: 'next' | 'prev'): void => {
    const items = document.querySelectorAll('.local-package-item')
    let newIndex = 0
    if (direction === 'next') {
      newIndex = $activePackageIndex + 1
    } else {
      newIndex = $activePackageIndex - 1
    }
    if (newIndex < 0) {
      newIndex = items.length - 1
    } else if (newIndex >= items.length) {
      newIndex = 0
    }
    const item = items[newIndex] as HTMLElement
    item.click()
    item.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const updateAllPackages = async (): Promise<void> => {
    loadingModal.showModal()
    loadingText = 'Updating all packages ...'
    const updatedPackages = await window.zana.updateAllPackages()
    if (updatedPackages) {
      $localFilteredPackages = await window.zana.loadRegistry()
    } else {
      showInfoModal('Failed to update packages')
    }
    loadingModal.close()
  }

  const removeSelectedPackage = async (): Promise<void> => {
    loadingModal.showModal()
    loadingText = 'Removing package ...'
    const pkg = $localFilteredPackages[$activePackageIndex]
    const res = await window.zana.removePackage(pkg.source.id)
    if (res) {
      $activePackageIndex = $activePackageIndex > 0 ? $activePackageIndex - 1 : 0
      $localFilteredPackages = res
      loadingModal.close()
    } else {
      showInfoModal('Failed to update package')
      loadingModal.close()
    }
  }

  const installSelectedPackage = async (): Promise<void> => {
    loadingModal.showModal()
    loadingText = 'Updating package ...'
    const pkg = $localFilteredPackages[$activePackageIndex]
    const updatedPkg = await window.zana.installPackage(pkg.source.id)
    console.log(updatedPkg)
    if (updatedPkg) {
      $localFilteredPackages[$activePackageIndex].localVersion =
        $localFilteredPackages[$activePackageIndex].version
      $localFilteredPackages[$activePackageIndex].updateAvailable = false
    } else {
      showInfoModal('Failed to update package')
    }
    loadingModal.close()
  }

  onMount(async () => {
    if ($localInstalledPackages.length === 0) {
      loadingModal.showModal()
      await window.zana.downloadRegistry()
      $registryPackages = await window.zana.getRegistry()
      $localInstalledPackages = await window.zana.loadRegistry()
      $localFilteredPackages = $localInstalledPackages
      loadingText = 'Checking for updates ...'
      loadingModal.close()
    }
    window.onkeydown = (evt: KeyboardEvent): void => {
      switch (evt.key) {
        case 'q':
          if (evt.target !== $searchInputElement) window.zana.quitApp()
          break
        case 'x':
          if (evt.target !== $searchInputElement) removeSelectedPackage()
          break
        case 'U':
          if (evt.target !== $searchInputElement) updateAllPackages()
          break
        case 'u':
          if (evt.target !== $searchInputElement) installSelectedPackage()
          break
        case 'ArrowDown':
        case 'j':
          if (evt.target !== $searchInputElement) selectPackage('next')
          break
        case 'ArrowUp':
        case 'k':
          if (evt.target !== $searchInputElement) selectPackage('prev')
          break
      }
    }
  })
</script>

<dialog bind:this={loadingModal} class="modal">
  <div class="modal-box">
    <div>
      <div class="text-center">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
      <div class="text-center">
        <p class="content-center">{loadingText}</p>
      </div>
    </div>
  </div>
</dialog>

<dialog bind:this={infoModal} class="modal">
  <div class="modal-box">
    <div>
      <div class="text-center">
        <p class="content-center">{infoModalContent}</p>
      </div>
    </div>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>

<div class="overflow-x-auto">
  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        <th>Name</th>
        <th>Version</th>
      </tr>
    </thead>
    <tbody>
      {#each $localFilteredPackages as pkg, i}
        {#if $searchInputElement.value === '' || pkg.name
            .toLowerCase()
            .includes($searchInputElement.value.toLowerCase())}
          <tr
            class="local-package-item {i === $activePackageIndex
              ? 'bg-primary text-primary-content'
              : ''}"
            on:click={onLocalPackageItemClick}
          >
            <td>{pkg.name}</td>
            <td>
              {#if pkg.updateAvailable}
                <span class="text-accent">Update available {pkg.localVersion} -> {pkg.version}</span
                >
              {:else}
                <span>{pkg.localVersion}</span>
              {/if}
            </td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
</div>
