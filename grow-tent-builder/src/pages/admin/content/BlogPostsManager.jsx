import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import styles from '../Admin.module.css';
import JsonEditor from '../components/JsonEditor';
import ImageUploader from '../components/ImageUploader';

const BlogPostForm = ({ initialData, onClose, onSuccess }) => {
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
            alert('Error saving blog post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>{initialData ? 'Edit Blog Post' : 'New Blog Post'}</h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Title (English)</label>
                    <input
                        type="text"
                        value={formData.title?.en || ''}
                        onChange={e => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Title (Turkish)</label>
                    <input
                        type="text"
                        value={formData.title?.tr || ''}
                        onChange={e => setFormData({ ...formData, title: { ...formData.title, tr: e.target.value } })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Slug (English)</label>
                    <input
                        type="text"
                        value={formData.slug?.en || ''}
                        onChange={e => setFormData({ ...formData, slug: { ...formData.slug, en: e.target.value } })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Slug (Turkish)</label>
                    <input
                        type="text"
                        value={formData.slug?.tr || ''}
                        onChange={e => setFormData({ ...formData, slug: { ...formData.slug, tr: e.target.value } })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Category</label>
                    <input
                        type="text"
                        value={formData.category || ''}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Author</label>
                    <input
                        type="text"
                        value={formData.author || ''}
                        onChange={e => setFormData({ ...formData, author: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    />
                </div>

                <ImageUploader
                    label="Cover Image"
                    value={formData.image_url}
                    onChange={url => setFormData({ ...formData, image_url: url })}
                />

                <JsonEditor
                    label="Excerpt (Localised)"
                    value={formData.excerpt}
                    onChange={val => setFormData({ ...formData, excerpt: val })}
                    height="100px"
                    helpText='Format: { "en": "Short text...", "tr": "Kısa metin..." }'
                />

                <JsonEditor
                    label="Content (Localised Markdown/HTML)"
                    value={formData.content}
                    onChange={val => setFormData({ ...formData, content: val })}
                    height="300px"
                    helpText='Format: { "en": "# Hello...", "tr": "# Merhaba..." }'
                />

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '2rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={formData.is_published}
                            onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                            style={{ width: '1.25rem', height: '1.25rem' }}
                        />
                        Published
                    </label>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={onClose} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto' }}>
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#10b981', color: '#fff', border: 'none' }}>
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function BlogPostsManager() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

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
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                await adminService.delete('blog_posts', id);
                loadData();
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Blog Posts</h2>
                <button
                    onClick={() => { setSelectedPost(null); setIsEditing(true); }}
                    className={styles.actionBtn}
                    style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                >
                    <Plus size={20} /> Write Post
                </button>
            </div>

            {isEditing && (
                <BlogPostForm
                    initialData={selectedPost}
                    onClose={() => setIsEditing(false)}
                    onSuccess={loadData}
                />
            )}

            <div className={styles.panel}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Slugs</th>
                                <th>Category</th>
                                <th>Author</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                            ) : posts.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No posts found</td></tr>
                            ) : posts.map(post => (
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
                                            {post.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
        </div>
    );
}
