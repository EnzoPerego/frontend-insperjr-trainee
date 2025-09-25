import React from 'react'

const SidebarHeader = ({ 
  title = "KAISERHAUS Admin",
  subtitle = "Admin",
  className = ""
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-lg sm:text-xl font-bold text-kaiserhaus-dark-brown">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-kaiserhaus-light-brown mt-1">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SidebarHeader
