import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaRobot, FaSearch, FaUserPlus } from 'react-icons/fa';

export default function WaterHero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = canvas.offsetWidth || window.innerWidth;
    let height = canvas.offsetHeight || window.innerHeight * 0.7;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = canvas.offsetWidth || window.innerWidth;
      height = canvas.offsetHeight || window.innerHeight * 0.7;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#001133');
      bgGradient.addColorStop(1, '#000820');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Two overlapping sine-wave "water" layers
      const drawWave = (amplitude, wavelength, speed, color, offsetY) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 4) {
          const y =
            Math.sin((x / wavelength) + t * speed) * amplitude +
            Math.cos((x / (wavelength * 1.5)) + t * speed * 0.7) * (amplitude * 0.4) +
            offsetY;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      };

      drawWave(30, 120, 0.015, 'rgba(0, 160, 255, 0.4)', height * 0.55);
      drawWave(40, 180, 0.01, 'rgba(0, 120, 255, 0.3)', height * 0.6);

      t += 0.03;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <header className="water-hero">
      <canvas ref={canvasRef} className="water-hero-canvas" />
      <div className="water-hero-overlay">
        <div className="water-hero-container">
          <div className="water-hero-content">
            <h1 className="water-hero-title">
              Find Your Dream Job with <span className="highlight">AI Power</span>
            </h1>
            <p className="water-hero-subtitle">
              Our advanced AI helps match you with the perfect job opportunities,
              optimize your resume, and prepare you for interviews.
            </p>
            <div className="water-hero-cta">
              <Link href="/jobs" className="btn btn-primary">
                <FaSearch /> Browse Jobs
              </Link>
              <Link href="/register" className="btn btn-secondary">
                <FaUserPlus /> Get Started
              </Link>
            </div>
          </div>
          <div className="water-hero-image">
            <div className="water-hero-avatar">
              <FaRobot className="water-hero-robot" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .water-hero {
          position: relative;
          min-height: 80vh;
          color: #fff;
          overflow: hidden;
        }

        .water-hero-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          z-index: 0;
        }

        .water-hero-overlay {
          position: relative;
          z-index: 1;
        }

        .water-hero-container {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 4rem 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .water-hero-content {
          flex: 1;
          max-width: 600px;
        }

        .water-hero-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .highlight {
          color: #ffcc00;
        }

        .water-hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.95;
          max-width: 520px;
        }

        .water-hero-cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .water-hero-image {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .water-hero-avatar {
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25), rgba(0, 80, 200, 0.4));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          animation: float 4s ease-in-out infinite;
        }

        .water-hero-robot {
          font-size: 7rem;
          opacity: 0.9;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: none;
          cursor: pointer;
        }

        .btn-primary {
          background: #ffffff;
          color: #0070f3;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .btn-secondary {
          background: transparent;
          color: #ffffff;
          border: 2px solid #ffffff;
        }

        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .water-hero-container {
            flex-direction: column;
            text-align: center;
            padding: 2.5rem 1.5rem 3rem;
          }

          .water-hero-title {
            font-size: 2.2rem;
          }

          .water-hero-subtitle {
            font-size: 1rem;
            margin: 0 auto 1.75rem;
          }

          .water-hero-cta {
            justify-content: center;
          }
        }
      `}</style>
    </header>
  );
}

