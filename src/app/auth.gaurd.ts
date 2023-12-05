import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from "@angular/router";
  
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Promise<boolean> {
        var isAuthenticated = localStorage.getItem("isLoggedIn");
        if (isAuthenticated) {
            return true;
        }
        this.router.navigate(['']);
        return false;
    }
}