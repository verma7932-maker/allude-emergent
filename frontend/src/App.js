import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";

import PublicLayout from "@/components/PublicLayout";
import Home from "@/pages/Home";
import Collections from "@/pages/Collections";
import CategoryPage from "@/pages/CategoryPage";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import DealerEnquiry from "@/pages/DealerEnquiry";
import Contact from "@/pages/Contact";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/NotFound";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminEnquiries from "@/pages/admin/AdminEnquiries";
import AdminMessages from "@/pages/admin/AdminMessages";
import AdminHomepage from "@/pages/admin/AdminHomepage";
import AdminAbout from "@/pages/admin/AdminAbout";
import AdminMedia from "@/pages/admin/AdminMedia";
import AdminContactInfo from "@/pages/admin/AdminContactInfo";
import AdminSocial from "@/pages/admin/AdminSocial";
import AdminSEO from "@/pages/admin/AdminSEO";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:slug" element={<CategoryPage />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/dealer-enquiry" element={<DealerEnquiry />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Legal type="privacy" />} />
              <Route path="/terms" element={<Legal type="terms" />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="homepage" element={<AdminHomepage />} />
              <Route path="about" element={<AdminAbout />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="contact-info" element={<AdminContactInfo />} />
              <Route path="social" element={<AdminSocial />} />
              <Route path="seo" element={<AdminSEO />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </AuthProvider>
    </div>
  );
}

export default App;
