import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { getBlogPosts, getBlogPostBySlug } from '../../services/blogApi';
import Footer from '../Footer';
import styles from './BlogPost.module.css';

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
      <div className={`${styles.quizContainer} fade-in-up`}>
        <div className={styles.quizResult}>
          <h3>🎉 {language === 'tr' ? 'Test Tamamlandı!' : 'Quiz Completed!'}</h3>
          <div className={styles.scoreCircle}>
            <span className={styles.scoreNumber}>{score}</span>
            <span className={styles.scoreTotal}>/ {data.length}</span>
          </div>
          <p className={styles.scoreMessage}>
            {score === data.length
              ? (language === 'tr' ? "Mükemmel skor! Sen bir usta yetiştiricisin! 🌿" : "Perfect score! You're a master grower! 🌿")
              : score >= data.length / 2
                ? (language === 'tr' ? "İyi iş! Konuya hakimsin. 👍" : "Good job! You know your stuff. 👍")
                : (language === 'tr' ? "Öğrenmeye devam! Bir dahaki sefere yaparsın. 📚" : "Keep learning! You'll get it next time. 📚")}
          </p>
          <button className={styles.quizSubmitBtn} onClick={handleRetake}>
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
    <div className={`${styles.quizContainer} fade-in-up`}>
      <div className={styles.quizHeader}>
        <div className={styles.quizProgress}>
          <span>{language === 'tr' ? 'Soru' : 'Question'} {currentQuestion + 1} / {data.length}</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((currentQuestion + 1) / data.length) * 100}%` }}
            />
          </div>
        </div>
        <h3>🧠 {language === 'tr' ? 'Bilgini Test Et' : 'Test Your Knowledge'}</h3>
      </div>

      <div>
        <p className={styles.quizQuestion}>{question.question[language]}</p>
        <div className={styles.quizOptions}>
          {optionsForQuestion.map((optionText, index) => (
            <button
              key={index}
              className={`${styles.quizOption} ${selectedOption === index ? styles.quizOptionSelected : ''} ${showResult && index === question.correctAnswer ? styles.quizOptionCorrect : ''} ${showResult && selectedOption === index && !isCorrect ? styles.quizOptionIncorrect : ''}`}
              onClick={() => handleOptionSelect(index)}
              disabled={showResult}
            >
              {optionText}
              {showResult && index === question.correctAnswer && <span>✅</span>}
              {showResult && selectedOption === index && !isCorrect && <span>❌</span>}
            </button>
          ))}
        </div>

        {!showResult ? (
          <button
            className={styles.quizSubmitBtn}
            onClick={handleSubmit}
            disabled={selectedOption === null}
          >
            {language === 'tr' ? 'Cevabı Kontrol Et' : 'Check Answer'}
          </button>
        ) : (
          <div className={styles.quizFeedbackContainer}>
            <div className={`${styles.quizFeedback} ${isCorrect ? styles.quizFeedbackSuccess : styles.quizFeedbackError}`}>
              <h4>{isCorrect ? (language === 'tr' ? 'Doğru!' : 'Correct!') : (language === 'tr' ? 'Tam olarak değil...' : 'Not quite...')}</h4>
              <p>{question.explanation[language]}</p>
            </div>
            <button className={styles.quizNextBtn} onClick={handleNext}>
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

import { Helmet } from 'react-helmet-async';

const BlogPost = () => {
  const { language, setLanguage, getLocalizedPath } = useSettings();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('');
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch post from Supabase
  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const fetchedPost = await getBlogPostBySlug(slug, language);
      setPost(fetchedPost);
      setLoading(false);
    }
    fetchPost();
  }, [slug, language]);

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
        navigate(getLocalizedPath(`/blog/${targetSlug}`));
      }
    }
  }, [language]); // Only depend on language to trigger navigation on user change

  // Update page title when language or post changes
  useEffect(() => {
    // Document title is now handled by Helmet, but we can keep this as fallback or remove it.
    // Helmet will take precedence.
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

  // ScrollSpy Logic using Scroll Event (More robust for "active section" tracking)
  useEffect(() => {
    if (!headings.length) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for navbar + breathing room

      // Find the last heading that is above the current scroll position
      let currentId = '';

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const { offsetTop } = element;
          if (scrollPosition >= offsetTop) {
            currentId = heading.id;
          } else {
            // Since headings are ordered, once we find one below us, we can stop
            break;
          }
        }
      }

      if (currentId && currentId !== activeId) {
        setActiveId(currentId);
      } else if (!currentId && headings.length > 0) {
        // If we are at the top, active the first one or none?
        // Usually first one if we are close to it, or none if very top.
        // Let's default to the first one if we are past the hero but before the first header
        const firstHeader = document.getElementById(headings[0].id);
        if (firstHeader && window.scrollY > 400) { // Arbitrary hero height check
          setActiveId(headings[0].id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on mount to set initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, activeId]);

  if (loading) {
    return (
      <div className={styles.notFoundContainer}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>{language === 'tr' ? 'Yükleniyor...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.notFoundContainer}>
        <Navbar />
        <h2>{language === 'tr' ? 'Yazı Bulunamadı' : 'Post Not Found'}</h2>
        <p>{language === 'tr' ? 'Aradığınız makale mevcut değil veya taşınmış.' : "The article you're looking for doesn't exist or has been moved."}</p>
        <Link to={getLocalizedPath('/blog')}>{language === 'tr' ? 'Bloga Dön' : 'Back to Blog'}</Link>
      </div>
    );
  }

  return (
    <div className={styles.blogPostContainer}>
      <Helmet>
        <title>{post.title[language]} | GroWizard Blog</title>
        <meta name="description" content={post.excerpt[language]} />
      </Helmet>
      <Navbar />
      <div className={styles.postHero} style={{ backgroundImage: `url(${post.image})` }}>
        <div className={styles.heroOverlay}></div>
        <div className={`${styles.heroContent} container`}>
          <div className={styles.postNav}>
            <Link to={getLocalizedPath('/blog')} className={styles.backLink}>← {language === 'tr' ? 'Bloga Dön' : 'Back to Blog'}</Link>
          </div>
          <div>
            <span className={styles.postCategory}>{post.category}</span>
          </div>
          <h1>{post.title[language]}</h1>
          <div className={styles.postMeta}>
            <span>{language === 'tr' ? 'Yazar:' : 'By'} {post.author}</span>
            <span className={styles.dot}>•</span>
            <span>{post.date}</span>
            <span className={styles.dot}>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      <div className={`${styles.blogLayout} container`}>
        <aside className={styles.blogSidebar}>
          <div className={styles.stickyWrapper}>
            <TableOfContents headings={headings} activeId={activeId} />

            <div className={styles.shareWidget}>
              <h4>{language === 'tr' ? 'PAYLAŞ' : 'SHARE'}</h4>
              <div className={styles.shareButtonsRow}>
                <button className={styles.shareIconBtn} title="WhatsApp">💬</button>
                <button className={styles.shareIconBtn} title="Twitter">𝕏</button>
                <button className={styles.shareIconBtn} title="LinkedIn">in</button>
                <button className={styles.shareIconBtn} title="Facebook">f</button>
              </div>
            </div>
          </div>
        </aside>

        <article className={styles.postContent}>
          <div className={styles.contentBody} dangerouslySetInnerHTML={{ __html: processedContent }} />

          {post.quiz && post.quiz.length > 0 && <Quiz data={post.quiz} />}
        </article>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPost;


