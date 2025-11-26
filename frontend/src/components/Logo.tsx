const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center shadow-lg">
        <span className="text-primary-foreground font-bold text-xl">S</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Soul Shards
        </h1>
        <p className="text-xs text-muted-foreground">Encrypted Private Expense Log</p>
      </div>
    </div>
  );
};

export default Logo;

