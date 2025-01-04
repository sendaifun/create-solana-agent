interface LogoProps {
  className?: string;
}

export function TensorLogo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10.3902 2L1 12H5.29268L7.70732 9.5V18.9444L10.3902 21.7222V2Z" fill="currentColor" />
      <path d="M13.6098 22V2L23 12H18.9756L16.2927 9.22222V19.2222L13.6098 22Z" fill="currentColor" />
    </svg>
  );
}
