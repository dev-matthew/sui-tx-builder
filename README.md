# Sui Transaction Builder

```
# First create the env file according to .env.example
npm install
npm run dev
```

TODO List:
- What are "type arguments"?
- What is the difference between tx.makeMoveVec and tx.pure.vector? Is it that the first one is used for vectors of objects and different types?
- Finish executing transactions (all that's left is getting the arguments)
- How do we view the outputs (and/or get the values of Results/Nested Results) of individual transactions within the transaction block, after executing the entire block?
- What should our readable transaction summary look like?
- What templates do we want to have? NFT mint, etc
- Clean up code and make documentation

Resources: 
- https://sdk.mystenlabs.com/typescript/transaction-building/basics
  - This shows the SDK that we will use for constructing transaction blocks. We essentially are wrapping this with a no code UI
- https://kit.suiet.app/docs/QuickStart
  - Wallet stuff for later
- https://ui.shadcn.com/docs/components
  - UI components
- https://lucide.dev/icons/
  - Icons
- Random example transactions:
  - https://suiscan.xyz/mainnet/tx/HyEAqXfUJ6937oC8yYSGh9P7koc7m4YTfTTEKEQDEiq5
  - https://suiscan.xyz/mainnet/tx/F3h1E83jvvGV5FNFoQLWMzGYvxq2by8viqR6sdc3hdim
  - https://suiscan.xyz/mainnet/tx/5yxDjA6L5EjNEXZ9kVcK728wPjbeu88BrP646g7N8fFf
- Blockberry API:
  - https://api.blockberry.one/
  - https://docs.blockberry.one/reference/getpackagebyid
- Original RFP:
  - https://docs.google.com/document/d/1pgh_9JEgMGHaZAGrqV61AzhFRS-n8NXLTWETemnolVQ/edit?tab=t.0
