const BLOCK_DESCRIPTIONS = {
    TransferObjects: {
        template: (data) => {
            const objectCount = data.objects?.length || 0;
            const recipient = data.to || "unknown address";
            return `Transfer ${objectCount} object${objectCount !== 1 ? "s" : ""} to ${recipient}`;
        }
    },
    MoveCall: {
        template: (data) => {
            const moduleName = data.module || "unknown module";
            const functionName = data.function || "unknown function";
            const argCount = data.arguments?.length || 0;
            let description = `Call ${moduleName}::${functionName}`; // Fixed: removed extra space

            if (data.packageData?.name) { // Fixed: data.package?.name -> data.packageData?.name
                description = `Call ${data.packageData.name}::${moduleName}::${functionName}`;
            }
            if (argCount > 0) {
                description += ` with ${argCount} argument${argCount !== 1 ? "s" : ""}`;
            }
            return description;
        }
    },
    SplitCoins: {
        template: (data) => {
            const coin = data.coin || 'gas coin';
            const amountCount = data.amounts?.length || 0;
            return `Split ${coin} into ${amountCount} part${amountCount !== 1 ? 's' : ''}`;
        }
    },
    MergeCoins: {
        template: (data) => {
            const sourceCount = data.sourceCoins?.length || 0;
            const destination = data.destinationCoin || 'destination coin';
            return `Merge ${sourceCount} coin${sourceCount !== 1 ? 's' : ''} into ${destination}`;
        }
    },
    MakeMoveVec: {
        template: (data) => {
            const elementCount = data.vecArguments?.length || 0;
            return `Create a vector with ${elementCount} element${elementCount !== 1 ? 's' : ''}`;
        }
    }
}

export function generatePresetSummary(nodes, sequence) {
    if (!nodes || nodes.length === 0) {
        return "No transactions to summarize";
    }
    const description = sequence.map((node, index) => {
        const blockType = node.type;
        const descriptionFn = BLOCK_DESCRIPTIONS[blockType]?.template;
        if (descriptionFn) {
            return `${index + 1}. ${descriptionFn(node.data)}`;
        } else {
            return `${index + 1}. Execute ${blockType} operation`;
        }
    });
    return description.join("\n");
}

export function extractTransactionDetails(nodes, sequence) {
    const details = {
        totalSteps: sequence.length,
        blockTypes: {},
        complexity: 'Low'
    };

    sequence.forEach((node) => {
        details.blockTypes[node.type] = (details.blockTypes[node.type] || 0) + 1;
    });

    if (sequence.length > 5) {
        details.complexity = 'High';
    } else if (sequence.length > 2) {
        details.complexity = 'Medium';
    }
    return details;
}

export async function generateLLMSummary(nodes, sequence) {
    if (!nodes || nodes.length === 0) {
        return "No transaction blocks to summarize";
    }

    try {
        const transactionData = sequence.map((node, index) => ({
            step: index + 1,
            type: node.type,
            data: node.data
        }));

        const prompt = `Analyze this Sui blockchain transaction and provide a clear, concise summary in natural language. Focus on what the transaction accomplishes from a user's perspective.

Transaction Steps:
${JSON.stringify(transactionData, null, 2)}

Please provide:
1. A brief overview of what this transaction does
2. Explain it in simple terms that a non-technical user would understand
3. Mention any notable DeFi protocols or services being used
4. Do not use markdown formatting

Keep the response concise and user-friendly.`;

        const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 400,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error Response:', errorText);
            throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Gemini API Response:', data);

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No response from Gemini API');
        }

        return data.candidates[0]?.content?.parts[0]?.text || 'Failed to generate LLM summary';
    } catch (error) {
        console.error('LLM summary generation failed:', error);
        return `Failed to generate LLM summary: ${error.message}`;
    }
}