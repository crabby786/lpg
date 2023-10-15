/*!
 * FullCalendar v1.0.1
 * Docs & License: Aramco
 * (c) 2023 Aramco Author : Rajnikanth BS
 */

//ajax request for select option values > start
//returns success and failure messages
function getSelectOptionResults() {
    var terminalURL = 'https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FTERMINAL_CUST_DROPDOWN&myjson=%7B"id":"123"%7D';
    $.ajax({
        url: terminalURL,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
        },

        // data : {},
        success: function (data) {
            // To get the dropdown of terminals specific to the table edit rows
            $.each(data.TERMINALS, function (index, valTerminal) {
                $('#terminalIdNewRow').append('<option value="' + valTerminal.TERMINAL_NM + '">' + valTerminal.TERMINAL_NM + '</option>');
            });
            // To get the dropdown of customer specific to the table edit rows
            $.each(data.CUSTOMERS, function (index, valCustomer) {
                $('#customerIdNewRow').append('<option value="' + valCustomer.CUSTOMER_NM + '">' + valCustomer.CUSTOMER_NM + '</option>');
            });
            //the below code is for annual plan

            if (data.TERMINALS.length > 0) {

                // To get the dropdown of customer specific to the table edit rows

                $.each(data.TERMINALS, function (index, valCoload) {
                    $('#coloadIdNewRow').append('<option value="' + valCoload.TERMINAL_NM + '">' + valCoload.TERMINAL_NM + '</option>');
                });
                // $.each(data.COLOAD_GROUP, function (index, valCoload) {
                //     $('#coload').append('<option value="' + valCoload.COLOAD_GROUP_NM + '">' + valCoload.COLOAD_GROUP_NM + '</option>');
                // });
            }
        }
    });
}

function getOptionSelected(customerSelectedValue, terminalSelectedValue, tbl_row) {
    //ajax request for table data > start
    var terminalURL = 'https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FTERMINAL_CUST_DROPDOWN&myjson=%7B"id":"123"%7D';
    $.ajax({
        url: terminalURL,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
        },

        // data : {},
        success: function (data) {
            // To get the dropdown of terminals specific to the table edit rows
            var l = 0;
            $.each(data.TERMINALS, function (index, valTerminal) {
                if ((terminalSelectedValue) == (valTerminal.TERMINAL_NM)) {
                    tbl_row.closest('tr').find('.terminal_dropdown').append('<option value="' + valTerminal.TERMINAL_NM + '" selected="selected">' + valTerminal.TERMINAL_NM + '</option>');
                } else {
                    tbl_row.closest('tr').find('.terminal_dropdown').append('<option value="' + valTerminal.TERMINAL_NM + '">' + valTerminal.TERMINAL_NM + '</option>');
                }
                l++;
            });


            // To get the dropdown of customer specific to the table edit rows
            var k = 0;
            
            $.each(data.CUSTOMERS, function (index, valCustomer) {
                if ((customerSelectedValue) == (valCustomer.CUSTOMER_NM)) {
                    tbl_row.closest('tr').find('.customer_dropdown').append('<option value="' + valCustomer.CUSTOMER_NM + '" selected="selected">' + valCustomer.CUSTOMER_NM + '</option>');
                } else {
                    tbl_row.closest('tr').find('.customer_dropdown').append('<option value="' + valCustomer.CUSTOMER_NM + '">' + valCustomer.CUSTOMER_NM + '</option>');
                }
                k++;
            });

            // $('.terminal_dropdown').val( $( '.terminal_dropdown option:contains("' + preSelectedValue + '")' ).prop('selected', true) );
        }
    });
}

//without action of create closing the row > start
$('body').on('click', '.btn_close,newRowClose', function () {
    $(".newRow").animate({
        opacity: 0.25,
        left: "+=50",
        height: "toggle"
    }, 1000, function () {
        $(".newRow").slideUp("normal", function () {
            $(this).remove();
        });
    });
});
  //without action of create closing the row > end