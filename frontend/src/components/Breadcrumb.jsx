import React from 'react';
import { Link } from 'react-router-dom';

function Breadcrumb({ title, current }) {
  return (
    <section className="relative overflow-hidden bg-[#f3f1ec] py-24 sm:py-28">
      <div className="absolute right-[12%] top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#ffd9cd] opacity-70 blur-3xl" />
      <img
        src="/images/home-banner-bg-05-rotating.jpg"
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute right-[23%] top-1/2 w-10 -translate-y-1/2 pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold text-black">{title}</h1>
        <div className="mt-5 flex items-center justify-center gap-4 text-3xl">
          <Link to="/" className="text-[#ff5a32] hover:text-[#eb4e2a] transition">
            Home
          </Link>
          <span className="text-[#ff5a32]">•</span>
          <span className="text-[#5c6e8a]">{current}</span>
        </div>
      </div>
    </section>
  );
}

export default Breadcrumb;
