import { useApp } from '../context.jsx';
import Socials from './Socials.jsx';

export default function Footer() {
  const { t, data } = useApp();
  const p = data.settings.profile;
  return (
    <footer className="border-t border-fg/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-fg/70 sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} {p.name}. {t('footer.rights')}.</p>
        <Socials profile={p} />
      </div>
    </footer>
  );
}
