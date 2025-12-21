import { getPosts } from "./actions/blog";
import Link from "next/link";

export default async function Home() {
  const posts = (await getPosts()).slice(0, 3); // Only show top 3 featured posts

  return (
    <div className="container mt-4">
      {/* Editorial Headline */}
      {/* Editorial Headline */}
      <section className="text-center hero-section" style={{ padding: '8rem 0', borderBottom: '2px solid var(--foreground)' }}>
        <p className="caps" style={{ letterSpacing: '0.4em', marginBottom: '1.5rem' }}>Est. 2025 — The Anonymous Chronicles</p>
        <h1 className="hero-title" style={{ marginBottom: '2rem', maxWidth: '900px', margin: '0 auto', lineHeight: '0.9' }}>
          Unheard Voices, <br />
          <span style={{ fontStyle: 'italic', fontWeight: '400' }}>Untethered Truths.</span>
        </h1>
        <div className="divider" style={{ width: '80px', margin: '3rem auto' }}></div>
        <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.4rem', color: 'var(--muted)', lineHeight: '1.5' }}>
          Envelop is an editorial space for the unspoken. A curated sanctuary where stories are told without names, and truths are shared without fear.
        </p>


      </section>

      {/* Featured Selection */}
      <section className="mt-4" style={{ paddingBottom: '6rem' }}>
        <div className="section-header" style={{ marginBottom: '4rem' }}>
          <div>
            <p className="caps" style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Editor's Choice</p>
            <h2 className="serif" style={{ fontSize: '2.5rem' }}>Selected Highlights</h2>
          </div>
          <Link href="/feed" className="caps" style={{ fontSize: '0.8rem', fontWeight: '700', borderBottom: '1px solid var(--foreground)' }}>
            View Full Feed →
          </Link>
        </div>

        <style>{`
        .hero-title {
          font-size: 5.5rem;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        @media (max-width: 768px) {
          .hero-section {
            padding: 4rem 0 !important;
          }
          .hero-title {
            font-size: 3rem !important;
          }
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>

        <div className="grid-cols">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <article key={post._id} style={{
                padding: '2rem',
                borderBottom: '1px solid var(--border)',
                borderLeft: post.style?.backgroundColor ? `4px solid ${post.style.backgroundColor}` : 'none',
                backgroundColor: post.style?.backgroundColor ? `${post.style.backgroundColor}08` : 'transparent',
                transition: 'all 0.2s ease',
              }} className="post-card">
                <p className="caps" style={{ color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  Featured Column
                </p>
                <h2 className="mt-1" style={{
                  fontSize: '1.8rem',
                  lineHeight: '1.1',
                  fontFamily: post.style?.fontFamily || 'serif'
                }}>
                  <Link href={`/p/${post._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{post.title}</Link>
                </h2>
                <div className="mt-1 flex items-center" style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', opacity: 0.8 }}>
                  <span className="serif" style={{ fontStyle: 'italic' }}>By {post.author?.username || 'Anonymous'}</span>
                  <span style={{ color: 'var(--muted)' }}>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center" style={{ gridColumn: '1 / -1', padding: '4rem' }}>
              <p className="serif" style={{ fontSize: '1.5rem', color: 'var(--muted)' }}>The printing press is ready. Share your first story.</p>
              <Link href="/write" className="btn-outline mt-2" style={{ display: 'inline-block' }}>Start Writing</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
