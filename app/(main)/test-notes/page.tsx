"use client";

import { useState, useEffect } from 'react';
import { getSources } from '@/services/source';
import { useGeneration } from '@/components/hooks/useGeneration';
import { SuccessDialog } from '@/components/ui/SuccessDialog';
import { SourceDocument } from '@/types/types';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function TestNotesPage() {
    const [sources, setSources] = useState<SourceDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSourceId, setSelectedSourceId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const selectedSource = sources.find(s => s.id === selectedSourceId);

    const generation = useGeneration({
        sourceId: selectedSourceId,
        fileSearchStoreID: selectedSource?.fileSearchStoreID,
    });

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const data = await getSources();
                // Filter for sources that have a fileSearchStoreID or are processed enough to generate notes
                // For now just show all, useGeneration handles missing ID error
                setSources(data);
            } catch (err) {
                console.error("Failed to fetch sources", err);
                setError("Failed to load sources for testing.");
            } finally {
                setLoading(false);
            }
        };

        fetchSources();
    }, []);

    const handleGenerate = () => {
        if (!selectedSourceId) {
            toast.error("Please select a source first");
            return;
        }
        generation.generate('notes');
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center text-red-500 gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Test Note Generation</h1>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Source to Generate Notes From
                    </label>
                    <select
                        value={selectedSourceId}
                        onChange={(e) => setSelectedSourceId(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    >
                        <option value="">-- Select a source --</option>
                        {sources.map((source) => (
                            <option key={source.id} value={source.id}>
                                {source.title} ({source.type}) {source.fileSearchStoreID ? '✅ Ready' : '⚠️ No FileStore'}
                            </option>
                        ))}
                    </select>
                    {selectedSource && !selectedSource.fileSearchStoreID && (
                        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            This source lacks a FileSearchStoreID. Generation will likely fail.
                        </p>
                    )}
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={generation.isAnyGenerating || !selectedSourceId}
                    className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {generation.isGenerating('notes') ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating Notes...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Generate Notes
                        </>
                    )}
                </button>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
                <p className="font-semibold mb-1">Testing Instructions:</p>
                <ol className="list-decimal pl-5 space-y-1">
                    <li>Select a source from the dropdown.</li>
                    <li>Click "Generate Notes".</li>
                    <li>Wait for the AI to process (this may take 10-20 seconds).</li>
                    <li>Verify the Success Dialog appears with "View Notes" button.</li>
                    <li>Click "View Notes" to verify navigation to the new material.</li>
                </ol>
            </div>

            <SuccessDialog
                isOpen={generation.isSuccess('flashcards') || generation.isSuccess('notes')}
                onClose={generation.resetSuccess}
                title={generation.generatedTitle}
                materialId={generation.generatedMaterialId || ''}
                type={generation.isSuccess('flashcards') ? 'flashcards' : 'notes'}
            />
        </div>
    );
}
