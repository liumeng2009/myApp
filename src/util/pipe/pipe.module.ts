import { NgModule } from '@angular/core';
import {TitleDatePipe} from './titleDate.pipe';
import {DatePipe} from './date.pipe'

@NgModule({
  declarations: [
    TitleDatePipe,
    DatePipe
  ],
  imports: [

  ],
  exports: [
    TitleDatePipe,
    DatePipe
  ]
})
export class PipesModule { }
