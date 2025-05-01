import {customer_db} from "../db/db";
import customerModel from "../model/customerModel";

export function loadCustomer() {
    $("#customer-tbody").empty()

    customer_db.map(function (item,index) {
        let data = `<tr>
            <td>${index + 1}</td>
            <td>${item.cusName}</td>
            <td>${item.age}</td>
            <td>${item.contact}</td>
            <td>${item.address}</td>         
        </tr>`

    } );
}

$("#customer-save").click(function () {
    let cusName = $("#cusName").val()
    let age = $("#age").val()
    let contact = $("#contact").val()
    let address = $("#address").val()

    if (cusName === '' || age === '' || contact === '' || address === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    } else {
        let customer_data = new customerModel(cusName,age,contact,address);
        customer_db.push(customer_data);
        console.log(customer_db);

        loadCustomer();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });
    }

    $('#customer-reset').on('click', function () {
        $('#cusName').val('');
        $('#age').val('');
        $('#contact').val('');
        $('#address').val('');

        loadCustomer()
    });

})