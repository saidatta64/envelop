'use client';

export default function EditPostLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="edit-mode">
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
