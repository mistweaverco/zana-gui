<script lang="ts">
  import { onMount } from 'svelte'
  import { useActiveView } from './stores'
  const activeView = useActiveView()

  let buttonsContainer: HTMLDivElement

  const handleTopButtonsClick = (evt: MouseEvent): void => {
    evt.preventDefault()
    const target = evt.target as HTMLButtonElement
    const root = target.closest('button')

    $activeView = root.dataset.action
  }
  const selectButton = (direction: 'next' | 'prev'): void => {
    const buttons = buttonsContainer.querySelectorAll('button')
    const activeButton = buttonsContainer.querySelector('.btn-active') as HTMLButtonElement
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
        case 'l':
        case 'ArrowRight':
          selectButton('next')
          break
        case 'h':
        case 'ArrowLeft':
          selectButton('prev')
          break
      }
    })
  })
</script>

<div class="navbar bg-base-300 sticky top-0 z-10">
  <div class="flex-1" bind:this={buttonsContainer}>
    <button
      class="btn {$activeView === 'installed' ? 'btn-active' : ''}"
      data-action="installed"
      on:click={handleTopButtonsClick}
    >
      <span class="icon">
        <i class="fa fa-bolt"></i>
      </span>
      <strong>Installed</strong>
    </button>
    <button
      class="btn {$activeView === 'registry' ? 'btn-active' : ''}"
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
      <input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" />
    </div>
  </div>
</div>
