import React, { FC, useRef, useEffect, useState } from "react";// eslint-disable-next-line
import { Canvas, extend, useFrame, useThree, ReactThreeFiber} from "@react-three/fiber";
import { BufferGeometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
extend({ OrbitControls })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
    }
  }
};

interface Props {
    fileUrl: string;
    fileName: string;
};

export const STLViewer: FC<Props> = ({fileUrl, fileName}) => {
  const [geometry, setGeometry] = useState<BufferGeometry>() 
  
  const Controls = () => {
    const { camera, gl, invalidate } = useThree();
    const ref: any = useRef();
    useFrame(() => ref.current.update());// eslint-disable-next-line
    useEffect(() => void ref.current.addEventListener('change', invalidate), []);
    return <orbitControls ref={ref} minDistance={10} maxDistance={500} enableDamping enableZoom autoRotate args={[camera, gl.domElement]} />
  };

  useEffect(() => {
    console.log(fileUrl);
    const stlLoader = new STLLoader();
    stlLoader.load(fileUrl, geo => {
      setGeometry(geo);
     // console.log(geo);
    });// eslint-disable-next-line
  }, []);

  return (
    <>
    <Canvas style={{height: 800}}>
      <Controls />
      <ambientLight intensity={.5} />
      <spotLight position={[10, 10, 10]} angle={0.45} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <mesh geometry={geometry} >
        <meshStandardMaterial color={"green"} />
      </mesh>
    </Canvas>
    </>
  )
}