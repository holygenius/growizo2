import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { blogPosts, categories } from './blogData';
import Footer from '../Footer';

const BlogList = () => {
  const { language } = useSettings();
  const [activeCategory, setActiveCategory] = useState('All');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredPosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPost = blogPosts[0]; // First post is featured
  const gridPosts = filteredPosts.filter(post => post.id !== featuredPost.id || activeCategory !== 'All');

  return (
    <div className="blog-container">
      {/* Blog Hero & Featured Post */}
      <section className="blog-hero">
        <div className="container">
          <div className="blog-nav-header fade-in-up">
            <Link to="/" className="nav-btn home-btn">
              🏠 Home
            </Link>
            <Link to="/builder" className="nav-btn app-btn">
              🚀 Launch App
            </Link>
          </div>
          <div className="blog-header fade-in-up">
            <span className="badge">📚 Knowledge Base</span>
            <h1>Grow Wizard <span className="gradient-text">Blog</span></h1>
            <p>Expert guides, tips, and deep dives into plant technology.</p>
          </div>

          {activeCategory === 'All' && (
            <div className="featured-post fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Link to={`/blog/${featuredPost.slug[language]}`} className="featured-card">
                <div className="featured-image" style={{ backgroundImage: `url(${featuredPost.image})` }} />
                <div className="featured-content">
                  <span className="featured-badge">Featured Article</span>
                  <h2>{featuredPost.title[language]}</h2>
                  <p>{featuredPost.excerpt[language]}</p>
                  <div className="blog-meta">
                    <span>{featuredPost.date}</span>
                    <span className="dot">•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Category Filter */}
      <div className="category-nav container">
        <div className="category-scroll">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="blog-grid container">
        {gridPosts.map((post) => (
          <Link to={`/blog/${post.slug[language]}`} key={post.id} className="blog-card card-interactive">
            <div className="blog-card-image">
              <img src={post.image} alt={post.title[language]} loading="lazy" />
              <div className="blog-tags">
                <span className="blog-tag">{post.category}</span>
              </div>
            </div>
            <div className="blog-card-content">
              <div className="blog-meta">
                <span>{post.date}</span>
                <span className="dot">•</span>
                <span>{post.readTime}</span>
              </div>
              <h3>{post.title[language]}</h3>
              <p>{post.excerpt[language]}</p>
              <div className="blog-author">
                <div className="author-avatar">
                  {post.author.charAt(0)}
                </div>
                <span>{post.author}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Footer />

      <style>{`
        .blog-container {
          min-height: 100vh;
          background: var(--bg-app);
          padding-bottom: 4rem;
        }

        .blog-hero {
          padding: 6rem 1rem 2rem;
          background: radial-gradient(circle at top center, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
        }

        .blog-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .blog-nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .home-btn {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .home-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .app-btn {
          background: var(--color-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .app-btn:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }

        .blog-header h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin: 1rem 0;
          color: var(--text-primary);
        }

        .blog-header p {
          color: var(--text-secondary);
          font-size: 1.25rem;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Featured Post */
        .featured-post {
          margin-bottom: 3rem;
        }

        .featured-card {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border-color);
          text-decoration: none;
          transition: transform 0.3s ease;
          height: 400px;
        }

        .featured-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-primary);
        }

        .featured-image {
          background-size: cover;
          background-position: center;
          height: 100%;
        }

        .featured-content {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .featured-badge {
          color: var(--color-primary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .featured-content h2 {
          color: var(--text-primary);
          font-size: 2.5rem;
          line-height: 1.2;
          margin-bottom: 1rem;
        }

        .featured-content p {
          color: var(--text-secondary);
          font-size: 1.125rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        /* Category Nav */
        .category-nav {
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1rem;
        }

        .category-scroll {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .category-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.5rem 1rem;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 500;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .category-btn:hover {
          color: var(--text-primary);
          background: var(--bg-surface);
        }

        .category-btn.active {
          background: var(--color-primary);
          color: white;
        }

        /* Grid */
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 2rem;
        }

        .blog-card {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          text-decoration: none;
          height: 100%;
        }

        .blog-card-image {
          height: 200px;
          position: relative;
          overflow: hidden;
        }

        .blog-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .blog-card:hover .blog-card-image img {
          transform: scale(1.05);
        }

        .blog-tags {
          position: absolute;
          top: 1rem;
          left: 1rem;
        }

        .blog-tag {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          color: var(--color-primary);
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .blog-card-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .blog-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
        }

        .dot {
          color: var(--border-color);
        }

        .blog-card h3 {
          color: var(--text-primary);
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .blog-card p {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-author {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-primary);
          font-weight: 500;
          font-size: 0.875rem;
        }

        .author-avatar {
          width: 32px;
          height: 32px;
          background: var(--bg-surface);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .blog-hero h1 {
            font-size: 2.5rem;
          }
          
          .featured-card {
            grid-template-columns: 1fr;
            height: auto;
          }

          .featured-image {
            height: 200px;
          }

          .featured-content {
            padding: 1.5rem;
          }

          .featured-content h2 {
            font-size: 1.75rem;
          }
          
          .blog-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogList;
