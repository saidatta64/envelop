'use client';

import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import { Star, Sparkles, Moon, Feather, Gem, Flame, Sun, Anchor, Zap, Heart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const ICONS = [Star, Sparkles, Moon, Feather, Gem, Flame, Sun, Anchor, Zap, Heart];
const COLORS = [
    '#c41e3a', // Crimson
    '#0891b2', // Cyan
    '#059669', // Emerald
    '#7c3aed', // Violet
    '#ea580c', // Orange
    '#db2777', // Pink
    '#2563eb', // Blue
    '#ca8a04', // Gold
];

const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
};

export default function HeaderClient({ session }: { session: any }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    let IconComponent = Star;
    let iconColor = '#c41e3a';

    if (session) {
        const hash = getHash(session.username);
        IconComponent = ICONS[hash % ICONS.length];
        iconColor = COLORS[hash % COLORS.length];
    }

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    return (
        <header style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--paper)', position: 'sticky', top: 0, zIndex: 50 }}>
            <div className="container" style={{
                height: 'var(--header-height)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', zIndex: 60 }}>
                    <Link href="/" className="serif" style={{ fontSize: '1.8rem', letterSpacing: '-1px' }}>
                        ENVELOP
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-only"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        zIndex: 60,
                        display: 'none', // Hidden by default, shown in media query
                        padding: '0.5rem',
                        marginRight: '-0.5rem',
                        color: 'var(--foreground)', // Ensure visibility in dark mode
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {session && (
                    <div className="desktop-only" style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        pointerEvents: 'none'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.4rem 1.4rem',
                            border: `1px solid ${iconColor}33`,
                            borderRadius: '24px',
                            fontSize: '0.85rem',
                            color: 'var(--foreground)',
                            background: `${iconColor}08`,
                            textTransform: 'none',
                            letterSpacing: '0',
                            boxShadow: `0 2px 12px ${iconColor}11`,
                            whiteSpace: 'nowrap',
                            pointerEvents: 'auto'
                        }}>
                            <IconComponent size={15} fill={iconColor} stroke={iconColor} strokeWidth={1} />
                            <span style={{ fontWeight: 500 }}>
                                Hey, <span className="serif" style={{ fontWeight: 700, color: 'var(--foreground)' }}>{session.username}</span>
                            </span>
                        </div>
                    </div>
                )}

                {/* Desktop Navigation */}
                <nav className="desktop-only caps" style={{
                    flex: 1,
                    display: 'flex',
                    gap: '2rem',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                }}>
                    <Link href="/feed">Feed</Link>
                    {session ? (
                        <>
                            <Link href="/saved">Saved</Link>
                            <Link href="/write">Write</Link>
                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <Link href="/login">Login</Link>
                            <Link href="/register" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Join</Link>
                        </>
                    )}
                </nav>
            </div>

            {/* Mobile Navigation Overlay */}
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'var(--paper)',
                transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                padding: '6rem 2rem 2rem 2rem',
                gap: '2rem',
                zIndex: 50
            }}>
                {session && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.8rem 1.2rem',
                        border: `1px solid ${iconColor}33`,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        color: 'var(--foreground)',
                        background: `${iconColor}08`,
                        marginBottom: '2rem'
                    }}>
                        <IconComponent size={18} fill={iconColor} stroke={iconColor} strokeWidth={1} />
                        <span style={{ fontWeight: 500 }}>
                            Hey, <span className="serif" style={{ fontWeight: 700, color: 'var(--foreground)' }}>{session.username}</span>
                        </span>
                    </div>
                )}

                <Link href="/feed" className="serif" style={{ fontSize: '2rem' }} onClick={() => setIsMenuOpen(false)}>Feed</Link>

                {session ? (
                    <>
                        <Link href="/saved" className="serif" style={{ fontSize: '2rem' }} onClick={() => setIsMenuOpen(false)}>Saved</Link>
                        <Link href="/write" className="serif" style={{ fontSize: '2rem' }} onClick={() => setIsMenuOpen(false)}>Write</Link>
                        <div style={{ marginTop: 'auto' }}>
                            <LogoutButton style={{ color: '#dc2626', fontSize: '1.2rem' }} />
                        </div>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="serif" style={{ fontSize: '2rem' }} onClick={() => setIsMenuOpen(false)}>Login</Link>
                        <Link href="/register" className="serif" style={{ fontSize: '2rem' }} onClick={() => setIsMenuOpen(false)}>Join Envelop</Link>
                    </>
                )}
            </div>

            <style jsx>{`
                @media (max-width: 1024px) {
                    .desktop-only {
                        display: none !important;
                    }
                    .mobile-only {
                        display: block !important;
                    }
                }
                @media (min-width: 1025px) {
                    .mobile-only {
                        display: none !important;
                    }
                }
            `}</style>
        </header>
    );
}
