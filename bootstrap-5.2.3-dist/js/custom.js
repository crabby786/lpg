var date = new Date();
if (date.getMonth() === 11) {
    var yyyy = String(date.getFullYear() + 1);
    var nextMonth = 0;
} else {
    var yyyy = String(date.getFullYear());
    var nextMonth = date.getMonth() + 1;
}

var months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

var selectedMonthName = months[nextMonth];

// $("#datepicker1").datepicker({
//     default: "+1m",
//     format: 'MM-yyyy',
//     startView: "months",
//     minViewMode: "months",
//     defaultDate: selectedMonthName+'-'+yyyy,
//     autoclose: true,
// });
// $("#datepicker1").on("change", function () {
//     $('#datepicker1').val('Planning Month - ' + $(this).val());
// });
$("#datepicker1").val('Planning Month - ' + selectedMonthName+'-'+yyyy);


