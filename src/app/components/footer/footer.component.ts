import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, AfterViewInit {
  currentDate: Date = new Date();
  footerHeight: number;

  @ViewChild('footer') footer: ElementRef;

  @Output() propagarHeight = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.footerHeight = this.footer.nativeElement.offsetHeight;
    this.propagarHeight.emit(this.footerHeight);
  }
}
