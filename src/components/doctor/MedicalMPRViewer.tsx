'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Maximize2, RotateCcw, Layers, LayoutGrid } from 'lucide-react';

interface MedicalMPRViewerProps {
    fileUrl: string | null;
    anomalyMaskUrl?: string;
    onClose: () => void;
}

export default function MedicalMPRViewer({ fileUrl, anomalyMaskUrl, onClose }: MedicalMPRViewerProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Container Refs
    const view3DRef = useRef<HTMLDivElement>(null);
    const viewAxialRef = useRef<HTMLDivElement>(null);
    const viewCoronalRef = useRef<HTMLDivElement>(null);
    const viewSagittalRef = useRef<HTMLDivElement>(null);

    // Slice States
    const [sliceX, setSliceX] = useState(25);
    const [sliceY, setSliceY] = useState(25);
    const [sliceZ, setSliceZ] = useState(25);
    const [maxDim, setMaxDim] = useState({ x: 50, y: 50, z: 50 });

    // Context to hold VTK objects for cleanup
    const [vtkContext, setVtkContext] = useState<any>(null);

    useEffect(() => {
        let isMounted = true;

        // Hoist GenericRenderWindows for cleanup
        let grw3D: any;
        let grwAxial: any;
        let grwCoronal: any;
        let grwSagittal: any;

        // Render Windows (for context)
        let renderWindow3D: any, renderer3D: any;
        let renderWindowAxial: any, rendererAxial: any;
        let renderWindowCoronal: any, rendererCoronal: any;
        let renderWindowSagittal: any, rendererSagittal: any;

        // Mappers for updating slices
        let mapperAxial: any, mapperCoronal: any, mapperSagittal: any;

        const initMPR = async () => {
            try {
                if (!isMounted) return;
                setIsLoading(true);

                // --- Imports ---
                const vtkGenericRenderWindow = (await import('@kitware/vtk.js/Rendering/Misc/GenericRenderWindow')).default;
                const vtkVolume = (await import('@kitware/vtk.js/Rendering/Core/Volume')).default;
                const vtkVolumeMapper = (await import('@kitware/vtk.js/Rendering/Core/VolumeMapper')).default;
                const vtkXMLImageDataReader = (await import('@kitware/vtk.js/IO/XML/XMLImageDataReader')).default;
                const vtkColorTransferFunction = (await import('@kitware/vtk.js/Rendering/Core/ColorTransferFunction')).default;
                const vtkPiecewiseFunction = (await import('@kitware/vtk.js/Common/DataModel/PiecewiseFunction')).default;

                const vtkImageMapper = (await import('@kitware/vtk.js/Rendering/Core/ImageMapper')).default;
                const vtkImageSlice = (await import('@kitware/vtk.js/Rendering/Core/ImageSlice')).default;
                const vtkInteractorStyleImage = (await import('@kitware/vtk.js/Interaction/Style/InteractorStyleImage')).default;

                // Simulation imports
                const vtkImageData = (await import('@kitware/vtk.js/Common/DataModel/ImageData')).default;
                const vtkDataArray = (await import('@kitware/vtk.js/Common/Core/DataArray')).default;

                if (!isMounted) return;

                // --- Data Loading ---
                let imageData: any;

                if (fileUrl) {
                    const reader = vtkXMLImageDataReader.newInstance();
                    await reader.setUrl(fileUrl);
                    await reader.loadData();
                    if (!isMounted) { reader.delete(); return; }
                    imageData = reader.getOutputData();
                } else {
                    // Simulation Fallback
                    console.warn("No VTI URL. Using Simulation.");
                    const id = vtkImageData.newInstance();
                    id.setDimensions([50, 50, 50]);
                    id.setSpacing([1, 1, 1]);
                    id.setOrigin([0, 0, 0]);
                    const values = new Float32Array(50 * 50 * 50);
                    let i = 0;
                    for (let z = 0; z < 50; z++) {
                        for (let y = 0; y < 50; y++) {
                            for (let x = 0; x < 50; x++) {
                                const dx = x - 25; const dy = y - 25; const dz = z - 25;
                                values[i] = (dx * dx + dy * dy + dz * dz < 400) ? 100 + Math.random() * 50 : 0;
                                i++;
                            }
                        }
                    }
                    const dataArray = vtkDataArray.newInstance({ name: 'Scalars', values: values, numberOfComponents: 1 });
                    id.getPointData().setScalars(dataArray);
                    imageData = id;
                }

                const dims = imageData.getDimensions();
                if (isMounted) {
                    setMaxDim({ x: dims[0], y: dims[1], z: dims[2] });
                    setSliceX(Math.floor(dims[0] / 2));
                    setSliceY(Math.floor(dims[1] / 2));
                    setSliceZ(Math.floor(dims[2] / 2));
                }

                // --- 3D View Setup ---
                grw3D = vtkGenericRenderWindow.newInstance({ background: [0.1, 0.1, 0.1] });
                if (view3DRef.current) {
                    grw3D.setContainer(view3DRef.current);
                    grw3D.resize();
                }
                renderer3D = grw3D.getRenderer();
                renderWindow3D = grw3D.getRenderWindow();

                const actor3D = vtkVolume.newInstance();
                const mapper3D = vtkVolumeMapper.newInstance();
                mapper3D.setInputData(imageData);
                actor3D.setMapper(mapper3D);

                // Presets (Bone-ish)
                const cfun = vtkColorTransferFunction.newInstance();
                cfun.addRGBPoint(-1000, 0.0, 0.0, 0.0);
                cfun.addRGBPoint(400, 1.0, 0.8, 0.5);
                cfun.addRGBPoint(3000, 1.0, 1.0, 1.0);
                const ofun = vtkPiecewiseFunction.newInstance();
                ofun.addPoint(-1000, 0.0);
                ofun.addPoint(300, 0.3);
                ofun.addPoint(1000, 0.9);
                actor3D.getProperty().setRGBTransferFunction(0, cfun);
                actor3D.getProperty().setScalarOpacity(0, ofun);

                renderer3D.addVolume(actor3D);
                renderer3D.resetCamera();
                renderWindow3D.render();

                // --- Helper for Slice Views ---
                const setupSliceView = (container: HTMLElement, mode: number) => {
                    const grw = vtkGenericRenderWindow.newInstance({ background: [0, 0, 0] });
                    grw.setContainer(container);
                    grw.resize();
                    const ren = grw.getRenderer();
                    const renWin = grw.getRenderWindow();

                    const iStyle = vtkInteractorStyleImage.newInstance();
                    grw.getInteractor().setInteractorStyle(iStyle);

                    const mapper = vtkImageMapper.newInstance();
                    mapper.setInputData(imageData);
                    mapper.setSlicingMode(mode);

                    const slice = vtkImageSlice.newInstance();
                    slice.setMapper(mapper);
                    slice.getProperty().setColorWindow(2000);
                    slice.getProperty().setColorLevel(500);

                    ren.addActor(slice);

                    const cam = ren.getActiveCamera();
                    if (mode === 2) { // Axial (Z)
                        cam.setPosition(0, 0, 1); cam.setViewUp(0, 1, 0);
                    } else if (mode === 1) { // Coronal (Y)
                        cam.setPosition(0, 1, 0); cam.setViewUp(0, 0, 1);
                    } else if (mode === 0) { // Sagittal (X)
                        cam.setPosition(1, 0, 0); cam.setViewUp(0, 0, 1);
                    }
                    cam.setParallelProjection(true);
                    ren.resetCamera();
                    renWin.render();

                    return { ren, renWin, mapper, grw };
                };

                // Initialize Views
                if (viewAxialRef.current) {
                    const obj = setupSliceView(viewAxialRef.current, 2);
                    renderWindowAxial = obj.renWin; rendererAxial = obj.ren; mapperAxial = obj.mapper;
                    grwAxial = obj.grw;
                }
                if (viewCoronalRef.current) {
                    const obj = setupSliceView(viewCoronalRef.current, 1);
                    renderWindowCoronal = obj.renWin; rendererCoronal = obj.ren; mapperCoronal = obj.mapper;
                    grwCoronal = obj.grw;
                }
                if (viewSagittalRef.current) {
                    const obj = setupSliceView(viewSagittalRef.current, 0);
                    renderWindowSagittal = obj.renWin; rendererSagittal = obj.ren; mapperSagittal = obj.mapper;
                    grwSagittal = obj.grw;
                }

                if (isMounted) {
                    setVtkContext({
                        grw3D, renderWindow3D, renderer3D,
                        renderWindowAxial, rendererAxial, mapperAxial,
                        renderWindowCoronal, rendererCoronal, mapperCoronal,
                        renderWindowSagittal, rendererSagittal, mapperSagittal
                    });
                    setIsLoading(false);
                } else {
                    // Cleanup if unmounted during init
                    if (grw3D) grw3D.delete();
                    if (grwAxial) grwAxial.delete();
                    if (grwCoronal) grwCoronal.delete();
                    if (grwSagittal) grwSagittal.delete();
                }

            } catch (e: any) {
                if (isMounted) {
                    console.error("MPR Init Error:", e);
                    setError(e.message);
                    setIsLoading(false);
                }
            }
        };

        initMPR();

        return () => {
            isMounted = false;
            // Cleanup
            try {
                if (grw3D) { grw3D.setContainer(null); grw3D.delete(); }
                if (grwAxial) { grwAxial.setContainer(null); grwAxial.delete(); }
                if (grwCoronal) { grwCoronal.setContainer(null); grwCoronal.delete(); }
                if (grwSagittal) { grwSagittal.setContainer(null); grwSagittal.delete(); }
            } catch (e) { }
        };
    }, [fileUrl]);

    // Update Slices when state changes
    useEffect(() => {
        if (!vtkContext) return;

        if (vtkContext.mapperAxial) {
            vtkContext.mapperAxial.setSlice(sliceZ);
            vtkContext.renderWindowAxial.render();
        }
        if (vtkContext.mapperCoronal) {
            vtkContext.mapperCoronal.setSlice(sliceY);
            vtkContext.renderWindowCoronal.render();
        }
        if (vtkContext.mapperSagittal) {
            vtkContext.mapperSagittal.setSlice(sliceX);
            vtkContext.renderWindowSagittal.render();
        }
    }, [sliceX, sliceY, sliceZ, vtkContext]);

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
            {/* Header */}
            <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900">
                <div className="flex items-center gap-2 text-blue-400">
                    <LayoutGrid className="w-5 h-5" />
                    <span className="font-bold">Pro MPR Viewer (ITK-SNAP Style)</span>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white">Close</button>
            </div>

            {/* Grid */}
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-1 p-1">

                {/* Top Left: Axial (Z) - Red */}
                <div className="relative border-2 border-red-500/50 rounded overflow-hidden bg-black group">
                    <div className="absolute top-2 left-2 text-red-500 font-mono text-xs z-10">AXIAL (Z: {sliceZ})</div>
                    <div ref={viewAxialRef} className="w-full h-full" />
                    <input
                        type="range" min="0" max={maxDim.z - 1} value={sliceZ}
                        onChange={(e) => setSliceZ(Number(e.target.value))}
                        className="absolute bottom-2 left-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                </div>

                {/* Top Right: Coronal (Y) - Green */}
                <div className="relative border-2 border-green-500/50 rounded overflow-hidden bg-black group">
                    <div className="absolute top-2 left-2 text-green-500 font-mono text-xs z-10">CORONAL (Y: {sliceY})</div>
                    <div ref={viewCoronalRef} className="w-full h-full" />
                    <input
                        type="range" min="0" max={maxDim.y - 1} value={sliceY}
                        onChange={(e) => setSliceY(Number(e.target.value))}
                        className="absolute bottom-2 left-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                </div>

                {/* Bottom Left: Sagittal (X) - Yellow */}
                <div className="relative border-2 border-yellow-500/50 rounded overflow-hidden bg-black group">
                    <div className="absolute top-2 left-2 text-yellow-500 font-mono text-xs z-10">SAGITTAL (X: {sliceX})</div>
                    <div ref={viewSagittalRef} className="w-full h-full" />
                    <input
                        type="range" min="0" max={maxDim.x - 1} value={sliceX}
                        onChange={(e) => setSliceX(Number(e.target.value))}
                        className="absolute bottom-2 left-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                </div>

                {/* Bottom Right: 3D - Blue */}
                <div className="relative border-2 border-blue-500/50 rounded overflow-hidden bg-black">
                    <div className="absolute top-2 left-2 text-blue-500 font-mono text-xs z-10">3D VOLUME</div>
                    <div ref={view3DRef} className="w-full h-full" />
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
