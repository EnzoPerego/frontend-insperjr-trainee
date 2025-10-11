import React, { useEffect } from 'react'

interface AvisoAddProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
  type?: 'success' | 'error' | 'info'
}

const AvisoAdd: React.FC<AvisoAddProps> = ({ 
  message, 
  isVisible, 
  onClose, 
  duration = 2500,
  type = 'success'
}) => {
  const [progress, setProgress] = React.useState(100)

  useEffect(() => {
    if (isVisible) {
      setProgress(100)
      
      // Animar progresso
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 50))
          return newProgress > 0 ? newProgress : 0
        })
      }, 50)

      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => {
        clearTimeout(timer)
        clearInterval(interval)
      }
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const styles = {
    success: {
      bg: 'bg-kaiserhaus-dark-brown',
      border: 'border-kaiserhaus-light-brown',
      text: 'text-white'
    },
    error: {
      bg: 'bg-red-600',
      border: 'border-red-400',
      text: 'text-white'
    },
    info: {
      bg: 'bg-blue-600',
      border: 'border-blue-400',
      text: 'text-white'
    }
  }[type]

  const icon = {
    success: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }[type]

  return (
    <div className="fixed bottom-8 left-8 z-[9999] animate-slide-in-left">
      <div className="relative">

        <div className="absolute inset-0 bg-kaiserhaus-light-brown opacity-30 blur-xl rounded-2xl animate-glow-pulse"></div>
        
  
        <div className={`relative ${styles.bg} ${styles.text} rounded-2xl shadow-2xl overflow-hidden border border-kaiserhaus-light-brown border-opacity-30 backdrop-blur-md`}>
          {/* barra de progresssso */}
          <div className="absolute bottom-0 left-0 h-1 bg-white/20 transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
          
 
          <div className="px-5 py-3.5 flex items-center gap-3 min-w-[340px] max-w-md font-montserrat">

            <div className="flex-shrink-0 bg-gradient-to-br from-white/30 to-white/10 p-2.5 rounded-xl backdrop-blur-sm">
              {icon}
            </div>
            
    
            <div className="flex-1">
              <p className="font-semibold text-[15px] leading-relaxed tracking-wide">{message}</p>
            </div>
  
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-1 bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AvisoAdd

