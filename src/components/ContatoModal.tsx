import React, { useEffect, useRef } from 'react'
import contatoEsq from '../assets/Contato1.png'
import contatoDir from '../assets/Contato2.png'

interface ContactModalProps {
  open: boolean
  onClose: () => void
}

const ContactModal: React.FC<ContactModalProps> = ({ open, onClose }) => {
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="contact-modal-title"
      onClick={onClose}
    >

      <div className="absolute inset-0 bg-black/55" />

 
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="relative mx-4 w-full max-w-[720px] rounded-sm bg-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
      >
 
        <div className="rounded-sm border-[10px] border-white/95 bg-[#f7efdf]">

          <div className="rounded-sm border border-[#ead9c0]">
   
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 rounded-md p-2 text-[#4a2f2a] hover:bg-black/5"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

            <div className="grid grid-cols-1 items-center gap-6 px-8 py-12 sm:px-12 sm:py-16 md:grid-cols-[1fr_auto_1fr]">

              <div className="relative hidden items-center justify-center md:flex">
                <img src={contatoEsq} alt="Garçom ilustrado" className="h-64 w-auto object-contain opacity-30" />
              </div>

              <div className="text-center text-[#4a2f2a]">
                <h3 id="contact-modal-title" className="text-3xl sm:text-3xl font-extrabold">Contato:</h3>
                <p className="mt-3 text-[16px] sm:text-[17px] font-medium tracking-wide">+55 (11)3156-7590</p>

                <h4 className="mt-8 text-2xl font-extrabold">WhatsApp:</h4>
                <p className="mt-3 text-[16px] sm:text-[17px] font-medium tracking-wide">+55 (11)98765-4321</p>

                <p className="mt-7 text-[10px] sm:text-xs text-[#6a4b42]">Trabalhamos somente com delivery!</p>
              </div>


              <div className="relative hidden items-center justify-center md:flex">
                <img src={contatoDir} alt="Garçom ilustrado" className="h-64 w-auto object-contain opacity-30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ContactModal


