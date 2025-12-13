'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestGeneratePage() {
    const [storeID, setStoreID] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!storeID) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch('/api/ai/generate-decks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileSearchStoreID: storeID }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to generate');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>Test Flashcard Generation (JSON Mode)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <Input
                            placeholder="Enter fileSearchStoreID"
                            value={storeID}
                            onChange={(e) => setStoreID(e.target.value)}
                        />
                        <Button onClick={handleGenerate} disabled={loading || !storeID}>
                            {loading ? 'Generating...' : 'Generate'}
                        </Button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-md">
                            Error: {error}
                        </div>
                    )}

                    {result && (
                        <div className="space-y-2">
                            <h3 className="font-semibold">Result:</h3>
                            <pre className="bg-slate-100 p-4 rounded-md overflow-auto max-h-[600px] text-xs">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
