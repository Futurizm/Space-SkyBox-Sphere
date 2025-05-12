import { Canvas, useThree, useLoader, useFrame, extend } from "@react-three/fiber"
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

extend({ OrbitControls })

function CameraControls() {
  const {
    camera,
    gl: { domElement },
  } = useThree()

  const controls = useRef()
  useFrame(() => controls.current.update())
  return (
    <orbitControls 
      ref={controls}
      args={[camera, domElement]}
      autoRotate={true}
      enableZoom={false}
      enablePan={false}
      enableRotate={false}
      autoRotateSpeed={1}
    />
  )
}

function Skybox() {
  const { gl, scene } = useThree();
  const texture = useLoader(THREE.TextureLoader, "/7.png");

  useEffect(() => {
    // Указываем, что текстура в sRGB
    texture.encoding = THREE.sRGBEncoding;

    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024);
    cubeRenderTarget.fromEquirectangularTexture(gl, texture);
    scene.background = cubeRenderTarget.texture;

    return () => (scene.background = null);
  }, [gl, scene, texture]);

  return null;
}

function Sphere() {

  const { scene, gl } = useThree()

  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    format: THREE.RGBAFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter
  })
  const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget)
  cubeCamera.position.set(0, 0, 0)
  scene.add(cubeCamera)

  useFrame(() => cubeCamera.update(gl, scene))

  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow>
      <sphereGeometry attach={"geometry"} args={[2, 32, 32]} />
      <meshBasicMaterial 
        attach={"material"}
        envMap={cubeCamera.renderTarget.texture}
        color={"white"} 
        roughness={0.1}
        metalness={1}
      />
    </mesh>
  )
}

function App() {

  return (
    <Canvas>
      <Sphere />
      <Skybox />
      <CameraControls />
    </Canvas>
  )
}

export default App
