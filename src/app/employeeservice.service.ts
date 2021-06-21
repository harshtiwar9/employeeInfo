import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor() { }

  getEmployees() {
    const checkEmpArray = localStorage.getItem('empArray');
    const empData = JSON.parse(checkEmpArray == null ? "[]" : checkEmpArray);
    return empData
  }

  setEmployees(data: any) {
    localStorage.clear(); //clear local storage
    localStorage.setItem( //add new data to local storage
      "empArray", JSON.stringify(data)
    )
  }

}
