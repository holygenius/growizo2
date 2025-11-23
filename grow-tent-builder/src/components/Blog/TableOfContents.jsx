import React, { useEffect, useState } from 'react';

const TableOfContents = ({ headings, activeId }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleClick = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            // Offset for fixed navbar
            const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setIsMobileOpen(false);
        }
    };

    if (!headings || headings.length === 0) return null;

    return (
        <nav className="toc-container">
            <div className="toc-header" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                <h3>
                    <span className="icon">📑</span>
                    İÇİNDEKİLER
                </h3>
                <span className={`mobile-toggle ${isMobileOpen ? 'open' : ''}`}>▼</span>
            </div>

            <ul className={`toc-list ${isMobileOpen ? 'open' : ''}`}>
                {headings.map((heading) => (
                    <li key={heading.id} className={`toc-item level-${heading.level}`}>
                        <a
                            href={`#${heading.id}`}
                            className={`toc-link ${activeId === heading.id ? 'active' : ''}`}
                            onClick={(e) => handleClick(e, heading.id)}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TableOfContents;
