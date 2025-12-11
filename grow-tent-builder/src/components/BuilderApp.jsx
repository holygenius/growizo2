import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from './Layout';
import PresetSetSelector from '../features/PresetSetSelector';
import TentSelection from '../features/TentSelection';
import LightingSelection from '../features/LightingSelection';
import VentilationSelection from '../features/VentilationSelection';
import EnvironmentSelection from '../features/EnvironmentSelection';
import MediaSelection from '../features/MediaSelection';
import NutrientSelection from '../features/NutrientSelection';
import MonitoringSelection from '../features/MonitoringSelection';
import SummaryView from '../features/SummaryView';
import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';
import Navbar from './Navbar';
import Footer from './Footer';

function StepRenderer() {
    const { state } = useBuilder();
    const { currentStep } = state;

    // Scroll to top smoothly when step changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    switch (currentStep) {
        case 0: return <PresetSetSelector />;
        case 1: return <TentSelection />;
        case 2: return <LightingSelection />;
        case 3: return <VentilationSelection />;
        case 4: return <EnvironmentSelection />;
        case 5: return <MediaSelection />;
        case 6: return <NutrientSelection />;
        case 7: return <MonitoringSelection />;
        case 8: return <SummaryView />;
        default: return <PresetSetSelector />;
    }
}

export default function BuilderApp() {
    const { t } = useSettings();

    return (
        <>
            <Helmet>
                <title>{t('navBuilder')} | GroWizard</title>
            </Helmet>
            <Navbar />
            <Layout>
                <StepRenderer />
            </Layout>
            <Footer />
        </>
    );
}
