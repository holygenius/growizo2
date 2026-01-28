import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Grid, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { generatePPFDMap, calculateMetrics } from '../../utils/lightingUtils';

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

const VoxelGrid = ({ dimensions, activeLights, width, depth, height, unit, activeFilters, voxelOpacity = 0.3, onHover }) => {
    const meshRef = useRef();
    const [hoveredVoxel, setHoveredVoxel] = useState(null);

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
                        id: `${x}-${y}-${z}`,
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

    // Animation State with easing
    const [revealedCount, setRevealedCount] = useState(0);
    const [animationProgress, setAnimationProgress] = useState(0);

    // Easing function for smooth reveal
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    useFrame((state, delta) => {
        if (revealedCount < count) {
            // Calculate progress with easing
            const targetProgress = revealedCount / count;
            const newProgress = easeOutCubic(targetProgress);
            setAnimationProgress(newProgress);
            
            // Staggered reveal - faster start, slower end
            const speed = Math.max(15, (count - revealedCount) * 3 * delta);
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
        setAnimationProgress(0);
    }, [count, activeLights]);

    useEffect(() => {
        if (!meshRef.current) return;

        const tempObject = new THREE.Object3D();

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

    // Handle hover events
    const handlePointerMove = (e) => {
        e.stopPropagation();
        const instanceId = e.instanceId;
        if (instanceId !== undefined && data[instanceId]) {
            setHoveredVoxel(data[instanceId]);
            onHover?.(data[instanceId]);
        }
    };

    const handlePointerLeave = () => {
        setHoveredVoxel(null);
        onHover?.(null);
    };

    // Voxel Geometry size
    const boxSizeX = (width / resX) * 0.9;
    const boxSizeY = (height / resY) * 0.9;
    const boxSizeZ = (depth / resZ) * 0.9;

    return (
        <group>
            <instancedMesh
                ref={meshRef}
                args={[null, null, count]}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
            >
                <boxGeometry args={[boxSizeX, boxSizeY, boxSizeZ]} />
                <meshStandardMaterial
                    transparent
                    opacity={voxelOpacity}
                    roughness={0.1}
                    metalness={0.1}
                />
            </instancedMesh>
            {/* Tooltip for hovered voxel */}
            {hoveredVoxel && (
                <HtmlTooltip voxel={hoveredVoxel} />
            )}
        </group>
    );
};

// HTML Tooltip component for voxel data display
const HtmlTooltip = ({ voxel }) => {
    return (
        <group position={voxel.position}>
            <Html center distanceFactor={15}>
                <div style={{
                    background: 'rgba(0, 0, 0, 0.85)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {voxel.ppfd} μmol/m²/s
                    </div>
                    <div style={{ 
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: `rgb(${voxel.color.r * 255}, ${voxel.color.g * 255}, ${voxel.color.b * 255})`,
                        marginRight: '6px'
                    }} />
                    <span style={{ textTransform: 'capitalize' }}>
                        {getVoxelColor(voxel.ppfd).category}
                    </span>
                </div>
            </Html>
        </group>
    );
};

const GuideLines = ({ width, depth, height, unit, dimensions }) => {
    const scaleFactor = unit === 'cm' ? 0.1 : 3.0;
    const interval = unit === 'cm' ? 10 : 1; // 10cm or 1ft

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
                color="#ff6600"
                axis="x"
                position={[-width / 2, -0.1, depth / 2 + 0.5]}
                labelOffset={[0, 0, 0.5]}
            />

            {/* Depth (Z) - Left */}
            <RulerAxis
                size={depth}
                actualSize={dimensions.depth}
                color="#00ff66"
                axis="z"
                position={[-width / 2 - 0.5, -0.1, -depth / 2]}
                labelOffset={[-0.5, 0, 0]}
            />

            {/* Height (Y) - Back Left */}
            <RulerAxis
                size={height}
                actualSize={dimensions.height}
                color="#6600ff"
                axis="y"
                position={[-width / 2 - 0.5, 0, -depth / 2 - 0.5]}
                labelOffset={[-0.5, 0, 0]}
            />
        </group>
    );
};

const TentBox = ({ width, depth, height }) => {
    return (
        <group>
            <Grid
                position={[0, 0, 0]}
                args={[width, depth]}
                cellSize={width / 10}
                sectionSize={width / 2}
                fadeDistance={width * 2}
                sectionColor="#10b981"
                cellColor="#333"
                infiniteGrid
            />
            <lineSegments position={[0, height / 2, 0]}>
                <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
                <lineBasicMaterial color="#10b981" opacity={0.3} transparent />
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

/**
 * Displacement Map Visualization (Technique B from PDF)
 * Creates a 3D surface where elevation = PPFD intensity
 * Uses vertex shader for smooth displacement
 */
const DisplacementMap = ({ dimensions, activeLights, width, depth, height, unit, colorScale = 'growers' }) => {
    const meshRef = useRef();
    
    // Generate PPFD map
    const { ppfdMap, maxPPFD } = useMemo(() => {
        const widthFt = unit === 'cm' ? dimensions.width / 30.48 : dimensions.width;
        const depthFt = unit === 'cm' ? dimensions.depth / 30.48 : dimensions.depth;
        const heightFt = unit === 'cm' ? dimensions.height / 30.48 : dimensions.height;
        
        const resolution = 8;
        const map = generatePPFDMap(widthFt, depthFt, activeLights, resolution, heightFt);
        const metrics = calculateMetrics(map);
        
        return { ppfdMap: map, maxPPFD: Math.max(metrics.max, 1) };
    }, [dimensions, activeLights, unit]);
    
    // Create geometry with enough segments for smooth displacement
    const geometry = useMemo(() => {
        const segments = 32;
        return new THREE.PlaneGeometry(width, depth, segments, segments);
    }, [width, depth]);
    
    // Custom shader material for displacement
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                ppfdMap: { value: null },
                maxPPFD: { value: maxPPFD },
                displacementScale: { value: height * 0.5 }
            },
            vertexShader: `
                uniform sampler2D ppfdMap;
                uniform float maxPPFD;
                uniform float displacementScale;
                varying float vElevation;
                varying vec2 vUv;
                
                void main() {
                    vUv = uv;
                    
                    // Sample PPFD from texture (we'll create this from the map)
                    vec4 ppfdData = texture2D(ppfdMap, uv);
                    float ppfd = ppfdData.r * maxPPFD;
                    
                    // Normalize and apply displacement
                    float normalizedPPFD = ppfd / maxPPFD;
                    vElevation = normalizedPPFD * displacementScale;
                    
                    vec3 newPosition = position;
                    newPosition.z += vElevation;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform float maxPPFD;
                varying float vElevation;
                varying vec2 vUv;
                
                // Color function for heatmap
                vec3 getHeatmapColor(float value) {
                    // Grower's palette colors
                    vec3 c;
                    if (value < 0.15) {
                        c = mix(vec3(0.12, 0.12, 0.4), vec3(0.2, 0.4, 0.8), value / 0.15);
                    } else if (value < 0.3) {
                        c = mix(vec3(0.2, 0.4, 0.8), vec3(0.0, 0.7, 0.0), (value - 0.15) / 0.15);
                    } else if (value < 0.5) {
                        c = mix(vec3(0.0, 0.7, 0.0), vec3(0.7, 0.8, 0.0), (value - 0.3) / 0.2);
                    } else if (value < 0.7) {
                        c = mix(vec3(0.78, 0, 0..0), vec3(1.0, 0.55, 0.0), (value - 0.5) / 0.2);
                    } else if (value < 0.85) {
                        c = mix(vec3(1.0, 0.55, 0.0), vec3(1.0, 0.2, 0.0), (value - 0.7) / 0.15);
                    } else {
                        c = mix(vec3(1.0, 0.2, 0.0), vec3(1.0, 1.0, 1.0), (value - 0.85) / 0.15);
                    }
                    return c;
                }
                
                void main() {
                    float normalizedValue = vElevation / (displacementScale * 0.5);
                    vec3 color = getHeatmapColor(clamp(normalizedValue, 0.0, 1.0));
                    
                    // Add some lighting
                    float lighting = 0.5 + 0.5 * normalizedValue;
                    
                    gl_FragColor = vec4(color * lighting, 0.9);
                }
            `,
            side: THREE.DoubleSide,
            transparent: true
        });
    }, [maxPPFD, height]);
    
    // Create data texture from PPFD map
    useEffect(() => {
        if (!ppfdMap.length || !meshRef.current) return;
        
        const rows = ppfdMap.length;
        const cols = ppfdMap[0].length;
        const data = new Float32Array(rows * cols * 4);
        
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const idx = (r * cols + c) * 4;
                const ppfd = ppfdMap[r][c];
                data[idx] = ppfd / maxPPFD;     // R: normalized PPFD
                data[idx + 1] = 0;              // G
                data[idx + 2] = 0;              // B
                data[idx + 3] = 1;              // A
            }
        }
        
        const texture = new THREE.DataTexture(data, cols, rows, THREE.RGBAFormat, THREE.FloatType);
        texture.needsUpdate = true;
        
        meshRef.current.material.uniforms.ppfdMap.value = texture;
    }, [ppfdMap, maxPPFD]);
    
    return (
        <mesh ref={meshRef} geometry={geometry} material={shaderMaterial} rotation={[-Math.PI / 2, 0, 0]} />
    );
};

/**
 * Volumetric Light Beams (God Rays) - Technique C from PDF
 * Creates fake volumetric cone effects for each light source
 * Optimized for performance - no continuous frame updates
 */
const VolumetricLightBeams = React.memo(({ activeLights, width, depth, height, unit }) => {
    const beamsRef = useRef();
    
    // Reuse single geometry for all beams
    const beamGeometry = useMemo(() => {
        return new THREE.ConeGeometry(1, 1, 24, 1, true);
    }, []);
    
    // Create optimized shader material
    const beamMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(1.0, 0.95, 0.85) }
            },
            vertexShader: `
                varying vec3 vPosition;
                varying float vOpacity;
                
                void main() {
                    vPosition = position;
                    // Fade opacity based on Y position (top = opaque, bottom = transparent)
                    vOpacity = 1.0 - (position.y + 0.5);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                varying float vOpacity;
                
                void main() {
                    // Circular falloff from center with smoother edge
                    float dist = length(vec2(vPosition.x, vPosition.z));
                    float beamFalloff = 1.0 - smoothstep(0.0, 0.5, dist);
                    float alpha = vOpacity * beamFalloff * 0.08;
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        });
    }, []);
    
    // Calculate beam data once (no per-frame updates)
    const beamData = useMemo(() => {
        return activeLights.map((light) => {
            const pos = light.positions[0];
            const x = (pos.x - 0.5) * width;
            const z = (pos.y - 0.5) * depth;
            const beamHeight = height;
            const beamRadius = Math.tan((light.beamAngle || 120) * Math.PI / 360) * beamHeight;
            
            return {
                key: light.instanceId,
                position: [x, 0, z],
                scale: [beamRadius, beamHeight, beamRadius]
            };
        });
    }, [activeLights, width, depth, height]);
    
    return (
        <group ref={beamsRef} position={[0, height, 0]}>
            {beamData.map((beam) => (
                <group key={beam.key} position={beam.position}>
                    <mesh 
                        geometry={beamGeometry} 
                        material={beamMaterial}
                        rotation={[Math.PI, 0, 0]}
                        scale={beam.scale}
                    />
                </group>
            ))}
        </group>
    );
});

export default function PPFD3DScene({ 
    dimensions, 
    activeLights, 
    unit, 
    activeFilters, 
    showGuideLines = true, 
    voxelOpacity = 0.3,
    showDisplacement = false,
    showVolumetric = false
}) {
    const scaleFactor = unit === 'cm' ? 0.1 : 3.0;
    const width = (dimensions.width || 1) * scaleFactor;
    const depth = (dimensions.depth || 1) * scaleFactor;
    const height = (dimensions.height || 1) * scaleFactor;

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '500px', background: '#050505' }}>
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[width * 1.5, height * 1.2, width * 1.5]} fov={50} />
                <CameraRig targetPosition={[width * 1.5, height * 1.2, width * 1.5]} />
                <OrbitControls 
                    makeDefault 
                    minPolarAngle={0} 
                    maxPolarAngle={Math.PI}
                    enableDamping={true}
                    dampingFactor={0.05}
                    rotateSpeed={0.5}
                    minDistance={width * 0.5}
                    maxDistance={width * 4}
                />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                {/* Displacement Map Visualization */}
                {showDisplacement && (
                    <DisplacementMap
                        dimensions={dimensions}
                        activeLights={activeLights}
                        width={width}
                        depth={depth}
                        height={height}
                        unit={unit}
                    />
                )}

                {/* Volumetric Light Beams */}
                {showVolumetric && (
                    <VolumetricLightBeams
                        activeLights={activeLights}
                        width={width}
                        depth={depth}
                        height={height}
                        unit={unit}
                    />
                )}

                {/* Standard Voxel Grid (only show if not using displacement) */}
                {!showDisplacement && (
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
                )}

                {showGuideLines && (
                    <GuideLines
                        width={width}
                        depth={depth}
                        height={height}
                        unit={unit}
                        dimensions={dimensions}
                    />
                )}

                <TentBox width={width} depth={depth} height={height} />
                <Lights activeLights={activeLights} width={width} depth={depth} height={height} />
                <axesHelper args={[5]} />
            </Canvas>
        </div>
    );
}
