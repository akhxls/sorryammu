import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import './App.css'

function App() {
  const [mounted, setMounted] = useState(false)
  const [started, setStarted] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [pleadCount, setPleadCount] = useState(0)
  const [acceptCount, setAcceptCount] = useState(0)
  const [particles, setParticles] = useState([])
  const [tulips, setTulips] = useState([])
  const [showFlowerModal, setShowFlowerModal] = useState(false)
  const [showLoveModal, setShowLoveModal] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [showGiftModal, setShowGiftModal] = useState(false)
  const TARGET_ACCEPTS = 50

  const pleads = [
    "Please forgive me...",
    "I really mean it!",
    "Don't break my heart 💔",
    "I'll buy you chocolates 🍫",
    "Pretty please? 🥺"
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (accepted && started) {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const randomInRange = (min, max) => Math.random() * (max - min) + min

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)
    }
  }, [accepted, started])

  const handleStart = () => {
    setStarted(true)
    // Play music
    const audio = new Audio('/music.mp3')
    audio.loop = true
    audio.volume = 0.5
    audio.play().catch(e => console.log("Audio play failed:", e))
  }

  const handleFlowerAccept = () => {
    setShowFlowerModal(false)
    // Bloom the garden after accepting
    const newTulips = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      left: `${(i / 15) * 100}%`,
      delay: Math.random() * 2
    }))
    setTulips(newTulips)
  }

  const handleLoveAccept = () => {
    setShowLoveModal(false)
  }

  const handleAccept = (e) => {
    if (showFlowerModal || showLoveModal) return // Prevent clicks if modal is open

    if (acceptCount < TARGET_ACCEPTS) {
      const newCount = acceptCount + 1
      setAcceptCount(newCount)

      // Trigger Flower Modal at 25
      if (newCount === 25) {
        setShowFlowerModal(true)
        return // Stop particle generation for this click to focus on modal
      }

      // Trigger Love Modal at 40
      if (newCount === 40) {
        setShowLoveModal(true)
        return
      }

      // Create floating particle
      const id = Date.now()
      const rect = e.target.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top

      const randomX = (Math.random() - 0.5) * 100

      const newParticle = {
        id,
        x: x + randomX,
        y: y,
        text: "I am sorry 🥺"
      }

      setParticles(prev => [...prev, newParticle])

      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id))
      }, 1500)
    }

    if (acceptCount + 1 >= TARGET_ACCEPTS) {
      setAccepted(true)
    }
  }

  const handleReject = () => {
    setPleadCount((prev) => (prev + 1) % pleads.length)
  }

  return (
    <div className={`container ${mounted ? 'visible' : ''}`}>
      {/* Flower Modal */}
      {showFlowerModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1 className="title" style={{ fontSize: '4rem' }}>You deserve flowers!</h1>
            <div className="giant-bouquet">💐</div>
            <p className="subtitle">For being the best girlfriend ever.</p>
            <button className="btn btn-accept" onClick={handleFlowerAccept}>
              Yes, I accept! 💖
            </button>
          </div>
        </div>
      )}

      {/* Love Modal */}
      {showLoveModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1 className="title" style={{ fontSize: '4rem' }}>Do you love me?</h1>
            <div className="giant-bouquet">🥺</div>
            <div className="button-group">
              <button className="btn btn-accept" onClick={handleLoveAccept}>
                Yes, I do! 💘
              </button>
              <button className="btn btn-accept" onClick={handleLoveAccept}>
                Of course! 💒
              </button>
            </div>
          </div>
        </div>
      )}

      {particles.map(p => (
        <div
          key={p.id}
          className="floating-sorry"
          style={{ left: p.x, top: p.y }}
        >
          {p.text}
        </div>
      ))}

      {/* Tulip Garden */}
      <div className="tulip-garden">
        {tulips.map(t => (
          <div
            key={t.id}
            className="tulip"
            style={{ left: t.left, animationDelay: `${t.delay}s` }}
          >
            🌷
          </div>
        ))}
      </div>

      <div className={`card ${accepted ? 'card-wide' : ''}`}>
        {!started ? (
          <div className="welcome-content">
            <h1 className="title" style={{ fontSize: '5rem' }}>Kuttu Messed Up</h1>
            <p className="subtitle">Welcome to the game</p>
            <div className="heart">🎮</div>
            <button className="btn btn-accept" onClick={handleStart} style={{ fontSize: '1.5rem', padding: '1rem 3rem' }}>
              Play Game
            </button>
          </div>
        ) : accepted ? (
          <div className="success-content">
            <h1 className="title" style={{ fontSize: '4rem' }}>I Love You</h1>
            <p className="subtitle" style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
              I am so sorry my baby. I never wanted to hurt you like this. You mean so much to me.
              I miss your smile, your laugh and seeing you happy. Please come back to me.
              Please don't see me differently. I will make it up to you I swear.
              I don't know what you think of me but I like to believe I am still the person you fell in love with.
              Please forgive my mistakes. I love you sooooo much.
            </p>
            <div className="heart">💖</div>

            <p style={{ fontSize: '1rem', marginTop: '1rem', color: '#ffd700', fontWeight: 'bold', animation: 'fadeIn 2s' }}>
              (Click on the floating gift box! 🎁)
            </p>

            {/* Secret Code Section */}
            <div style={{ marginTop: '2rem' }}>
              {!showSecret ? (
                <button className="btn btn-accept" onClick={() => setShowSecret(true)} style={{ fontSize: '1rem', padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.2)' }}>
                  Reveal Secret Code 🤫
                </button>
              ) : (
                <div className="secret-code" style={{ animation: 'fadeIn 0.5s' }}>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Secret Code:</p>
                  <code style={{ fontSize: '2rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '10px', fontFamily: 'monospace', letterSpacing: '2px' }}>
                    ammusboyfriendisprettycool
                  </code>
                  <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                    (Send it to Akhil to let him know you made it to the end!)
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <h1 className={acceptCount === 0 ? "title" : "title title-sm"}>
              {acceptCount === 0 ? "I am sorry" : "One sorry is not enough!"}
            </h1>
            <p className="subtitle">
              {acceptCount === 0
                ? (pleadCount === 0 ? "Please forgive me, Ammu." : pleads[pleadCount])
                : `Forgiveness Meter: ${acceptCount}/${TARGET_ACCEPTS}`}
            </p>
            {acceptCount > 0 && (
              <div className="progress-bar-container" style={{ width: '200px', height: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '5px', margin: '0 auto 2rem', overflow: 'hidden' }}>
                <div style={{ width: `${(acceptCount / TARGET_ACCEPTS) * 100}%`, height: '100%', background: '#ff006e', transition: 'width 0.1s ease' }}></div>
              </div>
            )}
            <div className="heart">❤️</div>
            <div className="button-group">
              <button className="btn btn-accept" onClick={handleAccept}>
                {acceptCount === 0 ? "I Accept Apology" : "Accept Again"}
              </button>
              <button className="btn btn-reject" onClick={handleReject}>I Don't Accept</button>
            </div>

            {acceptCount > 0 && (
              <p className="tip-text">
                (Tip: Click slowly so you can see every "I am sorry" properly!)
              </p>
            )}
          </>
        )}
      </div>

      {/* Floating Gift Box - Only in success state */}
      {accepted && (
        <div className="floating-gift" onClick={() => setShowGiftModal(true)}>
          🎁
        </div>
      )}

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="modal-overlay" onClick={() => setShowGiftModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h1 className="title" style={{ fontSize: '3rem' }}>Surprise! 🎉</h1>
            <img
              src="/surprise.jpg"
              alt="Surprise"
              className="surprise-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x400?text=Please+add+surprise.jpg+to+public+folder";
              }}
            />
            <button className="btn btn-accept" onClick={() => setShowGiftModal(false)} style={{ marginTop: '1rem' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
