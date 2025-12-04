import { useEffect, useRef } from 'react';
import paper from 'paper';

interface Ball {
  radius: number;
  point: paper.Point;
  vector: paper.Point;
  maxVec: number;
  numSegment: number;
  boundOffset: number[];
  boundOffsetBuff: number[];
  sidePoints: paper.Point[];
  path: paper.Path;
}

class BallClass implements Ball {
  radius: number;
  point: paper.Point;
  vector: paper.Point;
  maxVec: number;
  numSegment: number;
  boundOffset: number[];
  boundOffsetBuff: number[];
  sidePoints: paper.Point[];
  path: paper.Path;

  constructor(r: number, p: paper.Point, v: paper.Point) {
    this.radius = r;
    this.point = p;
    this.vector = v;
    this.maxVec = 15;
    this.numSegment = Math.floor(r / 3 + 2);
    this.boundOffset = [];
    this.boundOffsetBuff = [];
    this.sidePoints = [];
    // Define app color palette - using lighter shades for background
    const colors = [
      '#baaf9b', // primary-300
      '#d5d0c3', // primary-200
      '#e8e6df', // primary-100
      '#f8f7f4', // primary-50
      '#fed7aa', // accent-200
      '#ffedd5', // accent-100
      '#fff7ed', // accent-50
      '#b0b0b0', // secondary-300
      '#d1d1d1', // secondary-200
      '#e7e7e7', // secondary-100
    ];
    
    const selectedColor = colors[Math.floor(Math.random() * colors.length)];
    
    this.path = new paper.Path({
      fillColor: selectedColor,
      blendMode: 'multiply'
    });

    for (let i = 0; i < this.numSegment; i++) {
      this.boundOffset.push(this.radius);
      this.boundOffsetBuff.push(this.radius);
      this.path.add(new paper.Point());
      this.sidePoints.push(new paper.Point({
        angle: 360 / this.numSegment * i,
        length: 1
      } as any));
    }
  }

  iterate() {
    this.checkBorders();
    if (this.vector.length > this.maxVec)
      this.vector.length = this.maxVec;
    this.point = this.point.add(this.vector);
    this.updateShape();
  }

  checkBorders() {
    const size = paper.view.size;
    if (this.point.x < -this.radius)
      this.point.x = size.width + this.radius;
    if (this.point.x > size.width + this.radius)
      this.point.x = -this.radius;
    if (this.point.y < -this.radius)
      this.point.y = size.height + this.radius;
    if (this.point.y > size.height + this.radius)
      this.point.y = -this.radius;
  }

  updateShape() {
    const segments = this.path.segments;
    for (let i = 0; i < this.numSegment; i++)
      segments[i].point = this.getSidePoint(i);

    this.path.smooth();
    for (let i = 0; i < this.numSegment; i++) {
      if (this.boundOffset[i] < this.radius / 4)
        this.boundOffset[i] = this.radius / 4;
      const next = (i + 1) % this.numSegment;
      const prev = (i > 0) ? i - 1 : this.numSegment - 1;
      let offset = this.boundOffset[i];
      offset += (this.radius - offset) / 15;
      offset += ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3;
      this.boundOffsetBuff[i] = this.boundOffset[i] = offset;
    }
  }

  react(b: BallClass) {
    const dist = this.point.getDistance(b.point);
    if (dist < this.radius + b.radius && dist != 0) {
      const overlap = this.radius + b.radius - dist;
      const direc = this.point.subtract(b.point).normalize(overlap * 0.015);
      this.vector = this.vector.add(direc);
      b.vector = b.vector.subtract(direc);

      this.calcBounds(b);
      b.calcBounds(this);
      this.updateBounds();
      b.updateBounds();
    }
  }

  getBoundOffset(b: paper.Point) {
    const diff = this.point.subtract(b);
    const angle = (diff.angle + 180) % 360;
    return this.boundOffset[Math.floor(angle / 360 * this.boundOffset.length)];
  }

  calcBounds(b: BallClass) {
    for (let i = 0; i < this.numSegment; i++) {
      const tp = this.getSidePoint(i);
      const bLen = b.getBoundOffset(tp);
      const td = tp.getDistance(b.point);
      if (td < bLen) {
        this.boundOffsetBuff[i] -= (bLen - td) / 2;
      }
    }
  }

  getSidePoint(index: number) {
    return this.point.add(this.sidePoints[index].multiply(this.boundOffset[index]));
  }

  updateBounds() {
    for (let i = 0; i < this.numSegment; i++)
      this.boundOffset[i] = this.boundOffsetBuff[i];
  }
}

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<BallClass[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Set canvas size to container size
    const updateCanvasSize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const container = canvasRef.current.parentElement;
        canvasRef.current.width = container.offsetWidth;
        canvasRef.current.height = container.offsetHeight;
      }
    };

    updateCanvasSize();
    
    // Setup Paper.js
    paper.setup(canvasRef.current);
    
    // Create balls
    const balls: BallClass[] = [];
    const numBalls = 8; // Further reduced for better performance
    
    for (let i = 0; i < numBalls; i++) {
      const position = new paper.Point(
        Math.random() * paper.view.size.width,
        Math.random() * paper.view.size.height
      );
      const vector = new paper.Point({
        angle: 360 * Math.random(),
        length: Math.random() * 3 + 1
      } as any);
      const radius = Math.random() * 60 + 40; // Slightly larger but fewer balls
      balls.push(new BallClass(radius, position, vector));
    }
    
    ballsRef.current = balls;

    // Animation loop
    const animate = () => {
      // Ball interactions
      for (let i = 0; i < balls.length - 1; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          balls[i].react(balls[j]);
        }
      }
      
      // Update balls
      for (let i = 0; i < balls.length; i++) {
        balls[i].iterate();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const container = canvasRef.current.parentElement;
        canvasRef.current.width = container.offsetWidth;
        canvasRef.current.height = container.offsetHeight;
        paper.view.viewSize = new paper.Size(
          container.offsetWidth,
          container.offsetHeight
        );
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      
      // Clean up Paper.js
      if (paper.project) {
        paper.project.clear();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100%',
        background: 'white',
        zIndex: 0
      }}
    />
  );
};

export default AnimatedBackground;