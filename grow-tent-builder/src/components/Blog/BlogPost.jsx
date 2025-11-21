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
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option ${selectedOption === index ? 'selected' : ''} ${showResult && index === question.correctAnswer ? 'correct' : ''} ${showResult && selectedOption === index && !isCorrect ? 'incorrect' : ''}`}
              onClick={() => handleOptionSelect(index)}
              disabled={showResult}
            >
              {option}
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

const BlogPost = () => {
  const { language, setLanguage } = useSettings();
  const { slug } = useParams();
  const navigate = useNavigate();

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

  if (!post) {
    return (
      <div className="not-found-container">
        <h2>{language === 'tr' ? 'Yazı Bulunamadı' : 'Post Not Found'}</h2>
        <p>{language === 'tr' ? 'Aradığınız makale mevcut değil veya taşınmış.' : "The article you're looking for doesn't exist or has been moved."}</p>
        <Link to="/blog" className="back-btn">{language === 'tr' ? 'Bloga Dön' : 'Back to Blog'}</Link>
      </div>
    );
  }

  return (
    <div className="blog-post-container">
      <div className="post-hero" style={{ backgroundImage: `url(${post.image})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <div className="post-nav">
            <Link to="/blog" className="back-link">← {language === 'tr' ? 'Bloga Dön' : 'Back to Blog'}</Link>
            <div className="nav-actions">
              <Link to="/" className="nav-btn home-btn">🏠 {language === 'tr' ? 'Ana Sayfa' : 'Home'}</Link>
              <Link to="/builder" className="nav-btn app-btn">🚀 {language === 'tr' ? 'Uygulama' : 'App'}</Link>
            </div>
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

      <article className="post-content container">
        <div className="content-body" dangerouslySetInnerHTML={{ __html: post.content[language] }} />

        {post.quiz && post.quiz.length > 0 && <Quiz data={post.quiz} />}

        <div className="post-footer">
          <div className="share-section">
            <span>{language === 'tr' ? 'Bu makaleyi paylaş:' : 'Share this article:'}</span>
            <div className="share-buttons">
              <button className="share-btn twitter">Twitter</button>
              <button className="share-btn facebook">Facebook</button>
              <button className="share-btn linkedin">LinkedIn</button>
            </div>
          </div>
        </div>
      </article>

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

        .nav-actions {
          display: flex;
          gap: 1rem;
        }

        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .home-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .home-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .app-btn {
          background: var(--color-primary);
          color: white;
        }

        .app-btn:hover {
          background: #059669;
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

        .post-content {
          max-width: 800px;
          margin: -2rem auto 0;
          position: relative;
          z-index: 2;
        }

        .content-body {
          font-size: 1.125rem;
          line-height: 1.8;
          color: var(--text-secondary);
        }

        .content-body h3 {
          color: var(--text-primary);
          font-size: 1.75rem;
          margin: 2.5rem 0 1rem;
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

        /* Share Section */
        .post-footer {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }

        .share-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .share-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .share-btn {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border-color);
          background: transparent;
          color: var(--text-secondary);
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .share-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
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
