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
    { sky: ["#79c7ff", "#f8f2ba"], land: "#72b05f", dark: "#32694b", accent: "#e43f3f", extra: "#f8d84e" },
    { sky: ["#0e2f59", "#49b6d8"], land: "#f0b84d", dark: "#443d74", accent: "#ff6b35", extra: "#fff3c4" },
    { sky: ["#ffc4d8", "#fff0b7"], land: "#8fd2bf", dark: "#4d5d8f", accent: "#f05d5e", extra: "#ffe066" },
    { sky: ["#a6d9ff", "#f7e6b1"], land: "#4f9d69", dark: "#145a67", accent: "#db504a", extra: "#f2c14e" },
    { sky: ["#e9f1d3", "#86c7b9"], land: "#81b29a", dark: "#3d405b", accent: "#e07a5f", extra: "#f2cc8f" },
    { sky: ["#b8f2e6", "#fff1d0"], land: "#60b88a", dark: "#3f5570", accent: "#ffa69e", extra: "#f9d56e" }
  ];
  const colors = palettes[seed % palettes.length];
  const sky = ctx.createLinearGradient(0, 0, 0, size);
  sky.addColorStop(0, colors.sky[0]);
  sky.addColorStop(1, colors.sky[1]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, size, size);

  drawSun(ctx, 980, 170, colors.extra);
  drawCloud(ctx, 205, 210, 1.35);
  drawCloud(ctx, 780, 310, 0.9);
  drawHills(ctx, colors);

  const scene = seed % 6;
  if (scene === 0) drawMushroomCottage(ctx, colors);
  if (scene === 1) drawHarborLighthouse(ctx, colors);
  if (scene === 2) drawGardenTeaTable(ctx, colors);
  if (scene === 3) drawMountainTrain(ctx, colors);
  if (scene === 4) drawBalloonFestival(ctx, colors);
  if (scene === 5) drawSpacePark(ctx, colors);

  drawPuzzleGuides(ctx);
  return canvas.toDataURL("image/jpeg", 0.92);
}

function drawSun(ctx, x, y, color) {
  const glow = ctx.createRadialGradient(x, y, 20, x, y, 150);
  glow.addColorStop(0, "rgba(255,255,255,0.95)");
  glow.addColorStop(0.35, color);
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, 160, 0, Math.PI * 2);
  ctx.fill();
}

function drawCloud(ctx, x, y, scale) {
  ctx.fillStyle = "rgba(255,255,255,0.86)";
  [[0, 0, 58], [56, -25, 74], [132, -5, 58], [82, 20, 82]].forEach(([dx, dy, r]) => {
    ctx.beginPath();
    ctx.arc(x + dx * scale, y + dy * scale, r * scale, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawHills(ctx, colors) {
  ctx.fillStyle = colors.land;
  ctx.beginPath();
  ctx.moveTo(0, 650);
  ctx.bezierCurveTo(180, 540, 330, 705, 520, 600);
  ctx.bezierCurveTo(720, 490, 900, 660, 1200, 515);
  ctx.lineTo(1200, 1200);
  ctx.lineTo(0, 1200);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = colors.dark;
  ctx.globalAlpha = 0.24;
  ctx.beginPath();
  ctx.moveTo(0, 785);
  ctx.bezierCurveTo(260, 690, 450, 820, 680, 725);
  ctx.bezierCurveTo(870, 640, 1040, 790, 1200, 700);
  ctx.lineTo(1200, 1200);
  ctx.lineTo(0, 1200);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawMushroomCottage(ctx, colors) {
  drawPath(ctx, 520, 1180, 610, 725, "#f4d69a");
  ctx.fillStyle = "#f8edd8";
  roundedRect(ctx, 365, 575, 440, 390, 42);
  ctx.fill();
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.ellipse(590, 570, 300, 145, -0.04, Math.PI, 0);
  ctx.lineTo(890, 575);
  ctx.bezierCurveTo(800, 720, 415, 720, 292, 570);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  [[420, 510, 55], [535, 450, 38], [675, 515, 70], [785, 570, 38]].forEach(([x, y, r]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
  drawWindow(ctx, 435, 700, 95, 95, "#7cc7ff");
  drawWindow(ctx, 650, 690, 110, 100, "#ffd17a");
  ctx.fillStyle = "#8b5a3a";
  roundedRect(ctx, 525, 780, 115, 185, 58);
  ctx.fill();
  drawFlowers(ctx, colors);
}

function drawHarborLighthouse(ctx, colors) {
  ctx.fillStyle = "#2e8cc6";
  ctx.fillRect(0, 780, 1200, 420);
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = 5;
  for (let y = 825; y < 1160; y += 55) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(260, y - 35, 370, y + 40, 610, y);
    ctx.bezierCurveTo(830, y - 35, 990, y + 35, 1200, y - 5);
    ctx.stroke();
  }
  ctx.fillStyle = "#f8f4df";
  ctx.fillRect(220, 345, 165, 520);
  ctx.fillStyle = colors.accent;
  for (let y = 435; y < 800; y += 110) {
    ctx.fillRect(220, y, 165, 48);
  }
  ctx.fillStyle = colors.dark;
  ctx.fillRect(200, 305, 205, 55);
  ctx.beginPath();
  ctx.moveTo(220, 305);
  ctx.lineTo(302, 230);
  ctx.lineTo(385, 305);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffe78a";
  ctx.fillRect(270, 250, 65, 55);
  drawBoat(ctx, 725, 845, 1.35, colors);
  drawBoat(ctx, 915, 1010, 0.78, colors);
}

function drawGardenTeaTable(ctx, colors) {
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  roundedRect(ctx, 305, 555, 590, 350, 36);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(605, 790, 240, 96, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.dark;
  ctx.lineWidth = 13;
  ctx.beginPath();
  ctx.moveTo(420, 870);
  ctx.lineTo(380, 1060);
  ctx.moveTo(790, 870);
  ctx.lineTo(840, 1060);
  ctx.stroke();
  ctx.fillStyle = colors.accent;
  roundedRect(ctx, 480, 670, 145, 95, 22);
  ctx.fill();
  ctx.fillStyle = colors.extra;
  ctx.beginPath();
  ctx.ellipse(715, 695, 70, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  drawFlowers(ctx, colors);
  drawVine(ctx, colors);
}

function drawMountainTrain(ctx, colors) {
  ctx.fillStyle = "#dfe8f1";
  ctx.beginPath();
  ctx.moveTo(0, 700);
  ctx.lineTo(265, 335);
  ctx.lineTo(420, 590);
  ctx.lineTo(610, 280);
  ctx.lineTo(875, 640);
  ctx.lineTo(1040, 420);
  ctx.lineTo(1200, 700);
  ctx.closePath();
  ctx.fill();
  drawPath(ctx, 0, 1000, 1200, 840, "#6f5d4d");
  ctx.fillStyle = colors.accent;
  roundedRect(ctx, 360, 725, 390, 130, 20);
  ctx.fill();
  ctx.fillStyle = colors.extra;
  roundedRect(ctx, 735, 745, 210, 110, 18);
  ctx.fill();
  ctx.fillStyle = colors.dark;
  [430, 615, 805, 910].forEach(x => {
    ctx.beginPath();
    ctx.arc(x, 865, 38, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#dff6ff";
  [400, 500, 600, 780, 860].forEach(x => {
    ctx.fillRect(x, 758, 62, 45);
  });
}

function drawBalloonFestival(ctx, colors) {
  drawPath(ctx, 170, 1200, 980, 700, "#f7d193");
  [[350, 435, 1.2], [700, 315, 1.55], [930, 520, 0.9]].forEach(([x, y, scale], index) => {
    ctx.fillStyle = [colors.accent, colors.extra, colors.dark][index];
    ctx.beginPath();
    ctx.ellipse(x, y, 95 * scale, 135 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(x, y - 130 * scale);
    ctx.bezierCurveTo(x - 48 * scale, y - 40 * scale, x - 50 * scale, y + 55 * scale, x, y + 132 * scale);
    ctx.bezierCurveTo(x + 50 * scale, y + 55 * scale, x + 48 * scale, y - 40 * scale, x, y - 130 * scale);
    ctx.stroke();
    ctx.fillStyle = "#9a6a3c";
    ctx.fillRect(x - 28 * scale, y + 150 * scale, 56 * scale, 38 * scale);
  });
  drawFlowers(ctx, colors);
}

function drawSpacePark(ctx, colors) {
  ctx.fillStyle = "rgba(11,20,46,0.55)";
  ctx.fillRect(0, 0, 1200, 1200);
  drawStars(ctx);
  drawPath(ctx, 585, 1200, 680, 700, "#bfc8d9");
  ctx.fillStyle = "#f8f4df";
  ctx.beginPath();
  ctx.moveTo(590, 730);
  ctx.bezierCurveTo(455, 575, 505, 330, 655, 210);
  ctx.bezierCurveTo(810, 335, 875, 570, 720, 730);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.moveTo(555, 620);
  ctx.lineTo(410, 810);
  ctx.lineTo(595, 760);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(755, 620);
  ctx.lineTo(910, 810);
  ctx.lineTo(715, 760);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#76d6ff";
  ctx.beginPath();
  ctx.arc(655, 430, 72, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colors.extra;
  ctx.beginPath();
  ctx.moveTo(610, 730);
  ctx.lineTo(700, 730);
  ctx.lineTo(655, 1030);
  ctx.closePath();
  ctx.fill();
}

function drawPath(ctx, startX, startY, endX, endY, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(startX - 95, startY);
  ctx.bezierCurveTo(startX + 130, 985, endX - 140, 885, endX - 50, endY);
  ctx.lineTo(endX + 55, endY);
  ctx.bezierCurveTo(endX - 30, 910, startX + 265, 1030, startX + 120, startY);
  ctx.closePath();
  ctx.fill();
}

function drawWindow(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  roundedRect(ctx, x, y, w, h, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(40,50,60,0.45)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + 8);
  ctx.lineTo(x + w / 2, y + h - 8);
  ctx.moveTo(x + 8, y + h / 2);
  ctx.lineTo(x + w - 8, y + h / 2);
  ctx.stroke();
}

function drawFlowers(ctx, colors) {
  for (let i = 0; i < 34; i += 1) {
    const x = 80 + ((i * 137) % 1020);
    const y = 825 + ((i * 73) % 275);
    ctx.fillStyle = [colors.accent, colors.extra, "#ffffff"][i % 3];
    for (let p = 0; p < 5; p += 1) {
      ctx.beginPath();
      ctx.arc(x + Math.cos(p * 1.26) * 11, y + Math.sin(p * 1.26) * 11, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#ffd45a";
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawVine(ctx, colors) {
  ctx.strokeStyle = colors.dark;
  ctx.lineWidth = 13;
  ctx.beginPath();
  ctx.moveTo(110, 575);
  ctx.bezierCurveTo(280, 390, 455, 650, 610, 470);
  ctx.bezierCurveTo(780, 285, 975, 545, 1110, 360);
  ctx.stroke();
}

function drawBoat(ctx, x, y, scale, colors) {
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.moveTo(x - 145 * scale, y);
  ctx.lineTo(x + 155 * scale, y);
  ctx.lineTo(x + 95 * scale, y + 75 * scale);
  ctx.lineTo(x - 95 * scale, y + 75 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff6d6";
  ctx.beginPath();
  ctx.moveTo(x - 15 * scale, y - 250 * scale);
  ctx.lineTo(x - 15 * scale, y - 20 * scale);
  ctx.lineTo(x + 135 * scale, y - 20 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = colors.dark;
  ctx.lineWidth = 8 * scale;
  ctx.beginPath();
  ctx.moveTo(x - 20 * scale, y - 255 * scale);
  ctx.lineTo(x - 20 * scale, y);
  ctx.stroke();
}

function drawStars(ctx) {
  ctx.strokeStyle = "rgba(255,255,255,0.82)";
  ctx.lineWidth = 4;
  for (let i = 0; i < 42; i += 1) {
    const x = 40 + ((i * 151) % 1120);
    const y = 40 + ((i * 89) % 630);
    ctx.beginPath();
    ctx.moveTo(x - 12, y);
    ctx.lineTo(x + 12, y);
    ctx.moveTo(x, y - 12);
    ctx.lineTo(x, y + 12);
    ctx.stroke();
  }
}

function drawPuzzleGuides(ctx) {
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 5;
  for (let i = 1; i < 4; i += 1) {
    const p = i * 300;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, 1200);
    ctx.moveTo(0, p);
    ctx.lineTo(1200, p);
    ctx.stroke();
  }
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function squareImageFromFile(file, onLoad) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const image = new Image();
    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      const size = 1200;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const scale = Math.max(size / image.width, size / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      ctx.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
      onLoad(canvas.toDataURL("image/jpeg", 0.92));
    });
    image.src = String(reader.result);
  });
  reader.readAsDataURL(file);
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
  const selectedPositions = state.selectedIndex === null ? [] : getConnectedComponent(state.selectedIndex);
  const selectedSet = new Set(selectedPositions);
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
    if (hasRightEdge(position)) button.classList.add("edge-right");
    if (hasBottomEdge(position)) button.classList.add("edge-bottom");
    if (isConnectedRight(position)) button.classList.add("connected-right");
    if (isConnectedDown(position)) button.classList.add("connected-down");
    if (selectedSet.has(position)) button.classList.add("selected");
    button.addEventListener("click", () => selectTile(position));
    board.append(button);
  }
}

function hasRightEdge(position) {
  return position % state.grid !== state.grid - 1;
}

function hasBottomEdge(position) {
  return Math.floor(position / state.grid) !== state.grid - 1;
}

function isConnectedRight(position) {
  if (!hasRightEdge(position)) return false;
  const tileId = state.tiles[position];
  const rightTileId = state.tiles[position + 1];
  return rightTileId === tileId + 1 && Math.floor(tileId / state.grid) === Math.floor(rightTileId / state.grid);
}

function isConnectedDown(position) {
  if (!hasBottomEdge(position)) return false;
  return state.tiles[position + state.grid] === state.tiles[position] + state.grid;
}

function neighboringPositions(position) {
  const neighbors = [];
  const row = Math.floor(position / state.grid);
  const col = position % state.grid;
  if (col > 0) neighbors.push(position - 1);
  if (col < state.grid - 1) neighbors.push(position + 1);
  if (row > 0) neighbors.push(position - state.grid);
  if (row < state.grid - 1) neighbors.push(position + state.grid);
  return neighbors;
}

function arePositionsConnected(first, second) {
  if (second === first + 1) return isConnectedRight(first);
  if (second === first - 1) return isConnectedRight(second);
  if (second === first + state.grid) return isConnectedDown(first);
  if (second === first - state.grid) return isConnectedDown(second);
  return false;
}

function getConnectedComponent(startPosition) {
  const visited = new Set([startPosition]);
  const queue = [startPosition];

  while (queue.length > 0) {
    const position = queue.shift();
    neighboringPositions(position).forEach(neighbor => {
      if (visited.has(neighbor) || !arePositionsConnected(position, neighbor)) return;
      visited.add(neighbor);
      queue.push(neighbor);
    });
  }

  return [...visited].sort((first, second) => first - second);
}

function selectTile(position) {
  if (state.selectedIndex === null) {
    state.selectedIndex = position;
    renderBoard();
    return;
  }

  if (getConnectedComponent(state.selectedIndex).includes(position)) {
    state.selectedIndex = null;
    renderBoard();
    return;
  }

  const moved = moveSelectedCluster(position);
  state.selectedIndex = null;
  if (moved) state.moves += 1;
  renderBoard();
  updateHud();

  if (isSolved()) {
    completePuzzle();
  }
}

function moveSelectedCluster(targetPosition) {
  const sourceAnchor = state.selectedIndex;
  const component = getConnectedComponent(sourceAnchor);
  const movableSources = getMovableClusterSources(component, sourceAnchor, targetPosition);
  if (movableSources.length === 0) return false;

  const sourceAnchorRow = Math.floor(sourceAnchor / state.grid);
  const sourceAnchorCol = sourceAnchor % state.grid;
  const targetRow = Math.floor(targetPosition / state.grid);
  const targetCol = targetPosition % state.grid;
  const sourceSet = new Set(movableSources);
  const movePairs = movableSources.map(source => {
    const sourceRow = Math.floor(source / state.grid);
    const sourceCol = source % state.grid;
    const destination = (targetRow + sourceRow - sourceAnchorRow) * state.grid + targetCol + sourceCol - sourceAnchorCol;
    return { source, destination };
  });
  const destinationSet = new Set(movePairs.map(pair => pair.destination));
  const nextTiles = [...state.tiles];
  const displacedTiles = movePairs
    .filter(pair => !sourceSet.has(pair.destination))
    .map(pair => state.tiles[pair.destination]);
  const vacatedSources = movePairs
    .filter(pair => !destinationSet.has(pair.source))
    .map(pair => pair.source);

  movePairs.forEach(pair => {
    nextTiles[pair.destination] = state.tiles[pair.source];
  });
  vacatedSources.forEach((source, index) => {
    nextTiles[source] = displacedTiles[index];
  });

  if (nextTiles.every((tile, index) => tile === state.tiles[index])) return false;
  state.tiles = nextTiles;
  return true;
}

function getMovableClusterSources(component, sourceAnchor, targetPosition) {
  const sourceAnchorRow = Math.floor(sourceAnchor / state.grid);
  const sourceAnchorCol = sourceAnchor % state.grid;
  const targetRow = Math.floor(targetPosition / state.grid);
  const targetCol = targetPosition % state.grid;
  const componentSet = new Set(component);
  const inBounds = new Set();

  component.forEach(source => {
    const sourceRow = Math.floor(source / state.grid);
    const sourceCol = source % state.grid;
    const destinationRow = targetRow + sourceRow - sourceAnchorRow;
    const destinationCol = targetCol + sourceCol - sourceAnchorCol;
    if (destinationRow >= 0 && destinationRow < state.grid && destinationCol >= 0 && destinationCol < state.grid) {
      inBounds.add(source);
    }
  });

  if (!inBounds.has(sourceAnchor)) return [];

  const kept = new Set([sourceAnchor]);
  const queue = [sourceAnchor];
  while (queue.length > 0) {
    const source = queue.shift();
    neighboringPositions(source).forEach(neighbor => {
      if (!componentSet.has(neighbor) || !inBounds.has(neighbor) || kept.has(neighbor)) return;
      if (!arePositionsConnected(source, neighbor)) return;
      kept.add(neighbor);
      queue.push(neighbor);
    });
  }

  return [...kept].sort((first, second) => first - second);
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
    squareImageFromFile(file, src => {
      state.images.push({ name: file.name, src });
      state.imageIndex = state.images.length - 1;
      renderGallery();
      startPuzzle();
    });
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
