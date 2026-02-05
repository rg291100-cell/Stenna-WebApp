import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Visualizer } from './pages/Visualizer';
import { Journal } from './pages/Journal';
import { PrivateRoute } from './components/PrivateRoute';
import Login from './pages/Login';
import LatestArrival from './pages/LatestArrival';
import WallpaperPattern from './pages/WallpaperPattern';
import RoomType from './pages/RoomType';
import About from './pages/About';
import Contact from './pages/Contact';
import { AssortmentPlanner } from './pages/AssortmentPlanner';
import { Checkout } from './pages/Checkout';
import { WhyStenna } from './pages/WhyStenna';
import { ShopByColor } from './pages/ShopByColor';
import { ShopByRoom } from './pages/ShopByRoom';
import { AdminLayout } from './layouts/AdminLayout';
import { ProductList } from './pages/Admin/ProductList';
import { ProductForm } from './pages/Admin/ProductForm';
import { Settings } from './pages/Admin/Settings';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/latest" element={<LatestArrival />} />
              <Route path="/patterns" element={<WallpaperPattern />} />
              <Route path="/rooms" element={<RoomType />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/visualizer" element={<Visualizer />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/why-stenna" element={<WhyStenna />} />
              <Route path="/shop-by-color" element={<ShopByColor />} />
              <Route path="/shop-by-room" element={<ShopByRoom />} />

              <Route element={<PrivateRoute />}>
                <Route path="/assortments" element={<AssortmentPlanner />} />
                <Route path="/checkout" element={<Checkout />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="products" replace />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id/edit" element={<ProductForm />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
