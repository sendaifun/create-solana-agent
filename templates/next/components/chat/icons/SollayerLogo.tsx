interface LogoProps {
  className?: string;
}

export function SollayerLogo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21.9503 2H8.96813L6.83294 6.00001H19.8151L21.9503 2Z" fill="currentColor" />
      <path d="M17.6791 18H6.74677L4.61155 22H15.5439L17.6791 18Z" fill="currentColor" />
      <path
        d="M4.75548 9.99997H21.9507L19.8434 14L24 14L21.8648 18L17.6791 18L19.8149 14L2.64823 14L4.75548 9.99997Z"
        fill="currentColor"
      />
      <path d="M6.83294 6.00001L2.13522 6.00018L0 10.0002H4.69749L6.83294 6.00001Z" fill="currentColor" />
    </svg>
  );
}
