import {customer_db, item_db} from "../db/db.js";
import itemModel from "../model/itemModel.js";


let productNameRegex = /([A-Za-z\s]+(?:Watch|Model)?)/;
let qtyRegex = /(\d+)\s*(?:qty|pcs|units?)/i;
let brandRegex = /\b(Brand|Manufacturer)\s*[:\-]?\s*([A-Za-z\s]+)/i;
let priceRegex = /\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/;

export function loadItems() {
    $("#item-tbody").empty();
    item_db.map((item) => {
        let data = `<tr>
            <td>${item.itemId}</td>
            <td>${item.itemName}</td>
            <td>${item.qty}</td>
            <td>${item.brand}</td>
            <td>${item.price}</td>         
        </tr>`;
        $("#item-tbody").append(data);
    });
}

function nextId() {
    return 2000 + item_db.length +1
}

export function clear() {
    $("#itemId").val("")
    $("#itemName").val("")
    $("#qty").val("")
    $("#brand").val("")
    $("#price").val("")
}

$("#item-save").click(function () {
    let itemId = nextId();
    let itemName = $("#itemName").val();
    let qty = $("#qty").val();
    let brand = $("#brand").val();
    let price = $("#price").val();

    if (itemName === '' || qty ===''|| brand ===''|| price ===''){
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    if (!productNameRegex.test(itemName)){
        Swal.fire({
            title: 'Error!',
            text: 'item name not correct',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    if (!qtyRegex.test(qty)){
        Swal.fire({
            title: 'Error!',
            text: 'qty not correct',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    if (!brandRegex.test(brand)){
        Swal.fire({
            title: 'Error!',
            text: 'brand not correct',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    if (!priceRegex.test(price)){
        Swal.fire({
            title: 'Error!',
            text: 'price not correct',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    let itemData = new itemModel(itemId,itemName,qty,brand,price)
    item_db.push(itemData)
    loadItems();
    clear();

    console.log("saved")
    Swal.fire({
        title: "Added Successfully!",
        icon: "success"
    });
})

$("#item-reset").click(function () {
    clear();
})

$("#item-tbody").on('click','tr',function () {
    let index = $(this).index();
    let item = item_db[index];

    $("#itemId").val(item.itemId)
    $("#itemName").val(item.itemName)
    $("#qty").val(item.qty)
    $("#brand").val(item.brand)
    $("#price").val(item.price)
})

$("#item-update").click(function () {
    let itemId = $("#itemId").val();
    let itemName = $("#itemName").val();
    let qty = $("#qty").val();
    let brand = $("#brand").val();
    let price = $("#price").val();

    if (itemName === '' || qty ===''|| brand ===''|| price ===''){
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    let index = item_db.findIndex(item => item.itemId == itemId );

    if (index === -1) {
        Swal.fire({
            title: "Error",
            text: "Customer not found to update",
            icon: "error"
        });
        return;
    }

    item_db[index] = new itemModel(itemId,itemName,qty,brand,price)
    loadItems();

    Swal.fire({
        title: "update success !",
        icon: "success"
    });
})

$("#item-delete").click(function () {
    let itemId = $("#itemId").val();
    let itemName = $("#itemName").val();
    let qty = $("#qty").val();
    let brand = $("#brand").val();
    let price = $("#price").val();

    if (itemName === '' || qty ===''|| brand ===''|| price ===''){
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    let index = item_db.findIndex(item => item.itemId == itemId );

    if (index === -1) {
        Swal.fire({
            title: "Error",
            text: "Customer not found to delete",
            icon: "error"
        });
        return;
    }

    item_db.splice(index,1)
    loadItems();
    clear()

    Swal.fire({
        title: "delete success !",
        icon: "success"
    });
})
