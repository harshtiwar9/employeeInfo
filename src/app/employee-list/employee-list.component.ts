import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../employeeservice.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  localEmpArray: any;

  empIdIndexBeforeUpdate = -1;
  empNameBeforeUpdate = "";
  empDeptBeforeUpdate = "";

  constructor(public router: Router, private _employeeService: EmployeeService) {

  }

  ngOnInit(): void {
    this.localEmpArray = this._employeeService.getEmployees();
  }

  editEmp(event: any){ //get input field to update data
    
    const empID = event.srcElement.id; //empID as reference to update data fields

    this.empNameBeforeUpdate = this.localEmpArray.filter((item: { id: any; }) => item.id == empID).map((item: { empName: any; }) => {return item.empName}).toString();
    this.empDeptBeforeUpdate = this.localEmpArray.filter((item: { id: any; }) => item.id == empID).map((item: { empDept: any; }) => {return item.empDept}).toString();

    //find Index of empID before update
    this.empIdIndexBeforeUpdate = this.localEmpArray.findIndex((emp: any) => emp.id == empID);

    const hideObjectArray = ["spanName","spanDept","btnEdit","btnDelete"]; //hide span ID's
    const showObjectArray = ["inputName","inputDept","update","btnCancel"]; //show input ID's
    
    hideObjectArray.map((item) => $("#"+item+empID).attr("hidden","hidden")); //Hide Span
    showObjectArray.map((item) => $("#"+item+empID).removeAttr("hidden")); //Show Input's

    $("#delCol").attr("hidden","hidden"); //Hide Delete Heading
    $("#cancelCol").removeAttr("hidden"); //Show Cancel Heading

    //Logic to hide Delete button while Update in progress
    this.localEmpArray.filter((item: { id: any; }) => item.id != empID)
      .map((item: { id: any; }) => {return item.id})
      .map((item: string) => $("#btnDelete"+item).attr("hidden","hidden"))
    
    //Logic to hide edit button while Update in progress
    this.localEmpArray.filter((item: { id: any; }) => item.id != empID)
    .map((item: { id: any; }) => {return item.id})
    .map((item: string) => $("#btnEdit"+item).attr("hidden","hidden"))  

    //Logic to show disable edit button while Update in progress
    this.localEmpArray.filter((item: { id: any; }) => item.id != empID)
    .map((item: { id: any; }) => {return item.id})
    .map((item: string) => $("#btnEditDisable"+item).removeAttr("hidden"))

  }

  cancelEdit(event: any){ //Cancel Update Operation

    const empID = event.srcElement.id; //empID as reference to update data fields

    //reset value of input
    $("#inputName"+empID).val(this.empNameBeforeUpdate);
    $("#inputDept"+empID).val(this.empDeptBeforeUpdate);

    //Hide Cancel button
    $("#btnCancel"+empID).attr("hidden","hidden");

    //Hide Update button
    $("#update"+empID).attr("hidden","hidden");

    //Logic to hide disable edit button while Update in progress
    this.localEmpArray.map((item: { id: any; }) => {return item.id})
    .map((item: string) => $("#btnEditDisable"+item).attr("hidden","hidden"))

    //Logic to show Delete button
    this.localEmpArray.map((item: { id: any; }) => {return item.id})
                .map((item: string) => $("#btnDelete"+item).removeAttr("hidden"));
    
    //Logic to show edit button
    this.localEmpArray.map((item: { id: any; }) => {return item.id})
                .map((item: string) => $("#btnEdit"+item).removeAttr("hidden"))  

    //Show Data back            
    const showObjectArray = ["spanName","spanDept"]; //show span ID's
    const hideObjectArray = ["inputName","inputDept"]; //hide inputs ID's
    
    hideObjectArray.map((item) => $("#"+item+empID).attr("hidden","hidden")); //Hide Input's
    showObjectArray.map((item) => $("#"+item+empID).removeAttr("hidden")); //Show Span

    $("#cancelCol").attr("hidden","hidden"); //Hide Cancel Heading
    $("#delCol").removeAttr("hidden"); //Show Delete Heading

  }

  updateEmp(event: any){ //update employee Info
    
    const empID = event.srcElement.id; //empID as reference to update data
    const showObjectArray = ["spanName","spanDept"]; //show span ID's
    const hideObjectArray = ["inputName","inputDept"]; //hide inputs ID's
    
    hideObjectArray.map((item) => $("#"+item+empID).attr("hidden","hidden")); //Hide Input's
    showObjectArray.map((item) => $("#"+item+empID).removeAttr("hidden")); //Show Span

    //Logic to hide disable edit button while Update in progress
    this.localEmpArray.map((item: { id: any; }) => {return item.id})
    .map((item: string) => $("#btnEditDisable"+item).attr("hidden","hidden"))

    //Logic to show Delete button
    this.localEmpArray.map((item: { id: any; }) => {return item.id})
                .map((item: string) => $("#btnDelete"+item).removeAttr("hidden"));
    
    //Logic to show edit button
    this.localEmpArray.map((item: { id: any; }) => {return item.id})
                .map((item: string) => $("#btnEdit"+item).removeAttr("hidden"))
    
    $("#cancelCol").attr("hidden","hidden"); //Hide Cancel Heading
    $("#delCol").removeAttr("hidden"); //Show Delete Heading

    const updatedEmpName = $("#inputName"+empID).val(), //Get new data to update current Data
    updatedEmpDept = $("#inputDept"+empID).val();

    //check if employee id exist. If exist then create new array without that emp and if not exist alert error.
    const idFound = this.localEmpArray.filter((item: { id: any; }) => item.id == empID).length == 1 ?
    this.localEmpArray.filter((item: { id: any; }) => item.id != empID)
    : alert("Employee record not found!");

    //empty local array
    this.localEmpArray = [];

    //push the unaffected data to array back
    this.localEmpArray.push(...idFound);
    
    //push new emp data
    this.localEmpArray.splice(this.empIdIndexBeforeUpdate,0,{
      id: empID,
      empName: updatedEmpName,
      empDept: updatedEmpDept
    })

    //Call Employee service to set new Data
    this._employeeService.setEmployees(this.localEmpArray);

  }

  deleteEmp(event: any){
    
    //empID as reference to delete data
    const empID = event.srcElement.id;

    //find Index of empID
    const empIndex = this.localEmpArray.findIndex((emp: any) => emp.id == empID);
  
    //Confirm box for operation
    const operationBool = confirm("Are you sure you want to delete "+this.localEmpArray[empIndex]["empName"]+"?") 
    
    //Update local storage for Yes and alert for No
    operationBool === true ? 
    //Call Employee service to set new Data
    this._employeeService.setEmployees(this.localEmpArray.filter((emp: { id: any; }) => emp.id != empID))
    : alert("Operation Canceled!")

    //Remove data
    operationBool === true ? this.localEmpArray.splice(empIndex,1) : ""
    // operationBool === true ? this.localEmpArray = this._employeeService.getEmployees() : ""
    
    //Data removed alert
    this.localEmpArray.filter((emp: { id: any; }) => emp.id == empID).length === 0 ? 
      alert("Employee data removed!") : ""

    //update Index to -1
    this.empIdIndexBeforeUpdate = -1;

  }

}
