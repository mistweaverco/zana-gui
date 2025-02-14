<script lang="ts">
  import { onMount } from 'svelte'
  import { useRegistryPackages, useLocalInstalledPackages, useActiveRemotePackageIndex } from './../stores'
  let loadingModal: HTMLDialogElement
  let infoModal: HTMLDialogElement

  let registryPackages = useRegistryPackages()
  let localPackages = useLocalInstalledPackages()

  let remotePackageItems = []
  let activePackageIndex = useActiveRemotePackageIndex()

  let infoModalContent = ''
  let loadingText = 'Downloading registry ...'

  const showInfoModal = (content: string): void => {
    infoModalContent = content
    infoModal.showModal()
  }

  const onRemotePackageItemClick = (evt: MouseEvent): void => {
    remotePackageItems.forEach((item) => {
      item.classList.remove('text-primary-content', 'bg-primary')
    })
    const target = evt.target as HTMLElement
    const root = target.closest('.remote-package-item')
    const index = remotePackageItems.indexOf(root)
    $activePackageIndex = index
    root.classList.add('text-primary-content', 'bg-primary')
  }

  const selectPackage = (direction: 'next' | 'prev'): void => {
    const activeItem = remotePackageItems[$activePackageIndex]
    const index = remotePackageItems.indexOf(activeItem)
    let newIndex = 0
    if (direction === 'next') {
      newIndex = index + 1
    } else {
      newIndex = index - 1
    }
    if (newIndex < 0) {
      newIndex = remotePackageItems.length - 1
    } else if (newIndex >= remotePackageItems.length) {
      newIndex = 0
    }
    remotePackageItems[newIndex].click()
    remotePackageItems[newIndex].scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const installSelectedPackage = async (): Promise<void> => {
    loadingModal.showModal()
    loadingText = 'Installing package ...'
    const pkg = $registryPackages[$activePackageIndex]
    const updatedPkg = await window.zana.updatePackage(pkg.source.id)
    if (updatedPkg) {
      $localPackages = await window.zana.loadRegistry()
    } else {
      showInfoModal('Failed to install package')
    }
    loadingModal.close()
  }

  onMount(async () => {
    if ($registryPackages.length === 0) {
      loadingModal.showModal()
      await window.zana.downloadRegistry()
      $registryPackages = await window.zana.getRegistry()
      loadingText = 'Loading registry ...'
      loadingModal.close()
    }
    window.onkeydown = (evt: KeyboardEvent): void => {
      switch (evt.key) {
        case 'q':
          window.zana.quitApp()
          break
        case 'Enter':
          installSelectedPackage()
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
        <th>Description</th>
        <th>Version</th>
      </tr>
    </thead>
    <tbody>
      {#each $registryPackages as pkg, i}
        <tr
          class="remote-package-item {i === $activePackageIndex
            ? 'bg-primary text-primary-content'
            : ''}"
          bind:this={remotePackageItems[i]}
          on:click={onRemotePackageItemClick}
        >
          <td>{pkg.name}</td>
          <td>{pkg.description}</td>
          <td>
            <span>{pkg.version}</span>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
