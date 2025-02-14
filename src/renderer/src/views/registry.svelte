<script lang="ts">
  import { onMount } from 'svelte'
  import {
    useActiveRemotePackageIndex,
    useLocalInstalledPackages,
    useRegistryFilteredPackages,
    useRegistryPackages,
    useSearchInputElement
  } from './../stores'
  let loadingModal: HTMLDialogElement
  let infoModal: HTMLDialogElement

  let registryPackages = useRegistryPackages()
  let registryFilteredPackages = useRegistryFilteredPackages()
  let localPackages = useLocalInstalledPackages()
  let searchInputElement = useSearchInputElement()

  let activePackageIndex = useActiveRemotePackageIndex()

  let infoModalContent = ''
  let loadingText = 'Downloading registry ...'

  const showInfoModal = (content: string): void => {
    infoModalContent = content
    infoModal.showModal()
  }

  const onRemotePackageItemClick = (evt: MouseEvent): void => {
    const target = evt.target as HTMLElement
    const root = target.closest('.remote-package-item')
    const table = root.closest('table')
    const items = table.querySelectorAll('.remote-package-item')
    items.forEach((item, i) => {
      if (item === root) {
        $activePackageIndex = i
      }
      item.classList.remove('text-primary-content', 'bg-primary')
    })
    root.classList.add('text-primary-content', 'bg-primary')
  }

  const selectPackage = (direction: 'next' | 'prev'): void => {
    const items = document.querySelectorAll('.remote-package-item')
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

  const installSelectedPackage = async (): Promise<void> => {
    loadingModal.showModal()
    loadingText = 'Installing package ...'
    const pkg = $registryFilteredPackages[$activePackageIndex]
    const updatedPkg = await window.zana.installPackage(pkg.source.id)
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
    }
    if ($registryFilteredPackages.length === 0) {
      $registryFilteredPackages = $registryPackages
    }
    loadingText = 'Loading registry ...'
    loadingModal.close()
    window.onkeydown = (evt: KeyboardEvent): void => {
      switch (evt.key) {
        case 'q':
          if (evt.target !== $searchInputElement) window.zana.quitApp()
          break
        case 'i':
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
  <table class="table w-full">
    <!-- head -->
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Version</th>
      </tr>
    </thead>
    <tbody>
      {#each $registryFilteredPackages as pkg, i}
        <tr
          class="remote-package-item {i === $activePackageIndex
            ? 'bg-primary text-primary-content'
            : ''}"
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

<style>
  td {
    vertical-align: top;
  }
</style>
