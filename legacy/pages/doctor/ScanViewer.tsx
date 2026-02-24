import React from 'react'
import { Canvas } from '@react-three/fiber'

const ScanViewer: React.FC = () => {
  return (
    <div className="mt-4 glass p-4 rounded">
      <h3>3D Scan Viewer (placeholder)</h3>
      <div style={{ height: 360 }} className="mt-4 bg-black/40 rounded">
        <Canvas>
          {/* Placeholder canvas — integrate models later */}
        </Canvas>
      </div>
    </div>
  )
}

export default ScanViewer
