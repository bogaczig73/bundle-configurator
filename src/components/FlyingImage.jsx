import React from 'react';
import bubu from '../images/bubu.webp';
const FlyingImage = () => {
  const randomX = Math.random() > 0.5 ? '300px' : '-300px';
  const randomY = Math.random() > 0.5 ? '200px' : '-200px';
  const randomRotation = Math.random() > 0.5 ? 720 : -720;
  const randomMidX = Math.random() > 0.5 ? '150px' : '-150px';
  const randomMidY = Math.random() > 0.5 ? '100px' : '-100px';

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        width: '100px',
        height: '100px',
        animation: 'fly 3s ease-in-out',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <style>
        {`
          @keyframes fly {
            0% {
              transform: translate(-50%, -50%) rotate(0deg) scale(0.2);
              opacity: 0;
            }
            10% {
              transform: translate(-50%, -50%) rotate(45deg) scale(1);
              opacity: 1;
            }
            50% {
              transform: translate(${randomMidX}, ${randomMidY}) rotate(${randomRotation/2}deg) scale(4);
              opacity: 1;
            }
            90% {
              transform: translate(${randomX}, ${randomY}) rotate(${randomRotation}deg) scale(0.8);
              opacity: 1;
            }
            100% {
              transform: translate(${randomX}, ${randomY}) rotate(${randomRotation}deg) scale(0.2);
              opacity: 0;
            }
          }
        `}
      </style>
      <img 
        src={bubu} 
        alt="Bubu"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default FlyingImage; 