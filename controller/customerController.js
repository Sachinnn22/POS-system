import { customer_db } from "../db/db.js";
import CustomerModel from "../model/customerModel.js";

export function loadCustomer() {
    $("#customer-tbody").empty();

    customer_db.forEach((item, index) => {
        let data = `<tr>
      <td>${item.cusId}</td>
      <td>${item.cusName}</td>
      <td>${item.age}</td>
      <td>${item.contact}</td>
      <td>${item.address}</td>         
    </tr>`;
        $("#customer-tbody").append(data);
    });
}

export function clear() {
    $('#cusName').val('');
    $('#age').val('');
    $('#contact').val('');
    $('#address').val('');
}

$("#customer-save").click(function () {
    let cusId = $("#cusId").val();
    let cusName = $("#cusName").val();
    let age = $("#age").val();
    let contact = $("#contact").val();
    let address = $("#address").val();

    if (cusName === '' || age === '' || contact === '' || address === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    } else {
        let customer_data = new CustomerModel(cusId,cusName, age, contact, address);
        customer_db.push(customer_data);
        console.log(customer_db);

        loadCustomer();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true


        });
    }
});

$('#customer-reset').on('click', function () {
    $('#cusName').val('');
    $('#age').val('');
    $('#contact').val('');
    $('#address').val('');

    loadCustomer();
});


$('#customer_update').on('click', function () {
    let cusId = $('#cusId').val();
    let cusName = $('#cusName').val();
    let age = $('#age').val();
    let contact = $('#contact').val();
    let address = $('#address').val();

    if (cusId === '' || cusName === '' || age === '' || contact === '' || address === '') {
        Swal.fire({
            title: "Error",
            text: "Fill the fields first",
            icon: "error",
        });
        return;
    }


    customer_db[i] = new CustomerModel(cusId, cusName, age, contact, address);

    loadCustomer();

    Swal.fire({
        title: "Updated!",
        text: "Customer Updated Successfully!",
        icon: "success"
    });

    clear();
});

$('#customer-delete').on('click', function () {
    let cusId = $('#cusId').val();
    let cusName = $('#cusName').val();
    let age = $('#age').val();
    let contact = $('#contact').val();
    let address = $('#address').val();

    if (cusId === '' || cusName === '' || age === '' || contact === '' || address === '') {
        Swal.fire({
            title: "Error",
            text: "Fill the fields first",
            icon: "error",
        });
        return;
    }

    let index = customer_db.findIndex(customer => customer.cusId === cusId);

    if (index === -1) {
        Swal.fire({
            title: "Error",
            text: "Customer not found to delete",
            icon: "error"
        });
        return;
    }

    customer_db.splice(index, 1);

    loadCustomer();


    Swal.fire({
        title: "Deleted!",
        text: "Customer Deleted Successfully!",
        icon: "success"
    });

    clear();
});
