import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ReachService {
  public base:any="http://localhost:3500/api";
  private ranges:any = {
    beginners: { min: 0, max: 3 },
    novices: { min: 4, max: 7 },
    experts: { min: 8, max: Infinity } 
  };
  constructor(private http: HttpClient,private cookieService: CookieService) { 
  };

  questions (){
    return [{
        abb:"q0"
      },{
      question:"¿Tienes página web y redes sociales?",
      abb:"q1",
      type:"checkbox",
      weights: {
        beginners: 0,
        novices: 4,
        experts: 6
      },
      images:{
        principal:"q1-bg.jpg",
        secondary:[
          {
            image:"q1-bg-01.png",
            alt:"Instagram"
          },{
            image:"q1-bg-02.png",
            alt:"Facebook"
          },{
            image:"q1-bg-03.png",
            alt:"Whatsapp"
          },{
            image:"q1-bg-04.png",
            alt:"Telegram"
          },{
            image:"q1-bg-05.png",
            alt:"Messenger"
          }
        ]
      },
      answers:[
        {name: "Página web",abb:"a1",value:1},
        {name: "WhatsApp",abb:"a2",value:1,checked: false,
          options:[
            {name:"Directo en el teléfono",abb:"o1",value:1},
            {name:"Herramienta de terceros",abb:"o1",value:2,icon:"info",description:"Sistema que coordina la comunicación y experiencia del usuario en diferentes canales, como tiendas físicas, sitios web y redes sociales, garantizando una interacción consistente y sin interrupciones."}
          ]
        },
        {
          name: "Fanpage de Facebook",abb:"a3",value:1,checked: false,
          options:[
            {name:"Verificada",abb:"o1",value:2},
            {name:"No Verificada",abb:"o1",value:1}
          ]
        },
        {name: "Instagram",abb:"a4",value:1},
        {name: "Catálogos en línea",abb:"a5",value:1},
        {name: "Tienda en línea",abb:"a6",value:1}
      ]      
    },{
      question:"¿Para qué utilizas la página web y redes sociales?",
      abb:"q2",
      type:"checkbox",
      weights: {
        beginners: 0,
        novices: 1,
        experts: 2
      },
      images:{
        principal:"q2-bg.jpg",
        secondary:[
          {
            image:"q2-bg-01.png",
            alt:"Mensajes"
          },{
            image:"q2-bg-02.png",
            alt:"Carretilla"
          },{
            image:"q2-bg-03.png",
            alt:"Personas"
          }
        ]
      },
      answers:[
        {name: "Ventas",value:1,abb:"a1"},
        {name: "Servicio al cliente",value:1,abb:"a2"},
        {name: "Promover productos o servicios",value:1,abb:"a3"},
        //{name: "Plataforma omnicanal",value:1,abb:"a3"},
        {name: "Ninguna",value:0,abb:"a4"}
      ]      
    },{
      question: "¿Ya cobras tus ventas en línea? ¿Cómo?",
      abb:"q3",
      type:"checkbox",
      weights: {
        beginners: 0,
        novices: 1,
        experts: 2
      },
      images:{
        principal:"q3-bg.jpg",
        secondary:[
          {
            image:"q3-bg-01.png",
            alt:"Link"
          },{
            image:"q3-bg-02.png",
            alt:"Tarjeta"
          },{
            image:"q3-bg-03.png",
            alt:"Ecommerce"
          },{
            image:"q3-bg-04.png",
            alt:"Transferencia"
          }
        ]
      },
      answers: [
        { name: "Contra entrega (efectivo)" ,value:1,abb:"a1"},
        { name: "Contra entrega (tarjeta de crédito)" ,value:1,abb:"a2"},
        { name: "Tarjeta de crédito (Link pago)" ,value:1,abb:"a3"},
        { name: "Tarjeta de crédito (Pagina web)" ,value:1,abb:"a4"},
        { name: "Transferencias" ,value:1,abb:"a5"},
        { name: "Ninguna" ,value:0,abb:"a6"}
      ]
    },{
      question: "¿Ya pagas por publicidad en línea?",
      abb:"q4",
      type:"radio",
      weights: {
        beginners: 0,
        novices: 1,
        experts: 1
      },
      images:{
        principal:"q0-bg.jpg",
        secondary:[
          {
            image:"q0-circle.png",
            alt:"Chat"
          },{
            image:"q0-circle1.png",
            alt:"Chat"
          },{
            image:"q4-bg-01.png",
            alt:"Chat"
          }
        ]
      },
      answers: [
        { name: "Sí" ,value:1,abb:"a1"},
        { name: "No" ,value:0,abb:"a1"}
      ]
    },{
      abb:"q5"
    }]
  }

  public register(data:any) {
    const registerObservable = new Observable(observer => {
        this.http.post(this.base+`/register`,data,this.createHeaders())
        .subscribe({
            next: response => {
                observer.next(response);
            },
            error: error => {
              observer.error(error);
            }
        });
    })
    return registerObservable;
  }
  public anonToken() {
    const anonTokenObservable = new Observable(observer => {
      this.http.get(this.base+`/anontoken`)
      .subscribe({
          next: response => {
              const token:any = response;
              if(token && token.token){
                this.cookieService.set('anon_reach', token.token, { sameSite: 'None', secure: true });
                localStorage.setItem('anon_reach', token.token);
              }
              observer.next({token:true});
          },
          error: error => {
            observer.error({token:false});
          }
      });
    })
    return anonTokenObservable;
  }
  public validate(token:any) {
    const validateObservable = new Observable(observer => {
      this.http.get(this.base+`/validate/${token}`,this.createHeaders())
      .subscribe({
          next: response => {
              observer.next(response);
          },
          error: error => {
            observer.error(error);
          }
      });
    })
    return validateObservable;
  }

  public sumValuesByMainQuestion(obj: any): { [key: string]: number } {
    const sumByMainQuestion: { [key: string]: number } = {};
    Object.keys(obj).forEach(mainQuestionKey => {
      const currentMainQuestion = obj[mainQuestionKey];
      sumByMainQuestion[mainQuestionKey] = 0;
      Object.keys(currentMainQuestion).forEach(subQuestionKey => {
        const currentSubQuestion = currentMainQuestion[subQuestionKey];
        if (currentSubQuestion.value !== undefined) {
          sumByMainQuestion[mainQuestionKey] += currentSubQuestion.value;
        }
        if (currentSubQuestion && typeof currentSubQuestion === 'object' && !Array.isArray(currentSubQuestion)) {
          sumByMainQuestion[mainQuestionKey] += this.sumValuesBySubQuestion(currentSubQuestion);
        }
      });
    });
  
    return sumByMainQuestion;
  }
  private sumValuesBySubQuestion(obj: any): number {
    let sum = 0;
    Object.keys(obj).forEach(subQuestionKey => {
      const currentSubQuestion = obj[subQuestionKey];
      if (currentSubQuestion.value !== undefined) {
        sum += currentSubQuestion.value;
      }
      if (currentSubQuestion && typeof currentSubQuestion === 'object' && !Array.isArray(currentSubQuestion)) {
        sum += this.sumValuesBySubQuestion(currentSubQuestion);
      }
    });
    return sum;
  }

  createHeaders(){
    const token = this.cookieService.get("anon_reach") ? this.cookieService.get("anon_reach") : localStorage.getItem("anon_reach")?localStorage.getItem("anon_reach"):"";
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }
  }
  
  downloadPdf(): void {
    const pdfPath = 'assets/reach/madurez.pdf';
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = 'madurez-digital.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
}
