let cnv
let points = []
let k = 0
let slider
let sliderLabel
let clusters = []
let scale = 10
let pointIdCounter = 0
let addPointsButton
let clearPointsButton
let randomizeClustersButton
let clearColors = [
  [25, 25, 112, 100],
  [255, 0, 255, 100],
  [255, 165, 0, 100],
  [0, 255, 0, 100],
  [0, 255, 255, 100],
  [255, 0, 0, 100],
]
let accelerationConstant = 10
let initialClusterValue = 2

function setup() {
  cnv = createCanvas(550, 550)
  createElement('br');
  sliderLabel = createP(initialClusterValue)
  sliderLabel.style('font-size', '20px')
  sliderLabel.style('font-family', 'Helvetica Neue')
  sliderLabel.style('display', 'inline-block')
  sliderLabel.style('margin-right', '5px')
  slider = createSlider(1, clearColors.length, initialClusterValue)
  slider.style('width', '150px')
  slider.input(sliderChange)
  addPointsButton = createButton('Add 10 Random Points');
  addPointsButton.mousePressed(() => addRandomPoints(10));
  clearPointsButton = createButton('Clear Points');
  clearPointsButton.mousePressed(() => points = []);
  randomizeClustersButton = createButton('Randomize Clusters');
  randomizeClustersButton.mousePressed(() => clusters = newClusters(slider.value()));
  sliderChange()
}


function addRandomPoints(n) {
  for (i = 0; i < n; i++) {
    addPoint(
      floor(random(scale, width - scale)),
      floor(random(scale, width - scale))
    )
  }
}

function draw() {
  background(255)
  drawBorder()
  drawPoints()
  drawclusters()
  updateDesiredClusterPositions()
  updateClusterPositions()
}

function addPoint(x_, y_) {
  points.push({ x: x_, y: y_, color: [255, 255, 255, 100], id: pointIdCounter++ })
}

function mousePressed() {
  if (0 <= mouseX && mouseX < width && 0 <= mouseY && mouseY < height) {
    addPoint(mouseX, mouseY)
  }
}

// function touchStarted() {
//   if (0 <= mouseX && mouseX < width && 0 <= mouseY && mouseY < height) {
//     addPoint(mouseX, mouseY)
//   }
// }

function getRandomBorderPosition() {
  let side = floor(random(0, 4))
  switch (side) {
    case 0:
      return { x: random(2.5 * scale, width - 2.5 * scale), y: 2.5 * scale }
    case 1:
      return { x: random(2.5 * scale, width - 2.5 * scale), y: height - 2.5 * scale }
    case 2:
      return { x: 2.5 * scale, y: random(2.5 * scale, height - 2.5 * scale) }
    case 3:
      return { x: width - 2.5 * scale, y: random(2.5 * scale, height - 2.5 * scale) }
  }
}

function newClusters(n) {
  return Array(n).fill(null).map((e, i) => {
    let newPosition = getRandomBorderPosition()
    return {
      x: newPosition.x,
      y: newPosition.y,
      desiredX: newPosition.x,
      desiredY: newPosition.y,
      id: i,
      color: clearColors[i],
      xVel: 0,
      yVel: 0,
    }
  })
}

function sliderChange() {
  sliderLabel.elt.innerText = slider.value()
  sliderLabel.value(slider.value())
  clusters = newClusters(slider.value())
}

function drawPoints() {
  noStroke()
  for (e of points) {
    fill(e.color)
    ellipse(e.x, e.y, 2 * scale, 2 * scale)
  }
}

function updateDesiredClusterPositions() {
  let labels = {}
  for (cluster of clusters) {
    for (e of points) {
      distance = dist(e.x, e.y, cluster.x, cluster.y)
      if (labels[e.id]) {
        if (distance < labels[e.id].distance) {
          labels[e.id] = { px: e.x, py: e.y, distance: distance, cluster: cluster.id }
          e.color = cluster.color
        }
      } else {
        labels[e.id] = { px: e.x, py: e.y, distance: distance, cluster: cluster.id }
        e.color = cluster.color
      }
    }
  }
    for (cluster of clusters) {
      positions = Object.keys(labels).filter(x => labels[x].cluster == cluster.id).map(x => labels[x])
      if (positions.length != 0) {
        newPosition = positions.reduce((acc, cur) => { return { x: acc.x + cur.px / positions.length, y: acc.y + cur.py / positions.length } }, { x: 0, y: 0 })
        cluster.desiredX = newPosition.x
        cluster.desiredY = newPosition.y
      }
    }
}

function drawclusters() {
  stroke(0)
  fill([218, 165, 32, 150])
  for (e of clusters) {
    beginShape();
    vertex(e.x, e.y - 2 * scale);
    vertex(e.x - scale / 2, e.y - scale / 2);
    vertex(e.x - 2 * scale, e.y);
    vertex(e.x - scale / 2, e.y + scale / 2);
    vertex(e.x, e.y + 2 * scale);
    vertex(e.x + scale / 2, e.y + scale / 2);
    vertex(e.x + 2 * scale, e.y);
    vertex(e.x + scale / 2, e.y - scale / 2);
    vertex(e.x, e.y - 2 * scale);
    endShape();
  }
}

function drawBorder() {
  stroke(0)
  line(0, 0, 0, height)
  line(0, height, width, height)
  line(width, height, width, 0)
  line(width, 0, 0, 0)
}

function updateClusterPositions() {
  for (e of clusters) {
    e.xVel = (e.desiredX - e.x) / accelerationConstant
    e.yVel = (e.desiredY - e.y) / accelerationConstant
    e.x += e.xVel
    e.y += e.yVel
  }
}
