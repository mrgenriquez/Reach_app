import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReachService } from '../reach.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-validate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validate.component.html',
  styleUrl: './validate.component.scss'
})
export class ValidateComponent {
  public clientId:any;
  public user:any;
  public model:boolean=false;
  public modelLoading:boolean=false;
  public modelDescription:boolean=false;
  public industrie:any;
  public message:any
  constructor(public reachService:ReachService,private route: ActivatedRoute,private http: HttpClient, private sanitizer: DomSanitizer,private router: Router){
    this.clientId = this.route.snapshot.paramMap.get('token');
    console.log(this.clientId);
    this.reachService.validate(this.clientId).subscribe({
      next: response => {
        console.log(response)
        this.user = response;
        this.openPdf();
      },
      error: error => {
        this.modelLoading = false;
        this.modelDescription= true;
        this.model = true;
        this.message = "Tienes que finalizar el formulario antes de poder ver tu nivel de madurez digital.";
        console.log(error)
      }
    });
  }
  close(){
    this.model = false;
    this.modelDescription=false;
    this.modelLoading=false;
    this.router.navigate(['/']);
  }
  openPdf() {
    this.reachService.downloadPdf();
  }
}
