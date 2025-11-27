import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation, useNavigate } from 'react-router-dom';
import { BuilderProvider } from './context/BuilderContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
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
import PPFDHeatMapTool from './components/Tools/PPFDHeatMapTool';
import FeedingSchedule from './components/Tools/FeedingSchedule';

import { Helmet } from 'react-helmet-async';

import NotFound from './components/NotFound';
import { useEffect } from 'react';

// Component to handle language sync and validation
const LanguageWrapper = ({ children }) => {
  const { lang } = useParams();
  const { setLanguage, language } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (lang && (lang === 'en' || lang === 'tr')) {
      if (lang !== language) {
        setLanguage(lang);
      }
    } else if (lang) {
      // Invalid language param, redirect to 404 or default
      // For now, let's redirect to default language
      // But wait, if it's not en/tr, maybe it's a 404?
      // Actually, the route path is /:lang/* so anything first segment is lang
      // If it's not en or tr, we should probably treat it as 404 or redirect
      // But for simplicity, let's just force EN if invalid
      // navigate(`/en${location.pathname.substring(location.pathname.indexOf('/', 1))}`, { replace: true });
    }
  }, [lang, language, setLanguage]);

  // If lang is not valid, render NotFound (or redirect)
  if (lang && lang !== 'en' && lang !== 'tr') {
    return <NotFound />;
  }

  return children;
};

// Root redirect component
const RootRedirect = () => {
  const { language } = useSettings();
  return <Navigate to={`/${language}`} replace />;
};

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route path="/:lang/*" element={
        <LanguageWrapper>
          <Routes>
            <Route path="" element={<LandingPage />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="builder" element={<BuilderApp />} />
            <Route path="grow-tent-setup-builder" element={<Navigate to="../builder" replace />} />
            <Route path="buyume-cadiri-kurulum-olusturucu" element={<Navigate to="../builder" replace />} />
            <Route path="blog" element={<BlogList />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="tools" element={<ToolsPage />} />
            <Route path="tools/electricity-cost-calculator" element={<CostCalculator />} />
            <Route path="tools/unit-converter" element={<UnitConverter />} />
            <Route path="tools/co2-calculator" element={<CO2Calculator />} />
            <Route path="tools/ppfd-heatmap" element={<PPFDHeatMapTool />} />
            <Route path="tools/feeding-schedule" element={<Navigate to="../feeding/biobizz" replace />} />
            <Route path="feeding/biobizz" element={<FeedingSchedule />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LanguageWrapper>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <OnboardingProvider>
          <BuilderProvider>
            <Helmet>
              <title>GroWizard</title>
              <meta name="description" content="Plan and optimize your perfect grow tent setup with advanced PPFD lighting simulation" />
            </Helmet>
            <AppContent />
          </BuilderProvider>
        </OnboardingProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}

export default App;
