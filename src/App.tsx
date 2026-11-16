/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoadingScreen } from './components/LoadingScreen';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';
import { JourneyPage } from './pages/JourneyPage';
import { SelfDimensionPage } from './pages/SelfDimensionPage';
import { ThenAndNowPage } from './pages/ThenAndNowPage';
import { UnderstandingSelfPage } from './pages/UnderstandingSelfPage';
import { YoungerLetterPage } from './pages/YoungerLetterPage';

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <LoadingScreen />
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/understanding-self" element={<UnderstandingSelfPage />} />
              <Route path="/understanding-self/:slug" element={<SelfDimensionPage />} />
              <Route path="/journey" element={<JourneyPage />} />
              <Route path="/then-and-now" element={<ThenAndNowPage />} />
              <Route path="/letter" element={<YoungerLetterPage />} />
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
  );
}
