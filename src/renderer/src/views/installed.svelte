<script lang="ts">
  import { onMount } from 'svelte'
  import { useLocalPackages } from './../stores'
  let isLoading = true
  let isInfoModalVisible = false
  let infoModalButton: HTMLButtonElement

  let localPackages = useLocalPackages()
  let localPackageItems = []
  let activePackageIndex = 0

  let infoModalContent = ''
  let loadingText = 'Downloading registry ...'

  const closeInfoModal = (): void => {
    isInfoModalVisible = false
  }

  const showInfoModal = (content: string): void => {
    infoModalContent = content
    isInfoModalVisible = true
    setTimeout(() => {
      infoModalButton.focus()
    }, 200)
  }

  const onLocalPackageItemClick = (evt: MouseEvent): void => {
    localPackageItems.forEach((item) => {
      item.classList.remove('is-active')
    })
    const target = evt.target as HTMLElement
    const root = target.closest('.card')
    const index = localPackageItems.indexOf(root)
    activePackageIndex = index
    root.classList.add('is-active')
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
    isLoading = true
    loadingText = 'Updating all packages ...'
    const updatedPackages = await window.zana.updateAllPackages()
    if (updatedPackages) {
      $localPackages = await window.zana.loadRegistry()
    } else {
      showInfoModal('Failed to update packages')
    }
    isLoading = false
  }

  const updateSelectedPackage = async (): Promise<void> => {
    isLoading = true
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
    isLoading = false
  }

  onMount(async () => {
    await window.zana.downloadRegistry()
    $localPackages = await window.zana.loadRegistry()
    loadingText = 'Checking for updates ...'
    isLoading = false
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

<div class="modal {isLoading ? 'is-active' : ''}">
  <div class="modal-background"></div>
  <div class="modal-content">
    <progress class="progress is-small is-primary" max="100">15%</progress>
    <p class="has-text-centered">{loadingText}</p>
  </div>
</div>

<div class="modal {isInfoModalVisible ? 'is-active' : ''}">
  <div class="modal-background"></div>
  <div class="modal-card">
    <section class="modal-card-body">
      <div class="content">
        <h1 class="title">Info</h1>
        <p>{infoModalContent}</p>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div class="buttons">
        <button bind:this={infoModalButton} class="button is-success" on:click={closeInfoModal}
          >OK</button
        >
      </div>
    </footer>
  </div>
</div>

{#each $localPackages as pkg, i}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="card {i === 0 ? 'is-active' : ''}"
    bind:this={localPackageItems[i]}
    on:click={onLocalPackageItemClick}
  >
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4 pb-3">
            {pkg.name}
            <span class="tag {pkg.updateAvailable ? 'is-warning' : 'is-text'}"
              >{pkg.localVersion}</span
            >
            {#if pkg.updateAvailable}
              <span class="tag is-primary" data-sourceId={pkg.source.id}
                >Update available {pkg.version}</span
              >{/if}
          </p>
          <p class="subtitle is-6"></p>
        </div>
      </div>
      <div class="content">
        {pkg.description}
      </div>
    </div>
  </div>
{/each}

<style>
  .is-active {
    background-color: #111111;
  }
</style>
