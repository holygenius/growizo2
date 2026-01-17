import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import styles from '../Admin.module.css';
import ImageUploader from '../components/ImageUploader';
import LocalizedContentEditor from '../components/LocalizedContentEditor';
import BlogPreviewModal from '../components/BlogPreviewModal';
import TableFilter from '../components/TableFilter';
import { useAdmin } from '../../../context/AdminContext';

const BlogPostForm = ({ initialData, onClose, onSuccess, onPreview }) => {
    const { t } = useAdmin();
    const [formData, setFormData] = useState({
        title: { en: '', tr: '' },
        slug: { en: '', tr: '' },
        excerpt: { en: '', tr: '' },
        content: { en: '', tr: '' },
        category: '',
        image_url: '',
        author: '',
        meta_title: { en: '', tr: '' },
        meta_description: { en: '', tr: '' },
        is_published: false,
        tags: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData?.id) {
                await adminService.update('blog_posts', initialData.id, formData);
            } else {
                await adminService.create('blog_posts', formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving blog post:', error);
            alert(t('blogPage.errorSaving') || 'Error saving blog post');
        } finally {
            setLoading(false);
        }
    };

    const [showImport, setShowImport] = useState(false);
    const [jsonInput, setJsonInput] = useState(JSON.stringify({
        title: { en: "English Title", tr: "Türkçe Başlık" },
        slug: { en: "english-slug", tr: "turkce-slug" },
        excerpt: { en: "Short summary...", tr: "Kısa özet..." },
        content: { en: "<p>Content...</p>", tr: "<p>İçerik...</p>" },
        category: "Category",
        author: "Author",
        tags: ["tag1"],
        meta_title: { en: "Meta Title", tr: "Meta Başlık" },
        meta_description: { en: "Meta Desc", tr: "Meta Açıklama" }
    }, null, 4));

    const handleImport = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            setFormData(prev => ({
                ...prev,
                title: {
                    en: parsed.title?.en || parsed.title || prev.title.en,
                    tr: parsed.title?.tr || prev.title.tr
                },
                slug: {
                    en: parsed.slug?.en || parsed.slug || prev.slug.en,
                    tr: parsed.slug?.tr || prev.slug.tr
                },
                excerpt: {
                    en: parsed.excerpt?.en || parsed.excerpt || prev.excerpt.en,
                    tr: parsed.excerpt?.tr || prev.excerpt.tr
                },
                content: {
                    en: parsed.content?.en || parsed.content || prev.content.en,
                    tr: parsed.content?.tr || prev.content.tr
                },
                category: parsed.category || prev.category,
                author: parsed.author || prev.author,
                meta_title: {
                    en: parsed.meta_title?.en || parsed.meta_title || prev.meta_title.en,
                    tr: parsed.meta_title?.tr || prev.meta_title.tr
                },
                meta_description: {
                    en: parsed.meta_description?.en || parsed.meta_description || prev.meta_description.en,
                    tr: parsed.meta_description?.tr || prev.meta_description.tr
                },
                tags: parsed.tags || prev.tags
            }));
            setShowImport(false);
            setJsonInput('');
            alert('Content imported successfully!');
        } catch (error) {
            alert('Invalid JSON format');
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff',
        borderRadius: '0.5rem'
    };

    const labelStyle = {
        display: 'block',
        color: '#94a3b8',
        marginBottom: '0.5rem',
        fontSize: '0.875rem'
    };

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>
                    {initialData ? t('blogPage.editPost') || t('editBlogPost') : t('blogPage.newPost') || t('newBlogPost')}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        type="button"
                        onClick={() => setShowImport(true)}
                        className={styles.iconBtn}
                        title="Import JSON"
                        style={{ color: '#ec4899', width: 'auto', padding: '0 1rem', fontSize: '0.875rem', gap: '0.5rem' }}
                    >
                        <Save size={16} /> Import JSON
                    </button>
                    <button
                        type="button"
                        onClick={() => onPreview(formData)}
                        className={styles.iconBtn}
                        title={t('blogPage.preview') || 'Preview'}
                        style={{ color: '#3b82f6' }}
                    >
                        <Eye size={20} />
                    </button>
                    <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
                </div>
            </div>

            {showImport && (
                <div style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    background: 'rgba(236, 72, 153, 0.1)',
                    border: '1px solid #ec4899',
                    borderRadius: '0.5rem'
                }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#ec4899' }}>Paste JSON Content</h4>
                    <textarea
                        value={jsonInput}
                        onChange={e => setJsonInput(e.target.value)}
                        placeholder='{"title": {"en": "...", "tr": "..."}, ...}'
                        style={{
                            width: '100%',
                            height: '200px',
                            padding: '1rem',
                            background: '#0f172a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            borderRadius: '0.5rem',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            marginBottom: '1rem'
                        }}
                    />
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={() => setShowImport(false)}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#fff',
                                borderRadius: '0.25rem',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleImport}
                            style={{
                                padding: '0.5rem 1rem',
                                background: '#ec4899',
                                border: 'none',
                                color: '#fff',
                                borderRadius: '0.25rem',
                                cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            Import Data
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Title EN */}
                <div className={styles.inputGroup}>
                    <label style={labelStyle}>{t('blogPage.titleEn') || t('titleEn')}</label>
                    <input
                        type="text"
                        value={formData.title?.en || ''}
                        onChange={e => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                        style={inputStyle}
                        placeholder="Enter English title..."
                        required
                    />
                </div>

                {/* Title TR */}
                <div className={styles.inputGroup}>
                    <label style={labelStyle}>{t('blogPage.titleTr') || t('titleTr')}</label>
                    <input
                        type="text"
                        value={formData.title?.tr || ''}
                        onChange={e => setFormData({ ...formData, title: { ...formData.title, tr: e.target.value } })}
                        style={inputStyle}
                        placeholder="Türkçe başlık girin..."
                        required
                    />
                </div>

                {/* Slug EN */}
                <div className={styles.inputGroup}>
                    <label style={labelStyle}>{t('blogPage.slugEn') || t('slugEn')}</label>
                    <input
                        type="text"
                        value={formData.slug?.en || ''}
                        onChange={e => setFormData({ ...formData, slug: { ...formData.slug, en: e.target.value } })}
                        style={inputStyle}
                        placeholder="url-friendly-slug"
                        required
                    />
                </div>

                {/* Slug TR */}
                <div className={styles.inputGroup}>
                    <label style={labelStyle}>{t('blogPage.slugTr') || t('slugTr')}</label>
                    <input
                        type="text"
                        value={formData.slug?.tr || ''}
                        onChange={e => setFormData({ ...formData, slug: { ...formData.slug, tr: e.target.value } })}
                        style={inputStyle}
                        placeholder="url-dostu-slug"
                        required
                    />
                </div>

                {/* Category */}
                <div className={styles.inputGroup}>
                    <label style={labelStyle}>{t('category')}</label>
                    <input
                        type="text"
                        value={formData.category || ''}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        style={inputStyle}
                        placeholder="Growing Tips, Nutrients, etc."
                    />
                </div>

                {/* Author */}
                <div className={styles.inputGroup}>
                    <label style={labelStyle}>{t('author')}</label>
                    <input
                        type="text"
                        value={formData.author || ''}
                        onChange={e => setFormData({ ...formData, author: e.target.value })}
                        style={inputStyle}
                        placeholder="Author name"
                    />
                </div>

                {/* Cover Image */}
                <ImageUploader
                    label={t('coverImage')}
                    value={formData.image_url}
                    onChange={url => setFormData({ ...formData, image_url: url })}
                    bucket="blogImages"
                />

                {/* Excerpt - Localized Rich Text */}
                <LocalizedContentEditor
                    label={t('blogPage.excerptLocalized') || t('excerptLocalized')}
                    value={formData.excerpt}
                    onChange={val => setFormData({ ...formData, excerpt: val })}
                    minHeight="120px"
                    placeholder={{
                        en: 'Write a brief summary in English...',
                        tr: 'Kısa bir özet yazın...'
                    }}
                    helpText={t('blogPage.excerptHint') || 'Brief summary shown in blog list'}
                />

                {/* Content - Localized Rich Text */}
                <LocalizedContentEditor
                    label={t('blogPage.contentLocalized') || t('contentLocalized')}
                    value={formData.content}
                    onChange={val => setFormData({ ...formData, content: val })}
                    minHeight="400px"
                    placeholder={{
                        en: 'Write your article content in English...',
                        tr: 'Makale içeriğinizi Türkçe yazın...'
                    }}
                    helpText={t('blogPage.contentHint') || 'Use headings, lists, and formatting to structure your content'}
                />

                {/* Meta Title */}
                <div className={styles.inputGroup}>
                    <label style={labelStyle}>Meta Title (EN/TR)</label>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={formData.meta_title?.en || ''}
                            onChange={e => setFormData({ ...formData, meta_title: { ...formData.meta_title, en: e.target.value } })}
                            style={inputStyle}
                            placeholder="Meta Title EN"
                        />
                        <input
                            type="text"
                            value={formData.meta_title?.tr || ''}
                            onChange={e => setFormData({ ...formData, meta_title: { ...formData.meta_title, tr: e.target.value } })}
                            style={inputStyle}
                            placeholder="Meta Title TR"
                        />
                    </div>
                </div>

                {/* Meta Description */}
                <div className={styles.inputGroup}>
                    <label style={labelStyle}>Meta Description (EN/TR)</label>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        <textarea
                            value={formData.meta_description?.en || ''}
                            onChange={e => setFormData({ ...formData, meta_description: { ...formData.meta_description, en: e.target.value } })}
                            style={inputStyle}
                            placeholder="Meta Description EN"
                            rows={3}
                        />
                        <textarea
                            value={formData.meta_description?.tr || ''}
                            onChange={e => setFormData({ ...formData, meta_description: { ...formData.meta_description, tr: e.target.value } })}
                            style={inputStyle}
                            placeholder="Meta Description TR"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Publish Status */}
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '2rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={formData.is_published}
                            onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                            style={{ width: '1.25rem', height: '1.25rem' }}
                        />
                        {t('published')}
                    </label>
                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {formData.is_published
                            ? (t('blogPage.willBeVisible') || 'Post will be visible to all users')
                            : (t('blogPage.savedAsDraft') || 'Post will be saved as draft')
                        }
                    </span>
                </div>

                {/* Action Buttons */}
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => onPreview(formData)}
                        className={styles.actionBtn}
                        style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}
                    >
                        <Eye size={18} />
                        {t('blogPage.preview') || 'Preview'}
                    </button>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={onClose} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto' }}>
                            {t('cancel')}
                        </button>
                        <button type="submit" disabled={loading} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#10b981', color: '#fff', border: 'none' }}>
                            {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                            {t('save')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default function BlogPostsManager() {
    const { t, showConfirm, addToast } = useAdmin();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [previewPost, setPreviewPost] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Get unique categories from posts
    const categories = useMemo(() => {
        const cats = [...new Set(posts.map(p => p.category).filter(Boolean))];
        return cats.map(c => ({ value: c, label: c }));
    }, [posts]);

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch = !searchTerm ||
                post.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.title?.tr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.author?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'published' && post.is_published) ||
                (statusFilter === 'draft' && !post.is_published);
            const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [posts, searchTerm, statusFilter, categoryFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data } = await adminService.getAll('blog_posts', { orderBy: { column: 'created_at', ascending: false } });
            setPosts(data);
        } catch (error) {
            console.error('Error loading blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = await showConfirm(
            t('blogPage.confirmDeleteMessage') || t('confirmDeletePost'),
            t('confirmDelete')
        );
        if (confirmed) {
            try {
                await adminService.delete('blog_posts', id);
                addToast(t('deletedSuccessfully'), 'success');
                loadData();
            } catch (error) {
                console.error('Error deleting post:', error);
                addToast(t('errorDeleting'), 'error');
            }
        }
    };

    const handlePreview = (post) => {
        setPreviewPost(post);
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{t('blogPosts')}</h2>
                <button
                    onClick={() => { setSelectedPost(null); setIsEditing(true); }}
                    className={styles.actionBtn}
                    style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                >
                    <Plus size={20} /> {t('writePost')}
                </button>
            </div>

            {isEditing && (
                <BlogPostForm
                    initialData={selectedPost}
                    onClose={() => setIsEditing(false)}
                    onSuccess={loadData}
                    onPreview={handlePreview}
                />
            )}

            <TableFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder={t('filter') + ' ' + t('blogPosts').toLowerCase() + '...'}
                filters={[
                    {
                        key: 'status',
                        label: t('status'),
                        value: statusFilter,
                        options: [
                            { value: 'published', label: t('published') },
                            { value: 'draft', label: t('draft') }
                        ]
                    },
                    {
                        key: 'category',
                        label: t('category'),
                        value: categoryFilter,
                        options: categories
                    }
                ]}
                onFilterChange={(key, value) => {
                    if (key === 'status') setStatusFilter(value);
                    if (key === 'category') setCategoryFilter(value);
                }}
                resultCount={filteredPosts.length}
                totalCount={posts.length}
            />

            <div className={styles.panel}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('title')}</th>
                                <th>{t('slug')}</th>
                                <th>{t('category')}</th>
                                <th>{t('author')}</th>
                                <th>{t('status')}</th>
                                <th>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
                            ) : filteredPosts.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>{t('noBlogsFound')}</td></tr>
                            ) : filteredPosts.map(post => (
                                <tr key={post.id}>
                                    <td style={{ fontWeight: 600 }}>{post.title?.en || 'No Title'}</td>
                                    <td style={{ color: '#94a3b8' }}>
                                        <div style={{ fontSize: '0.75rem' }}>EN: {post.slug?.en}</div>
                                        <div style={{ fontSize: '0.75rem' }}>TR: {post.slug?.tr}</div>
                                    </td>
                                    <td>{post.category}</td>
                                    <td>{post.author}</td>
                                    <td>
                                        <span className={`${styles.badge} ${post.is_published ? styles.badgeSuccess : styles.badgeInfo}`}>
                                            {post.is_published ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                            {post.is_published ? t('published') : t('draft')}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handlePreview(post)}
                                                className={styles.iconBtn}
                                                style={{ width: '2rem', height: '2rem', color: '#3b82f6' }}
                                                title={t('blogPage.preview') || 'Preview'}
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedPost(post); setIsEditing(true); }}
                                                className={styles.iconBtn}
                                                style={{ width: '2rem', height: '2rem' }}
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className={styles.iconBtn}
                                                style={{ width: '2rem', height: '2rem', color: '#f87171' }}
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Preview Modal */}
            {previewPost && (
                <BlogPreviewModal
                    post={previewPost}
                    onClose={() => setPreviewPost(null)}
                />
            )}
        </div>
    );
}
