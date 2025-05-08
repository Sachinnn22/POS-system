import {customer_db, order_db} from "../db/db.js";

$(document).ready(function () {
    clear()
});


function nextId() {
    if (order_db.length==0) return 3001;
    let orderDbElement = order_db[order_db.length-1];
    let lastId = orderDbElement.orderId;
    let newId = lastId+1;
    return newId;
}

export function clear() {
    $("#order-id").val(nextId());

}