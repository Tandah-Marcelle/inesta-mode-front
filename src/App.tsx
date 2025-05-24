import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductPage from './pages/ProductPage';
import NewsPage from './pages/NewsPage';
import SponsorsPage from './pages/SponsorsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="collections" element={<CollectionPage />} />
        <Route path="collections/:categoryId" element={<CollectionPage />} />
        <Route path="product/:productId" element={<ProductPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="sponsors" element={<SponsorsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;