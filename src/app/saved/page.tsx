import { getSavedPosts } from "@/app/actions/bookmarks";
import Link from "next/link";

export default async function ReadingListPage() {
    const posts = await getSavedPosts();

    return (
        <div className="container mt-4">
            <section className="text-center" style={{ padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
                <p className="caps" style={{ letterSpacing: '0.3em', marginBottom: '1rem' }}>Personal Collection</p>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Your Reading List</h1>
                <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--muted)' }}>
                    Stories you've saved for a quieter moment.
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
                                <p className="caps" style={{ color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                    Saved Column
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
                            <p className="serif" style={{ fontSize: '1.5rem', color: 'var(--muted)' }}>Your collection is empty.</p>
                            <Link href="/feed" className="btn-outline mt-2" style={{ display: 'inline-block' }}>Explore Stories</Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
