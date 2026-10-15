import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useApp } from './context.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { Background, ScrollProgress } from './components/Fx.jsx';
import Home from './pages/Home.jsx';

const Blog = lazy(() => import('./pages/Blog.jsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'));
const Admin = lazy(() => import('./admin/AdminApp.jsx'));

function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="font-mono text-7xl font-extrabold text-sec">404</p>
        <p className="mt-3 font-mono text-fg/70">// page not found</p>
        <a href="/" className="btn-primary mt-8">← Home</a>
      </div>
    </section>
  );
}

function PublicLayout({ children }) {
  const { data, error, t, lang, tr } = useApp();

  useEffect(() => {
    const seo = data?.settings?.seo;
    if (!seo) return;
    document.title = tr(seo.title) || document.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', tr(seo.description));
  }, [data, lang]);

  if (!data && error) return <div className="grid min-h-screen place-items-center">{t('error.load')}</div>;
  if (!data) return <div className="grid min-h-screen place-items-center font-mono">{t('loading')}</div>;
  return (
    <>
      <Background />
      <ScrollProgress />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center font-mono">...</div>}>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </Suspense>
  );
}
