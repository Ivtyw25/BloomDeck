import { YouTubeIcon } from "@/lib/icons";

interface YoutubeUploadAreaProps {
    link: string;
    onChange: (link: string) => void;
}

export function YoutubeUploadArea({ link, onChange }: YoutubeUploadAreaProps) {
    return (
        <div className="bg-white p-8 rounded-[32px] border border-gray-300 shadow-xs">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                    <YouTubeIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold font-heading text-gray-900">YouTube Video</h3>
            </div>
            <input
                type="text"
                value={link}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Paste YouTube URL here"
                className="w-full px-5 py-3.5 bg-surface-subtle shadow-xs border rounded-xl text-sm font-normal focus:ring-2 text-text-main placeholder:text-gray-400 hover:bg-gray-50 focus:bg-white focus:ring-red-100 border-transparent outline-none transition-all"
            />
        </div>
    );
}
