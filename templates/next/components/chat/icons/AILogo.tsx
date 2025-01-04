interface LogoProps {
  className?: string;
}

export function AILogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.5 4A5.5 5.5 0 0 0 2 9.5v5A5.5 5.5 0 0 0 7.5 20h9a5.5 5.5 0 0 0 5.5-5.5v-5A5.5 5.5 0 0 0 16.5 4h-9ZM6 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm8 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z"
        fill="currentColor"
      />
      <path
        d="M8.5 15.5C8.5 15.5 9.5 17 12 17C14.5 17 15.5 15.5 15.5 15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
} 