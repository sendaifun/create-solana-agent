interface LogoProps {
  className?: string;
}

export function SolanaLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.129 9.033L14.645 11.517L19.309 16.181H11.902L9.419 18.664H21.792L17.129 9.033Z"
        fill="currentColor"
      />
      <path
        d="M19.309 7.819L16.826 5.336H4.453L9.116 14.967L11.6 12.483L6.936 7.819H14.343L16.826 5.336L19.309 7.819Z"
        fill="currentColor"
      />
      <path
        d="M14.342 16.181H6.935L4.452 18.664L6.935 21.147H19.308L14.645 11.516L12.161 14L14.342 16.181Z"
        fill="currentColor"
      />
      <path
        d="M9.116 9.033L6.633 11.517L4.149 9.033L6.633 6.55L9.116 9.033Z"
        fill="currentColor"
      />
    </svg>
  );
} 