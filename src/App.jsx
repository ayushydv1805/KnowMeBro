import React, { useEffect, useMemo, useState } from 'react';

const STARTER_QUESTIONS = [
  { question: 'What is my favourite food?', options: ['Pizza', 'Biryani', 'Burger', 'Momos'], correct: null },
  { question: 'What would I choose for a perfect weekend?', options: ['Road trip', 'Gaming at home', 'Movie marathon', 'Sleeping all day'], correct: null },
  { question: 'What kind of music do I enjoy the most?', options: ['Punjabi', 'Haryanvi', 'Bollywood', 'English'], correct: null },
  { question: 'What is my ideal travel plan?', options: ['Mountains', 'Beach', 'Big city', 'Village getaway'], correct: null },
  { question: 'What do I usually do when I am bored?', options: ['Listen to music', 'Play games', 'Scroll social media', 'Call a friend'], correct: null },
  { question: 'Which describes my personality best?', options: ['Chill', 'Funny', 'Adventurous', 'Quiet'], correct: null },
  { question: 'What type of movies do I prefer?', options: ['Comedy', 'Thriller', 'Horror', 'Romance'], correct: null },
  { question: 'What would I rather do with friends?', options: ['Hang out outside', 'Play games', 'Watch a movie', 'Just talk'], correct: null },
  { question: 'When am I usually more active?', options: ['Early morning', 'Afternoon', 'Evening', 'Late night'], correct: null },
  { question: 'What matters most to me in a friendship?', options: ['Trust', 'Humour', 'Loyalty', 'Shared interests'], correct: null }
];

const CATEGORIES = ['Favorites', 'Personality', 'Memories', 'Random', 'This or That'];

const SAMPLE_QUIZ = {
  title: 'How well do you know me?',
  creator: 'Your Name',
  questions: [
    { question: 'What is my go-to comfort food?', options: ['Pizza', 'Biryani', 'Burger', 'Momos'], correct: 1 },
    { question: 'Which would I choose for a free weekend?', options: ['Road trip', 'Gaming', 'Movie marathon', 'Sleep all day'], correct: 0 },
    { question: 'What am I most likely to do when I am bored?', options: ['Call a friend', 'Listen to music', 'Go outside', 'Scroll endlessly'], correct: 1 }
  ]
};

function Icon({ name, size = 20 }) {
  const paths = {
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" /></>,
    moon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    spark: <><path d="m12 3-1.5 5.5L5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z" /><path d="m19 17-.6 2.4L16 20l2.4.6L19 23l.6-2.4L22 20l-2.4-.6L19 17Z" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    trash: <><path d="M4 7h16" /><path d="M10 11v6M14 11v6" /><path d="m6 7 1 14h10l1-14M9 7V4h6v3" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.1.1l1.8-1.8a5 5 0 0 0-7.1-7.1L10.8 5" /><path d="M14 11a5 5 0 0 0-7.1-.1l-1.8 1.8a5 5 0 0 0 7.1 7.1l1-1" /></>,
    back: <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  };

  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      <span className={theme === 'light' ? 'active' : ''}><Icon name="sun" size={17} /></span>
      <span className={theme === 'dark' ? 'active' : ''}><Icon name="moon" size={17} /></span>
    </button>
  );
}

function Header({ theme, setTheme, onHome }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={onHome} type="button" aria-label="Go to KnowMeBro home">
        <span className="brand-mark">K</span>
        <span>KnowMe<span className="brand-accent">Bro</span></span>
      </button>

      <div className="header-actions">
        <a href="#how-it-works" className="nav-link">How it works</a>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
}

function Landing({ onCreate, onPreview }) {
  return (
    <main className="landing">
      <section className="hero">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />

        <div className="hero-copy">
          <div className="eyebrow"><Icon name="spark" size={16} /> The friendship test</div>
          <h1>Do they really<br /><span>know you?</span></h1>
          <p className="hero-text">
            Create 10 questions about yourself, send the challenge to your friends,
            and discover who actually pays attention. No awkward group chats required.
          </p>

          <div className="hero-actions">
            <button className="primary-btn large" onClick={onCreate} type="button">
              Create my quiz <Icon name="arrow" size={19} />
            </button>
            <button className="ghost-btn large" onClick={onPreview} type="button">
              <Icon name="eye" size={18} /> See a preview
            </button>
          </div>

          <div className="trust-row">
            <span><Icon name="check" size={16} /> 10 questions</span>
            <span><Icon name="check" size={16} /> Shareable challenge</span>
            <span><Icon name="check" size={16} /> Light + dark mode</span>
          </div>
        </div>

        <div className="hero-card-wrap" aria-hidden="true">
          <div className="floating-pill pill-top">🔥 Who knows you best?</div>
          <div className="quiz-preview-card">
            <div className="preview-header">
              <div>
                <span className="tiny-label">KNOWMEBRO CHALLENGE</span>
                <h3>How well do you know me?</h3>
              </div>
              <span className="question-count">01 / 10</span>
            </div>
            <div className="preview-progress"><span /></div>
            <p className="preview-question">What would I pick for a perfect Sunday?</p>
            <div className="preview-options">
              {['Road trip with friends', 'Stay home & game', 'Movie marathon', 'Sleep until noon'].map((option, i) => (
                <div className={`preview-option ${i === 0 ? 'selected' : ''}`} key={option}>
                  <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                  {option}
                  {i === 0 && <span className="option-dot" />}
                </div>
              ))}
            </div>
            <div className="preview-next">Next question <Icon name="arrow" size={15} /></div>
          </div>
          <div className="floating-pill pill-bottom">🫂 8/10 — Real one!</div>
        </div>
      </section>

      <section className="feature-strip" id="how-it-works">
        <div className="section-heading">
          <span className="eyebrow">Simple by design</span>
          <h2>Make the quiz. Send the link. <span>Expose the fake friends.</span> 😭</h2>
        </div>
        <div className="steps">
          {[
            ['01', 'Build your quiz', 'Write 10 things your friends should know about you.'],
            ['02', 'Share your challenge', 'Send one simple link to your friends anywhere.'],
            ['03', 'See who knows you', 'Compare scores and find your real ones.']
          ].map(([number, title, text]) => (
            <article className="step-card" key={number}>
              <span className="step-number">{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function QuizBuilder({ onBack, onDone }) {
  const [creator, setCreator] = useState('');
  const [title, setTitle] = useState('How well do you know me?');
  const [category, setCategory] = useState('Favorites');
  const [questions, setQuestions] = useState(STARTER_QUESTIONS);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [saved, setSaved] = useState(false);

  const current = questions[activeQuestion];
  const filledCount = questions.filter(q => q.correct !== null).length;

  const updateQuestion = (field, value) => {
    setQuestions(prev => prev.map((q, i) => i === activeQuestion ? { ...q, [field]: value } : q));
    setSaved(false);
  };

  const updateOption = (index, value) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== activeQuestion) return q;
      const options = [...q.options];
      options[index] = value;
      return { ...q, options };
    }));
    setSaved(false);
  };

  const createQuiz = () => {
    if (!creator.trim()) {
      alert('Please add your name or nickname first.');
      return;
    }
    const valid = questions.every(q => q.correct !== null);
    if (!valid) {
      alert('Choose one answer for all 10 questions before generating your quiz.');
      return;
    }

    const quiz = {
      id: (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`).replace(/-/g, '').slice(0, 8).toUpperCase(),
      creator: creator.trim(),
      title: title.trim() || 'How well do you know me?',
      category,
      questions,
      createdAt: new Date().toISOString()
    };

    try { localStorage.setItem('knowmebro-draft', JSON.stringify(quiz)); } catch {}
    setSaved(true);
    onDone(quiz);
  };

  return (
    <main className="builder-page">
      <div className="builder-top">
        <button className="back-btn" onClick={onBack} type="button"><Icon name="back" size={18} /> Back</button>
        <div className="builder-status">
          <span>{filledCount}/10 complete</span>
          <div className="mini-progress"><span style={{ width: `${filledCount * 10}%` }} /></div>
        </div>
      </div>

      <div className="builder-layout">
        <aside className="question-nav">
          <div className="builder-intro">
            <span className="eyebrow">Phase 1</span>
            <h2>Choose your answers</h2>
            <p>We give you the questions and options. Pick the answer that is true about you.</p>
          </div>

          <div className="question-list">
            {questions.map((q, index) => (
              <button
                type="button"
                key={index}
                className={`question-nav-item ${index === activeQuestion ? 'active' : ''} ${q.question.trim() ? 'filled' : ''}`}
                onClick={() => setActiveQuestion(index)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span className="question-nav-text">{q.question.trim() || 'Untitled question'}</span>
                {q.question.trim() && <Icon name="check" size={15} />}
              </button>
            ))}
          </div>
        </aside>

        <section className="builder-main">
          <div className="builder-card">
            <div className="builder-card-header">
              <div>
                <span className="question-kicker">QUIZ DETAILS</span>
                <h1>Set up your challenge</h1>
              </div>
              <span className="builder-badge"><Icon name="spark" size={14} /> {category}</span>
            </div>

            <div className="details-grid">
              <label className="field">
                <span>Your name / nickname</span>
                <input value={creator} onChange={e => setCreator(e.target.value)} placeholder="e.g. Ayush" maxLength={30} />
              </label>
              <label className="field">
                <span>Quiz title</span>
                <input value={title} onChange={e => setTitle(e.target.value)} maxLength={50} />
              </label>
            </div>

            <label className="field category-field">
              <span>Question vibe</span>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(item => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>

          <div className="builder-card question-editor">
            <div className="question-editor-top">
              <div>
                <span className="question-kicker">QUESTION {String(activeQuestion + 1).padStart(2, '0')}</span>
                <h2>Pick the answer that describes you</h2>
              </div>
              <span className="question-counter">{activeQuestion + 1} / 10</span>
            </div>

            <div className="predefined-question">
              <span className="question-kicker">PREDEFINED QUESTION</span>
              <h2>{current.question}</h2>
              <p>Choose the option that is true about you.</p>
            </div>

            <div className="options-label">
              <span>Your answer</span>
              <small>Pick exactly one</small>
            </div>

            <div className="options-editor">
              {current.options.map((option, index) => (
                <button
                  type="button"
                  className={`answer-row answer-choice ${current.correct === index ? 'correct' : ''}`}
                  key={option}
                  onClick={() => updateQuestion('correct', index)}
                  aria-pressed={current.correct === index}
                >
                  <span className="correct-radio">
                    {current.correct === index && <span />}
                  </span>
                  <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="answer-choice-text">{option}</span>
                  {current.correct === index && <span className="correct-label">Your answer</span>}
                </button>
              ))}
            </div>

            <div className="editor-footer">
              <button
                type="button"
                className="secondary-btn"
                disabled={activeQuestion === 0}
                onClick={() => setActiveQuestion(q => Math.max(0, q - 1))}
              >
                <Icon name="back" size={16} /> Previous
              </button>

              {activeQuestion < 9 ? (
                <button type="button" className="primary-btn" onClick={() => setActiveQuestion(q => Math.min(9, q + 1))}>
                  Save & next <Icon name="arrow" size={17} />
                </button>
              ) : (
                <button type="button" className="primary-btn" onClick={createQuiz}>
                  Generate my quiz <Icon name="spark" size={17} />
                </button>
              )}
            </div>
          </div>

          <div className="builder-tip">
            <Icon name="spark" size={18} />
            <div><strong>No typing needed.</strong> KnowMeBro gives you 10 ready-made questions with 4 options each. Just choose your answer, then share the quiz.</div>
          </div>

          {saved && <div className="save-note"><Icon name="check" size={17} /> Your quiz is saved in this browser.</div>}
        </section>
      </div>
    </main>
  );
}

function QuizCreated({ quiz, onHome, onEdit }) {
  const shareUrl = `${window.location.origin}/?quiz=${quiz.id}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Quiz link copied!');
    } catch {
      window.prompt('Copy your quiz link:', shareUrl);
    }
  };

  return (
    <main className="created-page">
      <div className="success-orb"><Icon name="check" size={34} /></div>
      <span className="eyebrow">Quiz created</span>
      <h1>Your challenge is ready, <span>{quiz.creator}</span>.</h1>
      <p className="created-subtitle">Phase 1 is alive. Your quiz is saved locally and has a unique challenge ID.</p>

      <div className="share-card">
        <div className="share-card-head">
          <div>
            <span className="tiny-label">YOUR CHALLENGE</span>
            <h2>{quiz.title}</h2>
          </div>
          <span className="quiz-id">#{quiz.id}</span>
        </div>

        <div className="share-link-box">
          <Icon name="link" size={18} />
          <span>{shareUrl}</span>
        </div>

        <div className="share-actions">
          <button className="primary-btn" type="button" onClick={copyLink}><Icon name="link" size={17} /> Copy link</button>
          <button className="secondary-btn" type="button" onClick={onEdit}><Icon name="back" size={16} /> Edit quiz</button>
        </div>

        <div className="phase-note">
          <Icon name="spark" size={18} />
          <span><strong>Next:</strong> Phase 2 will connect this link to a real database so friends can take the quiz from any device.</span>
        </div>
      </div>

      <div className="created-stats">
        <div><strong>10</strong><span>Questions</span></div>
        <div><strong>4</strong><span>Answers each</span></div>
        <div><strong>1</strong><span>Shareable ID</span></div>
      </div>

      <button className="text-btn" type="button" onClick={onHome}>← Back to home</button>
    </main>
  );
}

function Preview({ onBack }) {
  const [selected, setSelected] = useState(null);
  const question = SAMPLE_QUIZ.questions[0];

  return (
    <main className="preview-page">
      <div className="preview-shell">
        <button className="back-btn" onClick={onBack} type="button"><Icon name="back" size={18} /> Back</button>
        <div className="preview-breadcrumb">FRIEND CHALLENGE <span>•</span> 01 / 10</div>

        <div className="friend-card">
          <div className="friend-card-top">
            <div>
              <span className="tiny-label">A QUIZ BY YOUR FRIEND</span>
              <h1>{SAMPLE_QUIZ.title}</h1>
            </div>
            <div className="friend-avatar">Y</div>
          </div>

          <div className="big-progress"><span style={{ width: '10%' }} /></div>
          <p className="friend-question">{question.question}</p>

          <div className="friend-options">
            {question.options.map((option, i) => (
              <button
                type="button"
                className={`friend-option ${selected === i ? 'selected' : ''}`}
                onClick={() => setSelected(i)}
                key={option}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {option}
                {selected === i && <Icon name="check" size={18} />}
              </button>
            ))}
          </div>

          <button className="primary-btn full" disabled={selected === null} type="button">
            Next question <Icon name="arrow" size={17} />
          </button>

          <p className="preview-disclaimer">This is a Phase 1 preview. Real friend responses arrive in Phase 2.</p>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('knowmebro-theme') || 'light'; } catch { return 'light'; } });
  const [screen, setScreen] = useState('home');
  const [createdQuiz, setCreatedQuiz] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('knowmebro-theme', theme); } catch {}
  }, [theme]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('quiz')) {
      let saved = null; try { saved = localStorage.getItem('knowmebro-draft'); } catch {}
      if (saved) {
        try {
          const quiz = JSON.parse(saved);
          if (quiz.id === params.get('quiz')) {
            setCreatedQuiz(quiz);
            setScreen('created');
          }
        } catch {
          // Ignore malformed local draft.
        }
      }
    }
  }, []);

  const page = useMemo(() => {
    if (screen === 'builder') {
      return <QuizBuilder onBack={() => setScreen('home')} onDone={(quiz) => { setCreatedQuiz(quiz); setScreen('created'); }} />;
    }
    if (screen === 'created' && createdQuiz) {
      return <QuizCreated quiz={createdQuiz} onHome={() => setScreen('home')} onEdit={() => setScreen('builder')} />;
    }
    if (screen === 'preview') {
      return <Preview onBack={() => setScreen('home')} />;
    }
    return <Landing onCreate={() => setScreen('builder')} onPreview={() => setScreen('preview')} />;
  }, [screen, createdQuiz]);

  return (
    <div className="app">
      <Header theme={theme} setTheme={setTheme} onHome={() => setScreen('home')} />
      {page}
    </div>
  );
}
