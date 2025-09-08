import { useEffect, useRef } from "react";
import { SceneManager } from "./scene.ts";

const ThreeManager = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sceneManager = SceneManager.getInstance();
    sceneManager.init(canvas);

  }, []);


  return <div ref={canvasRef} id="threeContainer">
    </div>;
};

export default ThreeManager;
