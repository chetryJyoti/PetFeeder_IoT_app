import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { filter, map, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AutoLoginGuard implements CanLoad {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter((val) => val !== null),
      take(1),
      map((isAuthenticated) => {
        // console.log('Found previous token, automatic login');
        // console.log(isAuthenticated);
        if (isAuthenticated) {
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
          return false; // Return false instead of navigating directly
        } else {
          return true;
        }
      })
    );
  }
}
