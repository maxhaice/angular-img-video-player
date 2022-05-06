import {Injectable} from "@angular/core";
import {TimerHelper} from "./timer.helper";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MediaHelper {

  defaultTiming = {
    animationTime: 300,
    imgChangeTime: 1000,
    sum: function (changeTime: number): number {
      return this.animationTime + changeTime;
    }
  }

  constructor(private timerHelper: TimerHelper) {
  }

  calculateMediaDuration(mediaNote: HTMLElement | null): number | null {
    if(mediaNote?.tagName === 'VIDEO') {
      this.prepareAndStartVideo(mediaNote as HTMLVideoElement);
      return null;
    } else {
      return this.defaultTiming.imgChangeTime
    }
  }



  prepareAndStartVideo(videoElement: HTMLVideoElement, changeStatus?: Subject<null>): void {
    videoElement.onended = () => {
      this.timerHelper.setTime(100);
      if(changeStatus){
        changeStatus.next(null);
      }
    }
    videoElement.play().then();
  }

  changeVideoState(mediaElement: HTMLElement | null): void {
    if(mediaElement) {
      if (mediaElement.tagName === "VIDEO") {
        const videoElement = mediaElement as HTMLVideoElement
        if(!videoElement.paused) {
          videoElement.pause()
        } else {
          videoElement.play().then();
        }
      }
    }
  }

  getAnimateDuration(): number {
    return this.defaultTiming.animationTime
  }
}
