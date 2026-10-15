import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useApp } from '../context.jsx';
import { api } from '../lib/api.js';

export default function BlogPost() {
  const { slug } = useParams();
  const { t, tr, lang } = useApp();
  const [post, setPost] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    api.get(`/posts/${slug}`).then((r) => setPost(r.data)).catch(() => setMissing(true));
  }, [slug]);

  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
      <Link to="/blog" className="text-sm text-sec hover:underline">← {t('blog.back')}</Link>
      {missing && <p className="mt-8">404</p>}
      {!post && !missing && <p className="mt-8 font-mono">{t('loading')}</p>}
      {post && (
        <>
          <time className="mt-6 block font-mono text-xs text-fg/60">{new Date(post.createdAt).toLocaleDateString(lang)}</time>
          <h1 className="mb-8 mt-1 text-4xl font-extrabold">{tr(post.title)}</h1>
          <div className="prose-md"><ReactMarkdown>{tr(post.content)}</ReactMarkdown></div>
        </>
      )}
    </article>
  );
}
