import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Grid, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useSettings } from '../../context/SettingsContext';

// Color scale helper
const getVoxelColor = (ppfd) => {
    const color = new THREE.Color();
    let opacity = 0.1; // Base opacity
    let category = 'low';

    if (ppfd < 200) {
        const t = ppfd / 200;
        color.setRGB(0.12 + (0.2 * t), 0.12 + (0.2 * t), 0.12 + (0.2 * t));
        opacity = 0.05;
        category = 'low';
    } else if (ppfd < 400) {
        const t = (ppfd - 200) / 200;
        color.setRGB(0, 0.2 * t, 0.6 + (0.4 * t));
        opacity = 0.1;
        category = 'seedling';
    } else if (ppfd < 600) {
        const t = (ppfd - 400) / 200;
        color.setRGB(0.2 * (1 - t), 0.6 + (0.4 * t), 0.2 * (1 - t));
        opacity = 0.2;
        category = 'veg';
    } else if (ppfd < 900) {
        const t = (ppfd - 600) / 300;
        color.setRGB(0.8 + (0.2 * t), 0.8 + (0.2 * (1 - t * 0.5)), 0);
        opacity = 0.4;
        category = 'flower';
    } else if (ppfd < 1200) {
        const t = (ppfd - 900) / 300;
        color.setRGB(1, 0.4 * (1 - t), 0);
        opacity = 0.6;
        category = 'high';
    } else {
        color.setRGB(1, 1, 1);
        opacity = 0.8;
        category = 'extreme';
    }
    return { color, opacity, category };
};

const VoxelGrid = ({ dimensions, activeLights, width, depth, height, unit, activeFilters, voxelOpacity = 0.3 }) => {
    const meshRef = useRef();

    // Grid Resolution (Number of cubes per axis)
    const resX = 12;
    const resZ = 12;
    const resY = 10;

    const { data, count } = useMemo(() => {
        if (!dimensions.width || !dimensions.height) return { data: [], count: 0 };

        const widthFt = unit === 'cm' ? dimensions.width / 30.48 : dimensions.width;
        const depthFt = unit === 'cm' ? dimensions.depth / 30.48 : dimensions.depth;
        const totalHeightFt = unit === 'cm' ? dimensions.height / 30.48 : dimensions.height;

        const voxels = [];

        // Loop Y (Height layers)
        for (let y = 0; y < resY; y++) {
            const layerY = y / (resY - 1); // 0 to 1
            const distanceFromLight = totalHeightFt * (1 - layerY);

            for (let x = 0; x < resX; x++) {
                for (let z = 0; z < resZ; z++) {
                    // Voxel Center Coordinates (Physical Feet)
                    const vx = (x + 0.5) * (widthFt / resX);
                    const vz = (z + 0.5) * (depthFt / resZ);

                    // Calculate PPFD manually for this point
                    let ppfd = 0;
                    activeLights.forEach(light => {
                        const quantity = light.quantity || 1;
                        const positions = light.positions || [];
                        for (let i = 0; i < quantity; i++) {
                            const pos = positions[i] || { x: 0.5, y: 0.5 };
                            const lx = pos.x * widthFt;
                            const lz = pos.y * depthFt;

                            const dx = vx - lx;
                            const dz = vz - lz;
                            const dy = distanceFromLight;

                            const dist = Math.sqrt(dx * dx + dz * dz + dy * dy);
                            const theta = Math.acos(dy / dist);

                            const beamAngle = (light.beamAngle || 120) * Math.PI / 180;
                            if (theta > beamAngle / 2) continue;

                            let ppfdAtHeight = light.maxPPFD;
                            if (light.recommendedHeight) {
                                const recH = light.recommendedHeight / 12;
                                const effectiveHeight = Math.max(0.5, distanceFromLight);
                                const scale = Math.pow(recH / effectiveHeight, 2);
                                ppfdAtHeight = light.maxPPFD * scale;
                            }

                            ppfd += ppfdAtHeight * (dy / dist);
                        }
                    });

                    // Visual Position (World Units)
                    const posX = (x / resX) * width - width / 2 + (width / resX) / 2;
                    const posZ = (z / resZ) * depth - depth / 2 + (depth / resZ) / 2;
                    const posY = (y / resY) * height + (height / resY) / 2;

                    const { color, opacity, category } = getVoxelColor(ppfd);

                    // Filter Logic
                    if (activeFilters && !activeFilters[category]) {
                        continue; // Skip this voxel if its category is unchecked
                    }

                    voxels.push({
                        position: [posX, posY, posZ],
                        color: color,
                        opacity: opacity,
                        ppfd: Math.round(ppfd)
                    });
                }
            }
        }

        // Sort voxels by PPFD (descending) for the reveal animation
        voxels.sort((a, b) => b.ppfd - a.ppfd);

        return { data: voxels, count: voxels.length };
    }, [dimensions, activeLights, unit, width, depth, height, activeFilters]);

    // Animation State
    const [revealedCount, setRevealedCount] = useState(0);

    useFrame((state, delta) => {
        if (revealedCount < count) {
            // Animate reveal: Reveal ~20% of remaining or min 10 per frame
            // Adjust speed factor (2.5) to control duration
            const speed = Math.max(10, (count - revealedCount) * 2.5 * delta);
            const nextCount = Math.min(count, revealedCount + Math.ceil(speed));
            setRevealedCount(nextCount);

            // Update the mesh count directly for performance
            if (meshRef.current) {
                meshRef.current.count = nextCount;
            }
        }
    });

    useEffect(() => {
        // Reset animation when data changes
        setRevealedCount(0);
    }, [count, activeLights]); // Trigger restart on light change too

    useEffect(() => {
        if (!meshRef.current) return;

        const tempObject = new THREE.Object3D();

        // Only update matrices for the revealed count
        // But we need to set ALL matrices initially or at least the ones we want to show
        // Actually, instancedMesh draws 'count' instances. We can control 'count' prop on the mesh itself.
        // So we just need to ensure the matrices are set in the correct sorted order (which they are in 'data')

        for (let i = 0; i < count; i++) {
            const { position, color } = data[i];
            tempObject.position.set(...position);
            tempObject.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObject.matrix);
            meshRef.current.setColorAt(i, color);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

    }, [data, count]);

    // Voxel Geometry size
    const boxSizeX = (width / resX) * 0.9;
    const boxSizeY = (height / resY) * 0.9;
    const boxSizeZ = (depth / resZ) * 0.9;

    return (
        <instancedMesh
            ref={meshRef}
            args={[null, null, count]} // Initialize with MAX count
        >
            <boxGeometry args={[boxSizeX, boxSizeY, boxSizeZ]} />
            <meshStandardMaterial
                transparent
                opacity={voxelOpacity}
                roughness={0.1}
                metalness={0.1}
            />
        </instancedMesh>
    );
};

const GuideLines = ({ width, depth, height, unit, dimensions, theme }) => {
    const scaleFactor = unit === 'cm' ? 0.1 : 3.0;
    const interval = unit === 'cm' ? 10 : 1; // 10cm or 1ft

    // Text color based on theme
    const textColor = theme === 'light' ? '#1f2937' : '#ffffff';

    const RulerAxis = ({ size, actualSize, color, axis, position, labelOffset }) => {
        const ticks = [];
        const count = Math.floor(actualSize / interval);

        for (let i = 0; i <= count; i++) {
            const val = i * interval;
            if (val === 0 && i !== 0) continue;
            const pos = val * scaleFactor;

            // Tick Geometry
            let tickArgs = [0.05, 0.05, 0.05];
            let tickPos = [0, 0, 0];

            if (axis === 'x') {
                tickArgs = [0.02, 0.02, 0.3];
                tickPos = [pos, 0, 0.15];
            } else if (axis === 'z') {
                tickArgs = [0.3, 0.02, 0.02];
                tickPos = [-0.15, 0, pos];
            } else if (axis === 'y') {
                tickArgs = [0.3, 0.02, 0.02];
                tickPos = [-0.15, pos, 0];
            }

            ticks.push(
                <group key={i}>
                    <mesh position={tickPos}>
                        <boxGeometry args={tickArgs} />
                        <meshBasicMaterial color={color} />
                    </mesh>
                    <Text
                        position={[
                            axis === 'x' ? pos : labelOffset[0],
                            axis === 'y' ? pos : labelOffset[1],
                            axis === 'z' ? pos : labelOffset[2]
                        ]}
                        fontSize={0.25}
                        color={color}
                        anchorX="center"
                        anchorY="middle"
                        rotation={axis === 'z' ? [-Math.PI / 2, 0, 0] : [0, 0, 0]}
                    >
                        {val}
                    </Text>
                </group>
            );
        }

        // Main Line Geometry
        let lineArgs = [0.05, 0.05, 0.05];
        let linePos = [0, 0, 0];

        if (axis === 'x') {
            lineArgs = [size, 0.05, 0.05];
            linePos = [size / 2, 0, 0];
        } else if (axis === 'z') {
            lineArgs = [0.05, 0.05, size];
            linePos = [0, 0, size / 2];
        } else if (axis === 'y') {
            lineArgs = [0.05, size, 0.05];
            linePos = [0, size / 2, 0];
        }

        return (
            <group position={position}>
                <mesh position={linePos}>
                    <boxGeometry args={lineArgs} />
                    <meshBasicMaterial color={color} />
                </mesh>
                {ticks}
                {/* Axis Label */}
                <Text
                    position={[
                        axis === 'x' ? size + 0.5 : 0,
                        axis === 'y' ? size + 0.5 : 0,
                        axis === 'z' ? size + 0.5 : 0
                    ]}
                    fontSize={0.3}
                    color={color}
                    fontWeight="bold"
                >
                    {unit}
                </Text>
            </group>
        );
    };

    return (
        <group>
            {/* Width (X) - Front */}
            <RulerAxis
                size={width}
                actualSize={dimensions.width}
                color={theme === 'light' ? '#d97706' : '#ff6600'}
                axis="x"
                position={[-width / 2, -0.1, depth / 2 + 0.5]}
                labelOffset={[0, 0, 0.5]}
            />

            {/* Depth (Z) - Left */}
            <RulerAxis
                size={depth}
                actualSize={dimensions.depth}
                color={theme === 'light' ? '#059669' : '#00ff66'}
                axis="z"
                position={[-width / 2 - 0.5, -0.1, -depth / 2]}
                labelOffset={[-0.5, 0, 0]}
            />

            {/* Height (Y) - Back Left */}
            <RulerAxis
                size={height}
                actualSize={dimensions.height}
                color={theme === 'light' ? '#7c3aed' : '#6600ff'}
                axis="y"
                position={[-width / 2 - 0.5, 0, -depth / 2 - 0.5]}
                labelOffset={[-0.5, 0, 0]}
            />
        </group>
    );
};

const TentBox = ({ width, depth, height, theme }) => {
    // Theme colors
    const cellColor = theme === 'light' ? '#e2e8e6' : '#333';
    const sectionColor = theme === 'light' ? '#10b981' : '#10b981';

    return (
        <group>
            <Grid
                position={[0, 0, 0]}
                args={[width, depth]}
                cellSize={width / 10}
                sectionSize={width / 2}
                fadeDistance={width * 2}
                sectionColor={sectionColor}
                cellColor={cellColor}
                infiniteGrid
            />
            <lineSegments position={[0, height / 2, 0]}>
                <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
                <lineBasicMaterial color={theme === 'light' ? '#059669' : '#10b981'} opacity={0.3} transparent />
            </lineSegments>
        </group>
    );
};

const Lights = ({ activeLights, width, depth, height }) => {
    return (
        <group position={[0, height, 0]}>
            {activeLights.map((light) => {
                const pos = light.positions[0];
                const x = (pos.x - 0.5) * width;
                const z = (pos.y - 0.5) * depth;
                return (
                    <group key={light.instanceId} position={[x, 0, z]} rotation={[0, -pos.rotation * Math.PI / 180, 0]}>
                        <mesh>
                            <boxGeometry args={[light.physicalWidth || 1, 0.2, light.physicalDepth || 1]} />
                            <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
                        </mesh>
                        <spotLight
                            intensity={2}
                            angle={light.beamAngle ? light.beamAngle * Math.PI / 360 : Math.PI / 3}
                            penumbra={0.5}
                            distance={height * 1.5}
                            color="#fff"
                            target-position={[0, -height, 0]}
                        />
                    </group>
                );
            })}
        </group>
    );
};

const CameraRig = ({ targetPosition }) => {
    const { camera } = useThree();
    const initialPos = useRef(null);
    const [isAnimating, setIsAnimating] = useState(true);
    const startTime = useRef(Date.now());

    useEffect(() => {
        // Set initial position further away
        if (!initialPos.current) {
            initialPos.current = camera.position.clone();
            // Start further out and higher
            camera.position.set(
                targetPosition[0] * 2.5,
                targetPosition[1] * 2.5,
                targetPosition[2] * 2.5
            );
        }
    }, []);

    useFrame((state, delta) => {
        if (!isAnimating) return;

        const elapsed = (Date.now() - startTime.current) / 1000;
        if (elapsed > 2.0) { // Stop after 2 seconds
            setIsAnimating(false);
            return;
        }

        // Smoothly lerp to target
        camera.position.lerp(new THREE.Vector3(...targetPosition), 2.5 * delta);
        camera.lookAt(0, 0, 0); // Always look at center
    });

    return null;
};

export default function PPFD3DScene({ dimensions, activeLights, unit, activeFilters, showGuideLines = true, voxelOpacity = 0.3 }) {
    const { theme } = useSettings();
    const scaleFactor = unit === 'cm' ? 0.1 : 3.0;
    const width = (dimensions.width || 1) * scaleFactor;
    const depth = (dimensions.depth || 1) * scaleFactor;
    const height = (dimensions.height || 1) * scaleFactor;

    // Background color based on theme
    // Dark: #050505, Light: #ECF0EE (Soft Sage Surface from walkthrough)
    const bgColor = theme === 'light' ? '#ECF0EE' : '#050505';

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '500px', background: bgColor, transition: 'background-color 0.3s' }}>
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[width * 1.5, height * 1.2, width * 1.5]} fov={50} />
                <CameraRig targetPosition={[width * 1.5, height * 1.2, width * 1.5]} />
                <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI} />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <VoxelGrid
                    dimensions={dimensions}
                    activeLights={activeLights}
                    width={width}
                    depth={depth}
                    height={height}
                    unit={unit}
                    activeFilters={activeFilters}
                    voxelOpacity={voxelOpacity}
                />

                {showGuideLines && (
                    <GuideLines
                        width={width}
                        depth={depth}
                        height={height}
                        unit={unit}
                        dimensions={dimensions}
                        theme={theme}
                    />
                )}

                <TentBox width={width} depth={depth} height={height} theme={theme} />
                <Lights activeLights={activeLights} width={width} depth={depth} height={height} />
                <axesHelper args={[5]} />
            </Canvas>
        </div>
    );
}
