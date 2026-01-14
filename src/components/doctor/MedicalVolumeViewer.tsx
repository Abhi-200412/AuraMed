'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Maximize2, RotateCcw, Layers, LayoutGrid } from 'lucide-react';
import MedicalMPRViewer from './MedicalMPRViewer';

// Dynamic import for VTK to avoid SSR issues
// We'll handle the actual VTK logic inside a useEffect

interface MedicalVolumeViewerProps {
    fileUrl: string | null; // URL to the .nii.gz file
    anomalyMaskUrl?: string; // Optional URL to the anomaly heatmap
}

export default function MedicalVolumeViewer({ fileUrl, anomalyMaskUrl }: MedicalVolumeViewerProps) {
    const vtkContainerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [vtkContext, setVtkContext] = useState<any>(null);
    const [showMPR, setShowMPR] = useState(false);

    useEffect(() => {
        let isMounted = true;
        let renderWindow: any;
        let renderer: any;
        let genericRenderWindow: any;
        let actor: any;
        let mapper: any;

        const initVTK = async () => {
            try {
                if (!isMounted) return;
                setIsLoading(true);

                // Dynamically import VTK modules
                const vtkGenericRenderWindow = (await import('@kitware/vtk.js/Rendering/Misc/GenericRenderWindow')).default;
                const vtkVolume = (await import('@kitware/vtk.js/Rendering/Core/Volume')).default;
                const vtkVolumeMapper = (await import('@kitware/vtk.js/Rendering/Core/VolumeMapper')).default;
                const vtkXMLImageDataReader = (await import('@kitware/vtk.js/IO/XML/XMLImageDataReader')).default;
                const vtkColorTransferFunction = (await import('@kitware/vtk.js/Rendering/Core/ColorTransferFunction')).default;
                const vtkPiecewiseFunction = (await import('@kitware/vtk.js/Common/DataModel/PiecewiseFunction')).default;

                // For Simulation Fallback
                const vtkImageData = (await import('@kitware/vtk.js/Common/DataModel/ImageData')).default;
                const vtkDataArray = (await import('@kitware/vtk.js/Common/Core/DataArray')).default;

                // Check if container still exists after async imports
                if (!isMounted || !vtkContainerRef.current) {
                    return;
                }

                // Setup Render Window
                genericRenderWindow = vtkGenericRenderWindow.newInstance({
                    background: [0.05, 0.05, 0.05],
                });

                genericRenderWindow.setContainer(vtkContainerRef.current);
                genericRenderWindow.resize();

                renderer = genericRenderWindow.getRenderer();
                renderWindow = genericRenderWindow.getRenderWindow();

                actor = vtkVolume.newInstance();
                mapper = vtkVolumeMapper.newInstance();

                if (fileUrl) {
                    // --- Load Main Volume (VTI) ---
                    const reader = vtkXMLImageDataReader.newInstance();
                    await reader.setUrl(fileUrl);
                    await reader.loadData();

                    if (!isMounted) {
                        reader.delete();
                        return;
                    }

                    const imageData = reader.getOutputData();
                    mapper.setInputData(imageData);
                } else {
                    // --- FALLBACK: SIMULATED VOLUME ---
                    console.warn("No VTI URL provided. Using simulated volume.");
                    setError("Using Simulation Mode (Backend VTK missing). Run via Docker for real 3D.");

                    const id = vtkImageData.newInstance();
                    id.setDimensions([50, 50, 50]);
                    id.setSpacing([1, 1, 1]);
                    id.setOrigin([0, 0, 0]);

                    const values = new Float32Array(50 * 50 * 50);
                    let i = 0;
                    for (let z = 0; z < 50; z++) {
                        for (let y = 0; y < 50; y++) {
                            for (let x = 0; x < 50; x++) {
                                const dx = x - 25;
                                const dy = y - 25;
                                const dz = z - 25;
                                if (dx * dx + dy * dy + dz * dz < 400) {
                                    values[i] = 100 + Math.random() * 50;
                                } else {
                                    values[i] = 0;
                                }
                                i++;
                            }
                        }
                    }
                    const dataArray = vtkDataArray.newInstance({ name: 'Scalars', values: values, numberOfComponents: 1 });
                    id.getPointData().setScalars(dataArray);
                    mapper.setInputData(id);
                }

                actor.setMapper(mapper);

                // CT Bone/Soft Tissue Preset
                const cfun = vtkColorTransferFunction.newInstance();
                cfun.addRGBPoint(-1000, 0.0, 0.0, 0.0);
                cfun.addRGBPoint(400, 1.0, 0.8, 0.5); // Bone-ish
                cfun.addRGBPoint(3000, 1.0, 1.0, 1.0);

                const ofun = vtkPiecewiseFunction.newInstance();
                ofun.addPoint(-1000, 0.0);
                ofun.addPoint(0, 0.0);
                ofun.addPoint(300, 0.3);
                ofun.addPoint(1000, 0.9);

                actor.getProperty().setRGBTransferFunction(0, cfun);
                actor.getProperty().setScalarOpacity(0, ofun);
                actor.getProperty().setInterpolationTypeToLinear();

                renderer.addVolume(actor);

                // --- Load Anomaly Mask (Optional) ---
                if (anomalyMaskUrl) {
                    try {
                        const maskReader = vtkXMLImageDataReader.newInstance();
                        await maskReader.setUrl(anomalyMaskUrl);
                        await maskReader.loadData();

                        if (isMounted) {
                            const maskData = maskReader.getOutputData();
                            const maskActor = vtkVolume.newInstance();
                            const maskMapper = vtkVolumeMapper.newInstance();
                            maskMapper.setInputData(maskData);
                            maskActor.setMapper(maskMapper);

                            // Red Glow for Anomaly
                            const maskCfun = vtkColorTransferFunction.newInstance();
                            maskCfun.addRGBPoint(0, 0.0, 0.0, 0.0);
                            maskCfun.addRGBPoint(0.5, 1.0, 0.0, 0.0); // Red
                            maskCfun.addRGBPoint(1, 1.0, 0.0, 0.0);

                            const maskOfun = vtkPiecewiseFunction.newInstance();
                            maskOfun.addPoint(0, 0.0);
                            maskOfun.addPoint(0.5, 0.5); // Semi-transparent
                            maskOfun.addPoint(1, 0.8);

                            maskActor.getProperty().setRGBTransferFunction(0, maskCfun);
                            maskActor.getProperty().setScalarOpacity(0, maskOfun);

                            renderer.addVolume(maskActor);
                        }
                    } catch (maskErr) {
                        console.warn("Failed to load anomaly mask:", maskErr);
                    }
                }

                if (isMounted) {
                    renderer.resetCamera();
                    renderWindow.render();
                    setVtkContext({ genericRenderWindow, renderWindow, renderer });
                    setIsLoading(false);
                }
            } catch (e: any) {
                if (isMounted) {
                    console.error("VTK Init Error:", e);
                    setError(e.message || "Failed to initialize 3D Viewer");
                    setIsLoading(false);
                }
            }
        };

        initVTK();

        return () => {
            isMounted = false;
            if (genericRenderWindow) {
                try {
                    genericRenderWindow.setContainer(null);
                    genericRenderWindow.delete();
                } catch (cleanupErr) {
                    // Ignore cleanup errors
                }
            }
        };
    }, [fileUrl]);

    return (
        <>
            <div className="relative w-full h-[500px] bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                {/* VTK Container */}
                <div ref={vtkContainerRef} className="absolute inset-0 w-full h-full" />

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                        <div className="text-center">
                            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-2" />
                            <p className="text-primary font-mono">Loading 3D Volume...</p>
                        </div>
                    </div>
                )}

                {/* Error Overlay */}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
                        <div className="text-center text-red-400">
                            <p className="font-bold mb-2">3D Rendering Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Controls Overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                        className="p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg backdrop-blur-sm transition-all"
                        title="Reset View"
                        onClick={() => {
                            if (vtkContext) {
                                vtkContext.renderer.resetCamera();
                                vtkContext.renderWindow.render();
                            }
                        }}
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    <button
                        className="p-2 bg-blue-600/80 hover:bg-blue-500 text-white rounded-lg backdrop-blur-sm transition-all"
                        title="Switch to Pro MPR View (ITK-SNAP Style)"
                        onClick={() => setShowMPR(true)}
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                        className="p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg backdrop-blur-sm transition-all"
                        title="Fullscreen"
                    >
                        <Maximize2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Status Bar */}
                <div className="absolute bottom-4 left-4 right-4 bg-gray-900/80 backdrop-blur-md p-3 rounded-lg border border-gray-700 flex justify-between items-center text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span>GPU Acceleration: Active</span>
                    </div>
                    <div>
                        Resolution: 50x50x50 (Demo)
                    </div>
                </div>
            </div>

            {/* MPR Viewer Overlay */}
            {showMPR && (
                <MedicalMPRViewer
                    fileUrl={fileUrl}
                    anomalyMaskUrl={anomalyMaskUrl}
                    onClose={() => setShowMPR(false)}
                />
            )}
        </>
    );
}
