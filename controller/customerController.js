import {customer_db, item_db} from "../db/db.js";
import CustomerModel from "../model/customerModel.js";

let contactPattern = /^0\d{9}$/;
let addressPattern =/^[a-zA-Z0-9\s,.'-]{5,100}$/
let namePattern =/^[A-Za-z\s]{3,40}$/
let agePattern =/^(1[01][0-9]|120|[1-9][0-9]?)$/

$(document).ready(function () {
    clear();
});

$("#search-customer").on("input",function () {
    let text = $(this).val()

    $("#table-customer tr").each(function () {
        let search = $(this).text()

        if (search.includes(text)){
            $(this).show()
        }else {
            $(this).hide()
        }
    })
})

export function loadCustomer() {
    $("#customer-tbody").empty();
    customer_db.map((item) => {
        let data = `<tr>
            <td>${item.cusId}</td>
            <td>${item.cusName}</td>-
            <td>${item.age}</td>
            <td>${item.contact}</td>
            <td>${item.address}</td>         
        </tr>`;
        $("#customer-tbody").append(data);
    });
}

function nextId() {
    if (customer_db.length === 0) return 1001;
    let lastItem = Number(customer_db[customer_db.length - 1].cusId);
    return lastItem + 1;
}

export function clear() {
    $("#cusId").val(nextId());
    $('#cusName').val('');
    $('#age').val('');
    $('#contact').val('');
    $('#address').val('');
}

function loadCustomerIds() {
    $('#customer-dropdown').empty();
    $('#customer-dropdown').append($('<option>', {
        value: '',
        text: 'Select Customer ID'
    }));
    console.log(customer_db);
    customer_db.forEach(customer => {
        $('#customer-dropdown').append(
            $('<option>', {
                value: customer.cusId,
                text: customer.cusId
            })
        );
    });
}

$("#customer-save").click(function () {
    let cusId = nextId();
    let cusName = $("#cusName").val()
    let age = $("#age").val()
    let contact = $("#contact").val()
    let address = $("#address").val()

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

    let customer_data = new CustomerModel(cusId, cusName, age, contact, address);
    customer_db.push(customer_data);
    loadCustomerIds()
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
    let cusId = $('#cusId').val()
    let cusName = $('#cusName').val()
    let age = $('#age').val()
    let contact = $('#contact').val()
    let address = $('#address').val()

    if (cusName === '' || age === '' || contact === '' || address === '') {
        Swal.fire({
            title: "Error",
            text: "Select customer",
            icon: "error"
        });
        return;
    }

    let index = customer_db.findIndex(customer => customer.cusId == Number(cusId));

    Swal.fire({
        title: 'Are you sure?',
        text: 'This customer will be removed!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
    }).then(result => {
        if (result.isConfirmed) {
            customer_db.splice(index, 1);
            loadCustomer();
            clear();
            loadCustomerIds()

        }
    });

});

$('#customer-update').on('click', function () {
    let cusId = $('#cusId').val()
    let cusName = $('#cusName').val();
    let age = $('#age').val();
    let contact = $('#contact').val();
    let address = $('#address').val();

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

    let index = customer_db.findIndex(customer => customer.cusId == Number(cusId));

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