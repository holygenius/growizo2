import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BuilderProvider } from './context/BuilderContext';
import { SettingsProvider } from './context/SettingsContext';
import { OnboardingProvider } from './context/OnboardingContext';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import BuilderApp from './components/BuilderApp';

function App() {
  return (
    <SettingsProvider>
      <OnboardingProvider>
        <BuilderProvider>
          <BrowserRouter basename="/grow-tent-builder-web-app">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/builder" element={<BuilderApp />} />
            </Routes>
          </BrowserRouter>
        </BuilderProvider>
      </OnboardingProvider>
    </SettingsProvider>
  );
}

export default App;

