'use client';

import { register } from '@/app/actions/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');
        const result = await register(formData);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push('/');
            router.refresh();
        }
    }

    return (
        <div className="container" style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div style={{ padding: '3rem', border: '1px solid var(--border)', background: 'var(--paper)' }}>
                <h1 className="text-center serif" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Join</h1>

                {error && <p style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

                <form action={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="caps" style={{ display: 'block', marginBottom: '0.5rem' }}>Choose Username</label>
                        <input type="text" name="username" required />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label className="caps" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input type="password" name="password" required />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Join the Collective'}
                    </button>
                </form>

                <p className="mt-2 text-center" style={{ fontSize: '0.9rem' }}>
                    Already a member? <Link href="/login" style={{ textDecoration: 'underline' }}>Login</Link>
                </p>
            </div>
        </div>
    );
}
