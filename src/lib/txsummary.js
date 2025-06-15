
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
            let description = `Call ${moduleName}:: ${functionName}`;

            if (data.package?.name) {
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
    }
    if (sequence.length > 2) {
        details.complexity = 'Medium';
    }
    return details;
}