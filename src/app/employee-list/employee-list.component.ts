import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  constructor(public router: Router) {

  }

  ngOnInit(): void {
  }

  checkEmpArray = localStorage.getItem('empArray');
  empData = JSON.parse(this.checkEmpArray == null ? "[]" : this.checkEmpArray);

  empIdIndexBeforeUpdate = -1;
  empNameBeforeUpdate = "";
  empDeptBeforeUpdate = "";

  editEmp(event: any){ //get input field to update data
    
    const empID = event.srcElement.id; //empID as reference to update data fields

    this.empNameBeforeUpdate = this.empData.filter((item: { id: any; }) => item.id == empID).map((item: { empName: any; }) => {return item.empName}).toString();
    this.empDeptBeforeUpdate = this.empData.filter((item: { id: any; }) => item.id == empID).map((item: { empDept: any; }) => {return item.empDept}).toString();

    //find Index of empID before update
    this.empIdIndexBeforeUpdate = this.empData.findIndex((emp: any) => emp.id == empID);

    const hideObjectArray = ["spanName","spanDept","btnEdit","btnDelete"]; //hide span ID's
    const showObjectArray = ["inputName","inputDept","update","btnCancel"]; //show input ID's
    
    hideObjectArray.map((item) => $("#"+item+empID).attr("hidden","hidden")); //Hide Span
    showObjectArray.map((item) => $("#"+item+empID).removeAttr("hidden")); //Show Input's

    $("#delCol").attr("hidden","hidden"); //Hide Delete Heading
    $("#cancelCol").removeAttr("hidden"); //Show Cancel Heading

    //Logic to hide Delete button while Update in progress
    this.empData.filter((item: { id: any; }) => item.id != empID)
      .map((item: { id: any; }) => {return item.id})
      .map((item: string) => $("#btnDelete"+item).attr("hidden","hidden"))
    
    //Logic to hide edit button while Update in progress
    this.empData.filter((item: { id: any; }) => item.id != empID)
    .map((item: { id: any; }) => {return item.id})
    .map((item: string) => $("#btnEdit"+item).attr("hidden","hidden"))  

    //Logic to show disable edit button while Update in progress
    this.empData.filter((item: { id: any; }) => item.id != empID)
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
    this.empData.map((item: { id: any; }) => {return item.id})
    .map((item: string) => $("#btnEditDisable"+item).attr("hidden","hidden"))

    //Logic to show Delete button
    this.empData.map((item: { id: any; }) => {return item.id})
                .map((item: string) => $("#btnDelete"+item).removeAttr("hidden"));
    
    //Logic to show edit button
    this.empData.map((item: { id: any; }) => {return item.id})
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
    this.empData.map((item: { id: any; }) => {return item.id})
    .map((item: string) => $("#btnEditDisable"+item).attr("hidden","hidden"))

    //Logic to show Delete button
    this.empData.map((item: { id: any; }) => {return item.id})
                .map((item: string) => $("#btnDelete"+item).removeAttr("hidden"));
    
    //Logic to show edit button
    this.empData.map((item: { id: any; }) => {return item.id})
                .map((item: string) => $("#btnEdit"+item).removeAttr("hidden"))
    
    $("#cancelCol").attr("hidden","hidden"); //Hide Cancel Heading
    $("#delCol").removeAttr("hidden"); //Show Delete Heading

    const updatedEmpName = $("#inputName"+empID).val(), //Get new data to update current Data
    updatedEmpDept = $("#inputDept"+empID).val();

    //check if employee id exist. If exist then create new array without that emp and if not exist alert error.
    const idFound = this.empData.filter((item: { id: any; }) => item.id == empID).length == 1 ?
    this.empData.filter((item: { id: any; }) => item.id != empID)
    : alert("Employee record not found!");

    //empty local array
    this.empData = [];

    //push the unaffected data to array back
    this.empData.push(...idFound);
    
    //push new emp data
    this.empData.splice(this.empIdIndexBeforeUpdate,0,{
      id: empID,
      empName: updatedEmpName,
      empDept: updatedEmpDept
    })

    localStorage.clear(); //clear local storage
    localStorage.setItem( //add new data to local storage
      "empArray", JSON.stringify(this.empData)
    )

  }

  deleteEmp(event: any){
    
    //empID as reference to delete data
    const empID = event.srcElement.id;

    //find Index of empID
    const empIndex = this.empData.findIndex((emp: any) => emp.id == empID);
  
    //Confirm box for operation
    const operationBool = confirm("Are you sure you want to delete "+this.empData[empIndex]["empName"]+"?") 
    
    //Update local storage for Yes and alert for No
    operationBool === true ? 
    localStorage.setItem(
      "empArray", JSON.stringify(this.empData.filter((emp: { id: any; }) => emp.id != empID))
    )
    : alert("Operation Canceled!")

    //Remove data
    operationBool === true ? this.empData.splice(empIndex,1) : ""
    
    //Data removed alert
    this.empData.filter((emp: { id: any; }) => emp.id == empID).length === 0 ? 
      alert("Employee data removed!") : ""

    //update Index to -1
    this.empIdIndexBeforeUpdate = -1;

  }

}
