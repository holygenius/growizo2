import React from 'react';
import './BloomingLeaves.css';

export default function BloomingLeaves() {
    return (
        <div className="blooming-leaves-container">
            <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="blooming-leaves-svg">
                {/* LEAF 1: Oak (Rounded Lobes) */}
                <g className="leaf-group leaf-1">
                    <defs>
                        <path id="path-1" d="M100,20 C105,20 120,30 118,50 C116,60 110,65 110,65 C110,65 130,75 130,95 C130,115 115,125 115,125 C115,125 125,135 120,150 C115,165 100,180 100,180 L100,20 Z" />
                    </defs>
                    <use href="#path-1" className="light-shadow" />
                    <use href="#path-1" className="light-base" transform="translate(200, 0) scale(-1, 1)" />
                    <path d="M100,20 L100,180 M100,65 L110,60 M100,95 L120,90 M100,135 L115,130 M100,65 L90,60 M100,95 L80,90 M100,135 L85,130" className="light-vein" />
                </g>

                {/* LEAF 2: Nasturtium (Circular/Peltate) */}
                <g className="leaf-group leaf-2">
                    <defs>
                        <path id="path-2" d="M100,40 A40,40 0 0,1 100,120 Z" />
                    </defs>
                    <use href="#path-2" className="dark-shadow" />
                    <use href="#path-2" className="dark-base" transform="translate(200, 0) scale(-1, 1)" />
                    <path d="M100,180 L100,80" className="dark-vein" strokeWidth="2" />
                    <path d="M100,80 L135,80 M100,80 L125,55 M100,80 L125,105" className="dark-vein" strokeWidth="1.5" />
                    <path d="M100,80 L65,80 M100,80 L75,55 M100,80 L75,105" className="dark-vein" strokeWidth="1.5" />
                </g>

                {/* LEAF 3: Lanceolate (Long & Thin) */}
                <g className="leaf-group leaf-3">
                    <defs>
                        <path id="path-3" d="M100,10 C102,15 125,70 125,100 C125,140 100,180 100,180 L100,10 Z" />
                    </defs>
                    <use href="#path-3" className="light-shadow" />
                    <use href="#path-3" className="light-base" transform="translate(200, 0) scale(-1, 1)" />
                    <path d="M100,10 L100,180" className="light-vein" />
                </g>

                {/* LEAF 4: Maple (Sharp 5-point Star) */}
                <g className="leaf-group leaf-4">
                    <defs>
                        <path id="path-4" d="M100,20 L108,45 L135,40 L120,70 L145,85 L120,105 L125,130 L100,180 L100,20 Z" />
                    </defs>
                    <use href="#path-4" className="dark-shadow" />
                    <use href="#path-4" className="dark-base" transform="translate(200, 0) scale(-1, 1)" />
                    <path d="M100,45 L100,180 M100,70 L135,40 M100,105 L145,85 M100,130 L125,130" className="dark-vein" />
                    <path d="M100,70 L65,40 M100,105 L55,85 M100,130 L75,130" className="dark-vein" />
                </g>

                {/* LEAF 5: Palmate (5 Separate Leaflets) */}
                <g className="leaf-group leaf-5">
                    <g transform="translate(100, 120)">
                        <path d="M0,0 Q8,-30 0,-70 Q-8,-30 0,0" className="dark-shadow" />
                        <path d="M0,0 Q-8,-30 0,-70 Q8,-30 0,0" className="dark-base" transform="scale(-1,1)" />
                        <g transform="rotate(30)">
                            <path d="M0,0 Q6,-25 0,-60 Q-6,-25 0,0" className="dark-shadow" />
                            <path d="M0,-60 Q-6,-25 0,0" className="dark-base" />
                        </g>
                        <g transform="rotate(75)">
                            <path d="M0,0 Q5,-20 0,-45 Q-5,-20 0,0" className="dark-shadow" />
                            <path d="M0,-45 Q-5,-20 0,0" className="dark-base" />
                        </g>
                        <g transform="rotate(-30)">
                            <path d="M0,0 Q6,-25 0,-60 Q-6,-25 0,0" className="dark-base" />
                            <path d="M0,-60 Q-6,-25 0,0" className="dark-shadow" transform="scale(-1,1)"/>
                        </g>
                        <g transform="rotate(-75)">
                            <path d="M0,0 Q5,-20 0,-45 Q-5,-20 0,0" className="dark-base" />
                            <path d="M0,-45 Q-5,-20 0,0" className="dark-shadow" transform="scale(-1,1)"/>
                        </g>
                    </g>
                    <path d="M100,120 L100,180" className="dark-vein" strokeWidth="3"/>
                </g>

                {/* LEAF 6: Serrated Lanceolate (Sawtooth) */}
                <g className="leaf-group leaf-6">
                    <defs>
                        <path id="path-6" d="M100,20 L105,35 L102,40 L115,55 L110,60 L125,80 L118,85 L128,110 L120,115 L125,135 L100,180 L100,20 Z" />
                    </defs>
                    <use href="#path-6" className="light-shadow" />
                    <use href="#path-6" className="light-base" transform="translate(200, 0) scale(-1, 1)" />
                    <path d="M100,20 L100,180" className="light-vein" />
                </g>

                {/* LEAF 7: Fiddle/Deep Oak (Curvy) */}
                <g className="leaf-group leaf-7">
                    <defs>
                        <path id="path-7" d="M100,20 C110,25 115,35 105,45 C102,48 125,50 130,65 C135,80 115,90 115,90 C115,90 135,100 130,120 C125,135 100,180 100,180 L100,20 Z" />
                    </defs>
                    <use href="#path-7" className="dark-shadow" />
                    <use href="#path-7" className="dark-base" transform="translate(200, 0) scale(-1, 1)" />
                    <path d="M100,20 L100,180 M100,65 L120,60 M100,110 L120,105 M100,65 L80,60 M100,110 L80,105" className="dark-vein" />
                </g>

                {/* LEAF 8: Pinnate Small (Acacia Style) */}
                <g className="leaf-group leaf-8">
                    <path d="M100,20 L100,180" className="light-vein" strokeWidth="3" />
                    <ellipse cx="115" cy="40" rx="6" ry="12" transform="rotate(40 115 40)" className="light-shadow" />
                    <ellipse cx="118" cy="65" rx="6" ry="12" transform="rotate(40 118 65)" className="light-shadow" />
                    <ellipse cx="118" cy="90" rx="6" ry="12" transform="rotate(40 118 90)" className="light-shadow" />
                    <ellipse cx="115" cy="115" rx="6" ry="12" transform="rotate(40 115 115)" className="light-shadow" />
                    <ellipse cx="112" cy="140" rx="6" ry="12" transform="rotate(40 112 140)" className="light-shadow" />
                    <ellipse cx="85" cy="40" rx="6" ry="12" transform="rotate(-40 85 40)" className="light-base" />
                    <ellipse cx="82" cy="65" rx="6" ry="12" transform="rotate(-40 82 65)" className="light-base" />
                    <ellipse cx="82" cy="90" rx="6" ry="12" transform="rotate(-40 82 90)" className="light-base" />
                    <ellipse cx="85" cy="115" rx="6" ry="12" transform="rotate(-40 85 115)" className="light-base" />
                    <ellipse cx="88" cy="140" rx="6" ry="12" transform="rotate(-40 88 140)" className="light-base" />
                    <ellipse cx="100" cy="20" rx="6" ry="12" className="light-base" />
                    <path d="M100,8 A6,12 0 0,1 100,32 Z" className="light-shadow" fillOpacity="0.5"/>
                </g>

                {/* LEAF 9: Holly (Sharp Spikes) */}
                <g className="leaf-group leaf-9">
                    <defs>
                        <path id="path-9" d="M100,20 L105,30 Q110,25 115,35 Q108,45 125,55 Q115,70 130,80 Q115,90 125,105 Q110,115 120,130 Q110,140 100,180 L100,20 Z" />
                    </defs>
                    <use href="#path-9" className="light-base" />
                    <use href="#path-9" className="light-shadow" transform="translate(200, 0) scale(-1, 1)" />
                    <path d="M100,20 L100,180 M100,55 L115,50 M100,80 L120,75 M100,105 L115,100 M100,130 L110,125" className="light-vein" />
                    <path d="M100,55 L85,50 M100,80 L80,75 M100,105 L85,100 M100,130 L90,125" className="light-vein" />
                </g>

                {/* LEAF 10: Monstera (Split Leaf) */}
                <g className="leaf-group leaf-10">
                    <defs>
                        <path id="path-10" d="M100,30 Q130,30 140,50 Q130,55 125,60 Q145,65 145,85 Q135,90 120,95 Q140,105 135,125 Q130,130 115,135 Q120,150 100,170 L100,30 Z" />
                    </defs>
                    <use href="#path-10" className="dark-base" />
                    <use href="#path-10" className="dark-shadow" transform="translate(200, 0) scale(-1, 1)" />
                    <path d="M100,30 L100,170" className="dark-vein" />
                    <path d="M100,55 L125,50 M100,90 L130,85 M100,130 L120,125" className="dark-vein" />
                    <path d="M100,55 L75,50 M100,90 L70,85 M100,130 L80,125" className="dark-vein" />
                </g>

                {/* LEAF 11: Pinnate Large (Ash/Walnut) */}
                <g className="leaf-group leaf-11">
                    <path d="M100,20 L100,180" className="dark-vein" strokeWidth="3"/>
                    <path d="M100,20 Q115,35 100,55 Q85,35 100,20" className="dark-base" />
                    <path d="M100,20 Q115,35 100,55 Z" className="dark-shadow" />
                    <path d="M100,65 Q130,55 135,70 Q130,90 100,85 Z" className="dark-shadow" />
                    <path d="M100,65 Q70,55 65,70 Q70,90 100,85 Z" className="dark-base" />
                    <path d="M100,95 Q135,85 140,100 Q135,120 100,115 Z" className="dark-shadow" />
                    <path d="M100,95 Q65,85 60,100 Q65,120 100,115 Z" className="dark-base" />
                    <path d="M100,125 Q130,115 135,130 Q130,150 100,145 Z" className="dark-shadow" />
                    <path d="M100,125 Q70,115 65,130 Q70,150 100,145 Z" className="dark-base" />
                </g>

                {/* LEAF 12: Cordate (Heart Shape) */}
                <g className="leaf-group leaf-12">
                    <defs>
                        <path id="path-12" d="M100,60 C100,60 110,35 130,35 C150,35 160,65 145,100 C130,135 100,170 100,170 L100,60 Z" />
                    </defs>
                    <use href="#path-12" className="dark-shadow" />
                    <use href="#path-12" className="dark-base" transform="translate(200, 0) scale(-1, 1)" />
                    <path d="M100,60 L100,170" className="dark-vein" />
                    <path d="M100,90 C120,80 130,70 140,60 M100,120 C120,110 130,100 135,90 M100,150 L120,140" className="dark-vein" />
                    <path d="M100,90 C80,80 70,70 60,60 M100,120 C80,110 70,100 65,90 M100,150 L80,140" className="dark-vein" />
                </g>

                {/* THE FLOWERPOT */}
                <g id="flowerpot">
                    <ellipse cx="100" cy="170" rx="35" ry="8" className="pot-soil" />
                    <path d="M65,170 L75,215 L125,215 L135,170 Z" className="pot-base" />
                    <path d="M100,170 L100,215 L125,215 L135,170 Z" className="pot-shadow" opacity="0.3" />
                    <path d="M60,165 L140,165 L138,175 L62,175 Z" className="pot-rim" />
                    <path d="M60,165 L140,165 L138,168 L62,168 Z" fill="#FFB088" opacity="0.5" />
                </g>
            </svg>
        </div>
    );
}
