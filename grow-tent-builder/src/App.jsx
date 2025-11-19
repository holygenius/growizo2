import { useState } from 'react';
import Layout from './components/Layout';
import TentSelection from './features/TentSelection';
import LightingSelection from './features/LightingSelection';
import VentilationSelection from './features/VentilationSelection';
import EnvironmentSelection from './features/EnvironmentSelection';
import MediaSelection from './features/MediaSelection';
import NutrientSelection from './features/NutrientSelection';
import MonitoringSelection from './features/MonitoringSelection';
import SummaryView from './features/SummaryView';
import { BuilderProvider, useBuilder } from './context/BuilderContext';
import { SettingsProvider } from './context/SettingsContext';
import SettingsBar from './components/SettingsBar';

function StepRenderer() {
  const { state } = useBuilder();
  const { currentStep } = state;

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

function App() {
  return (
    <SettingsProvider>
      <BuilderProvider>
        <SettingsBar />
        <Layout>
          <StepRenderer />
        </Layout>
      </BuilderProvider>
    </SettingsProvider>
  );
}

export default App;
