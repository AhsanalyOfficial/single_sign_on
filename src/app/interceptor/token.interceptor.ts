import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJnbml3TVRtVEpmemtZSVBhc0FOa2siLCJ1c2VyX2lkIjoiMSIsInVuaXF1ZV9uYW1lIjoiSmFjb2IiLCJlbWFpbCI6ImFkbWluQHNlZWZhci5vcmciLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9sb2NhbGl0eSI6ImVuLVVTIiwibmJmIjoxNzMwOTYxNzkzLCJleHAiOjE3MzEyMjA5OTMsImlhdCI6MTczMDk2MTc5MywiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzMDgiLCJhdWQiOiJodHRwczovL2FwaS5jY3R2Z3VhcmQuYWkvb2F1dGgvY2FsbGJhY2ssaHR0cDovL2xvY2FsaG9zdDo0MjAwL2xvZ2luIn0.Pr7BYvNV9GXgD4vS2VXH2DzodHHRyuaeBJvRnBdDRPA';

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(authReq);
  }
}
