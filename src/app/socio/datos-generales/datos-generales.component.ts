import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CriptoService } from 'src/app/services/cripto.service';

@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss'],
})
export class DatosGeneralesComponent implements OnInit {
  public userTypeId: number = 5;

  constructor(private router: Router, private cripto: CriptoService) {}

  ngOnInit(): void {
    // Descriptación del userTypeId tomado del localStorage
    this.userTypeId = +this.cripto.decrypt(localStorage.getItem('userTypeId'));
  }

  onChange(e) {
    const tab = e.index;
    if (tab === 4) {
      this.router.navigate(['/proyectos']);
    }
  }
}
