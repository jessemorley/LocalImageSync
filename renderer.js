window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('syncBtn');
  const searchInput = document.getElementById('searchInput');

  btn.addEventListener('click', () => {
    window.electronAPI.startSync();
  });

  let currentFolder = null;
  let allMetadata = {};

  function renderGrid(folder = null, searchTerm = '') {
    const container = document.getElementById('imageGrid');
    container.innerHTML = '';
    container.className = folder ? 'masonry' : 'grid-container';

    const entries = Object.values(allMetadata);
    if (entries.length === 0) {
      container.innerHTML = '<p>No images synced yet.</p>';
      return;
    }

    let filteredEntries = entries;

    if (folder) {
      filteredEntries = filteredEntries.filter(e => e.photographer === folder);
    }

    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      filteredEntries = filteredEntries.filter(e =>
        e.photographer.toLowerCase().includes(lowerSearch)
      );
    }

    const grouped = {};
    for (const entry of filteredEntries) {
      if (!grouped[entry.photographer]) {
        grouped[entry.photographer] = [];
      }
      grouped[entry.photographer].push(entry);
    }

    for (const [photographer, images] of Object.entries(grouped)) {
      const toShow = folder ? images : [images[0]];

      for (const entry of toShow) {
        const img = document.createElement('img');
        img.src = `file://${entry.absolute_path}`;
        img.alt = entry.filename;
        img.title = entry.photographer;
        img.className = 'grid-image';

        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-wrapper';
        imageWrapper.appendChild(img);

        const wrapper = document.createElement('div');
        wrapper.className = folder ? 'masonry-item' : 'grid-item';
        wrapper.appendChild(imageWrapper);

        if (!folder) {
          const label = document.createElement('div');
          label.className = 'label';
          label.textContent = entry.photographer;
          wrapper.appendChild(label);

          wrapper.onclick = () => {
            currentFolder = entry.photographer;
            renderGrid(currentFolder, searchInput.value);
          };
        }

        container.appendChild(wrapper);
      }
    }

    if (folder) {
      const backBtn = document.createElement('button');
      backBtn.textContent = '← Back to folders';
      backBtn.className = 'back-btn';
      backBtn.onclick = () => {
        currentFolder = null;
        renderGrid(null, searchInput.value);
      };
      container.prepend(backBtn);
    }
  }

  window.electronAPI.requestMetadata().then(metadata => {
    allMetadata = metadata;
    renderGrid();
  });

  searchInput.addEventListener('input', () => {
    renderGrid(currentFolder, searchInput.value);
  });
});
