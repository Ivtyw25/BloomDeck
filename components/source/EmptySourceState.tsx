import { Search } from 'lucide-react';

export function EmptySourceState({text, desc}: {text: string, desc: string}) {
    return (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center shadow-xs justify-center mb-4">
                <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold font-heading text-text-main">{text}</h3>
            <p className="text-text-muted mt-1 max-w-sm">{desc}</p>
        </div>
    );
}
