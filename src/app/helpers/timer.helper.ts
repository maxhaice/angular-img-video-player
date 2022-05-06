import {Injectable} from "@angular/core";
import {Observable, Subject, timer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TimerHelper {
  timer?: Observable<0>

  timerStatusChange: Subject<boolean> = new Subject<boolean>();

  setTime(time: number | null) {
    if(time) {
      this.timer = timer(time);
      this.timerStatusChange.next(true);
    }
    else {
      this.timer = undefined;
      this.timerStatusChange.next(false);
    }
  }
}
