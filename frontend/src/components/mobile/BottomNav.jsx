/**
 * BottomNav - Mobile bottom navigation
 * B16 Mobile Retail Polish
 */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Grid3X3, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "../../contexts/CartContext";

export default function BottomNav({ onSearchClick }) {
  const location = useLocation();
  const { cart } = useCart();
  
  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  // Don't show on checkout pages
  if (location.pathname.startsWith('/checkout')) {
    return null;
  }

  return (
    <nav className="ys-bottomnav" data-testid="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `ys-bottomnav-item ${isActive ? 'is-active' : ''}`}>
        <div className="ys-bottomnav-ico">
          <Home size={22} />
        </div>
        <div className="ys-bottomnav-txt">Головна</div>
      </NavLink>

      <NavLink to="/catalog" className={({ isActive }) => `ys-bottomnav-item ${isActive ? 'is-active' : ''}`}>
        <div className="ys-bottomnav-ico">
          <Grid3X3 size={22} />
        </div>
        <div className="ys-bottomnav-txt">Каталог</div>
      </NavLink>

      <button 
        className="ys-bottomnav-item" 
        onClick={onSearchClick}
        data-testid="bottom-nav-search"
      >
        <div className="ys-bottomnav-ico">
          <Search size={22} />
        </div>
        <div className="ys-bottomnav-txt">Пошук</div>
      </button>

      <NavLink to="/cart" className={({ isActive }) => `ys-bottomnav-item ys-bottomnav-cart ${isActive ? 'is-active' : ''}`}>
        <div className="ys-bottomnav-ico">
          <ShoppingCart size={22} />
          {cartCount > 0 && <span className="ys-bottomnav-badge">{cartCount}</span>}
        </div>
        <div className="ys-bottomnav-txt">Кошик</div>
      </NavLink>

      <NavLink to="/account" className={({ isActive }) => `ys-bottomnav-item ${isActive ? 'is-active' : ''}`}>
        <div className="ys-bottomnav-ico">
          <User size={22} />
        </div>
        <div className="ys-bottomnav-txt">Профіль</div>
      </NavLink>
    </nav>
  );
}
