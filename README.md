# Sui Transaction Builder

```
npm run dev
```

TODO List:
- Understand/handle "type arguments"
- Handle vectors / options?
  - This is difficult because they can be infinitely nested, so we would need variable nodes to represent them maybe
- Display outputs correctly if possible (can do this after we finish the executing transactions functionality?)
- Template nodes
- Executing transactions
- Readable transaction summary
- Clean up code / documentation


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
