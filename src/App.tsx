import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { PassbookModal } from './components/PassbookModal';
import { ReceiptModal } from './components/ReceiptModal';
import { MemberCardModal } from './components/MemberCardModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { MissionVisionPage } from './pages/MissionVisionPage';
import { CommitteePage } from './pages/CommitteePage';
import { ServicesPage } from './pages/ServicesPage';
import { CalculatorsPage } from './pages/CalculatorsPage';
import { MemberRegistrationPage } from './pages/MemberRegistrationPage';
import { LoanApplicationPage } from './pages/LoanApplicationPage';
import { DigitalPassbookPage } from './pages/DigitalPassbookPage';
import { ConstitutionPage } from './pages/ConstitutionPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { NewsGalleryPage } from './pages/NewsGalleryPage';
import { FAQContactPage } from './pages/FAQContactPage';
import { PrivacyTermsPage } from './pages/PrivacyTermsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { BulkExportPage } from './pages/BulkExportPage';

const MainLayout: React.FC = () => {
  const { activePage } = useApp();

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'mission-vision':
        return <MissionVisionPage />;
      case 'committee':
        return <CommitteePage />;
      case 'services':
      case 'savings':
      case 'loans':
      case 'dps':
        return <ServicesPage />;
      case 'calculators':
        return <CalculatorsPage />;
      case 'register':
        return <MemberRegistrationPage />;
      case 'loan-application':
        return <LoanApplicationPage />;
      case 'passbook':
        return <DigitalPassbookPage />;
      case 'constitution':
        return <ConstitutionPage />;
      case 'downloads':
        return <DownloadsPage />;
      case 'news-gallery':
        return <NewsGalleryPage />;
      case 'contact':
        return <FAQContactPage />;
      case 'privacy-terms':
        return <PrivacyTermsPage />;
      case 'admin':
        return <AdminDashboardPage />;
      case 'bulk-export':
        return <BulkExportPage />;
      case 'login':
        return <LoginPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040d12] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <main className="flex-1 animate-fade-in">{renderPage()}</main>
      <Footer />
      <ToastContainer />
      <PassbookModal />
      <ReceiptModal />
      <MemberCardModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
