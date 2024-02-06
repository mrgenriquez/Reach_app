import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { QuestionsComponent } from './questions/questions.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
@NgModule({
  declarations: [
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatIconModule, 
    MatRadioModule,
    MatCheckboxModule,
    FormsModule,
    SlickCarouselModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule
  ],
  bootstrap: []
})
export class AppModule { }