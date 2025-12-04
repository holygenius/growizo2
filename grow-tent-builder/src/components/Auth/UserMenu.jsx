/**
 * User Menu Component
 * Shows login button or user avatar with dropdown
 */

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import styles from './UserMenu.module.css';

export default function UserMenu() {
    const { user, isAuthenticated, isAdmin, signInWithGoogle, signOut, loading } = useAuth();
    const { language } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignIn = async () => {
        await signInWithGoogle();
    };

    const handleSignOut = async () => {
        await signOut();
        setIsOpen(false);
    };

    if (loading) {
        return <div className={styles.skeleton}></div>;
    }

    if (!isAuthenticated) {
        return (
            <button className={styles.signInBtn} onClick={handleSignIn}>
                <svg className={styles.googleIcon} viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {language === 'tr' ? 'Giriş Yap' : 'Sign In'}
            </button>
        );
    }

    return (
        <div className={styles.userMenu} ref={menuRef}>
            <button 
                className={styles.avatarBtn} 
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                {user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                    <img 
                        src={user.user_metadata.avatar_url || user.user_metadata.picture} 
                        alt={user.user_metadata.full_name || 'User'} 
                        className={styles.avatar}
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className={styles.avatarPlaceholder}>
                        {(user?.user_metadata?.full_name || user?.email || 'U')[0].toUpperCase()}
                    </div>
                )}
                {isAdmin && <span className={styles.adminBadge}>👑</span>}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>
                            {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                        </span>
                        <span className={styles.userEmail}>{user?.email}</span>
                        {isAdmin && (
                            <span className={styles.adminLabel}>
                                {language === 'tr' ? 'Yönetici' : 'Admin'}
                            </span>
                        )}
                    </div>
                    
                    <div className={styles.divider}></div>
                    
                    <button className={styles.menuItem} onClick={handleSignOut}>
                        <span>🚪</span>
                        {language === 'tr' ? 'Çıkış Yap' : 'Sign Out'}
                    </button>
                </div>
            )}
        </div>
    );
}
