let canvas = document.getElementById('graph')
let ctx = canvas.getContext('2d')

function drawPixel (x, y) {
	ctx.fillRect(x, y, 1, 1)
}

function drawLine (x1, y1, x2, y2) {
	ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	ctx.stroke()
}

function drawGrid () {
	ctx.lineWidth = 1
	ctx.strokeStyle = "grey"
	drawLine(canvas.width/2, 0, canvas.width/2, canvas.height)
	drawLine(0, canvas.height/2, canvas.width, canvas.height/2)

	for (let i = 2; i < 10; i+=2) {
		drawPolarFunc(fi => {
			return i
		}, 40, 1, "grey")
	}
}

function parseInput () {
	let str = document.getElementById("data").value
	str = str
		  .split('\n')
		  .map(el => el.trim())

	let len = +str[0]
	let points = []

	for (let i = 1; i <= len; i++) {
		let point = str[i].split(' ')
		points.push({
			x: +point[0],
			y: +point[1],
		})
	}

	return points
}

function rotate (A, B, C) {
	return (B.x - A.x) * (C.y - B.y) - (B.y - A.y) * (C.x - B.x)
}

function drawPoints (points, scale = 100) {
	ctx.lineWidth = 2
	ctx.strokeStyle = "grey"
	ctx.fillStyle = "blue"
	for (let point of points) {
		ctx.beginPath()
		ctx.arc(point.x * scale, point.y * scale, 5, 0, 2*Math.PI)
		ctx.fill()
		ctx.stroke()
	}
}

function jarvisMarch (points) {
	let P = points.map((_, i) => i)

	for (let i = 1; i < P.length; i++) {
		if (points[P[i]].x < points[P[0]].x) {
			[ P[i], P[0] ] = [ P[0], P[i] ]
		}
	}

	let H = [ P[0] ]

	P.splice(0, 1)

	P.push(H[0])

	while (true) {
		let right = 0

		for (let i = 1; i < P.length; i++) {
			if (rotate(points[H[H.length - 1]], points[P[right]], points[P[i]]) < 0) {
				right = i
			}
		}

		if (P[right] == H[0]) {
			break
		} else {
			H.push(P[right])
			P.splice(right, 1)
		}
	}

	return H.map(i => points[i])
}

let scale = 70

function updateScale (el) {
	scale = +el.value

	main()
}

function main () {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	let points = parseInput()

	let marchPoints = jarvisMarch(points)

	let x1, y1, x2, y2
	for (let i = 1; i < marchPoints.length; i++) {
		x1 = marchPoints[i - 1].x
		y1 = marchPoints[i - 1].y
		x2 = marchPoints[i].x
		y2 = marchPoints[i].y

		drawLine(x1 * scale, y1 * scale, x2 * scale, y2 * scale)
	}

	x1 = marchPoints[0].x
	y1 = marchPoints[0].y

	drawLine(x1 * scale, y1 * scale, x2 * scale, y2 * scale)

	drawPoints(points, scale)
}
