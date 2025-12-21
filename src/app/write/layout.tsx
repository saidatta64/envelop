'use client';

export default function WriteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="write-mode">
            <style dangerouslySetInnerHTML={{
                __html: `
        footer {
          display: none !important;
        }
      `}} />
            {children}
        </div>
    )
}
