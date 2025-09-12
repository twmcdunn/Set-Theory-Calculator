
const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer ring with gradient */}
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 p-1 animate-spin`}
             style={{ animationDuration: '0.4s' }}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-900 via-red-800 to-black"></div>
        </div>
        
        {/* Inner spinning accent */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-6 h-6'} 
                          bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full animate-pulse`}
               style={{ animationDuration: '0.6s' }}>
          </div>
        </div>
        
        {/* Subtle outer glow effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 animate-ping`}
             style={{ animationDuration: '1s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;