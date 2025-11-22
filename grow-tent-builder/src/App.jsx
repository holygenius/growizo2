import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BuilderProvider } from './context/BuilderContext';
import { SettingsProvider } from './context/SettingsContext';
import { OnboardingProvider } from './context/OnboardingContext';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import BuilderApp from './components/BuilderApp';
import BlogList from './components/Blog/BlogList';
import BlogPost from './components/Blog/BlogPost';
import ToolsPage from './components/Tools/ToolsPage';
import CostCalculator from './components/Tools/CostCalculator';
import UnitConverter from './components/Tools/UnitConverter';
import CO2Calculator from './components/Tools/CO2Calculator';

function App() {
  return (
    <SettingsProvider>
      <OnboardingProvider>
        <BuilderProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/builder" element={<BuilderApp />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/tools/electricity-cost-calculator" element={<CostCalculator />} />
              <Route path="/tools/unit-converter" element={<UnitConverter />} />
              <Route path="/tools/co2-calculator" element={<CO2Calculator />} />
            </Routes>
          </BrowserRouter>
        </BuilderProvider>
      </OnboardingProvider>
    </SettingsProvider>
  );
}

export default App;
