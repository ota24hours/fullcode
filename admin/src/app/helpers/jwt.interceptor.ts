import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';


// import { AuthenticationService } from '../service/auth.service';
// import { CommonService } from '../service/common.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor( public router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
      /**
       * Attaching neccessory headers to the Httprequest
       * 
       */ 
      // req = req.clone(
      //   {setHeaders: {
      //       'Authorization': `Bearer ${localStorage.getItem('token')!}`,
      //       'Content-Type': "application/json",
      //     }}
      // )

      
      if( localStorage.getItem('authToken')){    
        req = req.clone({
          // headers:new HttpHeaders({'Authorization':`Bearer ${localStorage.getItem('token')!}`})
          headers:new HttpHeaders({'Authorization':`${localStorage.getItem('authToken')!}`})
        })
    }
        return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            const token = event.headers.get('Authorization')
            // if (token && token.length) {
            //   this.authService.updateToken(token)
            // }
          }
        }, 
        (err: any) => {
          if (err instanceof HttpErrorResponse) { 
            console.log('inteceptor', err.status)
            if (err.status === 401 ) {

              this.router.navigate(['/login'])
            }
            else if (err.status === 403 ) {

              this.router.navigate(['/login'])
            }
          }
        }))
      }

}