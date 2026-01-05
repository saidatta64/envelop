'use client';

import { useEditor, EditorContent, BubbleMenu, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, List, ListOrdered, Image as ImageIcon, Heading1, Heading2, Quote, Upload } from 'lucide-react';
import { useState } from 'react';
import Modal from './Modal';
import { uploadImage } from '@/app/actions/upload';

const MenuBar = ({ editor, onAddImage, backgroundColor, textColor }: { editor: Editor | null, onAddImage: () => void, backgroundColor?: string, textColor?: string }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="editor-menu-bar" style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
            padding: '0.5rem',
            borderBottom: '1px solid currentColor',
            position: 'sticky',
            top: 0,
            background: backgroundColor || 'var(--background)', // Use the document background
            color: textColor || 'var(--foreground)',          // Use the document text color
            zIndex: 10,
            transition: 'background-color 0.3s ease, color 0.3s ease'
        }}>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
                style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: editor.isActive('bold') ? 1 : 0.5 }}
                type="button"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
                style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: editor.isActive('italic') ? 1 : 0.5 }}
                type="button"
            >
                <Italic size={18} />
            </button>
            <div style={{ width: '1px', background: 'currentColor', opacity: 0.2, margin: '0 0.5rem' }}></div>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: editor.isActive('heading', { level: 1 }) ? 1 : 0.5 }}
                type="button"
            >
                <Heading1 size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: editor.isActive('heading', { level: 2 }) ? 1 : 0.5 }}
                type="button"
            >
                <Heading2 size={18} />
            </button>
            <div style={{ width: '1px', background: 'currentColor', opacity: 0.2, margin: '0 0.5rem' }}></div>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
                style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: editor.isActive('bulletList') ? 1 : 0.5 }}
                type="button"
            >
                <List size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'is-active' : ''}
                style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: editor.isActive('orderedList') ? 1 : 0.5 }}
                type="button"
            >
                <ListOrdered size={18} />
            </button>
            <div style={{ width: '1px', background: 'currentColor', opacity: 0.2, margin: '0 0.5rem' }}></div>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'is-active' : ''}
                style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: editor.isActive('blockquote') ? 1 : 0.5 }}
                type="button"
            >
                <Quote size={18} />
            </button>
            <button
                onClick={onAddImage}
                style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.5 }}
                type="button"
            >
                <ImageIcon size={18} />
            </button>
        </div>
    );
};

export default function TiptapEditor({ content, onChange, style, backgroundColor, textColor }: { content: string, onChange: (html: string) => void, style?: React.CSSProperties, backgroundColor?: string, textColor?: string }) {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: 'Tell your story...',
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
                style: 'min-height: 50vh; outline: none;',
            },
        },
        immediatelyRender: false,
    });

    const addImage = () => {
        if (imageUrl) {
            editor?.chain().focus().setImage({ src: imageUrl }).run();
            setImageUrl('');
            setIsImageModalOpen(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await uploadImage(formData);
            if (result.url) {
                editor?.chain().focus().setImage({ src: result.url }).run();
                setIsImageModalOpen(false);
            } else {
                console.error(result.error);
                alert('Failed to upload image');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred during upload');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modern-editor" style={style}>
            <MenuBar editor={editor} onAddImage={() => setIsImageModalOpen(true)} />
            <EditorContent editor={editor} />

            <Modal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                title="Add Image"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Local Upload Option */}
                    <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                            Upload from device
                        </p>
                        <label style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem',
                            border: '2px dashed var(--border)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            backgroundColor: 'rgba(0,0,0,0.02)',
                            transition: 'all 0.2s ease',
                            textAlign: 'center'
                        }} className="upload-zone">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                                disabled={uploading}
                            />
                            {uploading ? (
                                <span style={{ color: 'var(--muted)' }}>Uploading...</span>
                            ) : (
                                <>
                                    <Upload size={24} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                    <span style={{ fontSize: '0.9rem' }}>Click to select an image</span>
                                </>
                            )}
                        </label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--border)' }}></div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>OR</span>
                        <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--border)' }}></div>
                    </div>

                    {/* URL Option */}
                    <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                            Paste Link
                        </p>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                backgroundColor: 'var(--background)',
                                color: 'var(--foreground)',
                                fontSize: '1rem'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                            <button
                                onClick={() => setIsImageModalOpen(false)}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: 'transparent',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addImage}
                                disabled={!imageUrl}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'var(--foreground)',
                                    color: 'var(--background)',
                                    cursor: 'pointer',
                                    opacity: imageUrl ? 1 : 0.5
                                }}
                            >
                                Embed
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
