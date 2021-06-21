import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../employeeservice.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  
  //Local variable to store data
  localEmpArray: any;

  constructor(public router: Router, private _employeeService: EmployeeService) {

  }

  ngOnInit(): void {
    this.localEmpArray = this._employeeService.getEmployees();
  }

  //Generate random ID
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  onSubmit(data: any) { //onSubmit add data to Local Storage.

    //Data push to local storage
    this.localEmpArray.push({
      id: this.generateId(),
      ...data.value
    });

    //Call Employee service to set new Data
    this._employeeService.setEmployees(this.localEmpArray);

    //reset form
    data.reset();

    //Alert data recorded
    alert("Employee data recorded!");

    //Navigate to update List component
    this.router.url == "/home" ? this.router.navigateByUrl('/employee-list', { skipLocationChange: true }).then(() => {
      this.router.navigate(['home']);
    }) : ""

  }

}
