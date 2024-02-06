import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet,RouterLink,RouterLinkActive } from '@angular/router';
import {ThemePalette} from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { ReachService } from './reach.service';
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
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule,CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'reach_app';
  
  constructor(private reachService:ReachService) { 
  }
  ngOnInit() {
    this.reachService.anonToken().subscribe({
      next: response => {
          console.log(response)
      },
      error: error => {
        console.log(error);
      }
  });
  }
}
