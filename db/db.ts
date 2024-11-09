import fs from "fs";
interface SelfWallet {
  publicKey: string;
  privateKey: string;
}
interface Wallet {
  name: string;
  address: string;
  status: "active" | "paused";
}
interface User {
  id: string;
  username: string;
  email: string;
  status: "active" | "paused";
  wallet: SelfWallet;
  trackWallets: Wallet[];
}
export class JsonDatabase {
  private databasePath: string;
  constructor() {
    this.databasePath = "./db.json";
    if (!fs.existsSync(this.databasePath)) {
      this.stdout({ users: [] });
    }
  }
  private stdin(): { users: User[] } {
    const rawData = fs.readFileSync(this.databasePath, "utf-8");
    return JSON.parse(rawData);
  }
  private stdout(data: { users: User[] }) {
    fs.writeFileSync(this.databasePath, JSON.stringify(data, null, 2), "utf-8");
  }
  public findOne(id: string): User | undefined {
    const db = this.stdin();
    return db.users.find((user) => user.id === id);
  }
  public findAll(): User[] {
    const db = this.stdin();
    return db.users;
  }
  public findAndUpdateOne(id: string, updatedData: Partial<User>): boolean {
    const db = this.stdin();
    const userIndex = db.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return false;
    db.users[userIndex] = { ...db.users[userIndex], ...updatedData };
    this.stdout(db);
    return true;
  }
  public addUser(newUser: User): void {
    const db = this.stdin();
    db.users.push(newUser);
    this.stdout(db);
  }
  public removeUser(id: string): boolean {
    const db = this.stdin();
    const initialLength = db.users.length;
    db.users = db.users.filter((user) => user.id !== id);
    if (db.users.length === initialLength) return false;
    this.stdout(db);
    return true;
  }
  public updateWallet(id: string, newWallet: SelfWallet): boolean {
    const db = this.stdin();
    const userIndex = db.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return false;
    db.users[userIndex].wallet = newWallet;
    this.stdout(db);
    return true;
  }
  public addWallet(id: string, newWallet: Wallet): boolean {
    const db = this.stdin();
    const user = db.users.find((user) => user.id === id);
    if (!user) return false;
    user.trackWallets.push(newWallet);
    this.stdout(db);
    return true;
  }
  public updateTrackWallet(
    id: string,
    walletName: string,
    updatedData: Partial<Wallet>
  ): boolean {
    const db = this.stdin();
    const user = db.users.find((user) => user.id === id);
    if (!user) return false;
    const walletIndex = user.trackWallets.findIndex(
      (wallet) => wallet.name === walletName
    );
    if (walletIndex === -1) return false;
    user.trackWallets[walletIndex] = {
      ...user.trackWallets[walletIndex],
      ...updatedData,
    };
    this.stdout(db);
    return true;
  }
  public removeWallet(id: string, walletAddress: string): boolean {
    const db = this.stdin();
    const user = db.users.find((user) => user.id === id);
    if (!user) return false;
    const initialLength = user.trackWallets.length;
    user.trackWallets = user.trackWallets.filter(
      (wallet) => wallet.address !== walletAddress
    );
    if (user.trackWallets.length === initialLength) return false;
    this.stdout(db);
    return true;
  }
  public async getAllWallets(): Promise<Wallet[]> {
    const db = this.stdin();
    const allWallets = db.users.flatMap((user) => user.trackWallets);
    const uniqueWallets = allWallets.filter(
      (wallet, index, self) =>
        index === self.findIndex((w) => w.address === wallet.address)
    );
    return uniqueWallets;
  }
}
