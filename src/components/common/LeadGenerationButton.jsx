'use client';

import { ForumOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';

const variantClasses = {
  primary: 'bg-[#1f2a77] text-white hover:bg-[#18205f]',
  light: 'bg-white text-[#1f2a77] hover:bg-slate-100',
  outline: 'border border-[#1f2a77] bg-white text-[#1f2a77] hover:bg-[#1f2a77] hover:text-white',
};

export default function LeadGenerationButton({
  label = 'Get Quote',
  variant = 'primary',
  className = '',
  showIcon = true,
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push('/lead-generation')}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${variantClasses[variant] || variantClasses.primary} ${className}`}
    >
      {showIcon && <ForumOutlined sx={{ fontSize: 17 }} />}
      <span>{label}</span>
    </button>
  );
}
