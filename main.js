let cnv
let points = []
let k = 0
let slider
let sliderLabel
let clusters = []
let scale = 8
let pointIdCounter = 0
let clearColors = [
  [25, 25, 112, 100],
  [255, 0, 255, 100],
  [255, 69, 0, 100],
  [0, 255, 0, 100],
  [0, 255, 255, 100],
]
let accelerationConstant = 10

function setup() {
  cnv = createCanvas(550, 550)
  slider = createSlider(2, 5, 2)
  slider.style('width', '150px')
  slider.input(sliderChange)
  sliderLabel = createP(slider.value())
  sliderLabel.style('font-size', '20px')
  sliderLabel.style('font-family', 'Helvetica Neue')
  sliderLabel.style('display', 'inline-block')
  sliderLabel.style('margin-left', '10px')
  sliderChange()
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
  points.push({ x: x_, y: y_, color: [255, 0, 255, 100], id: pointIdCounter++ })
}

function mouseClicked() {
  if (0 <= mouseX && mouseX < width && 0 <= mouseY && mouseY < height) {
    addPoint(mouseX, mouseY)
  }
}

function newClusters(n) {
  return Array(n).fill(null).map((e, i) => {
    let ranX = floor(random(2 * scale, width - 2 * scale))
    let ranY = floor(random(2 * scale, width - 2 * scale))
    return {
      x: ranX,
      y: ranY,
      desiredX: ranX,
      desiredY: ranY,
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
  if (points.length) {
    for (cluster of clusters) {
      positions = Object.keys(labels).filter(x => labels[x].cluster == cluster.id).map(x => labels[x])
      if (positions.length) {
        newPosition = positions.reduce((acc, cur) => { return { x: acc.x + cur.px / positions.length, y: acc.y + cur.py / positions.length } }, { x: 0, y: 0 })
        cluster.desiredX = newPosition.x
        cluster.desiredY = newPosition.y
      }
    }
  }
  console.log(clusters)
}

function drawclusters() {
  stroke(0)
  fill([218, 165, 32, 100])
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
