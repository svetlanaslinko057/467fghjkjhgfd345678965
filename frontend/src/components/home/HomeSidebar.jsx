/**
 * HomeSidebar - Categories sidebar for home page hero section
 * Foxtrot/Rozetka style with icons and hover effects
 */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Package } from "lucide-react";
import * as LucideIcons from "lucide-react";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Check if icon is an emoji or Lucide icon name
const isEmoji = (str) => {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(str);
};

// Get icon component by name or return emoji
const IconDisplay = ({ icon, size = 20 }) => {
  if (!icon) {
    return <Package size={size} />;
  }
  if (isEmoji(icon)) {
    return <span style={{ fontSize: size }}>{icon}</span>;
  }
  const Icon = LucideIcons[icon] || Package;
  return <Icon size={size} />;
};

export default function HomeSidebar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v2/categories/tree`);
      if (res.ok) {
        const data = await res.json();
        // Handle both formats: {tree: [...]} and direct array
        const tree = data.tree || data;
        // Get only root categories (max 10)
        setCategories(Array.isArray(tree) ? tree.slice(0, 10) : []);
      }
    } catch (error) {
      console.warn("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ys-home-sidebar" data-testid="home-sidebar">
        <div className="ys-home-sidebar-inner">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="ys-home-sidebar-item is-skeleton">
              <div className="ys-skel" style={{ width: 24, height: 24, borderRadius: 6 }} />
              <div className="ys-skel" style={{ height: 14, width: `${60 + i * 5}%`, borderRadius: 4 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <div 
      className="ys-home-sidebar" 
      data-testid="home-sidebar"
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        overflow: 'hidden'
      }}
    >
      <div className="ys-home-sidebar-inner" style={{ display: 'flex', flexDirection: 'column' }}>
        {categories.map((cat) => {
          const hasChildren = cat.children && cat.children.length > 0;

          return (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              className={`ys-home-sidebar-item ${hoveredId === cat.id ? "is-active" : ""}`}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
              data-testid={`sidebar-category-${cat.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                color: hoveredId === cat.id ? '#2563eb' : '#374151',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                borderBottom: '1px solid #f3f4f6',
                background: hoveredId === cat.id ? '#f8fafc' : 'transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <span 
                className="ys-home-sidebar-icon"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  background: hoveredId === cat.id ? '#eff6ff' : '#f3f4f6',
                  color: hoveredId === cat.id ? '#2563eb' : '#6b7280',
                  flexShrink: 0
                }}
              >
                <IconDisplay icon={cat.icon} size={20} />
              </span>
              <span 
                className="ys-home-sidebar-name"
                style={{
                  flex: 1,
                  minWidth: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {cat.name}
              </span>
              {hasChildren && (
                <ChevronRight 
                  size={16} 
                  className="ys-home-sidebar-arrow" 
                  style={{
                    color: '#9ca3af',
                    flexShrink: 0,
                    opacity: hoveredId === cat.id ? 1 : 0,
                    transform: hoveredId === cat.id ? 'translateX(0)' : 'translateX(-4px)',
                    transition: 'all 0.15s ease'
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
