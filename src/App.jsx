import { useState, useEffect, useRef } from 'react'
import './App.css'

// Developer Note: Enter your WhatsApp number here (in international format, e.g., 94771234567)
const WA_NUMBER = "94775631149"

function App() {
  const [step, setStep] = useState(1)

  // Selection preferences state
  const [morningVibe, setMorningVibe] = useState('')
  const [middayVibe, setMiddayVibe] = useState('')
  const [eveningVibe, setEveningVibe] = useState('')

  // Anti-gravity button position state
  const [noBtnStyle, setNoBtnStyle] = useState({})
  const [hasMoved, setHasMoved] = useState(false)

  const noBtnRef = useRef(null)

  // Active repelling physics logic
  useEffect(() => {
    if (step !== 1) return

    const handlePointerMove = (e) => {
      if (!noBtnRef.current) return

      let clientX, clientY
      if (e.type === 'touchmove') {
        if (e.touches && e.touches[0]) {
          clientX = e.touches[0].clientX
          clientY = e.touches[0].clientY
        } else {
          return
        }
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }

      const rect = noBtnRef.current.getBoundingClientRect()
      const btnX = rect.left + rect.width / 2
      const btnY = rect.top + rect.height / 2

      const dx = btnX - clientX
      const dy = btnY - clientY
      let distance = Math.sqrt(dx * dx + dy * dy)
      if (distance === 0) distance = 1

      // 1 inch is approx 96px on standard screens
      const minDistance = 96

      if (distance < minDistance) {
        // Prevent default touch movement to avoid page scrolling/bouncing on mobile
        if (e.type === 'touchmove' && e.cancelable) {
          e.preventDefault()
        }

        // Set target angle from cursor to button
        const targetAngle = Math.atan2(dy, dx)

        const padding = 20
        const minX = padding
        const maxX = window.innerWidth - rect.width - padding
        const minY = padding
        const maxY = window.innerHeight - rect.height - padding

        // Target center position exactly minDistance away
        let targetLeft = clientX + Math.cos(targetAngle) * minDistance - rect.width / 2
        let targetTop = clientY + Math.sin(targetAngle) * minDistance - rect.height / 2

        // If target position is out of screen bounds, find the closest in-bounds angle
        if (targetLeft < minX || targetLeft > maxX || targetTop < minY || targetTop > maxY) {
          let found = false
          // Sweep angles around targetAngle to find a valid spot
          for (let offset = 0; offset <= Math.PI; offset += 0.05) {
            for (let sign of [1, -1]) {
              const testAngle = targetAngle + sign * offset
              const testLeft = clientX + Math.cos(testAngle) * minDistance - rect.width / 2
              const testTop = clientY + Math.sin(testAngle) * minDistance - rect.height / 2

              if (testLeft >= minX && testLeft <= maxX && testTop >= minY && testTop <= maxY) {
                targetLeft = testLeft
                targetTop = testTop
                found = true
                break
              }
            }
            if (found) break
          }

          // Fallback clamping
          if (!found) {
            targetLeft = Math.max(minX, Math.min(maxX, targetLeft))
            targetTop = Math.max(minY, Math.min(maxY, targetTop))
          }
        }

        setNoBtnStyle({
          position: 'fixed',
          left: `${targetLeft}px`,
          top: `${targetTop}px`,
          zIndex: 9999,
          // Zero transition delay for absolute real-time locking to cursor
          transition: 'none'
        })
        setHasMoved(true)
      }
    }

    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('touchmove', handlePointerMove, { passive: false })

    return () => {
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('touchmove', handlePointerMove)
    }
  }, [step])

  // Decorative floating hearts generator
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    // Generate random background hearts on load
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 95}%`,
      speed: `${6 + Math.random() * 6}s`,
      scale: 0.4 + Math.random() * 0.8,
      rot: `${Math.random() * 360}deg`,
      delay: `${Math.random() * 5}s`
    }))
    setHearts(newHearts)
  }, [])

  // Function to move the "No" button to a random position
  const moveNoButton = (e) => {
    // Prevent default touch/click behaviors so the button doesn't trigger a click
    if (e) {
      if (e.cancelable) e.preventDefault()
    }

    // Calculate random position, keeping it within 10% to 80% of viewport to avoid screen edge clipping
    const randomX = Math.floor(Math.random() * 70) + 15
    const randomY = Math.floor(Math.random() * 70) + 15

    setNoBtnStyle({
      position: 'fixed',
      left: `${randomX}vw`,
      top: `${randomY}vh`,
      zIndex: 9999,
      transition: 'all 0.15s ease-out'
    })
    setHasMoved(true)
  }

  // Handle WhatsApp message redirection
  const handlePaymentSubmit = () => {
    setStep(7)

    const message = `Hey! I paid the 5000LKR. Here are my date choices:\n\n🌅 Morning: ${morningVibe}\n☀️ Midday: ${middayVibe}\n🍛 Evening: ${eveningVibe}`
    const encodedMessage = encodeURIComponent(message)
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`

    // Open in a new tab
    window.open(waUrl, '_blank')
  }

  const isFormValid = morningVibe && middayVibe && eveningVibe

  // Custom visual components for each step to look premium and themed
  return (
    <div className="relative min-h-screen w-screen flex flex-col justify-center items-center overflow-hidden py-12 px-4">
      {/* Decorative Floating Hearts Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="floating-heart text-romantic-300"
            style={{
              left: heart.left,
              '--speed': heart.speed,
              '--scale': heart.scale,
              '--rot': heart.rot,
              animationDelay: heart.delay
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Main Elegant Card Container */}
      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl p-8 transition-all duration-500 scale-100 glow-effect animate-fade-in">

        {/* Shimmering top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-300 via-romantic-400 to-rose-400 rounded-t-3xl overflow-hidden">
          <div className="shimmer h-full w-full"></div>
        </div>

        {/* Step 1: The Question */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 bg-romantic-100 rounded-full flex items-center justify-center animate-bounce-gentle">
              <span className="text-5xl">🥺</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Will you go on a date with me?
            </h1>

            <p className="text-slate-600 text-sm px-4">
              I promise it will be filled with laughter, good food, and beautiful memories.
            </p>

            <div className="flex items-center justify-center space-x-4 w-full pt-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-romantic-500 hover:bg-romantic-600 active:scale-95 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all duration-150 hover:shadow-romantic-300 hover:shadow-md cursor-pointer text-center"
              >
                Yes 💖
              </button>

              {!hasMoved ? (
                <button
                  ref={noBtnRef}
                  style={noBtnStyle}
                  onMouseEnter={moveNoButton}
                  onClick={moveNoButton}
                  onTouchStart={moveNoButton}
                  className="flex-1 bg-slate-400 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-2xl transition-colors duration-150 cursor-pointer text-center select-none"
                >
                  No 😢
                </button>
              ) : (
                <div className="flex-1 h-[52px]"></div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: The Surprise */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-5xl">🎉</span>
            </div>

            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Wait... You Actually Said Yes?!
            </h2>

            <p className="text-slate-600 text-lg">
              I was ready for you to say no 😁
            </p>

            <p className="text-slate-500 text-xs italic px-6">
              (Honestly, my heart skipped a beat just now!)
            </p>

            <button
              onClick={() => setStep(3)}
              className="w-full bg-romantic-500 hover:bg-romantic-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all duration-150 hover:shadow-md active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Okay Okay!</span>
              <span>👉</span>
            </button>
          </div>
        )}

        {/* Step 3: Set The Date */}
        {step === 3 && (
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Elegant Calendar Rendering */}
            <div className="relative w-36 h-36 bg-white border-4 border-rose-200 rounded-3xl shadow-lg overflow-hidden flex flex-col items-center justify-between">
              <div className="w-full bg-rose-500 text-white text-sm font-bold py-1.5 uppercase tracking-widest">
                August
              </div>
              <div className="text-5xl font-black text-rose-600 font-serif -mt-2 animate-bounce-gentle">
                15
              </div>
              <div className="text-xs font-semibold text-slate-500 pb-2">
                SATURDAY
              </div>

              {/* Binder rings */}
              <div className="absolute top-1 left-6 w-2 h-4 bg-slate-700 rounded-full"></div>
              <div className="absolute top-1 right-6 w-2 h-4 bg-slate-700 rounded-full"></div>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-800 leading-snug">
              Set Your date on 15th August 📅
            </h2>

            <p className="text-slate-600 text-sm px-4">
              Clear your schedule and get ready for the best Saturday of the month!
            </p>

            <button
              onClick={() => setStep(4)}
              className="w-full bg-romantic-500 hover:bg-romantic-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all duration-150 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Set and okay ✨</span>
            </button>
          </div>
        )}

        {/* Step 4: Pick The Vibe */}
        {step === 4 && (
          <div className="flex flex-col space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-slate-800">
                What are we feeling? 🤔
              </h2>
              <p className="text-slate-600 text-sm">
                Pick your vibe for the day
              </p>
            </div>

            {/* Form Selection Categories */}
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">

              {/* Category 1: Morning Time */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500 block mb-1">
                  🌅 Morning Time
                </span>
                {[
                  { text: 'Bike ride with a view 🏍️', val: 'Bike ride with a view 🏍️' },
                  { text: 'Coffee & Morning Walk ☕', val: 'Coffee & Morning Walk ☕' },
                  { text: 'Just chill & talk 😌', val: 'Just chill & talk 😌' }
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setMorningVibe(opt.val)}
                    className={`w-full text-left p-3 rounded-xl border text-sm transition-all duration-150 flex items-center justify-between cursor-pointer ${morningVibe === opt.val
                      ? 'border-romantic-500 bg-romantic-50/50 text-romantic-700 font-bold ring-2 ring-romantic-400'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                      }`}
                  >
                    <span>{opt.text}</span>
                    {morningVibe === opt.val && <span className="text-romantic-500">✓</span>}
                  </button>
                ))}
              </div>

              {/* Category 2: Midday */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500 block mb-1">
                  ☀️ Midday (10 AM+)
                </span>
                {[
                  { text: 'Garden / Park Walk 🌳', val: 'Garden / Park Walk 🌳' },
                  { text: 'Relax at the Beach 🌊', val: 'Relax at the Beach 🌊' },
                  { text: 'Watch a Movie 🍿', val: 'Watch a Movie 🍿' }
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setMiddayVibe(opt.val)}
                    className={`w-full text-left p-3 rounded-xl border text-sm transition-all duration-150 flex items-center justify-between cursor-pointer ${middayVibe === opt.val
                      ? 'border-romantic-500 bg-romantic-50/50 text-romantic-700 font-bold ring-2 ring-romantic-400'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                      }`}
                  >
                    <span>{opt.text}</span>
                    {middayVibe === opt.val && <span className="text-romantic-500">✓</span>}
                  </button>
                ))}
              </div>

              {/* Category 3: Evening / Food */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500 block mb-1">
                  🍛 Evening / Food
                </span>
                {[
                  { text: 'Authentic Sri Lankan with a Sea view (OGF) 🍛🌊', val: 'Authentic Sri Lankan with a Sea view (OGF) 🍛🌊' },
                  { text: 'Pizza Time 🍕', val: 'Pizza Time 🍕' },
                  { text: 'Hot Ramen 🍜', val: 'Hot Ramen 🍜' }
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setEveningVibe(opt.val)}
                    className={`w-full text-left p-3 rounded-xl border text-sm transition-all duration-150 flex items-center justify-between cursor-pointer ${eveningVibe === opt.val
                      ? 'border-romantic-500 bg-romantic-50/50 text-romantic-700 font-bold ring-2 ring-romantic-400'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                      }`}
                  >
                    <span className="leading-tight">{opt.text}</span>
                    {eveningVibe === opt.val && <span className="text-romantic-500">✓</span>}
                  </button>
                ))}
              </div>

            </div>

            <button
              onClick={() => setStep(5)}
              disabled={!isFormValid}
              className={`w-full font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer ${isFormValid
                ? 'bg-romantic-500 hover:bg-romantic-600 text-white active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
              <span>Lock it in! 🔒</span>
            </button>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center animate-bounce-gentle">
              <span className="text-5xl">🏍️</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-800">
                Glad you didn't say no. 😉
              </h2>
              <h3 className="text-lg font-bold text-rose-500">
                Be ready by 9:00 AM, I'm coming to get you 🏍️
              </h3>
            </div>

            <div className="border-t border-slate-100 w-full pt-4">
              <p className="text-slate-600 font-serif italic text-base">
                "I can't wait to make new beautiful memories with you."
              </p>
            </div>

            <button
              onClick={() => setStep(6)}
              className="w-full bg-romantic-500 hover:bg-romantic-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all duration-150 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Ok. I Accept 💝</span>
            </button>
          </div>
        )}

        {/* Step 6: The Joke Fee */}
        {step === 6 && (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center">
              <span className="text-4xl text-rose-500">💳</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-800">
                One small fee...
              </h2>
              <p className="text-slate-500 text-xs px-2 leading-relaxed">
                to confirm your acceptance of this date, please complete the following transaction. totally normal. everyone does this.
              </p>
            </div>

            {/* Custom Payment Slip / Agreement Box */}
            <div className="w-full bg-slate-50 rounded-2xl border-2 border-dashed border-rose-300 p-5 space-y-3 relative overflow-hidden">
              <div className="text-left border-b border-slate-200 pb-3 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Product Name</span>
                  <p className="text-sm font-bold text-slate-700">Date Agreement Fee</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</span>
                  <p className="text-xs font-semibold text-amber-500">Pending</p>
                </div>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-slate-600 font-medium">Fee:</span>
                <span className="text-xl font-black text-rose-600 font-serif">5,000 LKR</span>
              </div>

              <div className="text-[10px] text-slate-400 leading-tight">
                *Secure payment redirection to WhatsApp booking agent
              </div>
            </div>

            <button
              onClick={handlePaymentSubmit}
              className="w-full bg-romantic-600 hover:bg-romantic-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-150 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Pay 5000LKR & Confirm 💸</span>
            </button>
          </div>
        )}

        {/* Step 7: Final Screen */}
        {step === 7 && (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce-gentle">
              <span className="text-5xl">🤑</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-emerald-600">
                Your Money Received!
              </h2>
              <p className="text-slate-600 text-sm font-medium">
                Just joking... save it for the ice cream! 🍦
              </p>
            </div>

            <div className="border-t border-slate-100 w-full pt-6">
              <h3 className="text-3xl font-black text-romantic-600 font-serif tracking-wide">
                See you on the 15th! ❤️
              </h3>
            </div>

            <p className="text-slate-400 text-xs">
              Confirmations have been dispatched to WhatsApp!
            </p>
          </div>
        )}

      </div>

      {/* Render the repelling No button outside the card once it has moved to bypass parent transform offset issues */}
      {hasMoved && step === 1 && (
        <button
          ref={noBtnRef}
          style={noBtnStyle}
          onMouseEnter={moveNoButton}
          onClick={moveNoButton}
          onTouchStart={moveNoButton}
          className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-2xl transition-colors duration-150 cursor-pointer text-center select-none"
        >
          No 😜
        </button>
      )}
    </div>
  )
}

export default App
