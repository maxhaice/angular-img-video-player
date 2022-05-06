import {Injectable} from "@angular/core";
import {MediaHelper} from "./media.helper";

@Injectable({
  providedIn: 'root'
})
export class AnimationHelper {

  constructor(private mediaHelper: MediaHelper) {
  }

  animatePlaylistsList(list: HTMLDivElement, isOpened: boolean) {
    let start, finish;
    start = -400;
    finish = 0;
    if(isOpened){
      start = 0;
      finish = -400;
    }
    list.animate([
      { left: `${start}px` },
      { left: `${finish}px` }
    ], {
      duration: 200,
      fill: 'forwards'
    })
  }

  oneTickPlayerAnimation(
    player: HTMLDivElement | undefined,
    next: boolean,
    selectedItem: number) {
    let firstValue, secondValue;
    firstValue = secondValue = 0;
    if(next) {
      firstValue = (selectedItem - 1) * -100;
      secondValue = selectedItem * -100;
    } else {
      firstValue = (selectedItem + 1) * -100;
      secondValue = selectedItem * -100;
    }
    if(player) {
      player.animate([
        { transform: 'translateX(' + firstValue + 'vw)' },
        { transform: 'translateX(' + secondValue + 'vw)'}
      ], {
        duration: this.mediaHelper.getAnimateDuration(),
        fill: 'forwards'
      })
    }
  }

}
