import React, { useState } from 'react';
import { X, ExternalLink, Globe } from 'lucide-react';
import styles from './BlogPreviewModal.module.css';
import { useAdmin } from '../../../context/AdminContext';

const BlogPreviewModal = ({ post, onClose }) => {
  const { t } = useAdmin();
  const [previewLang, setPreviewLang] = useState('en');

  if (!post) return null;

  const title = post.title?.[previewLang] || post.title?.en || 'Untitled';
  const excerpt = post.excerpt?.[previewLang] || post.excerpt?.en || '';
  const content = post.content?.[previewLang] || post.content?.en || '';
  const category = post.category || '';
  const author = post.author || 'Unknown';
  const imageUrl = post.image_url || '/images/placeholder.jpg';

  // Format date
  const date = post.created_at 
    ? new Date(post.created_at).toLocaleDateString(previewLang === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date().toLocaleDateString();

  // Estimate read time (roughly 200 words per minute)
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const readTimeText = previewLang === 'tr' 
    ? `${readTime} dk okuma` 
    : `${readTime} min read`;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <Globe size={18} />
            <span>{t('blogPage.preview') || 'Preview'}</span>
          </div>
          <div className={styles.headerCenter}>
            <div className={styles.langSwitcher}>
              <button 
                className={`${styles.langBtn} ${previewLang === 'en' ? styles.active : ''}`}
                onClick={() => setPreviewLang('en')}
              >
                🇬🇧 EN
              </button>
              <button 
                className={`${styles.langBtn} ${previewLang === 'tr' ? styles.active : ''}`}
                onClick={() => setPreviewLang('tr')}
              >
                🇹🇷 TR
              </button>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Preview Content */}
        <div className={styles.previewContainer}>
          {/* Hero Section */}
          <div 
            className={styles.hero}
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
              <span className={styles.category}>{category}</span>
              <h1 className={styles.title}>{title}</h1>
              <div className={styles.meta}>
                <span>{previewLang === 'tr' ? 'Yazar:' : 'By'} {author}</span>
                <span className={styles.dot}>•</span>
                <span>{date}</span>
                <span className={styles.dot}>•</span>
                <span>{readTimeText}</span>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          {excerpt && (
            <div className={styles.excerpt}>
              <p>{excerpt}</p>
            </div>
          )}

          {/* Content */}
          <article 
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Status indicator */}
          <div className={styles.statusBar}>
            <span className={`${styles.statusBadge} ${post.is_published ? styles.published : styles.draft}`}>
              {post.is_published 
                ? (t('published') || 'Published') 
                : (t('draft') || 'Draft')}
            </span>
            {post.slug?.[previewLang] && (
              <span className={styles.slugInfo}>
                <ExternalLink size={14} />
                /blog/{post.slug[previewLang]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPreviewModal;
