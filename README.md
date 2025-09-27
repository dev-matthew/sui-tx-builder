# Sui Transaction Builder

A visual, node-based transaction builder for the Sui blockchain. This application allows developers and users to construct complex Sui transactions through an intuitive drag-and-drop interface, inspect existing transactions, and create reusable templates.

## 🚀 Features

- **Visual Transaction Building**: Drag-and-drop interface for creating Sui transactions
- **Transaction Inspection**: Analyze existing transactions by digest
- **Template System**: Save and reuse transaction patterns
- **Wallet Integration**: Connect with Sui wallets via Suiet
- **Real-time Execution**: Execute transactions directly from the builder
- **Transaction Summaries**: Generate human-readable transaction summaries (with optional LLM enhancement)
- **Multiple Node Types**: Support for various Sui operations (MoveCall, SplitCoins, TransferObjects, etc.)

## 🛠️ Tech Stack

- **Framework**: Next.js 15.1.2 (React 19)
- **Blockchain**: Sui (@mysten/sui, @mysten/dapp-kit)
- **Visual Editor**: React Flow (@xyflow/react)
- **Wallet**: Suiet Wallet Kit (@suiet/wallet-kit)
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: React hooks + TanStack Query

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- A Sui wallet (for transaction execution)

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sui-tx-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Blockberry API (for transaction inspection)
   BLOCKBERRY_KEY=your_blockberry_api_key
   BLOCKBERRY_DELAY=2000

   # Optional: Gemini API (for LLM-enhanced transaction summaries)
   NEXT_PUBLIC_GEMINI_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
sui-tx-builder/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── metadata/      # Transaction metadata endpoint
│   │   │   └── search/        # Transaction search endpoint
│   │   ├── globals.css        # Global styles
│   │   ├── layout.js          # Root layout component
│   │   └── page.js           # Main page component
│   ├── components/            # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── nodes/            # Transaction node components
│   │   │   ├── EmptyNode.js
│   │   │   ├── MergeCoins.js
│   │   │   ├── MoveCall.js
│   │   │   ├── SplitCoins.js
│   │   │   ├── TransferObjects.js
│   │   │   └── MakeMoveVec.js
│   │   ├── templates/        # Transaction templates
│   │   │   ├── NFTMint.json
│   │   │   └── SendTokens.json
│   │   ├── ui/              # UI components (shadcn/ui)
│   │   ├── app-sidebar.js   # Main sidebar component
│   │   ├── blocks.js        # Node type definitions
│   │   ├── main.js          # Main application component
│   │   ├── templates.js     # Template management
│   │   ├── variables.js     # Variable management
│   │   └── TransactionSummary.js # Transaction summary component
│   ├── hooks/               # Additional custom hooks
│   │   └── use-mobile.jsx
│   └── lib/                 # Utility functions
│       ├── txsummary.js     # Transaction summary generation
│       └── utils.js         # General utilities
├── public/                  # Static assets
├── tailwind.config.mjs      # Tailwind CSS configuration
├── components.json          # shadcn/ui configuration
└── package.json            # Project dependencies
```

I've created a comprehensive README that includes:

1. **Clear project overview** - What the application does and its key features
2. **Complete setup instructions** - Step-by-step installation and configuration
3. **Detailed project structure** - File organization and component hierarchy  
4. **Architecture explanation** - Core components and their responsibilities
5. **API documentation** - Available endpoints and their usage
6. **Extension guides** - How to add custom nodes and templates
7. **Development workflow** - Scripts, dependencies, and contribution guidelines
8. **Resource links** - Relevant documentation and APIs

The README provides developers with everything they need to understand, run, and extend the Sui Transaction Builder application.

## 🎯 Core Components

### Main Application (`src/components/main.js`)
The central component that orchestrates the entire application:
- Manages the React Flow canvas
- Handles node and edge state
- Executes transactions
- Integrates wallet functionality

### Node Types (`src/components/nodes/`)
Individual components for different Sui operations:
- **MoveCall**: Execute Move functions
- **SplitCoins**: Split coin objects
- **MergeCoins**: Merge coin objects  
- **TransferObjects**: Transfer objects to addresses
- **MakeMoveVec**: Create Move vectors

### Sidebar (`src/components/app-sidebar.js`)
Provides:
- Transaction inspection by digest
- Node palette for building transactions
- Template management
- Wallet connection

### Transaction Summary (`src/components/TransactionSummary.js`)
Generates human-readable summaries of constructed transactions with optional LLM enhancement.

## 🔌 API Endpoints

### `/api/search`
- **Purpose**: Search for transactions by digest
- **Method**: POST
- **Body**: `{ "digest": "transaction_digest_here" }`
- **Returns**: Transaction details from Blockberry API

### `/api/metadata`
- **Purpose**: Get package metadata
- **Method**: POST  
- **Body**: `{ "packageId": "package_id_here" }`
- **Returns**: Package information and Move functions

## 🧩 Building Custom Nodes

To add new node types:

1. **Create the node component** in `src/components/nodes/`:
   ```javascript
   // Example: CustomNode.js
   import { Handle, Position } from '@xyflow/react';
   
   export default function CustomNode({ data }) {
     return (
       <div className="custom-node">
         <Handle type="target" position={Position.Top} />
         {/* Your node UI here */}
         <Handle type="source" position={Position.Bottom} />
       </div>
     );
   }
   ```

2. **Register the node** in `src/components/blocks.js`:
   ```javascript
   import CustomNode from './nodes/CustomNode';
   
   export const blocks = [
     // ... existing blocks
     {
       id: 'custom',
       name: 'Custom Operation',
       node: CustomNode,
       // ... other properties
     }
   ];
   ```

## 📝 Creating Templates

Templates are JSON files stored in `src/components/templates/` that define reusable transaction patterns. They follow the Sui transaction structure:

```json
{
  "result": {
    "transaction": {
      "data": {
        "transaction": {
          "inputs": [...],
          "transactions": [...]
        }
      }
    }
  }
}
```

## 🚀 Building & Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Dependencies
- **Sui SDK**: `@mysten/sui` - Core Sui blockchain functionality
- **Wallet Integration**: `@suiet/wallet-kit` - Sui wallet connectivity
- **Visual Editor**: `@xyflow/react` - Node-based visual editor
- **UI Framework**: Radix UI components with Tailwind CSS styling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📚 Resources

- [Sui TypeScript SDK](https://sdk.mystenlabs.com/typescript/transaction-building/basics)
- [Blockberry API Documentation](https://docs.blockberry.one/reference/getpackagebyid)
- [React Flow Documentation](https://reactflow.dev/)
- [Suiet Wallet Kit](https://kit.suiet.app/)

## 📄 License

This project is open source. Please check the license file for details.

## 🐛 Issues & Support

For issues, feature requests, or questions, please use the GitHub issue tracker.
