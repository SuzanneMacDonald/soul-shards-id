import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from './lib/wagmi';
import ExpenseEntryForm from "./components/ExpenseEntryForm";
import ExpenseHistory from "./components/ExpenseHistory";
import ExpenseAnalysis from "./components/ExpenseAnalysis";
import WalletConnect from "./components/WalletConnect";
import Logo from "./components/Logo";
import { Badge } from "@/components/ui/badge";
import { Shield, TrendingUp, BarChart3, Zap } from "lucide-react";
import "./App.css";

const queryClient = new QueryClient();

const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          locale="en"
          modalSize="compact"
          theme={darkTheme({
            accentColor: 'hsl(221.2, 83.2%, 53.3%)',
            accentColorForeground: 'hsl(210, 40%, 98%)',
            borderRadius: 'medium',
          })}
        >
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
              <div className="container mx-auto px-4 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="logo-hover floating-animation">
                    <Logo />
                  </div>
                  <Badge variant="outline" className="hidden md:flex items-center gap-2 pulse-glow">
                    <Shield className="h-3 w-3" />
                    FHE-Powered
                  </Badge>
                </div>
                <WalletConnect />
              </div>
            </header>

            <main className="container mx-auto px-4 py-12 space-y-12">
              {/* Hero Section */}
              <section className="text-center space-y-6 mb-12 fade-in-up">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Badge variant="secondary" className="flex items-center gap-2 shimmer-effect">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Fully Homomorphic Encryption
                  </Badge>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gradient-animated bg-clip-text text-transparent">
                  Soul Shards
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground">
                  Anonymous Expense Analysis Platform
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Record your expenses privately with fully homomorphic encryption.
                  Analyze spending patterns without revealing sensitive financial data.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                  <div className="flex items-center gap-2 text-sm feature-card p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span>Privacy-First</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm feature-card p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <span>Encrypted Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm feature-card p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    <span>Zero-Knowledge Proofs</span>
                  </div>
                </div>
              </section>

              {/* Main Features Grid */}
              <div className="grid gap-8 lg:grid-cols-2">
                <ExpenseEntryForm />
                <ExpenseHistory />
              </div>

              {/* Analysis Section */}
              <section className="space-y-6 fade-in-up">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 floating-animation">Encrypted Data Analytics</h3>
                  <p className="text-muted-foreground">
                    Perform computations on encrypted data without ever decrypting it
                  </p>
                </div>
                <ExpenseAnalysis />
              </section>
            </main>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;

