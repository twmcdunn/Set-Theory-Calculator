import React, { useEffect, useState } from 'react';

const SetTheoryBackground = () => {
  const [symbols, setSymbolsSetter] = useState([]);
  const [connections, setConnections] = useState([]);

  // Mathematical set theory symbols and notations
  const setSymbols = [
  '{0,1,4}',
  '{0,3,7}',
  '{0,2,5}',
  '{0,1,2,5}',
  '{0,1,3,6}',
  '{0,2,3,7}',
  '{0,3,4,8}',
  '{0,2,5,7}',
  '{0,1,4,8}',
  '{0,3,5,9}',
  '{0,1,3,5,8}',
  '{0,1,4,5,9}',
  '{0,2,4,7,9}',
  '{0,1,5,6,8}',
  '{0,2,3,6,9}',
  '{0,3,4,7,10}',
  '{0,1,2,6,8}',
  '{0,2,4,6,10}',
  '{0,1,3,5,9}',
  '{0,2,5,8,10}',
  '{0,1,4,6,9}',
  '{0,3,5,8,11}',
  '{0,2,3,7,10}',
  '{0,1,2,5,9}',
  '{0,2,4,5,9}',
  '{0,3,4,6,10}',
  '{0,1,5,7,9}',
  '{0,2,5,7,10}',
  '{0,1,3,7,9}',
  '{0,4,5,8,11}'
];

  useEffect(() => {
    // Generate initial symbols
    const generateSymbols = () => {
      const newSymbols = [];
      for (let i = 0; i < 100; i++) {
        newSymbols.push({
          id: i,
          symbol: setSymbols[Math.floor(Math.random() * setSymbols.length)],
          x: Math.random() * 120 - 10, // Start from -10% to 110%
          y: Math.random() * 120 - 10,
          z: Math.random() * 100 - 50, // Depth for 3D effect
          size: Math.random() * 0.8 + 0.5, // 0.5 to 1.3
          opacity: 0,
          speed: Math.random() * 0.3 + 0.1, // 0.1 to 0.4
          direction: {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5
          },
          lifecycle: 0, // 0 to 1, controls fade in/out
          maxLifetime: Math.random() * 20000 + 15000 // 15-35 seconds
        });
      }
      setSymbolsSetter(newSymbols);
    };

    generateSymbols();
  }, []);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setSymbolsSetter(prevSymbols => 
        prevSymbols.map(symbol => {
          const newLifecycle = symbol.lifecycle + 100; // Increment by 100ms
          const progress = newLifecycle / symbol.maxLifetime;
          
          // Calculate opacity based on lifecycle (fade in first 20%, fade out last 20%)
          let opacity;
          if (progress < 0.2) {
            opacity = progress / 0.2; // Fade in
          } else if (progress > 0.8) {
            opacity = (1 - progress) / 0.2; // Fade out
          } else {
            opacity = 1; // Full opacity
          }

          // Reset symbol if it's completed its lifecycle
          if (progress >= 1) {
            return {
              ...symbol,
              symbol: setSymbols[Math.floor(Math.random() * setSymbols.length)],
              x: Math.random() * 120 - 10,
              y: Math.random() * 120 - 10,
              z: Math.random() * 100 - 50,
              size: Math.random() * 0.8 + 0.5,
              speed: Math.random() * 0.3 + 0.1,
              direction: {
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.5
              },
              lifecycle: 0,
              maxLifetime: Math.random() * 20000 + 15000
            };
          }

          return {
            ...symbol,
            x: symbol.x + symbol.direction.x * symbol.speed,
            y: symbol.y + symbol.direction.y * symbol.speed,
            lifecycle: newLifecycle,
            opacity: Math.max(0, Math.min(1, opacity))
          };
        })
      );
    }, 100);

    return () => clearInterval(animationInterval);
  }, []);

  // // Generate and animate connections
  // useEffect(() => {
  //   const connectionInterval = setInterval(() => {
  //     setConnections(prevConnections => {
  //       // Update existing connections
  //       const updatedConnections = prevConnections
  //         .map(conn => ({
  //           ...conn,
  //           lifecycle: conn.lifecycle + 100,
  //           opacity: Math.max(0, Math.min(1, 
  //             conn.lifecycle < conn.fadeInTime ? conn.lifecycle / conn.fadeInTime :
  //             conn.lifecycle > conn.maxLifetime - conn.fadeOutTime ? 
  //               (conn.maxLifetime - conn.lifecycle) / conn.fadeOutTime : 1
  //           ))
  //         }))
  //         .filter(conn => conn.lifecycle < conn.maxLifetime);

  //       // Add new connections occasionally
  //       if (Math.random() < 0.15 && symbols.length > 0) {
  //         // Find two visible symbols that are relatively close and won't reset soon
  //         const visibleSymbols = symbols.filter(s => {
  //           const progress = s.lifecycle / s.maxLifetime;
  //           return s.opacity > 0.5 && progress < 0.65; // Only connect stable, visible symbols
  //         });

  //         if (visibleSymbols.length >= 2) {
  //           const symbol1 = visibleSymbols[Math.floor(Math.random() * visibleSymbols.length)];
  //           let symbol2;
  //           let attempts = 0;
            
  //           do {
  //             symbol2 = visibleSymbols[Math.floor(Math.random() * visibleSymbols.length)];
  //             attempts++;
  //           } while (symbol1.id === symbol2.id && attempts < 10);

  //           if (symbol1.id !== symbol2.id) {
  //             const distance = Math.sqrt(
  //               Math.pow(symbol1.x - symbol2.x, 2) + 
  //               Math.pow(symbol1.y - symbol2.y, 2)
  //             );

  //             // Only create connections for reasonably close symbols
  //             if (distance < 50 && distance > 10) {
  //               // Calculate how long until either symbol resets
  //               const symbol1TimeLeft = symbol1.maxLifetime - symbol1.lifecycle;
  //               const symbol2TimeLeft = symbol2.maxLifetime - symbol2.lifecycle;
  //               const minTimeLeft = Math.min(symbol1TimeLeft, symbol2TimeLeft);
                
  //               // Make connection lifetime shorter than the shortest symbol lifetime
  //               const maxConnectionLifetime = Math.min(minTimeLeft * 0.7, 8000);
                
  //               if (maxConnectionLifetime > 2000) { // Only create if we have enough time
  //                 const newConnection = {
  //                   id: Date.now() + Math.random(),
  //                   symbol1Id: symbol1.id,
  //                   symbol2Id: symbol2.id,
  //                   lifecycle: 0,
  //                   maxLifetime: Math.random() * 3000 + maxConnectionLifetime * 0.5,
  //                   fadeInTime: 800,
  //                   fadeOutTime: 1200,
  //                   opacity: 0,
  //                   color: `hsl(${Math.random() * 60 + 200}, 40%, 60%)`, // Blue to purple range
  //                   thickness: Math.random() * 1.5 + 0.5
  //                 };
                  
  //                 updatedConnections.push(newConnection);
  //               }
  //             }
  //           }
  //         }
  //       }

  //       return updatedConnections;
  //     });
  //   }, 200);

  //   return () => clearInterval(connectionInterval);
  // }, [symbols]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(30, 30, 30, 0.8) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(60, 60, 60, 0.6) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(45, 45, 45, 0.4) 0%, transparent 50%),
            linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1f1f1f 50%, #333333 75%, #222222 100%)
          `,
          animation: 'gradientShift 20s ease-in-out infinite'
        }}
      />
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map(connection => {
          const symbol1 = symbols.find(s => s.id === connection.symbol1Id);
          const symbol2 = symbols.find(s => s.id === connection.symbol2Id);
          
          if (!symbol1 || !symbol2 || symbol1.opacity < 0.3 || symbol2.opacity < 0.3) {
            return null;
          }

          const x1 = (symbol1.x / 100) * window.innerWidth;
          const y1 = (symbol1.y / 100) * window.innerHeight;
          const x2 = (symbol2.x / 100) * window.innerWidth;
          const y2 = (symbol2.y / 100) * window.innerHeight;

          return (
            <line
              key={connection.id}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={connection.color}
              strokeWidth={connection.thickness}
              opacity={connection.opacity * 0.6}
              style={{
                filter: 'drop-shadow(0 0 3px rgba(156, 163, 175, 0.3))',
                transition: 'opacity 0.3s ease-in-out'
              }}
            />
          );
        })}
      </svg>
      
      {/* Floating symbols */}
      <div className="absolute inset-0">
        {symbols.map((symbol) => {
          const scale = 0.5 + (symbol.z + 50) / 200; // Perspective scaling
          const blur = Math.max(0, (50 - symbol.z) / 25); // Depth blur
          
          return (
            <div
              key={symbol.id}
              className="absolute text-gray-400 font-mono select-none"
              style={{
                left: `${symbol.x}%`,
                top: `${symbol.y}%`,
                opacity: symbol.opacity,
                fontSize: `${symbol.size * scale * 1.2}rem`,
                transform: `scale(${scale})`,
                filter: `blur(${blur}px)`,
                textShadow: '0 0 10px rgba(156, 163, 175, 0.3)',
                transition: 'opacity 0.3s ease-in-out'
              }}
            >
              {symbol.symbol}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% {
            filter: hue-rotate(0deg) brightness(1);
          }
          25% {
            filter: hue-rotate(5deg) brightness(0.95);
          }
          50% {
            filter: hue-rotate(-3deg) brightness(1.05);
          }
          75% {
            filter: hue-rotate(2deg) brightness(0.98);
          }
        }
      `}</style>
    </div>
  );
};

export default SetTheoryBackground;