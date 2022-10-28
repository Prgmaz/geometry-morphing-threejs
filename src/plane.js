import * as THREE from "three";

class Plane {
	constructor(canvas) {
		this.canvas = canvas;
		this.frames = 0;

		this.initialize();
	}

	initialize() {
		const ver = [];
		this.length = 128;
		const scale = 50;
		for (let i = 0; i < this.length; i++) {
			for (let j = 0; j < this.length; j++) {
				ver.push(
					scale * (i / this.length - 0.5),
					0,
					scale * (j / this.length - 0.5)
				);
			}
		}
		const vertices = new Float32Array(ver);
		const geometry = new BufferGeometry();
		geometry.setAttribute("position", new BufferAttribute(vertices, 3));
		this.plane = new Points(
			geometry,
			new PointsMaterial({ color: 0x000, size: 0.075, opacity: 1 })
		);
		this.plane.position.y = -20;

		this.canvas.scene.add(this.plane);
	}

	animate() {
		const vertices = this.plane.geometry.attributes["position"];
		var index = 0;

		for (var i = 0; i < this.length; i += 1) {
			for (var j = 0; j < this.length; j += 1) {
				const obj = {
					x: vertices.getX(index),
					y: vertices.getY(index),
					z: vertices.getZ(index),
					w: vertices.getW(index),
				};
				obj.y =
					Math.sin(((i + this.frames + index) * 0.003 + index) * 2) +
					Math.sin(((j + this.frames + index) * 0.0025 + index) * 2);

				vertices.setXYZW(index, obj.x, obj.y, obj.z, obj.w);
				index++;
			}
		}
		vertices.needsUpdate = true;
		this.frames += 1;
	}
}
