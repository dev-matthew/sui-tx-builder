import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { generatePresetSummary, extractTransactionDetails } from "@/lib/txsummary";

export function TransactionSummary({ nodes, sequence }) {
    if (!nodes || nodes.length === 0) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
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

    const summary = generatePresetSummary(nodes, sequence);
    const details = extractTransactionDetails(nodes, sequence);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Transaction Summary
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
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

                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="space-y-2">
                        {summary.split('\n').map((line, index) => (
                            <div key={index} className="font-medium text-sui">
                                {line}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}