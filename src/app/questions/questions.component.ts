import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ReachService } from '../reach.service';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ThemePalette} from '@angular/material/core';
import {FormsModule} from '@angular/forms';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {MatButtonModule} from '@angular/material/button';
import { MediaMatcher } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { Injectable } from '@angular/core';
declare var gtag: Function;
interface Answer {
  name: string;
  options?: AnswerOption[];
}

interface AnswerOption {
  name: string;
  points: number;
  completed: boolean;
  color: ThemePalette;
}
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule,MatTooltipModule,MatIconModule, RouterOutlet,MatRadioModule,MatCheckboxModule,FormsModule,SlickCarouselModule,MatButtonModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss'
})
export class QuestionsComponent implements OnInit{
  title = 'reach_app';
  public questions:any;
  public form!: FormGroup;
  public currentSlideIndex = 0;
  public currentQuestion: any;
  public formcontact:boolean=false;
  public isDesktop:any;
  public total:any;
  public result:boolean=false;
  public model:boolean=false;
  public currentQuestionIndex:number = 0;
  public modelLoading:boolean=false;
  public modelDescription:boolean=false;
  public industrie:any;
  public message:any
  public industries:any=['Tecnología', 'Manufactura', 'Salud', 'Educativa', "Retail", 'Servicios', "Turismo", 'Otra'];
  public answers:any={
    q1:{
      a1:{value:0},
      a2:{value:0,o1:{value:0},checked:false},
      a3:{value:0,o1:{value:0},checked:false},
      a4:{value:0},
      a5:{value:0},
      a6:{value:0}
    },
    q2:{
      a1:{value:0},
      a2:{value:0},
      a3:{value:0},
      a4:{value:0}
    },
    q3:{
      a1:{value:0},
      a2:{value:0},
      a3:{value:0},
      a4:{value:0},
      a5:{value:0},
      a6:{value:0}
    },
    q4:{
      a1:{value:0}
    }
  };
  constructor(public reachService:ReachService,
    private mediaMatcher: MediaMatcher,
    private fb: FormBuilder) { 
    this.questions = reachService.questions();
    console.log(this.questions);
  }
  ngOnInit() {
    const mediaQuery = this.mediaMatcher.matchMedia('(min-width: 900px)');
    this.isDesktop = mediaQuery.matches;
    mediaQuery.addEventListener('change', () => {
      this.isDesktop = mediaQuery.matches;
    });
    if(gtag){
      gtag('event', 'steps', {
        'step': this.currentQuestionIndex
      });
    }
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      company: ['', [Validators.required]],
      industrie:['', [Validators.required]]
    });
  }
  close(){
    this.model = false;
    this.modelDescription=false;
    this.modelLoading=false;
    this.formcontact = true;
  }
  refreshPage() {
    location.reload();
  }
  dataMaterial(question:any,answer:any,option:any,event:any,value:any,type:any){
    if(!option){
      if(event.checked==undefined){
        this.answers[question][answer].value = value;
      }else{
        this.answers[question][answer].value = event.checked?value:0;
      }
    }else{
      this.answers[question][answer][option].value = value?value:0;
    }
    this.total = this.reachService.sumValuesByMainQuestion(this.answers);
    console.log(this.total,this.calcularNivel(this.total));
  }

  

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      if(gtag){
        gtag('event', 'steps', {
          'step': this.currentQuestionIndex
        });
      }
    }
  }
  sendForm(value:any){
    const data= {
      name:this.form.value.name,
      phone:this.form.value.phone,
      email:this.form.value.email,
      company:this.form.value.company +" / "+this.form.value.industrie,
      ranking:this.calcularNivel(this.total),
    }
    this.modelLoading = true;
    this.model = true;
    this.reachService.register(data).subscribe({
      next: response => {
        let data:any = response;
        if(data && data.message){
          this.modelLoading = false;
          this.message = data.message;
          this.modelDescription= true;
          this.model = true;
          if(gtag){
            gtag('event', 'form', {
              'complete': true
            });
          }
        }else{
          this.close();
          if(gtag){
            gtag('event', 'form', {
              'complete': true
            });
          }
        }
      },
      error: error => {
        this.modelLoading = false;
        this.modelDescription= true;
        this.model = true;
        this.message = "A ocurrido un error, intentalo nuevamente más tarde.";
        if(gtag){
          gtag('event', 'form', {
            'complete': false
          });
        }
      }
    });
  }
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      if(gtag){
        gtag('event', 'steps', {
          'step': this.currentQuestionIndex
        });
      }
    }
  }

  finish() {
    console.log('Formulario finalizado');
    ;
  }
  calcularNivel(datos:any) {
    const maximos = { q1: 4, q2: 2, q3: 2, q4: 1 };
    const porcentajes = { q1: 0.55, q2: 0.15, q3: 0.15, q4: 0.15 };

    const sumaPonderada =
      (datos.q1 / maximos.q1) * porcentajes.q1 +
      (datos.q2 / maximos.q2) * porcentajes.q2 +
      (datos.q3 / maximos.q3) * porcentajes.q3 +
      (datos.q4 / maximos.q4) * porcentajes.q4;

    let nivel = Math.min(5, Math.max(1, Math.round(sumaPonderada * 5)));

    return nivel;
  }
}
