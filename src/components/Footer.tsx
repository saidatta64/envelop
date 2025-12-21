import { getSession } from "@/lib/auth";

export default async function Footer() {
    return (
        <footer style={{ borderTop: '1px solid var(--border)', padding: '6rem 0', marginTop: '4rem', backgroundColor: 'var(--paper)' }}>
            <div className="container text-center">
                <blockquote style={{ marginBottom: '3rem' }}>
                    <p className="serif" style={{ fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--foreground)', maxWidth: '600px', margin: '0 auto' }}>
                        &ldquo;I think we forget things if there is nobody to tell them.&rdquo;
                    </p>
                    <cite className="caps" style={{ display: 'block', marginTop: '1rem', fontSize: '0.7rem', color: 'var(--muted)' }}>
                        — The Lunchbox (2013)
                    </cite>
                </blockquote>
                <div className="divider" style={{ width: '40px', margin: '2rem auto' }}></div>
                <p className="caps" style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>© 2025 ENVELOP MAGAZINE. THE ANONYMOUS COLLECTIVE.</p>
            </div>
        </footer>
    );
}
