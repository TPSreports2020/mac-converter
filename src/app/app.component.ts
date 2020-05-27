import { Component, OnChanges, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";

// ffff.0000.9999
// ffff.0000.8888
// ffff.0000.7777
// ffff.0000.6666
// ffff.0000.5555
// ffff.0000.4444


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})

export class AppComponent  {
  macForm: FormGroup;
  formatNames = {
    Dot: '.',
    Dash: '-',
    Colon: ':',
    None: ''
  }

  @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.macForm.value.pasteMacs.length > 13){
      this.onSubmit();
    }
  }

   ngOnInit() {
    this.macForm = new FormGroup({
      formatSelect: new FormControl(null),
      intervalSelect: new FormControl(null),
      pasteMacs: new FormControl(null, [Validators.required]),
      spitMacs: new FormControl(null)
    });
    this.macForm.setValue({
      formatSelect: 'Colon',
      intervalSelect: '2',
      pasteMacs: '',
      spitMacs: ''
    });

  }

  onSubmit() {

    // Function to divide string by variable length
    const divide = (str, length) => {
      return str.match(new RegExp('.{1,' + length + '}', 'g'));
    }

    // Set values
    const completedForm = this.macForm.value;
    const formatChar = this.formatNames[completedForm.formatSelect];
    const interval = Number(completedForm.intervalSelect);
    let currentFormatChar: string;
    let newMacs = '';

    // Strip input whitespaces, split by new lines
    let macArray = completedForm.pasteMacs.trim().split('\n');
    
    // Determine the currentFormatChar
    const firstMac = macArray[0];
    if (firstMac.indexOf(':') > -1) {
      currentFormatChar = ':';
    } else if (firstMac.indexOf('.') > -1){
      currentFormatChar = '.';
    } else if (firstMac.indexOf('-') > -1){
      currentFormatChar = '-';
    }

    // For every mac in the macArray 
    macArray.map( (macAdd) => {
      // Strip the mac of the current format char
      macAdd = macAdd.replace(new RegExp('\\'+currentFormatChar, 'g'), '');
      // Divide by set interval
      macAdd = divide(macAdd, interval);
      // Add formatted mac to final string with attached new line
      newMacs += (macAdd.join(formatChar) + '\n');
    });
    
    // Place the new macs in the spitMacs textarea
    this.macForm.patchValue({
      spitMacs: newMacs
    });
  }
}

