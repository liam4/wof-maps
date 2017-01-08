class WorldMap {
  constructor(mapEl) {
    this.mapEl = mapEl

    this.selectedLayer = null

    this.setupLayerPicker()

    // Setup - no layers should be visible.
    for (let layerEl of mapEl.getElementsByTagName('map-layer')) {
      layerEl.style.display = 'none'
    }

    // If there's a default layer set on the root element (data-default-layer),
    // select that layer.
    if (mapEl.dataset.defaultLayer) {
      this.selectLayer(mapEl.dataset.defaultLayer)
    }
  }

  setupLayerPicker() {
    this.layerPicker = document.createElement('map-layer-picker')

    const ul = document.createElement('ul')
    this.layerPicker.appendChild(ul)

    for (let layerEl of this.mapEl.getElementsByTagName('map-layer')) {
      const li = document.createElement('li')
      li.appendChild(document.createTextNode(layerEl.dataset.layer))
      li.dataset.layer = layerEl.dataset.layer
      ul.appendChild(li)

      li.addEventListener('click', () => {
        this.selectLayer(layerEl.dataset.layer)
      })
    }

    this.mapEl.appendChild(this.layerPicker)
  }

  setupInterests(layer) {
    const layerEl = this.getLayerEl(layer)

    const interestEls = layerEl.getElementsByTagName('map-interest')

    for (let interestEl of interestEls) {
      const [ x, y ] = interestEl.dataset.position.split(' ')
      const [ w, h ] = interestEl.dataset.size.split(' ')

      interestEl.style.top = y + 'px'
      interestEl.style.left = x + 'px'
      interestEl.style.width = w + 'px'
      interestEl.style.height = h + 'px'

      // When we hover over the element, its width and height get unset
      // (so that the element can better fit its content), but we want to make
      // sure it doesn't shrink, so we set the minimum width and height here to
      // be equivalent to the given width and height.
      interestEl.style.minWidth = w + 'px'
      interestEl.style.minHeight = h + 'px'
    }
  }

  getLayerEl(layer) {
    return this.mapEl.querySelector(`map-layer[data-layer='${layer}']`)
  }

  selectLayer(layer) {
    // The currently selected layer should be hidden (if there was one).
    const oldLayerEl = this.getLayerEl(this.selectedLayer)
    if (oldLayerEl) {
      oldLayerEl.style.display = 'none'
    }

    const oldLayerPickerSelectedEl = this.layerPicker.querySelector(
      '.selected'
    )

    if (oldLayerPickerSelectedEl) {
      oldLayerPickerSelectedEl.classList.remove('selected')
    }

    const newLayerPickerSelectedEl = this.layerPicker.querySelector(
      `li[data-layer='${layer}']`
    )

    if (newLayerPickerSelectedEl) {
      newLayerPickerSelectedEl.classList.add('selected')
    }

    this.selectedLayer = layer

    const layerEl = this.getLayerEl(layer)
    layerEl.style.display = 'block'

    this.setupInterests(layer)
  }
}
