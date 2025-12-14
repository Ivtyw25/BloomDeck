"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FileUploadArea } from '@/components/source/FileUploadArea';
import { FileList } from '@/components/source/FileList';
import { YoutubeUploadArea } from '@/components/source/YoutubeUploadArea';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { getTitleFromUrl } from '@/services/youtube';
import { createSource } from '@/services/source';
import { getPresignedUploadUrl } from '@/services/upload';

type UploadMode = 'FILES' | 'YOUTUBE';

export default function UploadPage() {
    const router = useRouter();
    const [mode, setMode] = useState<UploadMode>('FILES');
    const [sourceName, setSourceName] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [youtubeLink, setYoutubeLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addFiles = (newFiles: File[]) => {
        const uniqueNewFiles = newFiles.filter(newFile =>
            !files.some(existingFile =>
                existingFile.name === newFile.name && existingFile.size === newFile.size
            )
        );

        if (uniqueNewFiles.length !== newFiles.length) {
            toast.error("Duplicate files were ignored.");
        }

        if (uniqueNewFiles.length === 0) return;

        if (files.length + uniqueNewFiles.length > 2) {
            toast.error("You can only upload a maximum of 2 files.");
            return;
        }
        setFiles(prev => [...prev, ...uniqueNewFiles]);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const getPlaceholderName = async () => {
        if (mode === 'FILES' && files.length > 0) return files[0].name;
        if (mode === 'YOUTUBE' && youtubeLink) return await getTitleFromUrl(youtubeLink);
        return "Untitled Source";
    };

    const isValidYoutubeUrl = (url: string) => {
        const regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
        return regex.test(url);
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['bytes', 'kb', 'mb', 'gb'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const normalizeFileType = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toUpperCase() || 'UNKNOWN';
        if (['PPT', 'PPTX'].includes(ext)) return 'PPT';
        if (['DOC', 'DOCX'].includes(ext)) return 'DOCX';
        if (ext === 'PDF') return 'PDF';
        return ext;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            if (mode === 'YOUTUBE' && !isValidYoutubeUrl(youtubeLink)) {
                toast.error("Please enter a valid YouTube URL");
                setIsSubmitting(false);
                return;
            }

            const finalName = sourceName || await getPlaceholderName()

            if (mode === 'YOUTUBE') {

                await createSource({
                    title: finalName || "Untitled Source",
                    type: 'YOUTUBE',
                    youtube_url: youtubeLink,
                    file_url: null,
                    containedTypes: null,
                    size: null
                });

            } else {
                if (files.length === 0) {
                    toast.error("Please select at least one file");
                    setIsSubmitting(false);
                    return;
                }

                const totalBytes = files.reduce((acc, file) => acc + file.size, 0);
                const MAX_SIZE_MB = 50;
                if (totalBytes > MAX_SIZE_MB * 1024 * 1024) {
                    toast.error(`Total file size must be less than ${MAX_SIZE_MB}MB`);
                    setIsSubmitting(false);
                    return;
                }

                // Upload files and gather metadata
                const uploadedUrls: string[] = [];
                let totalSize = 0;
                const typesSet = new Set<string>();

                for (const file of files) {
                    try {
                        const { signedUrl, publicUrl } = await getPresignedUploadUrl(file.name, file.type);
                        const uploadResponse = await fetch(signedUrl, {
                            method: 'PUT',
                            body: file,
                            headers: {
                                'Content-Type': file.type
                            }
                        });


                        if (!uploadResponse.ok) {
                            throw new Error(`Failed to upload to storage: ${uploadResponse.statusText}`);
                        }

                        uploadedUrls.push(publicUrl);
                        totalSize += file.size;
                        typesSet.add(normalizeFileType(file.name));
                    } catch (uploadError: any) {
                        console.error(`Failed to upload file ${file.name}:`, uploadError);
                        toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
                        setIsSubmitting(false);
                        return;
                    }
                }

                // Determine final type and containedTypes
                let finalType = '';
                let containedTypes: string[] | null = null;
                const uniqueTypes = Array.from(typesSet);

                if (uniqueTypes.length === 1) {
                    finalType = uniqueTypes[0];
                    containedTypes = null;
                } else {
                    finalType = 'MIXED';
                    containedTypes = uniqueTypes;
                }

                await createSource({
                    title: finalName || "Untitled Source",
                    type: finalType,
                    containedTypes: containedTypes,
                    size: formatBytes(totalSize),
                    file_url: uploadedUrls,
                    youtube_url: null
                });
            }

            toast.success(`Successfully uploaded ${mode === 'FILES' ? 'files' : 'YouTube link'}!`);
            router.back();

        } catch (error: any) {
            console.error("Submission error:", error);
            toast.error(error.message || "Failed to create source");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container px-6 py-4 min-h-screen animate-slide-in-right max-w-full">
            {/* Back Link */}
            <button
                onClick={() => !isSubmitting && router.back()}
                disabled={isSubmitting}
                className={`cursor-pointer mb-8 flex items-center gap-2 text-gray-500 transition-colors text-sm font-medium group ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-900'
                    }`}
            >
                <ArrowLeft className={`w-4 h-4 transition-transform ${isSubmitting ? '' : 'group-hover:-translate-x-1'}`} />
                Back
            </button>

            <div className="max-w-full mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-heading font-bold text-text-main mb-3 tracking-tight">Add New Source</h1>
                    <p className="text-text-muted font-medium">
                        Import sources to generate study decks automatically.
                    </p>
                </div>

                {/* Tabs - Centered Pill Style */}
                <div className="flex justify-center mb-10">
                    <SegmentedControl
                        options={[
                            { label: 'Upload Files', value: 'FILES' },
                            { label: 'YouTube Link', value: 'YOUTUBE', activeClass: 'text-red-500' }
                        ]}
                        value={mode}
                        onChange={(val: string) => setMode(val as UploadMode)}
                        layoutId="upload-tab"
                    />
                </div>

                {/* Source Name Input */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-text-main mb-2.5 ml-1">Source Name</label>
                    <input
                        type="text"
                        value={sourceName}
                        onChange={(e) => setSourceName(e.target.value)}
                        placeholder="e.g. Data Structures and Algorithms - Sorting"
                        className="w-full px-5 py-3.5 bg-surface-subtle shadow-xs border rounded-xl text-sm font-normal text-text-main placeholder:text-gray-400 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/40 border-transparent outline-none transition-all"
                    />
                    <p className="text-xs font-normal text-gray-400 mt-2 ml-1">
                        Give your source a relevant and purposeful name. If left empty, we'll automatically name it for you
                    </p>
                </div>

                {/* Upload Area */}
                <AnimatePresence mode="wait">
                    {mode === 'FILES' ? (
                        <motion.div
                            key="FILES"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <FileUploadArea
                                onFilesSelected={addFiles}
                                currentFileCount={files.length}
                            />

                            {/* File List */}
                            <FileList files={files} onRemove={removeFile} disabled={isSubmitting} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="YOUTUBE"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <YoutubeUploadArea link={youtubeLink} onChange={setYoutubeLink} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                <div className="mt-10 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || (mode === 'FILES' && (files.length === 0 || files.length > 2)) || (mode === 'YOUTUBE' && !youtubeLink)}
                        className="cursor-pointer px-10 py-3.5 bg-primary text-gray-50 font-semibold rounded-xl hover:bg-primary-hover transition-all shadow-md shadow-[#b5d365]/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none active:scale-95 flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating...
                            </>
                        ) : 'Create Source'}
                    </button>
                </div>
            </div>
        </div>
    );
};