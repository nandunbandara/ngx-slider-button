import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'lib-ngx-slider-button',
  template: `
    <div id="slider">
      <div id="sliding-button"
           #slider
           class="slider"
           (mousedown)="onTouch($event)"
           (mouseup)="onTouchEnd()"
           (mousemove)="onTouchMove($event)"
           (mouseleave)="onTouchLeave()"
      >
        >
      </div>
    </div>

  `,
  styles: [
  ]
})
export class NgxSliderButtonComponent implements OnInit {

  private readonly COMPLETE_POSITION_DIFFERENCE_THRESHOLD = 120;
  private readonly DEFAULT_TIMEOUT = 500;

  private isTouched: boolean = false;
  private isComplete: boolean = false;
  private initPosition: number = -1;
  private positionDifference: number = 0;
  private animationFrameId: number = 0;

  @ViewChild('slider') slider?: ElementRef;

  @Output() onComplete: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {}

  public onTouch($event: MouseEvent) {
    if (!this.isComplete) {
      this.isTouched = true;
      this.initPosition = $event.clientX;
    }
  }

  public onTouchEnd() {
    this.isTouched = false;
    this.initPosition = -1;

    if (this.positionDifference > this.COMPLETE_POSITION_DIFFERENCE_THRESHOLD) {
      this.isComplete = true;
      this.onComplete.emit(true);
      this.moveSliderToComplete();
    } else {
      this.resetSliderPosition();
    }

    cancelAnimationFrame(this.animationFrameId);
  }

  public onTouchMove($event: MouseEvent) {
    if (!this.isComplete && this.isTouched) {
      this.positionDifference = $event.clientX - this.initPosition;
      this.animationFrameId = requestAnimationFrame(this.moveSlider(this.slider, this.positionDifference));
    }
  }

  public onTouchLeave() {
    if (!this.isComplete) {
      this.isTouched = false;
      this.resetSliderPosition();
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private moveSlider(slider?: ElementRef, positionDifference: number = 0) {
    return function() {
      if (slider) {
        slider
          .nativeElement
          .style
          .transform = `translateX(calc(-16rem + ${positionDifference}px))`;
      }
    }
  }

  private resetSliderPosition() {
    if (this.slider) {
      this.slider.nativeElement.classList.add("slide-init");
      setTimeout(() => {
        if (this.slider) {
          this.slider.nativeElement.style = "";
          this.slider.nativeElement.classList.remove("slide-init");
          this.slider.nativeElement.classList.remove("slide-complete");
        }
      }, this.DEFAULT_TIMEOUT);
    }
  }

  private moveSliderToComplete() {
    if (this.slider) {
      this.slider.nativeElement.classList.remove("slide-init");
      this.slider.nativeElement.classList.add("slide-complete");
      setTimeout(() => {
        if (this.slider) {
          this.slider.nativeElement.style.transform = "translateX(0rem)";
        }
      }, this.DEFAULT_TIMEOUT);
    }
  }

}
