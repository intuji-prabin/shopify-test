import { LOCAL_STORAGE_KEYS } from "~/lib/constants/general.constant";
import StorageService from "./storage.service";

interface User {
  id: number;
}

class AuthService {
  private storageService;

  constructor() {
    this.storageService = new StorageService<User | null>();
  }

  public login(user: User) {
    // Store user in storage on login
    this.storageService.set(LOCAL_STORAGE_KEYS.ACCESSTOKEN, user);
  }

  public logout() {
    // Remove user from storage on logout
    this.storageService.clear();
  }

  public isAuthenticated(): boolean {
    // Check if the user is authenticated
    return !!this.storageService.get(LOCAL_STORAGE_KEYS.ACCESSTOKEN);
  }
}

export default AuthService;