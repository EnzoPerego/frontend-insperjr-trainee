import React from 'react'

interface BackButtonProps {
  href?: string
  onClick?: () => void
  className?: string
}

const BackButton: React.FC<BackButtonProps> = ({ 
  href = '/', 
  onClick, 
  className = '' 
}) => {
  const buttonContent = (
    <div className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span className="text-sm font-medium">Voltar</span>
    </div>
  )

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {buttonContent}
      </button>
    )
  }

  return (
    <a href={href} className={className}>
      {buttonContent}
    </a>
  )
}

export default BackButton
