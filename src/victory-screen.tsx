import { useGSAP } from '@gsap/react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import { useStore } from './store';

const VictoryScreen = () => {
  const enemyHealth = useStore((s) => s.enemyHealth);
  const backgroundShapeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const openTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const closeAnimation = useRef<gsap.core.Timeline>(
    gsap.timeline({ paused: true })
  );
  const hueRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const backgroundShape = backgroundShapeRef.current;
      const text = textRef.current;
      const hue = hueRef.current;
      if (!container || !backgroundShape || !text || !hue) return;

      openTimelineRef.current = gsap
        .timeline({ paused: true })
        .set(container, { display: 'block' })
        .fromTo(
          backgroundShape,
          {
            rotate: -45,
            opacity: 0,
            scale: 1.2,
          },
          {
            scale: 1.1,
            duration: 1,
            opacity: 0.9,
            ease: 'expo.out',
            rotate: 5,
          }
        )
        .fromTo(
          container,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 1,
            ease: 'none',
          },
          '<'
        )
        .fromTo(
          text,
          {
            opacity: 0,
            y: '50%',
          },
          {
            opacity: 1,
            y: '-50%',
            duration: 1,
            ease: 'back.out',
          },
          '0.5'
        )
        .fromTo(hue, { opacity: 0 }, { opacity: 1 }, '<');

      closeAnimation.current = gsap.timeline({ paused: true }).to(container, {
        opacity: 0,
        duration: 1,
        ease: 'none',
      });
    },
    {
      scope: containerRef,
      dependencies: [
        containerRef.current,
        backgroundShapeRef.current,
        textRef.current,
      ],
    }
  );

  useEffect(() => {
    console.log('appear', enemyHealth);
    if (enemyHealth <= 0) {
      openTimelineRef.current?.play(0);
    }
  }, [enemyHealth]);

  return (
    <>
      <div
        className='absolute inset-0 z-50 bg-cyan-400 mix-blend-hue select-none pointer-events-none'
        ref={hueRef}
      ></div>
      <div
        className='absolute inset-0 z-50 bg-transparent hidden backdrop-blur-sm'
        ref={containerRef}
      >
        <div className='absolute inset-0 bg-black/50'></div>
        <div
          className='absolute w-full h-full bg-[url(/background.svg)] bg-no-repeat bg-contain bg-center'
          ref={backgroundShapeRef}
        />
        <div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center'
          ref={textRef}
        >
          <h1
            className=' text-9xl font-black text-cyan-400'
            style={{
              textShadow: '0px 10px 0 #00d3f220',
            }}
          >
            YOU WIN!
          </h1>
          <div className='w-full text-left'>You did try hard enough</div>
        </div>
        <div className='w-[30vh] h-[9vh] absolute bottom-[12vh] left-[12vw] flex justify-center items-center text-cyan-400 hover:text-white hover:scale-105 transition-all duration-300 ease-out text-2xl font-bold bg-[url(/button-background-left.svg)] bg-no-repeat bg-contain bg-center'>
          Restart Game
        </div>
        <div className='w-[31.5vh] h-[9vh] absolute bottom-[12vh] right-[12vw] flex justify-center items-center text-cyan-400 hover:text-white hover:scale-105 transition-all duration-300 ease-out text-2xl font-bold bg-[url(/button-background-right.svg)] bg-no-repeat bg-contain bg-center'>
          Main menu
        </div>
      </div>
    </>
  );
};

export default VictoryScreen;
