import * as THREE from 'three';

// sets a cube as floor of the map with scale x: 10, y: 1, z: 0.1 (flat)

export class Environement {
  private scene: THREE.Scene | null;
  private floorGroup: THREE.Group;
  private static instance: Environement;

  private constructor() {
    this.scene = null;
    this.floorGroup = new THREE.Group();
    this.floorGroup.add(this.createMesh());
  }

  public getMesh() {
    return this.floorGroup;
  }

  private createMesh() {
    const geometry = new THREE.BoxGeometry(10, 1, 0.1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      roughness: 0.5,
      metalness: 0.5,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -0.05;
    mesh.rotation.x = Math.PI / 2;
    mesh.receiveShadow = true;
    return mesh;
  }

  public init(scene: THREE.Scene) {
    this.scene = scene;
    this.scene.add(this.floorGroup);
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Environement();
    }
    return this.instance;
  }
}
