let canvas = document.getElementById('graph')
let ctx = canvas.getContext('2d')

let a = 1
let b = 1
let c = 0
let k = 1
let d = 1

function setValue (type, el) {
	let value = +el.value

	switch (type) {
		case 'a':
			a = value
		break

		case 'b':
			b = value
		break

		case 'c':
			c = value
		break

		case 'k':
			k = value
		break

		case 'd':
			d = value
		break
	}

	draw()
}

function DegToRad (angle) {
	return angle * (Math.PI / 180)
}

function drawPixel (x, y) {
	ctx.fillRect(x, y, 1, 1)
}

function drawLine (x1, y1, x2, y2) {
	ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	ctx.stroke()
}

let graphScale = 200

function drawPolarFunc (func, scale = 100, lineWidth = 2, strokeStyle = "grey") {
	let x1, y1, x2, y2

	let leftX = Infinity
	let rightX = -Infinity

	let topY = -Infinity
	let bottomY = Infinity

	if (func == graphFunc) {
		for (let fi = 1; fi <= 360; fi++) {
			let angle1 = DegToRad(fi)
			let r1 = func(angle1)

			let angle2 = DegToRad(fi - 1)
			let r2 = func(angle2)

			let x1 = r1*Math.cos(angle1)
			let y1 = r1*Math.sin(angle1)

			let x2 = r2*Math.cos(angle2)
			let y2 = r2*Math.sin(angle2)

			if (x1 < leftX) {
				leftX = x1
			}

			if (x2 < leftX) {
				leftX = x2
			}

			if (x1 > rightX) {
				rightX = x1
			}

			if (x2 > rightX) {
				rightX = x2
			}

			if (y1 > topY) {
				topY = y1
			}

			if (y2 > topY) {
				topY = y2
			}

			if (y1 < bottomY) {
				bottomY = y1
			}

			if (y2 < bottomY) {
				bottomY = y2
			}
		}

		let scaleX = rightX - leftX
		let scaleY = topY - bottomY

		graphScale = 400 / Math.max(scaleX, scaleY)
	}

	for (let fi = 1; fi <= 360; fi++) {
		let angle1 = DegToRad(fi)
		let r1 = func(angle1)

		let angle2 = DegToRad(fi - 1)
		let r2 = func(angle2)

		let x1 = r1*Math.cos(angle1) * scale + canvas.width / 2
		let y1 = r1*Math.sin(angle1) * scale + canvas.height / 2

		let x2 = r2*Math.cos(angle2) * scale + canvas.width / 2
		let y2 = r2*Math.sin(angle2) * scale + canvas.height / 2

		ctx.lineWidth = lineWidth
		ctx.strokeStyle = strokeStyle

		drawLine(x1, y1, x2, y2)
	}
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

function graphFunc (fi) {
	return a*Math.sin(b*fi + c) + k*Math.cos(d*fi)
}

function draw () {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	drawGrid()
	drawPolarFunc(graphFunc, graphScale, 4, "#C3B091")
}

draw()
