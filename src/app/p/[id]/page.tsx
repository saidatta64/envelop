import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';
import PostManagement from '@/components/PostManagement';
import { checkIsSaved } from '@/app/actions/bookmarks';
import SaveButton from '@/components/SaveButton';

async function getPost(id: string) {
    await dbConnect();
    try {
        const post = await Post.findById(id).populate({ path: 'author', model: User, select: 'username' }).lean();
        if (!post) return null;
        return JSON.parse(JSON.stringify(post));
    } catch (error) {
        return null;
    }
}

export default async function PostPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const post = await getPost(params.id);
    const session = (await getSession()) as any;
    const isOwner = session?.userId === post?.author?._id;
    const isSaved = await checkIsSaved(params.id);

    if (!post) {
        notFound();
    }

    return (
        <div style={{ backgroundColor: post.style?.backgroundColor || '#ffffff', minHeight: '100vh', transition: 'all 0.3s ease' }}>
            <div className="container post-container" style={{
                maxWidth: '750px',
                margin: '0 auto',
                padding: '8rem 2rem',
                color: post.style?.textColor || '#000000',
                fontFamily: post.style?.fontFamily || 'serif'
            }}>
                <article>
                    <div className="post-meta" style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', position: 'relative' }}>
                        <p className="caps" style={{
                            color: post.style?.textColor || 'var(--accent)',
                            opacity: 0.6,
                            letterSpacing: '0.2em'
                        }}>
                            Published {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        {/* Save Button for authenticated users */}
                        {session && (
                            <div className="save-btn-wrapper" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                                <SaveButton postId={params.id} initialIsSaved={isSaved} />
                            </div>
                        )}
                    </div>

                    <h1 className="text-center post-title" style={{
                        marginBottom: '4rem',
                        lineHeight: '1.1',
                        fontWeight: 'bold'
                    }}>
                        {post.title}
                    </h1>

                    <style>{`
                        .post-title {
                            font-size: 4.5rem;
                            word-break: break-word;
                        }
                        @media (max-width: 768px) {
                            .post-container {
                                padding: 4rem 1.5rem !important;
                            }
                            .post-title {
                                font-size: 2.8rem !important;
                                margin-bottom: 2rem !important;
                            }
                            .post-content {
                                font-size: 1.1rem !important;
                                lineHeight: 1.6 !important;
                            }
                            .post-meta {
                                flex-direction: column;
                                gap: 1rem;
                                align-items: center;
                            }
                            .save-btn-wrapper {
                                position: static !important;
                                transform: none !important;
                            }
                        }
                    `}</style>

                    <div className="divider" style={{
                        width: '80px',
                        height: '1px',
                        backgroundColor: post.style?.textColor || 'var(--border)',
                        margin: '4rem auto',
                        opacity: 0.3
                    }}></div>

                    <div className="post-content" style={{
                        fontSize: '1.4rem',
                        lineHeight: '1.9',
                    }} dangerouslySetInnerHTML={{ __html: post.content }} />

                    <div className="mt-4" style={{
                        borderTop: `1px solid ${post.style?.textColor || 'var(--border)'}`,
                        paddingTop: '3rem',
                        marginTop: '6rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2rem',
                        opacity: 0.8
                    }}>
                        <p style={{ fontStyle: 'italic', fontSize: '1.2rem' }}>— Published by {post.author?.username || 'Anonymous'}</p>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {isOwner && (
                                <PostManagement postId={params.id} textColor={post.style?.textColor || '#000000'} />
                            )}
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
