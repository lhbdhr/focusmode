import React from 'react';
import { useMemo, useState } from 'react';
import useInterval from '@use-it/interval';

const CountdownTimer = ({ seconds, size, strokeColor, strokeBgColor, strokeWidth }) => {
  const milliseconds = seconds * 1000;
  const radius = size / 2;
  const circumference = size * Math.PI;

  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(milliseconds);
  const [interval, setInterval] = useState(10);

  const strokeDashoffset = useMemo(() => {
    return circumference - (countdown / milliseconds) * circumference;
  }, [countdown, circumference, milliseconds]);

  useInterval(() => {
    setIsPlaying(true);
    setCountdown(countdown - 10);

    if (countdown === 0) {
      setInterval(null);

      setCountdown(milliseconds);
      setIsPlaying(false);
    }
  }, interval);

  const countdownSizeStyles = {
    height: size,
    width: size,
  };

  const textStyles = {
    color: strokeColor,
    fontSize: size * 0.2,
  };

  const timeLeft = (countdown / 1000).toFixed();

  return (
    <div>
      <div style={Object.assign({}, styles.countdownContainer, countdownSizeStyles)}>
        <p style={textStyles}>{timeLeft}s</p>
        <svg style={styles.svg}>
          <circle
            cx={radius}
            cy={radius}
            r={radius}
            fill="none"
            stroke={strokeBgColor}
            strokeWidth={strokeWidth}
          ></circle>
        </svg>
        <svg style={styles.svg}>
          <defs>
            <linearGradient id="g1">
              <stop stop-color="#5fdfe7" />
              <stop offset=".25" stop-color="#00cef3" />
              <stop offset=".5" stop-color="#00b9ff" />
              <stop offset=".75" stop-color="#00a1ff" />
              <stop offset="1" stop-color="#5083f9" />
            </linearGradient>
          </defs>

          <circle
            strokeDasharray={circumference}
            strokeDashoffset={isPlaying ? strokeDashoffset : 0}
            r={radius}
            cx={radius}
            cy={radius}
            fill="none"
            strokeLinecap="round"
            stroke="url(#g1)"
            strokeWidth={strokeWidth}
          ></circle>
        </svg>
      </div>
    </div>
  );
};

const styles = {
  countdownContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    margin: 'auto',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transform: 'rotateY(-180deg) rotateZ(-90deg)',
    overflow: 'visible',
  },
  button: {
    fontSize: 16,
    padding: '15px 40px',
    margin: '10px auto 30px',
    display: 'block',
    backgroundColor: '#4d4d4d',
    color: 'lightgray',
    border: 'none',
    cursor: 'pointer',
    outline: 0,
  },
};

export default CountdownTimer;
