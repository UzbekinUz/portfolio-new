import { Github, Instagram, Linkedin, Mail, Send } from 'lucide-react';

export default function Socials({ profile, className = '' }) {
  const items = [
    [Github, profile.github, 'GitHub'],
    [Linkedin, profile.linkedin, 'LinkedIn'],
    [Send, profile.telegram, 'Telegram'],
    [Instagram, profile.instagram, 'Instagram'],
    [Mail, profile.email && `mailto:${profile.email}`, 'Email'],
  ].filter((i) => i[1]);

  return (
    <div className={`flex gap-2 ${className}`}>
      {items.map(([Icon, href, label]) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="grid h-10 w-10 place-items-center rounded-xl border border-fg/15 transition hover:border-sec hover:bg-sec hover:text-white"
        >
          <Icon size={18} />
        </a>
      ))}
    </div>
  );
}
