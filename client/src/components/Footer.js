import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>© {new Date().getFullYear()} Inventory Shop</div>
      <div className="links">
        <a href="#about">About</a>
        <a href="#privacy">Privacy</a>
        <a href="#contact">Contact</a>
      </div>
    </footer>
  );
}
