import { customer_db, item_db, order_db } from "../db/db.js";

$(document).ready(function () {
    clearFields();
    $('#order-qty').on('input', updateBalance);
    $('#cash, #discount').on('input', updateBalance);
});

function nextOrderId() {
    if (order_db.length === 0) return 3001;
    let lastOrder = order_db[order_db.length - 1].orderId;
    return lastOrder + 1;
}

export function clearFields() {
    $("#order-id").val(nextOrderId());
    $('#item-price').val('');
    $('#cash').val('');
    $('#discount').val('');
    $('#balance').val('');
    $('#order-qty').val(1);
    $('#total-amount').val('');
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
    let price = item ? +item.price : 0;

    let qty = +$('#order-qty').val() || 1;
    let cash = +$('#cash').val() || 0;
    let discount = +$('#discount').val() || 0;

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
    alert("hey")
    let orderId = $('#order-id').val();
    let itemId = $('#item-dropdown').val();
    let qty = +$('#order-qty').val() || 1;
    let amount = +$('#item-price').val() || 0;
    let date = new Date().toLocaleDateString();

    console.log({ orderId, itemId, qty, amount });

    if (!itemId || qty <= 0 || amount <= 0) {
        alert("Invalid input. Check item, qty, and amount.");
        return;
    }

    $('#order-table tbody').append(`
        <tr>
            <td>${orderId}</td>
            <td>${itemId}</td>
            <td>${qty}</td>
            <td>${amount.toFixed(2)}</td>
            <td>${date}</td>
        </tr>
    `);


});
