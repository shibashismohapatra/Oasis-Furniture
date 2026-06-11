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
import ReclinersPage from './components/sections/ReclinersPage';
import MattressPage from './components/sections/MattressPage';
import CoffeeTablePage from './components/sections/CoffeeTablePage';
import CenterTablePage from './components/sections/CenterTablePage';
import ModularKitchenPage from './components/sections/ModularKitchenPage';
import TvPanelPage from './components/sections/TvPanelPage';
import TvPanelPage1 from './components/sections/TvPanelPage1';
import SofaSetsPage from './components/sections/SofaSetsPage';
import LShapeSofaPage from './components/sections/LShapeSofaPage';
import DiningFurniturePage from './components/sections/DiningFurniturePage';
import CustomWardrobePage from './components/sections/CustomWardrobePage';
import RareWoodWardrobePage from './components/sections/RareWoodWardrobePage';
import InteriorFurnitureDesignPage from './components/sections/InteriorFurnitureDesignPage';
import NewArrivalsPage from './components/sections/NewArrivalsPage';
import Toast from './components/ui/Toast';
import WelcomeModal from './components/ui/WelcomeModal';
import FloatingSocial from './components/ui/FloatingSocial';
import BedSetsPage from './components/sections/BedSetsPage';

function App() {
  const [page, setPage] = useState(null);

  const handleNavigate = (type, slug, name, productId) => {
    if (slug === 'new-arrivals' || name === 'New Arrivals') {
      setPage({ type: 'new-arrivals' });
    } else if (slug === 'beds' || name === 'Beds') {
      setPage({ type: 'beds', productId });
    } else if (slug === 'bed-sets' || name === 'Bed Sets') {
      setPage({ type: 'bed-sets', productId });
    } else if (slug === 'bedside-tables' || name === 'Bedside Tables') {
      setPage({ type: 'bedside-tables', productId });
    } else if (slug === 'recliner-sofa' || name === 'Recliner Sofa') {
      setPage({ type: 'recliner-sofa', productId });
    } else if (slug === 'mattress' || name === 'Mattress') {
      setPage({ type: 'mattress', productId });
    } else if (slug === 'coffee-table' || name === 'Coffee Table') {
      setPage({ type: 'coffee-table', productId });
    } else if (slug === 'center-table' || name === 'Center Table') {
      setPage({ type: 'center-table', productId });
    } else if (slug === 'modular-kitchen' || name === 'Modular Kitchen') {
      setPage({ type: 'modular-kitchen', productId });
    } else if (slug === 'custom-wardrobe' || name === 'Custom Wardrobe') {
      setPage({ type: 'custom-wardrobe', productId });
    } else if (slug === 'wardrobe' || name === 'Wardrobe') {
      setPage({ type: 'wardrobe', productId });
    } else if (slug === 'tv-unit' || name === 'TV Unit / TV Cabinet') {
      setPage({ type: 'tv-unit', productId });
    } else if (slug === 'tv-unit-1' || name === 'TV Panel') {
      setPage({ type: 'tv-unit-1', productId });
    } else if (slug === 'interior-furniture-design' || name === 'Interior Furniture Design') {
      setPage({ type: 'interior-furniture-design', productId });
    } else if (slug === 'sofa-set' || name === 'Sofa Set') {
      setPage({ type: 'sofa-set', productId });
    } else if (slug === 'l-shape-sofa' || name === 'L Shape Sofa') {
      setPage({ type: 'l-shape-sofa', productId });
    } else if (slug === 'dining-furniture' || slug === 'dining-table-4-seater' || slug === 'dining-table-6-seater' || slug === 'dining-table-8-seater' || slug === 'dining-chair' || name === 'Dining Furniture') {
      setPage({ type: 'dining-furniture', productId });
    } else {
      setPage({ type: 'category', name, productId });
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

      {page?.type === 'new-arrivals' ? (
        <>
          <div style={{ paddingTop: '110px' }}>
            <NewArrivalsPage onBack={handleBack} />
          </div>
          <Footer />
        </>
        ) : page?.type === 'beds' ? (
        <>
          <BedsPage onBack={handleBack} selectedProductId={page.productId} />
          <Footer />
        </>
      ) : page?.type === 'bed-sets' ? (
        <>
          <BedSetsPage onBack={handleBack} selectedProductId={page.productId} />
          <Footer />
        </>
      ) : page?.type === 'bedside-tables' ? (
        
        <>
          <BedSideTablesPage onBack={handleBack} selectedProductId={page.productId} />
          <Footer />
        </>
      ) : page?.type === 'recliner-sofa' ? (
        <>
          <ReclinersPage onBack={handleBack} selectedProductId={page.productId} />
          <Footer />
        </>
      ) : page?.type === 'mattress' ? (
        <>
          <MattressPage onBack={handleBack} selectedProductId={page.productId} />
          <Footer />
        </>
      ) : page?.type === 'coffee-table' ? (
        <>
          <CoffeeTablePage onBack={handleBack} selectedProductId={page.productId} />
          <Footer />
        </>
      ) : page?.type === 'center-table' ? (
        <>
          <CenterTablePage onBack={handleBack} selectedProductId={page.productId} />
          <Footer />
        </>
      ) : page?.type === 'modular-kitchen' ? (
        <>
          <ModularKitchenPage onBack={handleBack} />
          <Footer />
        </>
      ) : page?.type === 'custom-wardrobe' ? (
        <>
          <CustomWardrobePage onBack={handleBack} />
          <Footer />
        </>
      ) : page?.type === 'wardrobe' ? (
        <>
          <RareWoodWardrobePage onBack={handleBack} selectedProductId={page.productId} />
          <Footer />
        </>
      ) : page?.type === 'interior-furniture-design' ? (
        <>
          <InteriorFurnitureDesignPage onBack={handleBack} selectedProductId={page.productId} />
          <Footer />
        </>
      ) : page?.type === 'tv-unit' ? (
        <>
          <TvPanelPage onBack={handleBack} selectedProductId={page.productId} />
          <Footer />
        </>
      ) : page?.type === 'tv-unit-1' ? (
        <>
          <TvPanelPage1 onBack={handleBack} selectedProductId={page.productId} />
          <Footer />
        </>
      ) : page?.type === 'sofa-set' ? (
        <>
          <SofaSetsPage onBack={handleBack} selectedProductId={page.productId} />
          <Footer />
        </>
      ) : page?.type === 'l-shape-sofa' ? (
        <>
          <LShapeSofaPage onBack={handleBack} selectedProductId={page.productId} />
          <Footer />
        </>
      ) : page?.type === 'dining-furniture' ? (
        <>
          <DiningFurniturePage onBack={handleBack} selectedProductId={page.productId} />
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
          <ShowroomCTA onNavigate={handleNavigate} />
          <div id="featured">
            <FeaturedProducts onNavigate={handleNavigate} />
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