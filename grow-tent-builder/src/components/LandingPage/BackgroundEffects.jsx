import React from 'react';

export default function BackgroundEffects({ mousePos }) {
    return (
        <div className="landing-bg">
            <div className="glow-orb orb-1" style={{
                transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`
            }} />
            <div className="glow-orb orb-2" style={{
                transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`
            }} />
            <div className="grid-overlay" />
        </div>
    );
}
