import { customer_db, item_db, order_db } from "../db/db.js";
import { loadItems, loadItemsId } from './itemController.js';

let cart_db = [];

$(document).ready(function () {
    clearForm();
    loadItemsId();
});

function nextOrderId() {
    if (order_db.length === 0) return 3001;
    let lastItem = order_db[order_db.length - 1].orderId;
    return lastItem + 1;
}

function clearForm() {
    $("#order-id").val(nextOrderId());
    $('#cash').val('');
    $('#discount').val('');
    $('#balance').val('');
    $('#order-qty').val('');
    $('#item-price').val('');
    $('#item-dropdown').prop('selectedIndex', 0);
    $('#customer-dropdown').prop('selectedIndex', 0);
}

$('#cash, #discount, #order-qty, #item-dropdown').on('input change', function () {
    updateBalance();
});

function updateBalance() {
    let itemId = $('#item-dropdown').val();
    let item = item_db.find(i => i.itemId.toString() === itemId);
    let price = item ? Number(item.price) : 0;

    let qty = Number($('#order-qty').val()) || 0;
    let cash = Number($('#cash').val()) || 0;
    let discount = Number($('#discount').val()) || 0;

    if (!item || qty <= 0) {
        $('#balance').val('');
        return;
    }

    let total = price * qty;
    let discountAmount = total * (discount / 100);
    let finalAmount = total - discountAmount;
    let balance = cash - finalAmount;

    $('#balance').val(balance.toFixed(2));
}

$('#add-cart').click(function () {
    let orderId = $('#order-id').val();
    let itemId = $('#item-dropdown').val();
    let qty = Number($('#order-qty').val()) || 0;
    let date = new Date().toLocaleDateString();

    let item = item_db.find(i => i.itemId.toString() === itemId);
    if (!item || item.qty < qty || qty <= 0) {
        Swal.fire({ icon: 'warning', title: 'Invalid or low stock' });
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

    Swal.fire('Added to Cart');

    $('#order-qty').val('');
    $('#item-dropdown').prop('selectedIndex', 0);
    $('#balance').val('');
    loadItems();
});

$('#order-tbody').on('click', '.remove-btn', function () {
    let row = $(this).closest('tr');
    let itemId = row.data('id').toString();
    let itemIndex = cart_db.findIndex(cartItem => cartItem.itemId === itemId);

    if (itemIndex !== -1) {
        let removedItem = cart_db.splice(itemIndex, 1)[0];
        let currentTotal = Number($('#item-price').val()) || 0;
        let newTotal = currentTotal - removedItem.amount;
        $('#item-price').val(newTotal.toFixed(2));
        row.remove();
        loadItems();
    }
});

$('#process-btn').click(function () {
    let orderId = $('#order-id').val();
    let customerId = $('#customer-dropdown').val();
    let date = new Date().toLocaleDateString();
    let balance = Number($('#balance').val());

    if (!customerId || cart_db.length === 0 || isNaN(balance) || balance < 0) {
        Swal.fire({
            title: 'Warning!',
            html: 'Please check:<br>• Customer<br>• Cart<br>• Cash input',
            icon: 'warning'
        });
        return;
    }

    let orderItems = [];

    cart_db.forEach(cartItem => {
        let item = item_db.find(i => i.itemId.toString() === cartItem.itemId.toString());
        if (item) {
            item.qty -= cartItem.qty;
            orderItems.push({
                itemId: cartItem.itemId,
                qty: cartItem.qty,
                amount: cartItem.amount
            });
        }
    });

    order_db.push({
        orderId: Number(orderId),
        customerId: customerId,
        date: date,
        items: orderItems
    });

    $('#order-tbody').empty();
    $('#item-price').val('');
    cart_db = [];

    Swal.fire({
        title: 'Order Saved!',
        html: 'Do you want a slip?<br><br>',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'

    }).then(result => {
        if (result.isConfirmed) {
            generatePDF(orderId, customerId, date, orderItems, balance);
        }
    });

    clearForm();
    loadItems();
});

function generatePDF(orderId, customerId, date, orderItems, balance) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let content = '';

    content = content + 'Order ID: ' + orderId + '\n';
    content = content + 'Customer: ' + customerId + '\n';
    content = content + 'Date: ' + date + '\n\n';

    for (let i = 0; i < orderItems.length; i++) {
        content = content + 'Item: ' + orderItems[i].itemId + ' | ';
        content = content + 'Qty: ' + orderItems[i].qty + ' | ';
        content = content + 'Price: Rs ' + orderItems[i].amount.toFixed(2) + '\n';
    }

    content = content + '\nBalance: Rs ' + balance.toFixed(2);

    doc.text(content, 10, 10);
    doc.save('Order_' + orderId + '_Slip.pdf');
}
