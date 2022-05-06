import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges, ViewChild
} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {concatMap, forkJoin, map, Observable, of, Subject, take, timer} from "rxjs";
import {ApiCallPlayListInterface, PlayList} from "./models/play-list-info.interface";
import {TimerHelper} from "./helpers/timer.helper";
import {MediaHelper} from "./helpers/media.helper";
import {AnimationHelper} from "./helpers/animation.helper";

export interface PlayListApiRoutes {
  apiRoute: Observable<any>[],
  playList: PlayList,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'slideshow';

  playlists: PlayList[] = [];

  currentApiKey: string = '';

  currentPlayList: PlayList | undefined;

  mediaItemsHttpResponse$: Subject<HttpResponse<any>[]>;

  mediaItemsHttpResponse: HttpResponse<any>[] = [];

  isStarted = false;

  selectedItem = 0;

  isPlayListsOpen = false;

  @ViewChild('player')
  player?: ElementRef<HTMLDivElement>

  constructor(private http: HttpClient,
              private cdr: ChangeDetectorRef,
              private timerHelper: TimerHelper,
              private mediaHelper: MediaHelper,
              private animationHelper: AnimationHelper,
  ) {
    this.mediaItemsHttpResponse$ = new Subject<HttpResponse<any>[]>();
    this.mediaItemsHttpResponse$.subscribe((values) => {
      this.mediaItemsHttpResponse = values;
    })
  }

  ngOnInit(){
    this.timerHelper.timerStatusChange.subscribe((active: boolean) => {
      if(this.timerHelper.timer) {
          this.timerHelper.timer.pipe(take(1)).subscribe(() => {
            if(active && (this.selectedItem + 1 < this.mediaItemsHttpResponse.length)) {
              this.activateAnimation();
            }
          })
      }
    })
  }
//0f127773-529f-4ff8-b211-af9e5c22a5bc
  useDefaultKey(apiKeyInput?: HTMLInputElement): void {
    if (apiKeyInput) {
      apiKeyInput.value = '0f127773-529f-4ff8-b211-af9e5c22a5bc';
    }
  }
  inputApiKey(apiKeyInput?: HTMLInputElement){
    if(apiKeyInput){
      this.currentApiKey = apiKeyInput.value;
    }

    this.http.get<ApiCallPlayListInterface>(`/api/screen/playlistItems/${this.currentApiKey}`)
      .pipe(
        map((value) => {
          this.playlists = value.playlists;
          return value.playlists[0];
        })
      )
      .subscribe((value) => {
          this.getDataFromPlayList(value).subscribe((mediaResponses) => {
            this.mediaItemsHttpResponse$.next(mediaResponses);
          });
        },
      )

  }

  getDataFromPlayList(playList: PlayList): Observable<any>{
    return of(playList.playlistItems)
      .pipe(
        concatMap((items) => {
          const observables: Observable<any>[] = [];
          items.forEach((item) => {
            observables.push(this.http.get(`/api/creative/get/${item.creativeKey}`, {observe: 'response', responseType: 'blob'}))
          })
          return forkJoin(observables.map(observable => observable))
        })
      );
  }

  choosePlayList(playListKey: string){
    this.currentPlayList = this.playlists.find((playList) => playListKey == playList.playlistKey);

    this.getDataFromPlayList(this.currentPlayList!).subscribe((mediaResponses) => {
      this.mediaItemsHttpResponse$.next(mediaResponses);
    });
  }

  trackByFn(index: number, item: PlayList){
    return item.playlistKey;
  }

  mainControlClick(): void {
    this.isStarted = !this.isStarted;
    const mediaNote = document.getElementById(`media${this.selectedItem}`);
    this.mediaHelper.changeVideoState(mediaNote);
    if(this.isStarted) {
      this.timerHelper.setTime(this.mediaHelper.calculateMediaDuration(mediaNote));
    } else {
      this.timerHelper.setTime(null);
    }
  }
  oneTickAnimationPalyer(next: boolean) {
    this.animationHelper.oneTickPlayerAnimation(
      this.player?.nativeElement,
      next,
      this.selectedItem
    );
  }

  activateAnimation() {
    this.selectedItem++;
    this.oneTickAnimationPalyer(true);
    const mediaNote = document.getElementById(`media${this.selectedItem}`);
    if (this.selectedItem + 1 < this.mediaItemsHttpResponse.length) {
      this.timerHelper.setTime(this.mediaHelper.calculateMediaDuration(mediaNote));
    } else {
      if(mediaNote?.tagName === "VIDEO") {
        let lastVideoEnded = new Subject<null>();
        this.mediaHelper.prepareAndStartVideo(mediaNote as HTMLVideoElement, lastVideoEnded);
        lastVideoEnded.subscribe(() => {this.isStarted = false});
      }
    }
  }

  nextClick(): void {
    if (this.selectedItem + 1 < this.mediaItemsHttpResponse.length) {
      const mediaNote = document.getElementById(`media${this.selectedItem}`);
      this.mediaHelper.changeVideoState(mediaNote);
      this.selectedItem++;
      this.timerHelper.setTime(null);
      this.isStarted = false;
      this.oneTickAnimationPalyer(true);
    }
  }

  previousClick(): void{
    if (this.selectedItem > 0) {
      const mediaNote = document.getElementById(`media${this.selectedItem}`);
      this.mediaHelper.changeVideoState(mediaNote);
      this.selectedItem--;
      this.timerHelper.setTime(null);
      this.isStarted = false;
      this.oneTickAnimationPalyer(false);
    }
  }

  changePlaylistsState(list: HTMLDivElement) {
    this.animationHelper.animatePlaylistsList(list, this.isPlayListsOpen);
    this.isPlayListsOpen = !this.isPlayListsOpen;
  }
}
