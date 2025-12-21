import { getPosts } from "../actions/blog";
import Link from "next/link";

export default async function FeedPage() {
    const posts = await getPosts();

    return (
        <div className="container mt-4">
            <section className="text-center" style={{ padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
                <p className="caps" style={{ letterSpacing: '0.3em', marginBottom: '1rem' }}>The Reading Room</p>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>The Latest Chronicles</h1>
                <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--muted)' }}>
                    Explore the collective thoughts and stories shared by our contributors.
                </p>
            </section>

            {/* Post Grid */}
            <section className="mt-4" style={{ paddingBottom: '4rem' }}>
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
                                <p className="caps" style={{ color: post.style?.backgroundColor !== '#ffffff' ? post.style?.backgroundColor : 'var(--accent)', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                    {post.style?.fontFamily === 'serif' ? 'Serif Column' : 'Modern Column'}
                                </p>
                                <h2 className="mt-1" style={{
                                    fontSize: '1.8rem',
                                    lineHeight: '1.1',
                                    fontFamily: post.style?.fontFamily || 'serif'
                                }}>
                                    <Link href={`/p/${post._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{post.title}</Link>
                                </h2>
                                <p className="mt-1" style={{
                                    color: 'var(--muted)',
                                    fontSize: '0.95rem',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {post.excerpt.replace(/<[^>]*>?/gm, '')}
                                </p>
                                <div className="mt-1 flex items-center" style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', opacity: 0.8 }}>
                                    <span className="serif" style={{ fontStyle: 'italic' }}>By {post.author?.username || 'Anonymous'}</span>
                                    <span style={{ color: 'var(--muted)' }}>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="text-center" style={{ gridColumn: '1 / -1', padding: '4rem' }}>
                            <p className="serif" style={{ fontSize: '1.5rem', color: 'var(--muted)' }}>The ink is yet to dry. Be the first to write.</p>
                            <Link href="/write" className="btn-outline mt-2" style={{ display: 'inline-block' }}>Write a Blog</Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
