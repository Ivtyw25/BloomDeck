import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Presentation, FileCode, File } from 'lucide-react';

interface FileListProps {
    files: File[];
    onRemove: (index: number) => void;
    disabled?: boolean;
}

export function FileList({ files, onRemove, disabled }: FileListProps) {
    const getFileDetails = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'pdf':
                return {
                    icon: <FileText className="w-5 h-5 text-[#ef4444]" />,
                    bg: 'bg-[#fef2f2]'
                };
            case 'ppt':
            case 'pptx':
                return {
                    icon: <Presentation className="w-5 h-5 text-[#f97316]" />,
                    bg: 'bg-[#fff7ed]'
                };
            case 'doc':
            case 'docx':
                return {
                    icon: <FileCode className="w-5 h-5 text-[#3b82f6]" />,
                    bg: 'bg-[#eff6ff]'
                };
            case 'txt':
            default:
                return {
                    icon: <File className="w-5 h-5 text-gray-500" />,
                    bg: 'bg-gray-50'
                };
        }
    };

    return (
        <div className="space-y-3">
            <AnimatePresence mode="popLayout">
                {files.map((file, idx) => {
                    const { icon, bg } = getFileDetails(file.name);
                    return (
                        <motion.div
                            key={`${file.name}-${file.size}-${file.lastModified}`}
                            layout
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                                    {icon}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-text-main text-sm line-clamp-1">{file.name}</p>
                                    <p className="text-xs font-medium text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                onClick={() => !disabled && onRemove(idx)}
                                disabled={disabled}
                                className={`cursor-pointer text-gray-400 p-2 rounded-lg transition-all shrink-0 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-500 hover:bg-red-50'}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
