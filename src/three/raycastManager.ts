import * as THREE from 'three';

export class RaycastManager {
  private static instance: RaycastManager; // must be static
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private hoverObject: THREE.Object3D | null;
  private clickObject: THREE.Object3D | null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.scene = scene;
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoverObject = null;
    this.clickObject = null;
  }

  public static getInstance(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera
  ) {
    if (!RaycastManager.instance) {
      RaycastManager.instance = new RaycastManager(scene, camera);
    }
    return RaycastManager.instance;
  }

  public click(e: MouseEvent) {
    console.log('click', e, this.clickObject);
    // this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    // this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    // if (this.hoverIntersects.length > 0) {
    //   this.hoverIntersects[0].object.userData.leaveHover();
    // }
    // this.raycaster.setFromCamera(this.mouse, this.camera);
    // this.hoverIntersects = this.raycaster.intersectObjects(this.scene.children);
    // if (this.hoverIntersects.length > 0) {
    //   this.hoverIntersects[0].object.userData.setHover();
    // }
  }

  public hover(event: MouseEvent) {
    this.mouse.x = (event.clientY / window.innerHeight) * 2 - 1;
    this.mouse.y = (event.clientX / window.innerWidth) * 2 - 1;
    console.log(this.mouse);

    if (this.hoverObject) {
      this.hoverObject.userData.class.removeHover();
    }
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.hoverObject = this.findIteractable(
      this.raycaster.intersectObjects(this.scene.children)
    );
    if (this.hoverObject) {
      this.hoverObject.userData.class.setHover();
    }
  }

  private findIteractable(intersects: THREE.Intersection[]) {
    if (intersects.length < 0) return null;
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.type === 'PolarGridHelper') continue;
      const objList = [];
      let obj: THREE.Object3D | null = intersects[i].object;
      while (obj) {
        if (obj.userData.canBeClicked) {
          console.warn(
            'found clickable',
            objList,
            obj.userData.class.id,
            obj.userData.class.type
          );
          return obj;
        }
        objList.push(obj);
        obj = obj.parent;
      }
      break;
      // return null;
    }
    return null;
  }
}
