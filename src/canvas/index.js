import {
	Scene,
	WebGLRenderer,
	PerspectiveCamera,
	AmbientLight,
	DirectionalLight,
	SphereGeometry,
	PointsMaterial,
	Points,
	TorusKnotGeometry,
	BufferAttribute,
	Vector4,
} from "three";
import * as TWEEN from "@tweenjs/tween.js";

class Canvas {
	constructor(selector = "body", backgroundColor = 0x000) {
		// Create Attributes
		this.selector = selector;
		this.backgroundColor = backgroundColor;
		this.scene = new Scene();
		this.camera = new PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
		this.ambientLight = new AmbientLight(0xffa1ff, 0.75);
		this.directionalLight = new DirectionalLight(0xffffff);
		this.geometries = [
			new SphereGeometry(2, 32, 32),
			new TorusKnotGeometry(1, 3, 100, 16),
		];
		this.count = 0;

		const sphereGeo = new SphereGeometry(2, 32, 32);
		const ver = [];
		for (let i = 0; i < 32 * 32; i++) {
			ver.push(
				(Math.random() - 0.5) * 20,
				(Math.random() - 0.5) * 20,
				(Math.random() - 0.5) * 20
			);
		}
		const vertices = new Float32Array(ver);
		const sphereMap = new PointsMaterial({
			color: 0xffffff,
			size: 0.025,
		});
		sphereGeo.setAttribute("position", new BufferAttribute(vertices, 3));
		this.geometries.push(sphereGeo.clone());
		this.sphere = new Points(sphereGeo, sphereMap);

		// Set Attributes
		this.renderer.setClearColor(this.backgroundColor, 0);
		this.camera.position.z = 10;
		this.directionalLight.position.y = 5;
		this.directionalLight.position.z = 2;

		// Add attributes to scene
		this.scene.add(this.sphere);
		this.scene.add(this.ambientLight);
		this.scene.add(this.directionalLight);

		// Others
		document
			.querySelector(this.selector)
			.appendChild(this.renderer.domElement);
		
		window.addEventListener("resize", this.resize.bind(this));
		window.addEventListener("mousemove", this.mouseMove.bind(this));
		window.addEventListener("click", this.mouseClick.bind(this));
		window.addEventListener("scroll", this.scroll.bind(this));
		this.resize();
		this.init(this.geometries[this.count]);
	}

	

	init(geo) {
		const vertices = this.sphere.geometry.attributes["position"];
		const toVertices = geo.attributes["position"];

		for (var i = 0; i < vertices.count; i += 1) {
			const vector2 = new Vector4(
				toVertices.getX(i),
				toVertices.getY(i),
				toVertices.getZ(i),
				toVertices.getW(i)
			);
			new TWEEN.Tween({
				x: vertices.getX(i),
				y: vertices.getY(i),
				z: vertices.getZ(i),
				w: vertices.getW(i),
				i,
			})
				.to(
					{
						x: vector2.x,
						y: vector2.y,
						z: vector2.z,
						w: vector2.w,
					},
					1000
				)
				.easing(TWEEN.Easing.Quadratic.InOut)
				.onUpdate((vec) => {
					vertices.setXYZW(vec.i, vec.x, vec.y, vec.z, vec.w);
					vertices.needsUpdate = true;
				})
				.start();
		}
	}

	resize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	mouseClick(e) {
		this.count += 1;
		this.count = this.count % this.geometries.length;
		this.init(this.geometries[this.count]);
	}

	mouseMove(e) {
		const x = (e.clientX / window.innerWidth - 0.5) * 2;
		const y = (e.clientY / window.innerHeight - 0.5) * 2;

		this.sphere.rotation.y = x * Math.PI;
		this.sphere.rotation.x = y * Math.PI;
	}

	scroll(e) {
		this.camera.position.y = (-window.scrollY * 15) / window.innerHeight;
	}

	render() {
		this.renderer.render(this.scene, this.camera);
		TWEEN.update();
	}

	animate() {
		this.render();
		window.requestAnimationFrame(this.animate.bind(this));
	}
}

export default Canvas;
