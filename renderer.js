window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('syncBtn');
  const container = document.getElementById('imageGrid');

  if (!window.electronAPI) {
    console.error("❌ electronAPI not found on window");
    return;
  }

  btn.addEventListener('click', () => {
    window.electronAPI.startSync();
  });

  async function renderGrid() {
    const metadata = await window.electronAPI.requestMetadata();
    container.innerHTML = '';

    const entries = Object.values(metadata);
    if (entries.length === 0) {
      container.innerHTML = '<p>No images synced yet.</p>';
      return;
    }

    entries.forEach(entry => {
      const img = document.createElement('img');
      img.src = `file://${entry.absolute_path}`;
      img.alt = entry.filename;
      img.title = entry.photographer;
      img.className = 'grid-image';

      const wrapper = document.createElement('div');
      wrapper.className = 'grid-item';
      wrapper.appendChild(img);
      container.appendChild(wrapper);
    });
  }

  renderGrid();
});
