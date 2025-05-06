import { customer_db } from "../db/db.js";
import CustomerModel from "../model/customerModel.js";

let contactPattern = /^0\d{9}$/;
let addressPattern =/^[a-zA-Z0-9\s,.'-]{5,100}$/
let namePattern =/^[A-Za-z\s]{3,40}$/
let agePattern =/^(1[01][0-9]|120|[1-9][0-9]?)$/

export function loadCustomer() {
    $("#customer-tbody").empty();
    customer_db.forEach((item) => {
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

function nextId() {
    return 1000 + customer_db.length + 1;
}

export function clear() {
    $("#cusId").val('');
    $('#cusName').val('');
    $('#age').val('');
    $('#contact').val('');
    $('#address').val('');
}

$("#customer-save").click(function () {

    let cusId = nextId();
    let cusName = $("#cusName").val().trim();
    let age = $("#age").val().trim();
    let contact = $("#contact").val().trim();
    let address = $("#address").val().trim();

    if (!contactPattern.test(contact)) {
        Swal.fire({
            title: "Error!",
            text: "Invalid contact format",
            icon: "error",
            confirmButtonText: "Ok"
        });
        return;
    }

    if (!addressPattern.test(address)) {
        Swal.fire({
            title: "Error!",
            text: "Invalid address format",
            icon: "error",
            confirmButtonText: "Ok"
        });
        return;
    }

    if (!namePattern.test(cusName)) {
        Swal.fire({
            title: "Error!",
            text: "Invalid name format",
            icon: "error",
            confirmButtonText: "Ok"
        });
        return;
    }

    if (!agePattern.test(age)) {
        Swal.fire({
            title: "Error!",
            text: "Invalid age format",
            icon: "error",
            confirmButtonText: "Ok"
        });
        return;
    }

    if (cusName === '' || age === '' || contact === '' || address === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    if (customer_db.some(c => c.cusId == cusId)) {
        Swal.fire({
            title: "Error!",
            text: "Customer ID already exists!",
            icon: "error"
        });
        return;
    }

    let customer_data = new CustomerModel(cusId, cusName, age, contact, address);
    customer_db.push(customer_data);
    loadCustomer();

    Swal.fire({
        title: "Added Successfully!",
        icon: "success"
    });

    clear();
});

$('#customer-reset').on('click', function () {
    clear();
    loadCustomer();
    nextId();
});

$('#customer-delete').on('click', function () {
    let cusId = $('#cusId').val().trim();
    let cusName = $('#cusName').val().trim();
    let age = $('#age').val().trim();
    let contact = $('#contact').val().trim();
    let address = $('#address').val().trim();

    if (cusId === '' || cusName === '' || age === '' || contact === '' || address === '') {
        Swal.fire({
            title: "Error",
            text: "Fill the fields first",
            icon: "error"
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

$('#customer-update').on('click', function () {
    let contactPattern = /^0\d{9}$/;

    let cusId = $('#cusId').val().trim();
    let cusName = $('#cusName').val().trim();
    let age = $('#age').val().trim();
    let contact = $('#contact').val().trim();
    let address = $('#address').val().trim();

    if (!contactPattern.test(contact)) {
        Swal.fire({
            title: "Error!",
            text: "Invalid contact format",
            icon: "error",
            confirmButtonText: "Ok"
        });
        return;
    }

    if (!addressPattern.test(address)) {
        Swal.fire({
            title: "Error!",
            text: "Invalid address format",
            icon: "error",
            confirmButtonText: "Ok"
        });
        return;
    }

    if (!namePattern.test(cusName)) {
        Swal.fire({
            title: "Error!",
            text: "Invalid name format",
            icon: "error",
            confirmButtonText: "Ok"
        });
        return;
    }

    if (!agePattern.test(age)) {
        Swal.fire({
            title: "Error!",
            text: "Invalid name format",
            icon: "error",
            confirmButtonText: "Ok"
        });
        return;
    }

    if (cusId === '' || cusName === '' || age === '' || contact === '' || address === '') {
        Swal.fire({
            title: "Error",
            text: "Fill the fields first",
            icon: "error"
        });
        return
    }

    let index = customer_db.findIndex(customer => customer.cusId == cusId);

    if (index === -1) {
        Swal.fire({
            title: "Error",
            text: "Customer not found to update",
            icon: "error"
        });
        return;
    }

    customer_db[index] = new CustomerModel(cusId, cusName, age, contact, address);

    loadCustomer();

    Swal.fire({
        title: "Updated!",
        text: "Customer Updated Successfully!",
        icon: "success"
    });

    clear();
});

$("#customer-tbody").on('click', 'tr', function () {
    let index = $(this).index();
    let customer = customer_db[index];

    $('#cusId').val(customer.cusId);
    $('#cusName').val(customer.cusName);
    $('#age').val(customer.age);
    $('#contact').val(customer.contact);
    $('#address').val(customer.address);
});
