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
          <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
              <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Logo />
                <WalletConnect />
              </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
              <section className="text-center space-y-2 mb-8">
                <h2 className="text-4xl font-bold">Anonymous Expense Analysis</h2>
                <p className="text-muted-foreground">
                  Record your expenses privately with encrypted data. Analyze spending patterns without revealing amounts.
                </p>
              </section>

              <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                <ExpenseEntryForm />
                <ExpenseHistory />
              </div>

              <ExpenseAnalysis />
            </main>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;

