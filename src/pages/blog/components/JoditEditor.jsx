import React, { useMemo, useContext, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import 'jodit/es2021/jodit.min.css'; // Updated path for Jodit 4
import { Context } from "../../../common/helper/Context";
import { POST_url } from "../../../connection/connection";

const JoditEditorComponent = ({ formData, setFormData, authorName, contentImages = [], onEditorReady, config: userConfig }) => {
    const { user } = useContext(Context);
    const dynamicAuthorName = authorName || user?.full_name || user?.username || "Admin";

    // Using a ref for author name to prevent stale closures in Jodit's uploader callbacks
    const authorNameRef = useRef(dynamicAuthorName);
    useEffect(() => {
        authorNameRef.current = dynamicAuthorName;
    }, [dynamicAuthorName]);

    // Using a ref for contentImages to prevent stale closures in Jodit's gallery callback
    const contentImagesRef = useRef(contentImages);
    useEffect(() => {
        contentImagesRef.current = contentImages;
    }, [contentImages]);

    const config = useMemo(() => ({
        readonly: false,
        toolbarButtonSize: 'middle',
        theme: 'dark',
        height: 400,
        toolbarAdaptive: false,
        buttons: [
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'ul', 'ol', '|',
            'outdent', 'indent', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'gallery', 'video', 'table', 'link', '|',
            'align', 'undo', 'redo', '|',
            'hr', 'eraser', 'fullsize', 'source'
        ],
        controls: {
            gallery: {
                icon: 'image',
                tooltip: 'Gallery',
                popup: (editor, current, control, close) => {
                    const div = editor.create.fromHTML('<div style="width: 300px; max-height: 400px; overflow-y: auto; padding: 10px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #1e293b;"></div>');

                    const currentImages = contentImagesRef.current;

                    if (!currentImages || currentImages.length === 0) {
                        div.innerHTML = '<div style="grid-column: span 3; text-align: center; color: #94a3b8; padding: 20px;">No images in gallery</div>';
                    } else {
                        currentImages.forEach(img => {
                            const imgThumb = editor.create.fromHTML(`<img src="${img.image_url}" style="width: 100%; height: 80px; object-fit: cover; cursor: pointer; border-radius: 4px; border: 1px solid #444;" title="${img.image_url.split('/').pop()}" />`);
                            imgThumb.onclick = () => {
                                const newImg = editor.create.fromHTML(`<img src="${img.image_url}" data-image-id="${img.id}" style="max-width: 100%; height: auto;" />`);
                                editor.selection.insertNode(newImg);
                                // Fix for TypeError: close is not a function
                                if (typeof close === 'function') {
                                    close();
                                } else {
                                    editor.e.fire('closeAllPopups');
                                }
                            };
                            div.appendChild(imgThumb);
                        });
                    }
                    return div;
                }
            }
        },
        events: {
            afterInit: (instance) => {
                if (typeof onEditorReady === 'function') {
                    onEditorReady(instance);
                }
            }
        },
        placeholder: 'Start writing your blog content here...',
        uploader: {
            insertImageAsBase64URI: false,
            url: POST_url.contentImages,
            format: 'json',
            prepareData: (fd) => {
                // Jodit 4 uses 'files[0]' as the default key for the first file
                const file = fd.get('files[0]');
                if (file) {
                    fd.append('image', file);
                    fd.delete('files[0]');
                }

                // Use the ref to get the LATEST author name, ensuring it's never empty
                const latestName = authorNameRef.current && authorNameRef.current.trim() !== ""
                    ? authorNameRef.current
                    : "Admin";

                fd.append('author_name', latestName);
                return fd;
            },
            isSuccess: (resp) => resp.status === 'success',
            getMessage: (resp) => resp.message,
            process: (resp) => ({
                files: [resp.data.image_url],
                path: resp.data.image_url,
                baseurl: '',
                error: resp.status !== 'success' ? resp.message : null,
                msg: resp.message,
                imageId: resp.data.id
            }),
            defaultHandlerSuccess: function (data) {
                const editor = this;
                data.files.forEach((url) => {
                    const imageId = data.imageId;
                    const img = editor.create.fromHTML(`<img src="${url}" data-image-id="${imageId}" style="max-width: 100%; height: auto;" />`);
                    editor.selection.insertNode(img);
                });
            },
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        },
        style: {
            background: '#1e293b',
            color: '#f8fafc',
        },
        ...userConfig
    }), [dynamicAuthorName, userConfig, contentImages]);

    const handleBlur = (newContent) => {
        setFormData(prev => ({ ...prev, content_preview: newContent }));
    };

    return (
        <div className="jodit-editor-wrapper text-slate-800">
            <style>
                {`
                .jodit-container {
                    border: 1px solid #475569 !important;
                    background-color: #1e293b !important;
                }
                .jodit-toolbar__box {
                    background-color: #0f172a !important;
                    border-bottom: 1px solid #475569 !important;
                }
                .jodit-toolbar-button__button {
                    color: #cbd5e1 !important;
                }
                .jodit-toolbar-button__button:hover {
                    background-color: #334155 !important;
                }
                .jodit-wysiwyg {
                    color: #f1f5f9 !important;
                    background-color: #1e293b !important;
                }
                .jodit-wysiwyg ul {
                    list-style-type: disc;
                    padding-left: 2rem !important;
                    margin: 1em 0 !important;
                }
                .jodit-wysiwyg ol {
                    list-style-type: decimal;
                    padding-left: 2rem !important;
                    margin: 1em 0 !important;
                }
                .jodit-wysiwyg li {
                    display: list-item !important;
                }
                .jodit-wysiwyg h1 {
                    font-size: 2.25em !important;
                    font-weight: 800 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    line-height: normal !important;
                }
                .jodit-wysiwyg h2 {
                    font-size: 1.875em !important;
                    font-weight: 700 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    line-height: normal !important;
                }
                .jodit-wysiwyg h3 {
                    font-size: 1.5em !important;
                    font-weight: 600 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    line-height: normal !important;
                }
                .jodit-wysiwyg h4 {
                    font-size: 1.25em !important;
                    font-weight: 600 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    line-height: normal !important;
                }
                /* Styling for heading items in the paragraph dropdown */
                .jodit-list-item_h1 { font-size: 20px !important; font-weight: bold !important; padding: 2px 8px !important; }
                .jodit-list-item_h2 { font-size: 18px !important; font-weight: bold !important; padding: 2px 8px !important; }
                .jodit-list-item_h3 { font-size: 16px !important; font-weight: bold !important; padding: 2px 8px !important; }
                .jodit-list-item_h4 { font-size: 14px !important; font-weight: bold !important; padding: 2px 8px !important; }
                .jodit-status-bar {
                    background-color: #0f172a !important;
                    border-top: 1px solid #475569 !important;
                    color: #94a3b8 !important;
                }
                .jodit-ui-button_active {
                    background-color: #f59e0b !important;
                }
                .jodit-ui-button_active .jodit-icon {
                   fill: #000 !important;
                }
                `}
            </style>
            <JoditEditor
                value={formData.content_preview}
                config={config}
                onBlur={handleBlur}
                onChange={() => { }} // Placeholder to avoid warnings if needed
            />
        </div>
    );
};

export default JoditEditorComponent;
