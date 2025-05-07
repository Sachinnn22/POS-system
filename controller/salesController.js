import {customer_db, sales_db} from "../db/db.js";
import salesModel from "../model/salesModel.js";
import {clear, loadCustomer} from "./customerController";

$(document).ready(function () {
    loadSales() ;
});

export function loadSales() {
    $("#sales-tbody").empty();
    customer_db.map((item) => {
        let data = `<tr>
            <td>${item.cusId}</td>
            <td>${item.cusName}</td>-
            <td>${item.age}</td>
            <td>${item.contact}</td>
            <td>${item.address}</td>         
        </tr>`;
        $("#sales-tbody").append(data);
    });
}

$("#sales-export").on('click',function () {
    
})