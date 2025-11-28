import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../Blog/blogData';
import { useSettings } from '../../context/SettingsContext';

export default function BlogPreviewSection() {
    const { language, t, getLocalizedPath } = useSettings();

    return (
        <section className="blog-preview-section">
            <div className="blog-preview-header">
                <h2>📚 {t('landingLatestArticles')}</h2>
                <p>{t('landingLatestArticlesSubtitle')}</p>
            </div>
            <div className="blog-preview-grid">
                {blogPosts.slice(0, 3).map((post) => (
                    <Link to={getLocalizedPath(`/blog/${post.slug[language]}`)} key={post.id} className="blog-preview-card">
                        <div className="preview-image" style={{ backgroundImage: `url(${post.image})` }} />
                        <div className="preview-content">
                            <span className="preview-tag">{post.category}</span>
                            <h3>{post.title[language]}</h3>
                            <div className="preview-meta">
                                <span>{post.readTime}</span>
                                <span className="arrow">→</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="blog-cta">
                <Link to={getLocalizedPath('/blog')} className="view-all-btn">
                    {t('landingViewAllArticles')}
                </Link>
            </div>
        </section>
    );
}
