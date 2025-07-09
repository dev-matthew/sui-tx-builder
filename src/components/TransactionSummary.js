import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Brain, RefreshCw, SparkleIcon, Sparkle } from "lucide-react";
import { generatePresetSummary, extractTransactionDetails, generateLLMSummary } from "@/lib/txsummary";

export function TransactionSummary({ nodes, sequence }) {
    const [summary, setSummary] = useState('');
    const [details, setDetails] = useState(null);
    const [useLLM, setUseLLM] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);

    // Generate summary when nodes, sequence, or LLM settings change
    useEffect(() => {
        if (nodes && nodes.length > 0 && sequence && sequence.length > 0) {
            generateSummary();
            setDetails(extractTransactionDetails(nodes, sequence));
        } else {
            setSummary('');
            setDetails(null);
        }
    }, [nodes, sequence, useLLM, apiKey]);

    const generateSummary = async () => {
        if (!nodes || nodes.length === 0) return;

        setLoading(true);
        try {
            if (useLLM) {
                const llmSummary = await generateLLMSummary(nodes, sequence, process.env.GEMINI_API_KEY);
                setSummary(llmSummary);
            } else {
                const presetSummary = generatePresetSummary(nodes, sequence);
                setSummary(presetSummary);
            }
        } catch (error) {
            console.error('Failed to generate summary:', error);
            // Fallback to preset summary
            const presetSummary = generatePresetSummary(nodes, sequence);
            setSummary(presetSummary);
        } finally {
            setLoading(false);
        }
    };

    if (!nodes || nodes.length === 0) {
        return (
            <Card className="w-full max-w-md mx-auto max-h-96 overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Transaction Summary
                    </CardTitle>
                    <CardDescription>
                        Build a transaction to see its summary
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <CardTitle>Transaction Summary</CardTitle>
                        {summary && (
                            <Badge variant={useLLM ? 'default' : 'secondary'}>
                                {useLLM ? 'AI Generated' : 'Preset'}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="useLLM"
                                checked={useLLM}
                                onChange={(e) => setUseLLM(e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="useLLM" className="flex items-center gap-2">
                                <Sparkle className="h-4 w-4" />
                                Use AI
                            </Label>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={generateSummary}
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>


            </CardHeader>

            <CardContent className="space-y-4 max-h-64 overflow-y-auto">                {details && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-medium">Total Steps:</span> {details.totalSteps}
                    </div>
                    <div>
                        <span className="font-medium">Complexity:</span>
                        <Badge variant="outline" className="ml-2">
                            {details.complexity}
                        </Badge>
                    </div>
                    <div className="col-span-2">
                        <span className="font-medium">Block Types:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(details.blockTypes).map(([type, count]) => (
                                <Badge key={type} variant="secondary">
                                    {type}: {count}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            )}

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                        <span>Generating summary...</span>
                    </div>
                ) : summary ? (
                    <div className="space-y-4">
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="space-y-2">
                                {summary.split('\n').map((line, index) => {
                                    if (line.trim() === '') return null;

                                    // Check if line starts with a number (step)
                                    if (/^\d+\./.test(line)) {
                                        return (
                                            <div key={index} className="font-medium text-sui">
                                                {line}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={index} className="mb-2">
                                            {line}
                                        </div>
                                    );
                                }).filter(Boolean)}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No summary available
                    </div>
                )}
            </CardContent>
        </Card>
    );
}