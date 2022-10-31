import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'lib-ngx-slider-button',
  template: `
    <div id="slider">
      <div id="sliding-button"
           #slider
           class="slider"
           (mousedown)="onTouch($event)"
           (mouseup)="onMouseUp()"
           (mousemove)="onMouseMove($event)"
           (mouseleave)="onTouchLeave()"
           (touchstart)="onTouchStart($event)"
           (touchmove)="onTouchMove($event)"
           (touchend)="onTouchEnd()"
           (touchcancel)="onTouchEnd()"
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
  private readonly DEFAULT_INIT_MOUSE_POSITION = -1;
  private readonly DEFAULT_INIT_SLIDER_POSITION = '-16rem';
  private readonly INIT_CLASS_NAME = 'slide-init';
  private readonly COMPLETE_CLASS_NAME = 'slide-complete';

  private isTouched: boolean = false;
  private isComplete: boolean = false;
  private initPosition: number = this.DEFAULT_INIT_MOUSE_POSITION;
  private positionDifference: number = 0;
  private animationFrameId: number = 0;

  @ViewChild('slider') slider?: ElementRef;

  @Output() onComplete: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {}

  public onTouchStart($event: TouchEvent) {
    if (!this.isComplete) {
      this.isTouched = true;
      this.initPosition = $event.touches[0].clientX;
    }
  }

  public onTouchMove($event: TouchEvent) {
    if (!this.isComplete && this.isTouched) {
      this.positionDifference = $event.touches[0].clientX - this.initPosition;
      this.animationFrameId = requestAnimationFrame(this.moveSlider(this.slider, this.positionDifference));
    }
  }

  public onTouchEnd() {
    this.isTouched = false;
    this.initPosition = this.DEFAULT_INIT_MOUSE_POSITION;

    if (this.positionDifference > this.COMPLETE_POSITION_DIFFERENCE_THRESHOLD) {
      this.isComplete = true;
      this.onComplete.emit(true);
      this.moveSliderToComplete();
    } else {
      this.resetSliderPosition();
    }

    cancelAnimationFrame(this.animationFrameId);
  }

  public onTouch($event: MouseEvent) {
    if (!this.isComplete) {
      this.isTouched = true;
      this.initPosition = $event.clientX;
    }
  }

  public onMouseUp() {
    this.isTouched = false;
    this.initPosition = this.DEFAULT_INIT_MOUSE_POSITION;

    if (this.positionDifference > this.COMPLETE_POSITION_DIFFERENCE_THRESHOLD) {
      this.isComplete = true;
      this.onComplete.emit(true);
      this.moveSliderToComplete();
    } else {
      this.resetSliderPosition();
    }

    cancelAnimationFrame(this.animationFrameId);
  }

  public onMouseMove($event: MouseEvent) {
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
    return () => {
      if (slider) {
        slider
          .nativeElement
          .style
          .transform = `translateX(calc(${this.DEFAULT_INIT_SLIDER_POSITION} + ${positionDifference}px))`;
      }
    }
  }

  private resetSliderPosition() {
    if (this.slider) {
      this.slider.nativeElement.classList.add(this.INIT_CLASS_NAME);
      setTimeout(() => {
        if (this.slider) {
          this.slider.nativeElement.style = "";
          this.slider.nativeElement.classList.remove(this.INIT_CLASS_NAME);
          this.slider.nativeElement.classList.remove(this.COMPLETE_CLASS_NAME);
        }
      }, this.DEFAULT_TIMEOUT);
    }
  }

  private moveSliderToComplete() {
    if (this.slider) {
      this.slider.nativeElement.classList.remove(this.INIT_CLASS_NAME);
      this.slider.nativeElement.classList.add(this.COMPLETE_CLASS_NAME);
      setTimeout(() => {
        if (this.slider) {
          this.slider.nativeElement.style.transform = "translateX(0rem)";
        }
      }, this.DEFAULT_TIMEOUT);
    }
  }
}
