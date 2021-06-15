import { Component } from '@angular/core';
// import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'employee';
  typeFlag = false;

  checkEmpArray = localStorage.getItem('empArray');
  empData = JSON.parse(this.checkEmpArray == null ? "[]" : this.checkEmpArray);

  empIdIndexBeforeUpdate = -1;

  //Generate random ID
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  onSubmit (data: any){ //onSubmit add data to Local Storage.

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
  
  }

  editEmp(event: any){ //get input field to update data
    
    const empID = event.srcElement.id; //empID as reference to update data fields

    //find Index of empID before update
    this.empIdIndexBeforeUpdate = this.empData.findIndex((emp: any) => emp.id == empID);

    const hideObjectArray = ["spanName","spanDept","btnEdit","btnDelete"]; //hide span ID's
    const showObjectArray = ["inputName","inputDept","update","btnDeleteDisable"]; //show input ID's
    
    hideObjectArray.map((item) => $("#"+item+empID).attr("hidden","hidden")); //Hide Span
    showObjectArray.map((item) => $("#"+item+empID).removeAttr("hidden")); //Show Input's
    
  }

  updateEmp(event: any){ //update employee Info
    
    const empID = event.srcElement.id; //empID as reference to update data
    const showObjectArray = ["spanName","spanDept","btnEdit","btnDelete"]; //show span ID's
    const hideObjectArray = ["inputName","inputDept","update","btnDeleteDisable"]; //hide inputs ID's
    
    hideObjectArray.map((item) => $("#"+item+empID).attr("hidden","hidden")); //Hide Input's
    showObjectArray.map((item) => $("#"+item+empID).removeAttr("hidden")); //Show Span
    
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
    const operationBool = confirm("Are you sure to delete "+this.empData[empIndex]["empName"]+"?") 
    
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
