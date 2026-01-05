'use client';

import { updatePost } from '@/app/actions/blog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TiptapEditor from '@/components/TiptapEditor';
import { Palette, X } from 'lucide-react';

const FONTS = [
    { name: 'Classic Serif', value: 'var(--font-serif)' },
    { name: 'Modern Sans', value: 'var(--font-sans)' },
    { name: 'Monospace', value: 'monospace' },
    { name: 'Elegant Cursive', value: 'cursive' },
];

const PRESET_COLORS = [
    { name: 'Paper', bg: '#ffffff', text: '#000000' },
    { name: 'Midnight', bg: '#0f172a', text: '#f8fafc' },
    { name: 'Sepia', bg: '#fdf6e3', text: '#586e75' },
    { name: 'Forest', bg: '#064e3b', text: '#ecfdf5' },
    { name: 'Wine', bg: '#450a0a', text: '#fef2f2' },
    { name: 'Dusk', bg: '#1e1b4b', text: '#e0e7ff' },
];

import { Post } from '@/types';

export default function EditPostForm({ post }: { post: Post }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [bgColor, setBgColor] = useState(post.style?.backgroundColor || '#ffffff');
    const [textColor, setTextColor] = useState(post.style?.textColor || '#000000');
    const [fontFamily, setFontFamily] = useState(post.style?.fontFamily || 'serif');
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');

        formData.append('backgroundColor', bgColor);
        formData.append('fontFamily', fontFamily);
        formData.append('textColor', textColor);

        const result = await updatePost(post._id, formData);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push(`/p/${post._id}`);
            router.refresh();
        }
    }

    return (
        <div className="write-container" style={{
            display: 'grid',
            gridTemplateColumns: isSidebarOpen ? '1fr 400px' : '1fr 0px',
            minHeight: '100vh',
            background: 'var(--background)',
            transition: 'grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
            {/* Editor Area */}
            <div style={{
                padding: '6rem 4rem',
                overflowY: 'auto',
                backgroundColor: bgColor,
                color: textColor,
                position: 'relative',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                {/* Design Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="design-toggle-btn"
                    style={{
                        position: 'fixed',
                        top: '100px',
                        right: isSidebarOpen ? '420px' : '2rem',
                        zIndex: 50,
                        padding: '0.8rem',
                        borderRadius: '50%',
                        backgroundColor: isSidebarOpen ? 'var(--background)' : bgColor === '#ffffff' ? 'var(--foreground)' : 'rgba(255,255,255,0.2)',
                        color: isSidebarOpen ? 'var(--foreground)' : bgColor === '#ffffff' ? 'var(--background)' : textColor,
                        border: isSidebarOpen ? '1px solid var(--border)' : 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    title={isSidebarOpen ? "Close Design" : "Open Design"}
                >
                    {isSidebarOpen ? <X size={20} /> : <Palette size={20} />}
                </button>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <form action={handleSubmit}>
                        <div style={{ marginBottom: '3rem' }}>
                            <textarea
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="The Headline..."
                                rows={2}
                                style={{
                                    fontSize: '4.5rem',
                                    border: 'none',
                                    background: 'transparent',
                                    padding: '0',
                                    width: '100%',
                                    fontFamily: fontFamily,
                                    color: textColor,
                                    outline: 'none',
                                    fontWeight: 'bold',
                                    lineHeight: '1.1',
                                    resize: 'none',
                                    overflow: 'hidden'
                                }}
                                required
                            />
                        </div>

                        <div className="divider" style={{
                            width: '60px',
                            height: '2px',
                            backgroundColor: textColor,
                            opacity: 0.2,
                            marginBottom: '4rem'
                        }}></div>

                        <div style={{ marginBottom: '2rem' }}>
                            <TiptapEditor
                                content={content}
                                onChange={setContent}
                                style={{
                                    fontFamily: fontFamily,
                                    color: textColor,
                                }}
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            position: 'fixed',
                            bottom: '3rem',
                            left: isSidebarOpen ? 'calc((100% - 400px) / 2 - 400px + 4rem)' : '50%',
                            transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-50%)',
                            transition: 'all 0.3s ease'
                        }}>
                            <button type="submit" className="btn-primary" disabled={loading} style={{
                                padding: '1.2rem 3rem',
                                borderRadius: '50px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                {loading ? 'Saving...' : (
                                    <>
                                        <span>Update Column</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Styling Sidebar */}
            <div style={{
                borderLeft: '1px solid var(--border)',
                padding: '3rem 2rem',
                backgroundColor: 'var(--background)',
                display: 'flex',
                flexDirection: 'column',
                gap: '3rem',
                position: 'sticky',
                top: 0,
                height: '100vh',
                overflowY: 'auto',
                width: '400px',
                opacity: isSidebarOpen ? 1 : 0,
                visibility: isSidebarOpen ? 'visible' : 'hidden',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="serif" style={{ fontSize: '1.8rem', margin: 0 }}>Design</h2>
                    <span className="caps" style={{ fontSize: '0.65rem', opacity: 0.5 }}>Re-style your column</span>
                </div>

                {error && (
                    <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid #fecaca' }}>
                        {error}
                    </div>
                )}

                {/* Font Selection */}
                <div className="design-section">
                    <label className="caps" style={{ display: 'block', marginBottom: '1.2rem', fontSize: '0.75rem', fontWeight: 700 }}>Typography</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {FONTS.map(font => (
                            <button
                                key={font.value}
                                onClick={() => setFontFamily(font.value)}
                                style={{
                                    padding: '1rem 0.5rem',
                                    border: fontFamily === font.value ? '2px solid var(--accent)' : '1px solid var(--border)',
                                    borderRadius: '12px',
                                    background: fontFamily === font.value ? 'var(--background)' : 'rgba(0,0,0,0.02)',
                                    fontFamily: font.value,
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    textAlign: 'center',
                                    transition: 'all 0.2s ease',
                                    transform: fontFamily === font.value ? 'scale(1.05)' : 'scale(1)'
                                }}
                            >
                                {font.name.split(' ')[0]} <br />
                                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{font.name.split(' ')[1]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* preset Colors */}
                <div className="design-section">
                    <label className="caps" style={{ display: 'block', marginBottom: '1.2rem', fontSize: '0.75rem', fontWeight: 700 }}>Color Palette</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {PRESET_COLORS.map(preset => (
                            <button
                                key={preset.name}
                                onClick={() => {
                                    setBgColor(preset.bg);
                                    setTextColor(preset.text);
                                }}
                                style={{
                                    aspectRatio: '1',
                                    backgroundColor: preset.bg,
                                    border: bgColor === preset.bg ? '3px solid var(--accent)' : '1px solid var(--border)',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: preset.text,
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    boxShadow: bgColor === preset.bg ? '0 5px 15px rgba(0,0,0,0.1)' : 'none',
                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    transform: bgColor === preset.bg ? 'scale(1.1)' : 'scale(1)'
                                }}
                                title={preset.name}
                            >
                                Aa
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Colors */}
                <div className="design-section" style={{ display: 'flex', gap: '1.5rem', background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <label className="caps" style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.65rem', opacity: 0.6 }}>Background</label>
                        <div style={{ position: 'relative', height: '40px' }}>
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer'
                                }}
                            />
                            <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: bgColor,
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                color: textColor
                            }}>
                                Pick
                            </div>
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label className="caps" style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.65rem', opacity: 0.6 }}>Text</label>
                        <div style={{ position: 'relative', height: '40px' }}>
                            <input
                                type="color"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer'
                                }}
                            />
                            <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: textColor,
                                borderRadius: '8px',
                                border: '1px solid var(--border)'
                            }}></div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 'auto', padding: '1.5rem', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                    <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--muted)' }}>
                        "Design is the silent ambassador of your brand." — Paul Rand
                    </p>
                </div>
            </div>
        </div>
    );
}
