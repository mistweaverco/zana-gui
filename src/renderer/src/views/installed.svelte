<script lang="ts">
  import { onMount } from 'svelte'
  import { useLocalInstalledPackages } from './../stores'
  let loadingModal: HTMLDialogElement
  let infoModal: HTMLDialogElement

  let localPackages = useLocalInstalledPackages()
  let localPackageItems = []
  let activePackageIndex = 0

  let infoModalContent = ''
  let loadingText = 'Downloading registry ...'

  const showInfoModal = (content: string): void => {
    infoModalContent = content
    infoModal.showModal()
  }

  const onLocalPackageItemClick = (evt: MouseEvent): void => {
    localPackageItems.forEach((item) => {
      item.classList.remove('bg-primary-content')
    })
    const target = evt.target as HTMLElement
    const root = target.closest('.local-package-item')
    const index = localPackageItems.indexOf(root)
    activePackageIndex = index
    root.classList.add('bg-primary-content')
  }

  const selectPackage = (direction: 'next' | 'prev'): void => {
    const activeItem = localPackageItems[activePackageIndex]
    const index = localPackageItems.indexOf(activeItem)
    let newIndex = 0
    if (direction === 'next') {
      newIndex = index + 1
    } else {
      newIndex = index - 1
    }
    if (newIndex < 0) {
      newIndex = localPackageItems.length - 1
    } else if (newIndex >= localPackageItems.length) {
      newIndex = 0
    }
    localPackageItems[newIndex].click()
    localPackageItems[newIndex].scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const updateAllPackages = async (): Promise<void> => {
    loadingModal.showModal()
    loadingText = 'Updating all packages ...'
    const updatedPackages = await window.zana.updateAllPackages()
    if (updatedPackages) {
      $localPackages = await window.zana.loadRegistry()
    } else {
      showInfoModal('Failed to update packages')
    }
    loadingModal.close()
  }

  const updateSelectedPackage = async (): Promise<void> => {
    loadingModal.showModal()
    loadingText = 'Updating package ...'
    const pkg = $localPackages[activePackageIndex]
    const updatedPkg = await window.zana.updatePackage(pkg.source.id)
    console.log(updatedPkg)
    if (updatedPkg) {
      $localPackages[activePackageIndex].localVersion = $localPackages[activePackageIndex].version
      $localPackages[activePackageIndex].updateAvailable = false
    } else {
      showInfoModal('Failed to update package')
    }
    loadingModal.close()
  }

  onMount(async () => {
    if ($localPackages.length === 0) {
      loadingModal.showModal()
      await window.zana.downloadRegistry()
      $localPackages = await window.zana.loadRegistry()
      loadingText = 'Checking for updates ...'
      loadingModal.close()
      return
    }
    window.onkeydown = (evt: KeyboardEvent): void => {
      switch (evt.key) {
        case 'q':
          window.zana.quitApp()
          break
        case 'U':
          updateAllPackages()
          break
        case 'u':
          updateSelectedPackage()
          break
        case 'ArrowDown':
        case 'j':
          selectPackage('next')
          break
        case 'ArrowUp':
        case 'k':
          selectPackage('prev')
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
      {#each $localPackages as pkg, i}
        <tr
          class="local-package-item {i === 0 ? 'bg-primary-content' : ''}"
          bind:this={localPackageItems[i]}
          on:click={onLocalPackageItemClick}
        >
          <td>{pkg.name}</td>
          <td>
            {#if pkg.updateAvailable}
              <span class="text-accent">Update available {pkg.localVersion} -> {pkg.version}</span>
            {:else}
              <span>{pkg.localVersion}</span>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
