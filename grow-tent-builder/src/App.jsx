import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation, useNavigate } from 'react-router-dom';
import { BuilderProvider } from './context/BuilderContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { OnboardingProvider } from './context/OnboardingContext';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import BuilderApp from './components/BuilderApp';
import BlogList from './components/Blog/BlogList';
import BlogPost from './components/Blog/BlogPost';
import ProfilePage from './pages/ProfilePage';
import ToolsPage from './components/Tools/ToolsPage';
import CostCalculator from './components/Tools/CostCalculator';
import UnitConverter from './components/Tools/UnitConverter';
import CO2Calculator from './components/Tools/CO2Calculator';
import PPFDHeatMapTool from './components/Tools/PPFDHeatMapTool';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import BrandsManager from './pages/admin/catalog/BrandsManager';
import CategoriesManager from './pages/admin/catalog/CategoriesManager';
import ProductsManager from './pages/admin/catalog/ProductsManager';
import VendorsManager from './pages/admin/catalog/VendorsManager';
import VendorProductsManager from './pages/admin/catalog/VendorProductsManager';
import FeedingSchedulesManager from './pages/admin/growth/FeedingSchedulesManager';
import FeedingScheduleProductsManager from './pages/admin/growth/FeedingScheduleProductsManager';
import PresetSetsManager from './pages/admin/growth/PresetSetsManager';
import ANScheduleManager from './pages/admin/growth/ANScheduleManager';
import BlogPostsManager from './pages/admin/content/BlogPostsManager';
import UsersManager from './pages/admin/users/UsersManager';
import SettingsManager from './pages/admin/settings/SettingsManager';
import AdminLogsManager from './pages/admin/settings/AdminLogsManager';
import FeedingSchedule from './components/Tools/FeedingSchedule';
import AdvancedNutrientsSchedule from './components/Tools/AdvancedNutrientsSchedule';
import CannaSchedule from './components/Tools/CannaSchedule';
import ProductList from './components/Products/ProductList';
import ProductDetail from './components/Products/ProductDetail';
import { AuthCallback } from './components/Auth';

import { Helmet } from 'react-helmet-async';

import NotFound from './components/NotFound';
import OnboardingPrompt from './components/Onboarding/OnboardingPrompt';
import { useEffect } from 'react';
import { BASE_URL } from './config/constants';

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
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="brands" element={<BrandsManager />} />
        <Route path="categories" element={<CategoriesManager />} />
        <Route path="products" element={<ProductsManager />} />
        <Route path="vendors" element={<VendorsManager />} />
        <Route path="vendor-products" element={<VendorProductsManager />} />
        <Route path="schedules" element={<FeedingSchedulesManager />} />
        <Route path="schedule-products" element={<FeedingScheduleProductsManager />} />
        <Route path="an-schedule" element={<ANScheduleManager />} />
        <Route path="presets" element={<PresetSetsManager />} />
        <Route path="blog" element={<BlogPostsManager />} />
        <Route path="users" element={<UsersManager />} />
        <Route path="logs" element={<AdminLogsManager />} />
        <Route path="settings" element={<SettingsManager />} />
        {/* Placeholder routes for other sections to prevent 404 in sidebar nav */}
        <Route path="*" element={<AdminDashboard />} />
      </Route>

      <Route path="/:lang/*" element={
        <LanguageWrapper>
          <Routes>
            <Route path="" element={<LandingPage />} />
            {/* EN Routes */}
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="grow-tent-builder" element={<BuilderApp />} />
            <Route path="builder" element={<Navigate to="../grow-tent-builder" replace />} />
            <Route path="grow-tent-setup-builder" element={<Navigate to="../grow-tent-builder" replace />} />
            <Route path="blog" element={<BlogList />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="tools" element={<ToolsPage />} />
            <Route path="tools/electricity-cost-calculator" element={<CostCalculator />} />
            <Route path="tools/unit-converter" element={<UnitConverter />} />
            <Route path="tools/co2-calculator" element={<CO2Calculator />} />
            <Route path="tools/ppfd-heatmap" element={<PPFDHeatMapTool />} />
            <Route path="tools/feeding-schedule" element={<Navigate to="../feeding/biobizz" replace />} />
            <Route path="tools/feeding-schedule/advanced-nutrients" element={<Navigate to="../../feeding/advanced-nutrients" replace />} />
            <Route path="feeding/biobizz" element={<FeedingSchedule />} />
            <Route path="feeding/advanced-nutrients" element={<AdvancedNutrientsSchedule />} />
            <Route path="feeding/canna" element={<CannaSchedule />} />

            {/* Store Routes */}
            <Route path="products" element={<ProductList />} />
            <Route path="products/:id" element={<ProductDetail />} />

            {/* TR Routes - Türkçe URL'ler */}
            <Route path="baslangic" element={<Onboarding />} />
            <Route path="bitki-yetistirme-kabini-olusturucu" element={<BuilderApp />} />
            <Route path="olusturucu" element={<Navigate to="../bitki-yetistirme-kabini-olusturucu" replace />} />
            <Route path="buyume-cadiri-kurulum-olusturucu" element={<Navigate to="../bitki-yetistirme-kabini-olusturucu" replace />} />
            <Route path="yazilar" element={<BlogList />} />
            <Route path="yazilar/:slug" element={<BlogPost />} />
            <Route path="araclar" element={<ToolsPage />} />
            <Route path="araclar/elektrik-maliyet-hesaplayici" element={<CostCalculator />} />
            <Route path="araclar/birim-donusturucu" element={<UnitConverter />} />
            <Route path="araclar/co2-hesaplayici" element={<CO2Calculator />} />
            <Route path="araclar/ppfd-isi-haritasi" element={<PPFDHeatMapTool />} />
            <Route path="beslenme/biobizz" element={<FeedingSchedule />} />
            <Route path="beslenme/advanced-nutrients" element={<AdvancedNutrientsSchedule />} />
            <Route path="beslenme/canna" element={<CannaSchedule />} />

            {/* TR Store Routes */}
            <Route path="urunler" element={<ProductList />} />
            <Route path="urunler/:id" element={<ProductDetail />} />

            {/* Fallback for old/indexed /tr/blog/slug URLs */}
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="profile" element={<ProfilePage />} />
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
        <AuthProvider>
          <OnboardingProvider>
            <BuilderProvider>
              <Helmet>
                <title>GroWizard</title>
                <meta name="description" content="Plan and optimize your perfect grow tent setup with advanced PPFD lighting simulation" />
                <meta property="og:title" content="GroWizard - Grow Tent Setup Builder" />
                <meta property="og:description" content="Plan and optimize your perfect grow tent setup with advanced PPFD lighting simulation" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={BASE_URL} />
                <meta property="og:image" content={`${BASE_URL}/icons/icon-512x512.png`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="GroWizard - Grow Tent Setup Builder" />
                <meta name="twitter:description" content="Plan and optimize your perfect grow tent setup with advanced PPFD lighting simulation" />
                <link rel="canonical" href={BASE_URL} />
              </Helmet>
              <AppContent />
              <OnboardingPrompt />
            </BuilderProvider>
          </OnboardingProvider>
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}

export default App;
