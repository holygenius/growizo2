import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { blogPosts } from './blogData';
import Footer from '../Footer';

const Quiz = ({ data }) => {
  const { language } = useSettings();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Reset state when data changes (e.g. navigating to a new post)
  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  }, [data]);

  const handleOptionSelect = (index) => {
    if (!showResult) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    setShowResult(true);
    if (selectedOption === data[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < data.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    return (
      <div className="quiz-container fade-in-up">
        <div className="quiz-result">
          <h3>🎉 {language === 'tr' ? 'Test Tamamlandı!' : 'Quiz Completed!'}</h3>
          <div className="score-circle">
            <span className="score-number">{score}</span>
            <span className="score-total">/ {data.length}</span>
          </div>
          <p className="score-message">
            {score === data.length
              ? (language === 'tr' ? "Mükemmel skor! Sen bir usta yetiştiricisin! 🌿" : "Perfect score! You're a master grower! 🌿")
              : score >= data.length / 2
                ? (language === 'tr' ? "İyi iş! Konuya hakimsin. 👍" : "Good job! You know your stuff. 👍")
                : (language === 'tr' ? "Öğrenmeye devam! Bir dahaki sefere yaparsın. 📚" : "Keep learning! You'll get it next time. 📚")}
          </p>
          <button className="quiz-submit-btn" onClick={handleRetake}>
            {language === 'tr' ? 'Testi Tekrarla' : 'Retake Quiz'}
          </button>
        </div>
      </div>
    );
  }

  const question = data[currentQuestion];
  const isCorrect = selectedOption === question.correctAnswer;
  // support both old shape (options: []) and new bilingual shape (options: { en: [], tr: [] })
  const optionsForQuestion = Array.isArray(question.options)
    ? question.options
    : (question.options?.[language] || []);

  return (
    <div className="quiz-container fade-in-up">
      <div className="quiz-header">
        <div className="quiz-progress">
          <span>{language === 'tr' ? 'Soru' : 'Question'} {currentQuestion + 1} / {data.length}</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / data.length) * 100}%` }}
            />
          </div>
        </div>
        <h3>🧠 {language === 'tr' ? 'Bilgini Test Et' : 'Test Your Knowledge'}</h3>
      </div>

      <div className="quiz-body">
        <p className="quiz-question">{question.question[language]}</p>
        <div className="quiz-options">
          {optionsForQuestion.map((optionText, index) => (
            <button
              key={index}
              className={`quiz-option ${selectedOption === index ? 'selected' : ''} ${showResult && index === question.correctAnswer ? 'correct' : ''} ${showResult && selectedOption === index && !isCorrect ? 'incorrect' : ''}`}
              onClick={() => handleOptionSelect(index)}
              disabled={showResult}
            >
              {optionText}
              {showResult && index === question.correctAnswer && <span className="icon">✅</span>}
              {showResult && selectedOption === index && !isCorrect && <span className="icon">❌</span>}
            </button>
          ))}
        </div>

        {!showResult ? (
          <button
            className="quiz-submit-btn"
            onClick={handleSubmit}
            disabled={selectedOption === null}
          >
            {language === 'tr' ? 'Cevabı Kontrol Et' : 'Check Answer'}
          </button>
        ) : (
          <div className="quiz-feedback-container">
            <div className={`quiz-feedback ${isCorrect ? 'success' : 'error'}`}>
              <h4>{isCorrect ? (language === 'tr' ? 'Doğru!' : 'Correct!') : (language === 'tr' ? 'Tam olarak değil...' : 'Not quite...')}</h4>
              <p>{question.explanation[language]}</p>
            </div>
            <button className="quiz-next-btn" onClick={handleNext}>
              {currentQuestion < data.length - 1
                ? (language === 'tr' ? 'Sonraki Soru →' : 'Next Question →')
                : (language === 'tr' ? 'Sonuçları Gör →' : 'See Results →')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import Navbar from '../Navbar';

import TableOfContents from './TableOfContents';

const BlogPost = () => {
  const { language, setLanguage } = useSettings();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('');

  // Find post by checking both English and Turkish slugs
  const post = blogPosts.find(p => p.slug.en === slug || p.slug.tr === slug);

  // When slug changes via navigation, sync language to match the URL
  useEffect(() => {
    if (!post || !slug) return;

    const slugLanguage = post.slug.en === slug ? 'en' : 'tr';

    // Only update language if it doesn't match the URL
    if (language !== slugLanguage) {
      setLanguage(slugLanguage);
    }
  }, [slug]); // Only depend on slug to avoid conflicts with language changes

  // When language changes via user action, navigate to the corresponding slug
  useEffect(() => {
    if (!post || !slug) return;

    const currentSlugLanguage = post.slug.en === slug ? 'en' : 'tr';

    // If user changed language and it doesn't match current URL, navigate
    if (language !== currentSlugLanguage) {
      const targetSlug = post.slug[language];
      if (targetSlug && targetSlug !== slug) {
        navigate(`/blog/${targetSlug}`);
      }
    }
  }, [language]); // Only depend on language to trigger navigation on user change

  // Update page title when language or post changes
  useEffect(() => {
    if (post) {
      document.title = `${post.title[language]} | Grow Wizard Blog`;
    }
  }, [language, post]);

  // Scroll to top when navigating to a new post
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Parse content to extract headings and inject IDs
  const { processedContent, headings } = React.useMemo(() => {
    if (!post) return { processedContent: '', headings: [] };

    const rawContent = post.content[language];
    const headingsList = [];

    // Regex to match h2 and h3 tags
    // We use a function replacer to build the headings list and inject IDs
    const contentWithIds = rawContent.replace(/<h([23])>(.*?)<\/h\1>/g, (match, level, text) => {
      // Create a simple slug from text for the ID
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\u00C0-\u00FF]+/g, '-') // Support international characters
        .replace(/^-+|-+$/g, '');

      headingsList.push({ id, text, level: parseInt(level) });

      return `<h${level} id="${id}">${text}</h${level}>`;
    });

    return { processedContent: contentWithIds, headings: headingsList };
  }, [post, language]);

  // ScrollSpy Logic
  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' } // Adjust these values to trigger earlier/later
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!post) {
    return (
      <div className="not-found-container">
        <Navbar />
        <h2>{language === 'tr' ? 'Yazı Bulunamadı' : 'Post Not Found'}</h2>
        <p>{language === 'tr' ? 'Aradığınız makale mevcut değil veya taşınmış.' : "The article you're looking for doesn't exist or has been moved."}</p>
        <Link to="/blog" className="back-btn">{language === 'tr' ? 'Bloga Dön' : 'Back to Blog'}</Link>
      </div>
    );
  }

  return (
    <div className="blog-post-container">
      <Navbar />
      <div className="post-hero" style={{ backgroundImage: `url(${post.image})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <div className="post-nav">
            <Link to="/blog" className="back-link">← {language === 'tr' ? 'Bloga Dön' : 'Back to Blog'}</Link>
          </div>
          <div className="post-tags">
            <span className="post-category">{post.category}</span>
          </div>
          <h1>{post.title[language]}</h1>
          <div className="post-meta">
            <span className="author">{language === 'tr' ? 'Yazar:' : 'By'} {post.author}</span>
            <span className="dot">•</span>
            <span className="date">{post.date}</span>
            <span className="dot">•</span>
            <span className="read-time">{post.readTime}</span>
          </div>
        </div>
      </div>

      <div className="blog-layout container">
        <aside className="blog-sidebar">
          <div className="sticky-wrapper">
            <TableOfContents headings={headings} activeId={activeId} />

            <div className="share-widget">
              <h4>{language === 'tr' ? 'PAYLAŞ' : 'SHARE'}</h4>
              <div className="share-buttons-row">
                <button className="share-icon-btn" title="WhatsApp">💬</button>
                <button className="share-icon-btn" title="Twitter">𝕏</button>
                <button className="share-icon-btn" title="LinkedIn">in</button>
                <button className="share-icon-btn" title="Facebook">f</button>
              </div>
            </div>
          </div>
        </aside>

        <article className="post-content">
          <div className="content-body" dangerouslySetInnerHTML={{ __html: processedContent }} />

          {post.quiz && post.quiz.length > 0 && <Quiz data={post.quiz} />}
        </article>
      </div>

      <Footer />

      <style>{`
        .blog-post-container {
          background: var(--bg-app);
          min-height: 100vh;
          padding-bottom: 4rem;
        }

        .post-hero {
          height: 60vh;
          min-height: 400px;
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          align-items: flex-end;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(15, 23, 42, 0.3), var(--bg-app));
        }

        .hero-content {
          position: relative;
          z-index: 1;
          padding-bottom: 4rem;
          width: 100%;
        }

        .back-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          margin-bottom: 2rem;
          display: inline-block;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: var(--color-primary);
        }

        .post-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .post-category {
          color: var(--color-primary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          display: block;
        }

        .hero-content h1 {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          max-width: 900px;
        }

        .post-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--text-secondary);
          font-size: 1rem;
        }

        /* New Layout Styles */
        .blog-layout {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 4rem;
            margin-top: -4rem; /* Pull up into hero */
            position: relative;
            z-index: 2;
        }

        .blog-sidebar {
            position: relative;
        }

        .sticky-wrapper {
            position: sticky;
            top: 120px; /* Adjust based on navbar height */
        }

        .post-content {
            min-width: 0; /* Prevent overflow in grid */
        }

        /* TOC Styles */
        .toc-container {
            margin-bottom: 3rem;
        }

        .toc-header h3 {
            font-size: 0.9rem;
            font-weight: 700;
            color: var(--text-primary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
            border-left: 2px solid var(--border-color);
        }

        .toc-item {
            margin: 0;
        }

        .toc-link {
            display: block;
            padding: 0.5rem 0 0.5rem 1.5rem;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.95rem;
            line-height: 1.4;
            transition: all 0.2s;
            border-left: 2px solid transparent;
            margin-left: -2px;
        }

        .toc-link:hover {
            color: var(--color-primary);
        }

        .toc-link.active {
            color: var(--color-primary);
            border-left-color: var(--color-primary);
            font-weight: 500;
        }

        .toc-item.level-3 .toc-link {
            padding-left: 2.5rem;
            font-size: 0.9rem;
        }

        /* Share Widget Styles */
        .share-widget h4 {
            font-size: 0.8rem;
            font-weight: 700;
            color: var(--text-secondary);
            margin-bottom: 1rem;
            letter-spacing: 0.05em;
        }

        .share-buttons-row {
            display: flex;
            gap: 0.75rem;
        }

        .share-icon-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid var(--border-color);
            background: var(--bg-surface);
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 1.1rem;
        }

        .share-icon-btn:hover {
            border-color: var(--color-primary);
            color: var(--color-primary);
            transform: translateY(-2px);
        }

        /* Content Styles */
        .content-body {
          font-size: 1.125rem;
          line-height: 1.8;
          color: var(--text-secondary);
        }

        .content-body h2 {
            color: var(--text-primary);
            font-size: 2rem;
            margin: 3rem 0 1.5rem;
            scroll-margin-top: 120px; /* For sticky header */
        }

        .content-body h3 {
          color: var(--text-primary);
          font-size: 1.5rem;
          margin: 2.5rem 0 1rem;
          scroll-margin-top: 120px;
        }

        .content-body p {
          margin-bottom: 1.5rem;
        }

        .content-body ul, .content-body ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .content-body li {
          margin-bottom: 0.5rem;
        }

        .content-body blockquote {
          border-left: 4px solid var(--color-primary);
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: var(--text-primary);
          font-size: 1.25rem;
        }

        /* Quiz Styles */
        .quiz-container {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 2rem;
          margin: 4rem 0;
        }

        .quiz-header {
          margin-bottom: 1.5rem;
        }

        .quiz-progress {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .progress-bar {
          height: 4px;
          background: var(--bg-surface);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--color-primary);
          transition: width 0.3s ease;
        }

        .quiz-header h3 {
          color: var(--text-primary);
          margin: 0;
        }

        .quiz-question {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }

        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .quiz-option {
          padding: 1rem;
          border: 2px solid var(--border-color);
          background: transparent;
          color: var(--text-secondary);
          border-radius: 0.5rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1rem;
        }

        .quiz-option:hover:not(:disabled) {
          border-color: var(--color-primary);
          background: var(--bg-surface);
        }

        .quiz-option.selected {
          border-color: var(--color-primary);
          background: rgba(16, 185, 129, 0.1);
        }

        .quiz-option.correct {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.2);
          color: white;
        }

        .quiz-option.incorrect {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.2);
        }

        .quiz-submit-btn, .quiz-next-btn {
          background: var(--color-primary);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .quiz-submit-btn:hover, .quiz-next-btn:hover {
          background: #059669;
        }

        .quiz-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quiz-feedback-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .quiz-feedback {
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .quiz-feedback.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid #10b981;
        }

        .quiz-feedback.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
        }

        .quiz-feedback h4 {
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        /* Quiz Result */
        .quiz-result {
          text-align: center;
          padding: 2rem 0;
        }

        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 2rem auto;
          flex-direction: column;
          background: rgba(16, 185, 129, 0.1);
        }

        .score-number {
          font-size: 3rem;
          font-weight: 800;
          color: var(--color-primary);
          line-height: 1;
        }

        .score-total {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .score-message {
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-bottom: 2rem;
        }

        /* Mobile Responsive */
        @media (max-width: 1024px) {
            .blog-layout {
                grid-template-columns: 1fr;
                gap: 2rem;
            }

            .blog-sidebar {
                order: -1; /* Move TOC to top on mobile */
            }

            .sticky-wrapper {
                position: static;
            }

            .toc-container {
                background: var(--bg-card);
                padding: 1rem;
                border-radius: 0.5rem;
                border: 1px solid var(--border-color);
            }

            .toc-header {
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .toc-header h3 {
                margin-bottom: 0;
            }

            .mobile-toggle {
                display: block;
                transition: transform 0.3s;
            }

            .mobile-toggle.open {
                transform: rotate(180deg);
            }

            .toc-list {
                display: none;
                margin-top: 1rem;
            }

            .toc-list.open {
                display: block;
            }

            .share-widget {
                display: none; /* Hide share widget on mobile sidebar to save space */
            }
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2rem;
          }

          .post-meta {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogPost;
