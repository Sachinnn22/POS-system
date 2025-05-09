import { customer_db, item_db, order_db } from "../db/db.js";
import { loadItems } from './itemController.js';

let cart_db = [];

$(document).ready(function () {
    clear();
});

function nextOrderId() {
    if (order_db.length === 0) return 3001;
    let lastOrder = order_db[order_db.length - 1].orderId;
    return lastOrder + 1;
}

function clear() {
    $("#order-id").val(nextOrderId());
    $('#item-price').val('');
    $('#cash').val('');
    $('#discount').val('');
    $('#balance').val('');
    $('#order-qty').val(1);
    $('#total-amount').val('');
    $('#item-dropdown').prop('selectedIndex', 0);
}

$('#customer-dropdown').change(function () {
    let customerId = $(this).val();
    customer_db.map(function (customer) {
        if (customerId.toString() === customer.cusId.toString()) {
        }
    });
});

$('#item-dropdown').change(function () {
    let itemId = $(this).val();
    item_db.map(function (item) {
        if (itemId.toString() === item.itemId.toString()) {
            $('#item-price').val(item.price);
            updateBalance();
        }
    });
});

$('#item-dropdown, #order-qty, #cash, #discount').on('input change', updateBalance);

function updateBalance() {
    let itemId = $('#item-dropdown').val();
    let item = item_db.find(i => i.itemId.toString() === itemId);
    let price = 0;

    if (item !== null) {
        price = Number(item.price);
    }

    let qty = Number($('#order-qty').val()) || 1;
    let cash = Number($('#cash').val()) || 0;
    let discount = Number($('#discount').val()) || 0;

    if (qty <= 0) {
        $('#item-price').val('');
        $('#balance').val('');
        return;
    }

    let totalPrice = price * qty;
    let discountAmount = totalPrice * (discount / 100);
    let discountedTotal = totalPrice - discountAmount;
    let balance = cash - discountedTotal;

    $('#item-price').val(discountedTotal.toFixed(2));
    $('#balance').val(balance.toFixed(2));
}

$('#add-cart').click(function () {
    let orderId = $('#order-id').val();
    let itemId = $('#item-dropdown').val();
    let qty = Number($('#order-qty').val()) || 1;
    let amount = Number($('#item-price').val()) || 0;
    let date = new Date().toLocaleDateString();

    let item = item_db.find(i => i.itemId.toString() === itemId);
    if (!item || item.qty < qty) {
        Swal.fire({
            icon: 'error',
            title: 'Not enough Stock',
        });
        return;
    }

    item.qty -= qty;

    if (!orderId || !itemId || !qty || !amount) {
        Swal.fire({
            icon: 'warning',
            title: 'Fields are empty',
        });
        return;
    }

    if (qty <= 0 || amount <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
        });
        return;
    }

    cart_db.push({ orderId: orderId, itemId: itemId, qty: qty, amount: amount, date: date });

    $('#order-table tbody').append(`
        <tr>
            <td>${orderId}</td>
            <td>${itemId}</td>
            <td>${qty}</td>
            <td>${amount.toFixed(2)}</td>
            <td>${date}</td>
        </tr>
    `);

    Swal.fire({
        icon: 'success',
        title: 'Added to Cart',
    });
    clear();
    loadItems()
});

$("#search-order").on("input",function () {
    let text = $(this).val()

   $("#order-table tr").each(function () {
       let search = $(this).text()

       if (search.includes(text)){
           $(this).show()
       }else {
           $(this).hide()
       }
   })
})
