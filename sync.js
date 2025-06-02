const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

const metadataPath = path.join(__dirname, 'metadata.json');
let metadata = {}; // Start fresh

function isImage(file) {
  return ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase());
}

function syncFile(filePath, baseFolder) {
  const relPath = path.relative(baseFolder, filePath);
  const photographer = relPath.split(path.sep)[0];
  const filename = path.basename(filePath);
  const lastModified = fs.statSync(filePath).mtimeMs;

  metadata[relPath] = {
    filename,
    photographer,
    relative_path: relPath,
    absolute_path: filePath,
    last_modified: lastModified
  };

  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`✅ Synced ${filename}`);
}

function watchFolder(baseFolder) {
  const watcher = chokidar.watch(baseFolder, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: false
  });

  watcher.on('add', (filePath) => {
    if (isImage(filePath)) {
      syncFile(filePath, baseFolder);
    }
  });
}

module.exports = { watchFolder };
