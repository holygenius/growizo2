import { useEffect } from 'react';
import Layout from './Layout';
import TentSelection from '../features/TentSelection';
import LightingSelection from '../features/LightingSelection';
import VentilationSelection from '../features/VentilationSelection';
import EnvironmentSelection from '../features/EnvironmentSelection';
import MediaSelection from '../features/MediaSelection';
import NutrientSelection from '../features/NutrientSelection';
import MonitoringSelection from '../features/MonitoringSelection';
import SummaryView from '../features/SummaryView';
import { useBuilder } from '../context/BuilderContext';
import SettingsBar from './SettingsBar';

function StepRenderer() {
    const { state } = useBuilder();
    const { currentStep } = state;

    // Scroll to top smoothly when step changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    switch (currentStep) {
        case 1: return <TentSelection />;
        case 2: return <LightingSelection />;
        case 3: return <VentilationSelection />;
        case 4: return <EnvironmentSelection />;
        case 5: return <MediaSelection />;
        case 6: return <NutrientSelection />;
        case 7: return <MonitoringSelection />;
        case 8: return <SummaryView />;
        default: return <TentSelection />;
    }
}

export default function BuilderApp() {
    return (
        <>
            <SettingsBar />
            <Layout>
                <StepRenderer />
            </Layout>
        </>
    );
}
