import { customer_db, item_db, order_db } from "../db/db.js";
import { loadItems, loadItemsId } from './itemController.js';

let cart_db = [];

$(document).ready(function () {
    clearForm();
    loadItemsId();
});

function nextOrderId() {
    if (order_db.length === 0) {
        return 3001;
    }
    let lastOrder = order_db[order_db.length - 1].orderId;
    return lastOrder + 1;
}

function clearForm() {
    $("#order-id").val(nextOrderId());
    $('#cash').val('');
    $('#discount').val('');
    $('#balance').val('');
    $('#order-qty').val('');
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
            $('#order-qty').val('');
            updateBalance();
        }
    });
});

$('#item-dropdown, #order-qty, #cash, #discount').on('input change', updateBalance);

function updateBalance() {
    let itemId = $('#item-dropdown').val();
    let item = item_db.find(i => i.itemId.toString() === itemId);
    let price = 0;

    if (item) {
        price = Number(item.price);
    }

    let qtyInput = $('#order-qty').val();
    let qty = qtyInput !== '' ? Number(qtyInput) : 0;
    let cash = Number($('#cash').val()) || 0;
    let discount = Number($('#discount').val()) || 0;

    if (qty <= 0 || isNaN(qty)) {
        $('#balance').val('');
        return;
    }

    let totalPrice = price * qty;
    let discountAmount = totalPrice * (discount / 100);
    let discountedTotal = totalPrice - discountAmount;
    let balance = cash - discountedTotal;

    $('#balance').val(balance.toFixed(2));
}

$('#add-cart').click(function () {
    let orderId = $('#order-id').val();
    let itemId = $('#item-dropdown').val();
    let qtyInput = $('#order-qty').val();
    let qty = qtyInput !== '' ? Number(qtyInput) : 0;
    let date = new Date().toLocaleDateString();

    let item = item_db.find(i => i.itemId.toString() === itemId);
    let existingQtyInCart = cart_db.filter(i => i.itemId === itemId).reduce((sum, i) => sum + i.qty, 0);

    if (!item || (item.qty - existingQtyInCart) < qty) {
        Swal.fire({
            icon: 'error',
            title: 'Not enough Stock'
        });
        return;
    }

    if (!orderId || !itemId || !qty) {
        Swal.fire({
            icon: 'warning',
            title: 'Fields are empty'
        });
        return;
    }

    if (qty <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input'
        });
        return;
    }

    let itemTotal = item.price * qty;

    cart_db.push({ orderId, itemId, qty, amount: itemTotal, date });

    $('#order-tbody').append(`
        <tr data-id="${itemId}">
            <td>${itemId}</td>
            <td>${qty}</td>
            <td>${itemTotal.toFixed(2)}</td>
            <td>${date}</td>
            <td><button class="btn btn-sm btn-danger remove-btn">Remove</button></td>
        </tr>
    `);

    let currentTotal = Number($('#item-price').val()) || 0;
    $('#item-price').val((currentTotal + itemTotal).toFixed(2));

    Swal.fire({
        icon: 'success',
        title: 'Added to Cart'
    });

    $('#order-qty').val('');
    $('#item-dropdown').prop('selectedIndex', 0);
    loadItems();
});

$('#order-tbody').on('click', '.remove-btn', function () {
    let row = $(this).closest('tr');
    let itemId = row.data('id');

    let index = cart_db.findIndex(item => item.itemId === itemId.toString());
    if (index !== -1) {
        let removedItem = cart_db.splice(index, 1)[0];

        let currentTotal = Number($('#item-price').val()) || 0;
        let newTotal = currentTotal - removedItem.amount;
        $('#item-price').val(newTotal.toFixed(2));

        row.remove();
        loadItems();
    }
});

$("#search-order").on("input", function () {
    let text = $(this).val();
    $("#order-table tr").each(function () {
        let search = $(this).text();
        if (search.includes(text)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});

$('#process-btn').click(function () {
    let orderId = $('#order-id').val();
    let customerId = $('#customer-dropdown').val();
    let date = new Date().toLocaleDateString();

    if (!customerId) {
        Swal.fire({
            icon: 'warning',
            title: 'Select a customer'
        });
        return;
    }

    if (cart_db.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Cart is empty'
        });
        return;
    }

    let orderItems = [];

    for (let i = 0; i < cart_db.length; i++) {
        let cartItem = cart_db[i];
        let item = item_db.find(i => i.itemId.toString() === cartItem.itemId.toString());

        if (item) {
            item.qty -= cartItem.qty;
            orderItems.push({
                itemId: cartItem.itemId,
                qty: cartItem.qty,
                amount: cartItem.amount
            });
        }
    }

    let order = {
        orderId: Number(orderId),
        customerId: customerId,
        date: date,
        items: orderItems
    };

    order_db.push(order);

    cart_db = [];
    $('#order-tbody').empty();
    $('#item-price').val('');

    Swal.fire({
        icon: 'success',
        title: 'Order Saved'
    });

    clearForm();
    loadItems();
});
