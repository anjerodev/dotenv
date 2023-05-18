type BlurbProps = {
  width?: number | string
  height?: number | string
  pathClassName?: string
  className?: string
}

export default function Blurb({
  width,
  height,
  pathClassName,
  className,
}: BlurbProps) {
  return (
    <svg
      width={width ?? '741'}
      height={height ?? '676'}
      viewBox="0 0 741 676"
      fill="none"
      className={className}
    >
      <g filter="url(#filter0_f_508_101)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M572.099 508.212C526.918 558.712 448.194 541.617 380.818 548.835C332.329 554.029 284.888 563.245 240.178 543.77C191.229 522.45 144.882 489.076 127.625 438.551C109.89 386.625 125.65 330.699 150.735 281.897C176.368 232.033 216.012 193.407 266.34 168.699C328.849 138.011 397.794 104.664 463.23 128.481C534.982 154.597 588.204 220.11 609.247 293.51C630.056 366.09 622.442 451.941 572.099 508.212Z"
          className={pathClassName}
        />
      </g>
      <defs>
        <filter
          id="filter0_f_508_101"
          x="0.0537109"
          y="0.383301"
          width="740"
          height="675.233"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="60"
            result="effect1_foregroundBlur_508_101"
          />
        </filter>
      </defs>
    </svg>
  )
}
