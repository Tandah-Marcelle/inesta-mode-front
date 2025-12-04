import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductPage from './pages/ProductPage';
import NewsPage from './pages/NewsPage';
import SponsorsPage from './pages/SponsorsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import ProductsManagement from './pages/admin/ProductsManagement';
import UsersManagement from './pages/admin/UsersManagement';
import MessagesManagement from './pages/admin/MessagesManagement';
import TestimonialsManagement from './pages/admin/TestimonialsManagement';
import NewsManagement from './pages/admin/NewsManagement';
import PartnersManagement from './pages/admin/PartnersManagement';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="collections" element={<CollectionPage />} />
        <Route path="collections/:categoryId" element={<CollectionPage />} />
        <Route path="product/:productId" element={<ProductPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="sponsors" element={<SponsorsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
      
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={
          <ProtectedRoute resource="dashboard" action="view">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="categories" element={
          <ProtectedRoute resource="categories" action="view">
            <CategoriesManagement />
          </ProtectedRoute>
        } />
        <Route path="products" element={
          <ProtectedRoute resource="products" action="view">
            <ProductsManagement />
          </ProtectedRoute>
        } />
        <Route path="users" element={
          <ProtectedRoute resource="users" action="view">
            <UsersManagement />
          </ProtectedRoute>
        } />
        <Route path="messages" element={
          <ProtectedRoute resource="orders" action="view">
            <MessagesManagement />
          </ProtectedRoute>
        } />
        <Route path="testimonials" element={
          <ProtectedRoute resource="settings" action="view">
            <TestimonialsManagement />
          </ProtectedRoute>
        } />
        <Route path="news" element={
          <ProtectedRoute resource="settings" action="view">
            <NewsManagement />
          </ProtectedRoute>
        } />
        <Route path="partners" element={
          <ProtectedRoute resource="settings" action="view">
            <PartnersManagement />
          </ProtectedRoute>
        } />
        <Route index element={
          <ProtectedRoute resource="dashboard" action="view">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* 404 fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;