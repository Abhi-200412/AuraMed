'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Maximize2,
    RotateCcw,
    ZoomIn,
    ZoomOut,
    Sun,
    Contrast,
    Layers
} from 'lucide-react';

interface MedicalImageViewerProps {
    fileUrl: string;
    anomalyMaskUrl?: string;
}

export default function MedicalImageViewer({ fileUrl, anomalyMaskUrl }: MedicalImageViewerProps) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [showHeatmap, setShowHeatmap] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);

    // Reset view when file changes
    useEffect(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setBrightness(100);
        setContrast(100);
    }, [fileUrl]);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        const newScale = Math.min(Math.max(0.5, scale + delta), 4);
        setScale(newScale);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div className="relative w-full h-[500px] bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 group">

            {/* Main Image Container */}
            <div
                ref={containerRef}
                className="w-full h-full flex items-center justify-center cursor-move"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    className="relative transition-transform duration-75 ease-out"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    }}
                >
                    {/* Base Image */}
                    <img
                        src={fileUrl}
                        alt="Medical Scan"
                        className="max-w-full max-h-full object-contain pointer-events-none select-none"
                        style={{
                            filter: `brightness(${brightness}%) contrast(${contrast}%)`
                        }}
                    />

                    {/* AI Heatmap Overlay */}
                    {anomalyMaskUrl && showHeatmap && (
                        <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-60">
                            <img
                                src={`data:image/png;base64,${anomalyMaskUrl}`}
                                alt="AI Heatmap"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Controls Overlay (Top Right) */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => setScale(s => Math.min(s + 0.5, 4))}
                    className="p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg backdrop-blur-sm transition-all"
                    title="Zoom In"
                >
                    <ZoomIn className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setScale(s => Math.max(s - 0.5, 0.5))}
                    className="p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg backdrop-blur-sm transition-all"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-5 h-5" />
                </button>
                <button
                    onClick={() => {
                        setScale(1);
                        setPosition({ x: 0, y: 0 });
                        setBrightness(100);
                        setContrast(100);
                    }}
                    className="p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg backdrop-blur-sm transition-all"
                    title="Reset View"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`p-2 rounded-lg backdrop-blur-sm transition-all ${showHeatmap ? 'bg-primary/80 text-white' : 'bg-gray-800/80 text-gray-400'}`}
                    title="Toggle AI Heatmap"
                >
                    <Layers className="w-5 h-5" />
                </button>
            </div>

            {/* Image Adjustments (Bottom Center) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-gray-400" />
                    <input
                        type="range"
                        min="50"
                        max="150"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
                <div className="w-px h-4 bg-gray-700"></div>
                <div className="flex items-center gap-2">
                    <Contrast className="w-4 h-4 text-gray-400" />
                    <input
                        type="range"
                        min="50"
                        max="150"
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            </div>

            {/* Status Bar (Bottom Left) */}
            <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-700 flex items-center gap-2 text-xs text-gray-300">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>2D Enhanced View</span>
            </div>
        </div>
    );
}
