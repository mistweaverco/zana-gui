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
    const activeButton = buttonsContainer.querySelector('.is-active') as HTMLButtonElement
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

<div class="container">
  <nav class="navbar" aria-label="main navigation">
    <div class="navbar-brand p-2">
      <div class="navbar-start">
        <div class="navbar-item">
          <div class="buttons" bind:this={buttonsContainer}>
            <button
              class="button {$activeView === 'installed' ? 'is-active is-primary' : 'is-secondary'}"
              data-action="installed"
              on:click={handleTopButtonsClick}
            >
              <span class="icon">
                <i class="fa fa-bolt"></i>
              </span>
              <strong>Installed</strong>
            </button>
            <button
              class="button {$activeView === 'registry' ? 'is-active is-primary' : 'is-secondary'}"
              data-action="registry"
              on:click={handleTopButtonsClick}
            >
              <span class="icon">
                <i class="fa-solid fa-cloud"></i>
              </span>
              <strong>Registry</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</div>
