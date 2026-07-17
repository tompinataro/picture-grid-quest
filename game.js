const board = document.querySelector("#board");
const levelNumber = document.querySelector("#levelNumber");
const gridSizeLabel = document.querySelector("#gridSize");
const moveCount = document.querySelector("#moveCount");
const progressText = document.querySelector("#progressText");
const progressFill = document.querySelector("#progressFill");
const pictureCount = document.querySelector("#pictureCount");
const gallery = document.querySelector("#gallery");
const photoInput = document.querySelector("#photoInput");
const preview = document.querySelector("#preview");
const previewImage = document.querySelector("#previewImage");
const winDialog = document.querySelector("#winDialog");
const winText = document.querySelector("#winText");

const state = {
  level: 1,
  grid: 4,
  solvedAtGrid: 0,
  moves: 0,
  selectedIndex: null,
  imageIndex: 0,
  images: [],
  tiles: []
};

function sceneImage(seed) {
  const canvas = document.createElement("canvas");
  const size = 1200;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const palettes = [
    ["#7fc8ff", "#fbf4be", "#4fb477", "#e74645", "#f8d84e"],
    ["#23395b", "#55dde0", "#f6ae2d", "#f26419", "#f7f7ff"],
    ["#f7c6d9", "#ffefbd", "#93d8c5", "#f05d5e", "#5b5f97"],
    ["#c4e7d4", "#56a3a6", "#084c61", "#db504a", "#e3b505"],
    ["#f4f1de", "#81b29a", "#3d405b", "#e07a5f", "#f2cc8f"],
    ["#b8f2e6", "#aed9e0", "#ffa69e", "#faf3dd", "#5e6472"]
  ];
  const colors = palettes[seed % palettes.length];
  const sky = ctx.createLinearGradient(0, 0, 0, size);
  sky.addColorStop(0, colors[0]);
  sky.addColorStop(0.54, colors[1]);
  sky.addColorStop(1, colors[2]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = colors[2];
  for (let i = 0; i < 9; i += 1) {
    const y = 720 + i * 38;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 80) {
      ctx.lineTo(x, y + Math.sin((x + seed * 70) / 90) * 28);
    }
    ctx.lineTo(size, size);
    ctx.lineTo(0, size);
    ctx.closePath();
    ctx.globalAlpha = 0.23 + i * 0.06;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (let i = 0; i < 18; i += 1) {
    const x = ((i * 173 + seed * 89) % 1050) + 70;
    const y = ((i * 119 + seed * 61) % 830) + 80;
    const r = 26 + ((i * 17 + seed * 11) % 82);
    ctx.fillStyle = colors[(i + 3) % colors.length];
    ctx.beginPath();
    ctx.arc(x, y, r, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.beginPath();
    ctx.ellipse(x - r * 0.35, y - r * 0.28, r * 0.22, r * 0.1, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f7f2d8";
    ctx.fillRect(x - r * 0.16, y, r * 0.32, r * 0.9);
  }

  for (let i = 0; i < 30; i += 1) {
    const x = ((i * 97 + seed * 151) % size);
    const y = ((i * 137 + seed * 47) % 680) + 35;
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 11, y);
    ctx.lineTo(x + 11, y);
    ctx.moveTo(x, y - 11);
    ctx.lineTo(x, y + 11);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.font = "900 190px ui-sans-serif, system-ui";
  ctx.fillText(String(seed + 1), 72, 230);
  return canvas.toDataURL("image/jpeg", 0.9);
}

function bootstrapImages() {
  state.images = Array.from({ length: 6 }, (_, index) => ({
    name: `Scene ${index + 1}`,
    src: sceneImage(index)
  }));
  renderGallery();
}

function targetForGrid() {
  return state.grid - 1;
}

function updateHud() {
  const needed = targetForGrid();
  levelNumber.textContent = String(state.level);
  gridSizeLabel.textContent = `${state.grid}x${state.grid}`;
  moveCount.textContent = String(state.moves);
  progressText.textContent = `${state.solvedAtGrid} / ${needed}`;
  progressFill.style.width = `${Math.min(100, (state.solvedAtGrid / needed) * 100)}%`;
  pictureCount.textContent = String(state.images.length);
}

function renderGallery() {
  gallery.innerHTML = "";
  state.images.forEach((image, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `thumb${index === state.imageIndex ? " active" : ""}`;
    button.style.backgroundImage = `url("${image.src}")`;
    button.title = image.name;
    button.ariaLabel = image.name;
    button.addEventListener("click", () => {
      state.imageIndex = index;
      startPuzzle();
      renderGallery();
    });
    gallery.append(button);
  });
}

function makeSolvedTiles() {
  const total = state.grid * state.grid;
  return Array.from({ length: total }, (_, index) => index);
}

function shuffleTiles(tiles) {
  const shuffled = [...tiles];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  if (shuffled.every((tile, index) => tile === index)) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  return shuffled;
}

function startPuzzle() {
  state.moves = 0;
  state.selectedIndex = null;
  state.tiles = shuffleTiles(makeSolvedTiles());
  preview.classList.remove("visible");
  renderBoard();
  updateHud();
}

function renderBoard() {
  const image = state.images[state.imageIndex];
  const total = state.grid * state.grid;
  board.style.gridTemplateColumns = `repeat(${state.grid}, 1fr)`;
  board.innerHTML = "";
  previewImage.src = image.src;

  for (let position = 0; position < total; position += 1) {
    const tileId = state.tiles[position];
    const correctRow = Math.floor(tileId / state.grid);
    const correctCol = tileId % state.grid;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tile";
    button.style.backgroundImage = `url("${image.src}")`;
    button.style.backgroundSize = `${state.grid * 100}% ${state.grid * 100}%`;
    button.style.backgroundPosition = `${(correctCol / (state.grid - 1)) * 100}% ${(correctRow / (state.grid - 1)) * 100}%`;
    button.ariaLabel = `Tile ${position + 1}`;
    if (position === state.selectedIndex) button.classList.add("selected");
    if (tileId === position) button.classList.add("fixed");
    button.addEventListener("click", () => selectTile(position));
    board.append(button);
  }
}

function selectTile(position) {
  if (state.selectedIndex === null) {
    state.selectedIndex = position;
    renderBoard();
    return;
  }

  if (state.selectedIndex === position) {
    state.selectedIndex = null;
    renderBoard();
    return;
  }

  [state.tiles[state.selectedIndex], state.tiles[position]] = [state.tiles[position], state.tiles[state.selectedIndex]];
  state.selectedIndex = null;
  state.moves += 1;
  renderBoard();
  updateHud();

  if (isSolved()) {
    completePuzzle();
  }
}

function isSolved() {
  return state.tiles.every((tile, index) => tile === index);
}

function completePuzzle() {
  state.solvedAtGrid += 1;
  const needed = targetForGrid();
  const leveledUp = state.solvedAtGrid >= needed;
  if (leveledUp) {
    state.grid += 1;
    state.level += 1;
    state.solvedAtGrid = 0;
  }
  updateHud();
  winText.textContent = leveledUp
    ? `Grid upgraded to ${state.grid}x${state.grid}.`
    : `${needed - state.solvedAtGrid} more completion${needed - state.solvedAtGrid === 1 ? "" : "s"} to unlock ${state.grid + 1}x${state.grid + 1}.`;
  winDialog.showModal();
}

function chooseNextImage() {
  state.imageIndex = (state.imageIndex + 1) % state.images.length;
  renderGallery();
  startPuzzle();
}

photoInput.addEventListener("change", () => {
  const files = Array.from(photoInput.files || []).filter(file => file.type.startsWith("image/"));
  files.forEach(file => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      state.images.push({ name: file.name, src: String(reader.result) });
      state.imageIndex = state.images.length - 1;
      renderGallery();
      startPuzzle();
    });
    reader.readAsDataURL(file);
  });
  photoInput.value = "";
});

document.querySelector("#newPuzzleButton").addEventListener("click", startPuzzle);
document.querySelector("#hintButton").addEventListener("pointerdown", () => preview.classList.add("visible"));
document.querySelector("#hintButton").addEventListener("pointerup", () => preview.classList.remove("visible"));
document.querySelector("#hintButton").addEventListener("pointerleave", () => preview.classList.remove("visible"));
document.querySelector("#hintButton").addEventListener("click", () => {
  preview.classList.toggle("visible");
  window.setTimeout(() => preview.classList.remove("visible"), 1300);
});
winDialog.addEventListener("close", chooseNextImage);

bootstrapImages();
startPuzzle();
