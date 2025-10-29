import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private activeRequests = 0;
  private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);
  readonly isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  private lastStartAt = 0;
  private stopTimer: any = null;

  start(): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.lastStartAt = Date.now();
      if (this.stopTimer) {
        clearTimeout(this.stopTimer);
        this.stopTimer = null;
      }
      this.isLoadingSubject.next(true);
    }
  }

  stop(): void {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }
    if (this.activeRequests === 0) {
      const minDurationMs = 2000;
      const elapsed = Date.now() - this.lastStartAt;
      const remaining = Math.max(0, minDurationMs - elapsed);
      if (remaining === 0) {
        this.isLoadingSubject.next(false);
      } else {
        this.stopTimer = setTimeout(() => {
          this.isLoadingSubject.next(false);
          this.stopTimer = null;
        }, remaining);
      }
    }
  }

  reset(): void {
    this.activeRequests = 0;
    this.isLoadingSubject.next(false);
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
  }
}


