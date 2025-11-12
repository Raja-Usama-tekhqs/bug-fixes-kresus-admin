import * as React from 'react';

const SvgDrawerOpen = ({
  width = 30,
  height = 197,
  fill = '#113d4e',
  stroke = 'currentColor',
  strokeWidth = 2,
  textFill = '#fff',
  textFontSize = 20,
  text = 'Drivers',
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 46 197"
    {...props}
  >
    {/* Main background rectangle */}
    <path
      fill={fill}
      d="M46 0v197a46 46 0 0 1-46-46V46A46 46 0 0 1 46 0Z"
      data-name="Rectangle 1053"
    />

    {/* Rotated text */}
    <text
      fill={textFill}
      fontFamily="Avenir-Regular, Avenir"
      fontSize={textFontSize}
      transform="rotate(-90 76 48)"
    >
      <tspan x={0} y={0}>
        {text}
      </tspan>
    </text>

    {/* Small triangle at the bottom (reversed direction compared to the first one) */}
    <path fill="#fff" d="m16 140 10-6v12Z" data-name="Polygon 23" />
  </svg>
);

export default SvgDrawerOpen;
