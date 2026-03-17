import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConvertToSpacePipe } from './convert-to-spaces.pipe';
import { TextComponent } from './elements/filter/text/text.component';
// import { MatSliderModule } from '@angular/material/slider';
// import { MatSelectModule } from '@angular/material/select';
// import { MatInputModule } from '@angular/material/input';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatDialogModule } from '@angular/material/dialog';
// import { OverlayComponent } from './overlay/overlay.component';
// import { TextComponent } from './elements/filter/text/text.component';
// import { CheckboxComponent } from './elements/filter/checkbox/checkbox.component';
// import { SliderComponent } from './elements/filter/slider/slider.component';
// import { SelectComponent } from './elements/filter/select/select.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    TextComponent,
    ConvertToSpacePipe,
  
],
  exports: [
    CommonModule,
    FormsModule,
    TextComponent,
    ConvertToSpacePipe,
   
  ]
})
export class SharedModule { }
