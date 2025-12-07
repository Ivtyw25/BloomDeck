"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FileUploadArea } from '@/components/source/FileUploadArea';
import { FileList } from '@/components/source/FileList';
import { YoutubeUploadArea } from '@/components/source/YoutubeUploadArea';

type UploadMode = 'FILES' | 'YOUTUBE';

export default function UploadPage() {
    const router = useRouter();
    const [mode, setMode] = useState<UploadMode>('FILES');
    const [sourceName, setSourceName] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [youtubeLink, setYoutubeLink] = useState('');

    const addFiles = (newFiles: File[]) => {
        if (files.length + newFiles.length > 2) {
            toast.error("You can only upload a maximum of 2 files.");
            return;
        }
        setFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const getPlaceholderName = () => {
        if (mode === 'FILES' && files.length > 0) return files[0].name;
        if (mode === 'YOUTUBE' && youtubeLink) return "YouTube Video Source";
        return "Untitled Source";
    };

    const isValidYoutubeUrl = (url: string) => {
        const regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
        return regex.test(url);
    };

    const handleSubmit = () => {
        const finalName = sourceName || getPlaceholderName();

        if (mode === 'YOUTUBE' && !isValidYoutubeUrl(youtubeLink)) {
            toast.error("Please enter a valid YouTube URL");
            return;
        }

        console.log("Submitting:", {
            name: finalName,
            mode,
            data: mode === 'FILES' ? files : youtubeLink
        });

        toast.success(`Successfully uploaded ${mode === 'FILES' ? 'files' : 'YouTube link'}!`);
        router.back();
    };

    return (
        <div className="container px-6 py-4 min-h-screen animate-slide-in-right max-w-full">
            {/* Back Link */}
            <button
                onClick={() => router.back()}
                className="cursor-pointer mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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
                    <div className="bg-surface-subtle p-1 rounded-xl inline-flex items-center relative">
                        <button
                            onClick={() => { setMode('FILES'); }}
                            className={`relative z-10 px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-350 ${mode === 'FILES'
                                ? 'text-primary'
                                : 'text-text-muted hover:text-text-main'
                                }`}
                        >
                            {mode === 'FILES' && (
                                <motion.div
                                    layoutId="upload-tab"
                                    className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-lg -z-10"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            Upload Files
                        </button>
                        <div className="w-px h-4 bg-gray-300 mx-1"></div>
                        <button
                            onClick={() => { setMode('YOUTUBE'); }}
                            className={`relative z-10 px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-350 ${mode === 'YOUTUBE'
                                ? 'text-error'
                                : 'text-text-muted hover:text-text-main'
                                }`}
                        >
                            {mode === 'YOUTUBE' && (
                                <motion.div
                                    layoutId="upload-tab"
                                    className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-lg -z-10"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            YouTube Link
                        </button>
                    </div>
                </div>

                {/* Source Name Input */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-text-main mb-2.5 ml-1">Source Name (Optional)</label>
                    <input
                        type="text"
                        value={sourceName}
                        onChange={(e) => setSourceName(e.target.value)}
                        placeholder="Untitled Source"
                        className="w-full px-5 py-3.5 bg-surface-subtle shadow-xs border rounded-xl text-sm font-normal text-text-main placeholder:text-gray-400 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/40 border-transparent outline-none transition-all"
                    />
                    <p className="text-xs font-normal text-gray-400 mt-2 ml-1">
                        If left empty, we'll automatically name it for you.
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
                            <FileList files={files} onRemove={removeFile} />
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
                        disabled={(mode === 'FILES' && files.length === 0) || (mode === 'YOUTUBE' && !youtubeLink)}
                        className="px-10 py-3.5 bg-green-300 text-gray-50 font-semibold rounded-xl hover:bg-green-400 transition-all shadow-md shadow-[#b5d365]/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none active:scale-95"
                    >
                        Create Source
                    </button>
                </div>
            </div>
        </div>
    );
};