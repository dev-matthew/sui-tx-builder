# Sui Transaction Builder

```
npm run dev
```

TODO List:
- When we look up a transaction block, it then looks up each package's metadata in an API request, which causes us to get rate limited. Find a way to fix this.
- Also understand "type arguments"
- Update move call argument types to handle every case (different from type arguments)
- Display outputs correctly if possible (can do this after we finish the executing transactions functionality?)
- See if we need to do anything with makeMoveVec
  - also if we need to do anything with publish, update transactions (these are used for creating move packages)
- Variable nodes?
- Propagating variables to other nodes
- Template nodes
- Executing transactions (connecting wallet, etc)
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
