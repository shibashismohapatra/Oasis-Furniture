import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartSidebar from './components/layout/CartSidebar';
import Hero from './components/sections/Hero';
import Categories from './components/sections/Categories';
import BestSellers from './components/sections/BestSellers';
import BrandsStats from './components/sections/BrandsStats';
import ShowroomCTA from './components/sections/ShowroomCTA';
import FeaturedProducts from './components/sections/FeaturedProducts';
import Design from './components/sections/Design';
import Testimonials from './components/sections/Testimonials';
import VideoShowcase from './components/sections/Instagram';
import Newsletter from './components/sections/Newsletter';
import CategoryPage from './components/sections/CategoryPage';
import BedsPage from './components/sections/BedsPage';
import BedSideTablesPage from './components/sections/BedSideTablesPage';
import WishlistPage from './components/sections/WishlistPage';
import Toast from './components/ui/Toast';
import WelcomeModal from './components/ui/WelcomeModal';
import FloatingSocial from './components/ui/FloatingSocial';

function App() {
  const [page, setPage] = useState(null);

  const handleNavigate = (type, slug, name) => {
    if (slug === 'beds' || name === 'Beds') {
      setPage({ type: 'beds' });
    } else if (slug === 'bedside-tables' || name === 'Bedside Tables') {
      setPage({ type: 'bedside-tables' });
    } else {
      setPage({ type: 'category', name });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setPage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWishlist = () => {
    setPage({ type: 'wishlist' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <WelcomeModal />
      <Navbar onLogoClick={handleBack} onNavigate={handleNavigate} onWishlist={handleWishlist} />
      <CartSidebar />
      <Toast />
      <FloatingSocial />

      {page?.type === 'beds' ? (
        <>
          <BedsPage onBack={handleBack} />
          <Footer />
        </>
      ) : page?.type === 'bedside-tables' ? (
        <>
          <BedSideTablesPage onBack={handleBack} />
          <Footer />
        </>
      ) : page?.type === 'category' ? (
        <CategoryPage categoryName={page.name} onBack={handleBack} />
      ) : page?.type === 'wishlist' ? (
        <>
          <div style={{ paddingTop: '110px' }}>
            <WishlistPage onBack={handleBack} />
          </div>
          <Footer />
        </>
      ) : (
        <main>
          <div style={{ paddingTop: '110px' }}>
            <Hero />
          </div>
          <div id="categories">
            <Categories onNavigate={handleNavigate} />
          </div>
          <div id="bestsellers">
            <BestSellers />
          </div>
          <BrandsStats />
          <ShowroomCTA />
          <div id="featured">
            <FeaturedProducts />
          </div>
       
          <Testimonials />
          <VideoShowcase />
          <Newsletter />
          <Footer />
        </main>
      )}
    </div>
  );
}

export default App;