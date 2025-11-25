import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import Navbar from '../Navbar';
import Footer from '../Footer';

const ToolsPage = () => {
    const { t } = useSettings();

    const tools = [
        {
            id: 'cost',
            icon: '⚡',
            titleKey: 'toolCostTitle',
            descKey: 'toolCostDesc',
            path: '/tools/electricity-cost-calculator',
            color: 'from-yellow-400 to-orange-500'
        },
        {
            id: 'unit',
            icon: '💧',
            titleKey: 'toolUnitTitle',
            descKey: 'toolUnitDesc',
            path: '/tools/unit-converter',
            color: 'from-blue-400 to-cyan-500'
        },
        {
            id: 'co2',
            icon: '🌫️',
            titleKey: 'toolCo2Title',
            descKey: 'toolCo2Desc',
            path: '/tools/co2-calculator',
            color: 'from-gray-400 to-gray-600'
        },
        {
            id: 'ppfd',
            icon: '🌡️',
            titleKey: 'toolPpfdTitle',
            descKey: 'toolPpfdDesc',
            path: '/tools/ppfd-heatmap',
            color: 'from-red-400 to-red-600'
        }
    ];

    return (
        <div className="page-container">
            <Navbar />
            <div className="tools-content">
                <div className="tools-header">
                    <h1>{t('toolsTitle')}</h1>
                    <p>{t('toolsSubtitle')}</p>
                </div>

                <div className="tools-grid">
                    {tools.map((tool) => (
                        <Link to={tool.path} key={tool.id} className="tool-card">
                            <div className="card-icon">{tool.icon}</div>
                            <h3>{t(tool.titleKey)}</h3>
                            <p>{t(tool.descKey)}</p>
                            <div className="card-arrow">→</div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />

            <style>{`
                .page-container {
                    min-height: 100vh;
                    background: #0a0a0a;
                    color: white;
                    display: flex;
                    flex-direction: column;
                }

                .tools-content {
                    flex: 1;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                    padding: 4rem 1.5rem;
                }

                .tools-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }

                .tools-header h1 {
                    font-size: 3rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .tools-header p {
                    color: #94a3b8;
                    font-size: 1.25rem;
                }

                .tools-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                }

                .tool-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1.5rem;
                    padding: 2.5rem;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }

                .tool-card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(16, 185, 129, 0.3);
                }

                .card-icon {
                    font-size: 3rem;
                    margin-bottom: 1.5rem;
                }

                .tool-card h3 {
                    font-size: 1.5rem;
                    color: white;
                    margin-bottom: 0.5rem;
                    font-weight: 700;
                }

                .tool-card p {
                    color: #94a3b8;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }

                .card-arrow {
                    margin-top: auto;
                    color: #10b981;
                    font-size: 1.5rem;
                    transition: transform 0.3s ease;
                }

                .tool-card:hover .card-arrow {
                    transform: translateX(5px);
                }
            `}</style>
        </div>
    );
};

export default ToolsPage;
