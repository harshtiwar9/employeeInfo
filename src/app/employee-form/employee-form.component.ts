import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {

  constructor(public router: Router) {

  }

  ngOnInit(): void {
  }

  checkEmpArray = localStorage.getItem('empArray');
  empData = JSON.parse(this.checkEmpArray == null ? "[]" : this.checkEmpArray);

  empIdIndexBeforeUpdate = -1;

  //Generate random ID
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  onSubmit(data: any) { //onSubmit add data to Local Storage.

    //Data push to local storage
    this.empData.push({
      id: this.generateId(),
      ...data.value
    });
    localStorage.setItem(
      "empArray", JSON.stringify(this.empData)
    )

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
