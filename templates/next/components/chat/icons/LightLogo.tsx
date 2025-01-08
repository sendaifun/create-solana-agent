interface LogoProps {
  className?: string;
}

export function LightLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7 2V13H10V22L17 10H13L17 2H7Z"
        fill="currentColor"
      />
      <path
        d="M3 12H5V14H3V12ZM19 12H21V14H19V12ZM12 19V21H14V19H12ZM12 3V5H14V3H12Z"
        fillOpacity="0.5"
        fill="currentColor"
      />
    </svg>
  );
} 