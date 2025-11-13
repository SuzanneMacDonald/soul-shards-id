import { WalletConnect } from "@/components/WalletConnect";
import { CardCarousel } from "@/components/CardCarousel";
import { MintSection } from "@/components/MintSection";
import { Shield } from "lucide-react";
import heroImage from "@/assets/hero-identity.jpg";
import logo from "@/assets/logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SoulChain Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SoulChain Identity
            </h1>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        
        {/* Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-slide-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Decentralized Identity Protocol</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Own Your Identity,
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow-pulse">
                Reveal Selectively
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mint identity NFTs with encrypted attributes verified on-chain. 
              Control what you share, protect what matters.
            </p>

            <div className="flex flex-wrap gap-6 justify-center pt-4">
              {[
                { label: "On-Chain Verification", value: "100%" },
                { label: "Zero-Knowledge Proofs", value: "Enabled" },
                { label: "Selective Disclosure", value: "Active" },
              ].map((stat, i) => (
                <div 
                  key={i}
                  className="px-6 py-3 rounded-lg bg-card/50 border border-primary/20 backdrop-blur-sm"
                >
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-3">
              Holographic Identity Cards
            </h3>
            <p className="text-muted-foreground">
              Your credentials, encrypted and verifiable on-chain
            </p>
          </div>
          <CardCarousel />
        </div>
      </section>

      {/* Mint Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-3">
              Create Your Identity NFT
            </h3>
            <p className="text-muted-foreground">
              Define attributes and choose encryption settings
            </p>
          </div>
          <MintSection />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Encrypted Attributes",
                description: "Your sensitive data is encrypted on-chain with zero-knowledge proofs",
                icon: "🔐",
              },
              {
                title: "Selective Disclosure",
                description: "Choose exactly what to reveal and to whom, maintaining full control",
                icon: "👁️",
              },
              {
                title: "On-Chain Verification",
                description: "All credentials are verifiable on the blockchain without exposing raw data",
                icon: "✅",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-[0_0_30px_hsl(var(--cyber-cyan)/0.2)] group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
