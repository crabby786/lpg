/*!
 * FullCalendar v1.0.1
 * Docs & License: Aramco
 * (c) 2023 Aramco Author : Rajnikanth BS
 */

//ajax request for table data > start
//returns success and failure messages
var url = 'https://sasserver.demo.sas.com';
function getSelectOptionResults(url) {
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
    }
  });
}

function insertData() {
  //ajax request to create new entry or a row insert > start
  $('body').on('click', '.addRow_btn_save', function () {
    var form_array = {};
    form_array['TERMINAL_ID'] = $('#terminalIdNewRow').val();
    form_array['CUSTOMER_ID'] = $('#customerIdNewRow').val();
    form_array['Date'] = parseInt($('#date').val());
    form_array['PROPANE_KMT'] = parseInt($('#propane_kmt').val());
    form_array['BUTANE_KMT'] = parseInt($('#butane_kmt').val());

    csrfToken = '';
    const so = async () => {
      const csrfURL = `${url}/SASJobExecution/csrf`
      const csrfParameters = { method: "GET", credentials: "include" }
      const csrfRequest = await fetch(csrfURL, csrfParameters)
      const csrfToken = await csrfRequest.headers.get("X-CSRF-TOKEN")

      // var data = JSON.stringify([{ "id": "id" + 1, "name": "ARAMCO", "lastname": "YNB" }]);

      $.ajax({
        type: "POST",
        url: "https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FMonthly%20Customer%20Nom_INSERT%207sas",
        dataType: "json",
        // data: data,
        credentials: "include",
        contentType: "application/json",
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-CSRF-Token', csrfToken);
          xhr.setRequestHeader('X-CSRF-Header', 'X-CSRF-Token');
          $('.overlay').show();
        },

        data: JSON.stringify(form_array),
        success: function (data, status, xhr) {
          $("#myToast").toast("show");
          $(".toast-header").addClass("bg-success text-white");
          $(".toast-body").addClass("bg-white");
          $(".me-auto").html("Success");
          $(".toast-header > strong").html(data.user);
          $(".toast-body ").html(data.Message);
          $(".newRow").animate({
            opacity: 0.25,
            left: "+=50",
            height: "toggle"
          }, 1000, function () {
            $(".newRow").slideUp("normal", function () {
              $(this).remove();
            });
          });
          readDataMonthlyPlan();
          $('.overlay').hide();
        },
        error: function (data) {
          $("#myToast").toast("show");
          $(".toast-header").addClass("bg-danger text-white");
          $(".toast-body").addClass("bg-white");
          $(".me-auto").html("Warning");
          $(".toast-header > strong").html(data.user);
          $(".toast-body ").html(data.Message);
        }
      });

    };
    so().then(af => csrfToken);

  });
}

function deleteRowData() {
  //--->Delete row by tmp_num_data > Start :
  $("body").on('click', '.btn_delete', function (e) {
    e.preventDefault();
    var tbl_row = $(this).closest('tr');
    var id = tbl_row.find('.tmp_num_key').html();
    $('#myModal').data('row_id', id).modal('show');
  });
  //on click of confirm popup delete the row
  $('#btnDeleteYes').click(function () {
    var id = $('#myModal').data('row_id');
    $('[row_id=' + id + ']').remove();
    var form_array = {};
    form_array['TEMP_NOMINATION_KEY'] = id;
    var newUrl = "https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FMonthly%20Customer%20Nom_delete";
    csrfToken = '';
    const so = async () => {
      const csrfURL = `${url}/SASJobExecution/csrf`
      const csrfParameters = { method: "GET", credentials: "include" }
      const csrfRequest = await fetch(csrfURL, csrfParameters)
      const csrfToken = await csrfRequest.headers.get("X-CSRF-TOKEN")

      $.ajax({
        type: "POST",
        url: newUrl,
        dataType: "json",
        // data: data,
        credentials: "include",
        contentType: "application/json",
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-CSRF-Token', csrfToken);
          xhr.setRequestHeader('X-CSRF-Header', 'X-CSRF-Token');
          $('.overlay').show();
        },
        data: JSON.stringify(form_array),
        success: function (data, status, xhr) {
          $("#myToast").toast("show");
          $(".toast-header").addClass("bg-success text-white");
          $(".toast-body").addClass("bg-white");
          $(".me-auto").html("Success");
          $(".toast-header > strong").html(data.user);
          $(".toast-body ").html(data.Message);

          readDataMonthlyPlan();
          $('#myModal').modal('hide');
        },
        error: function (data) {
          $("#myToast").toast("show");
          $(".toast-header").addClass("bg-danger text-white");
          $(".toast-body").addClass("bg-white");
          $(".me-auto").html("Warning");
          $(".toast-header > strong").html(data.user);
          $(".toast-body ").html(data.Message);
        }
      });

    };
    so().then(af => csrfToken);

  });
  //on click no release popup
  $('#btnDeleteNo,.close').click(function () {
    $('#myModal').modal('hide');
  });
  //--->Delete row by row id > End
}

function updateData() {
  //ajax request to create new entry or a row insert > start
  $('body').on('click', '.btn_save', function () {
    var form_array = {};
    var newUrl = "https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FMonthly%20Customer%20Nom_update";
    var tbl_row = $(this).closest('tr');
    var date = tbl_row.find('.date').html();
    var tmp_num_key = tbl_row.find('.tmp_num_key').html();
    var propane_kmt = tbl_row.find('.propane_kmt ').html();
    var butane_kmt = tbl_row.find('.butane_kmt').html();

    form_array['TERMINAL_ID'] = tbl_row.find('.terminal_dropdown').val();
    form_array['CUSTOMER_ID'] = tbl_row.find('.customer_dropdown').val();
    form_array['Date'] = parseInt(date);
    form_array['TEMP_NOMINATION_KEY'] = parseInt(tmp_num_key);
    form_array['PROPANE_KMT'] = parseInt(propane_kmt);
    form_array['BUTANE_KMT'] = parseInt(butane_kmt);

    csrfToken = '';
    const so = async () => {
      const csrfURL = `${url}/SASJobExecution/csrf`
      const csrfParameters = { method: "GET", credentials: "include" }
      const csrfRequest = await fetch(csrfURL, csrfParameters)
      const csrfToken = await csrfRequest.headers.get("X-CSRF-TOKEN")

      // var data = JSON.stringify([{ "id": "id" + 1, "name": "ARAMCO", "lastname": "YNB" }]);
      $.ajax({
        type: "POST",
        url: newUrl,
        dataType: "json",
        // data: data,
        credentials: "include",
        contentType: "application/json",
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-CSRF-Token', csrfToken);
          xhr.setRequestHeader('X-CSRF-Header', 'X-CSRF-Token');
          $('.overlay').show();
        },

        data: JSON.stringify(form_array),
        success: function (data, status, xhr) {
          $("#myToast").toast("show");
          $(".toast-header").addClass("bg-success text-white");
          $(".toast-body").addClass("bg-white");
          $(".me-auto").html("Success");
          $(".toast-header > strong").html(data.user);
          $(".toast-body ").html(data.Message);
          $(".newRow").animate({
            opacity: 0.25,
            left: "+=50",
            height: "toggle"
          }, 1000, function () {
            $(".newRow").slideUp("normal", function () {
              $(this).remove();
            });
          });
          readDataMonthlyPlan();

          $('.overlay').hide();
        },
        error: function (data) {
          //--->add the original entry > start
          tbl_row.find('.row_data').each(function (index, val) {
            //this will help in case user decided to click on cancel button
            $(this).attr('original_entry', $(this).html());
          });
          tbl_row.find('.row_data').attr('contenteditable', 'false');
          //--->add the original entry > end

          $("#myToast").toast("show");
          $(".toast-header").addClass("bg-danger text-white");
          $(".toast-body").addClass("bg-white");
          $(".me-auto").html("Warning");
          $(".toast-header > strong").html(data.user);
          $(".toast-body ").html(data.Message);


        }
      });

    };
    so().then(af => csrfToken);

  });
}

// ajax function to get all the data for monthly nominations > start
function readDataMonthlyPlan() {
  //ajax row data generating the random id
  var random_id = function () {
    var id_num = Math.random().toString(9).substr(2, 3);
    var id_str = Math.random().toString(36).substr(2);

    return id_num + id_str;
  }

  var temp_key = function () {
    var newId = Math.floor(1000 + Math.random() * 9000);
    return newId;
  }

  //ajax request for table data > start
  var newUrl = 'https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FMonthly%20Customer%20Nom_Read_7&myjson=%7B"id":"1"%7D';
  $.ajax({
    url: newUrl,
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
      $('.overlay').show();
    },

    // data : {},
    success: function (data) {
      $('.overlay').hide();
      //--->create data table > start
      var tbl = '';
      tbl += '<table id="monthlyPlan" class="table table-sm table-striped table-hover text-center table-bordered" cellspacing="0" width="100%">'
      //--->create table header > start
      tbl += '<thead style="background-color: #00A3E0!important;font-family: Segoe UI; color:white; text-decoration:none;">';
      tbl += '<tr>';
      tbl += '<td>Terminal</td>';
      tbl += '<td>Customer</td>';
      tbl += '<td>Date</td>';
      tbl += '<td>Temp Num Key</td>';
      tbl += '<td>Propane KMT</td>';
      tbl += '<td>Butane KMT</td>';
      tbl += '<td>Propane BBL</td>';
      tbl += '<td>Butane BBL</td>';
      tbl += '<td>Edit</td>';
      tbl += '</tr>';
      tbl += '</thead>';
      //--->create table header > end
      //--->create table body > start
      tbl += '<tbody>';
      //--->create table body rows > start
      var i = 0;
      $.each(data, function (index, val) {
        //you can replace with your database row id
        var row_id = random_id();
        var random = temp_key();
        //loop through ajax row data
        tbl += '<tr row_id="' + row_id + '">';
        tbl += '<td><div class="row_data" col_name="terminal"><select id="terminalId' + i + '" class="form-select-sm terminal_dropdown" name="terminal"><option value="">--Select--</option></select><div class="defaultValueTerminal">' + val['TERMINAL_ID'] + '</div></div></td>';
        tbl += '<td><div class="row_data" col_name="customer"><select id="customerId' + i + '" class="form-select-sm customer_dropdown" name="customer"><option value="">--Select--</option></select><div class="defaultValueCustomer">' + val['CUSTOMER_ID'] + '</div></div></td>';
        tbl += '<td><div class="row_data date" edit_type="click" col_name="date">' + val['Date'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="tmp_num_key" edit_type="click" col_name="temp_num_key">' + val['TEMP_NOMINATION_KEY'] + '</div></td>';
        tbl += '<td><div class="row_data propane_kmt" id="propane_kmt' + i + '" edit_type="click" col_name="propane_kmt">' + val['PROPANE_KMT'] + '</div></td>';
        tbl += '<td><div class="row_data butane_kmt" id="butane_kmt' + i + '" edit_type="click" col_name="butane_kmt">' + val['BUTANE_KMT'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="result_propane_bbl" id="result_propane_bbl' + row_id + '"  col_name="result_propane_bbl">' + parseFloat(val['PROPANE_KMT']) * 12.446 * 1000 + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="result_butane_bbl" id="result_butane_bbl' + row_id + '"  col_name="result_butane_bbl">' + parseFloat(val['BUTANE_KMT']) * 12.446 * 1000 + '</div></td>';

        //--->edit options > start
        tbl += '<td>';
        tbl += '<div class="d-flex justify-content-start"> <span class="btn_edit" > <a href="#" class="btn btn-link" row_id="' + row_id + '" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg></a> </span>';
        //only show this button if edit button is clicked
        tbl += '<span class="btn_save"> <a href="#" title="Save" class="btn btn-link update_row"  row_id="' + row_id + '"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save" viewBox="0 0 16 16"><path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/></svg></a>  </span>';
        tbl += '<span class="btn_cancel"> <a href="#" title="Reset" class="btn btn-link" row_id="' + row_id + '"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg> </a>  </span>';
        tbl += '<span class="btn_delete"> <a href="#" title="Delete" class="btn btn-link" row_id="' + row_id + '"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></span>';
        tbl += '</div></td>';
        //--->edit options > end
        tbl += '</tr>';


        i++;
      })
      //--->create table body rows > end
      tbl += '</tbody>';
      //--->create table body > end

      tbl += '</table>'
      //--->create data table > end

      //while editing the data find the default option value is selected  > End
      //out put table data
      //button to hide and show bassed on edit and display buttons
      $(document).find('.tbl_user_data').html(tbl);
      $(document).find('.btn_save').hide();
      $(document).find('.btn_cancel').hide();
      $(document).find('.terminal_dropdown').hide();
      $(document).find('.customer_dropdown').hide();
    },
    error: function () {
      console.log("Error side 1");
    }
  });
}

function addRow() {
  // on click of button add append new form row to the table > start
  $('body').on('click', '#addRow', function () {
    // if condition is to validate if the field is empty
    //User can't able to add new row until first is saved
    if ($('#terminal').val() === '' || $('#customer').val() === '' || $('#date').val() === '' || $('#propane_kmt').val() === '' || $('#butane_kmt').val() === '') {
      return false;
    }
    // append new form row to the table 
    $('#monthlyPlan tr:first').after('<tr class="newRow">'
      + '<td><select id="terminalIdNewRow" class="form-select terminal_dropdown form-select-xs-2" name="terminal"><option value="">Select</option></select></td>'
      + '<td><select id="customerIdNewRow" class="form-select customer_dropdown form-select-sm" name="customer"><option value="">--Select--</option></select></td>'
      + '<td><input type="number" id="date" class="form-control form-control-sm" name="date"></td>'
      + '<td><input type="number" class="form-control form-control-sm" disabled id="temp_num_key" name="temp_num_key"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="propane_kmt" name="propane_kmt"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="butane_kmt" name="butane_kmt"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="propane_bbl" disabled name="propane_bbl"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="butane_bbl" disabled name="butane_bbl"></td>'
      + '<td class="d-flex justify-content-start">'
      + '<span class="addRow_btn_save"><a href="#" title="Save" class="btn btn-link"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save" viewBox="0 0 16 16"><path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/></svg></a></span>'
      + '<span class="btn_close"><a href="#" title="Close" class="btn btn-link "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path></svg></a></span>'
      + '</td></tr></div>'
    );
    getSelectOptionResults();
  });
  // on click of button add append new form row to the table > end
}
//close the added row

function editRow() {
  //--->button > edit > start	
  $(document).on('click', '.btn_edit', function (event) {
    event.preventDefault();
    var customerSelectedValue = $(this).closest('tr').find('div.defaultValueCustomer').text();
    var terminalSelectedValue = $(this).closest('tr').find('div.defaultValueTerminal').text();

    var tbl_row = $(this).closest('tr');
    var row_id = tbl_row.attr('row_id');
    tbl_row.find('.btn_save').show();
    tbl_row.find('.btn_cancel').show();
    tbl_row.find('.terminal_dropdown').show();

    tbl_row.find('.customer_dropdown').val();
    tbl_row.find('.customer_dropdown').show();
    tbl_row.find('.defaultValueTerminal').hide();
    tbl_row.find('.defaultValueCustomer').hide();
    //hide edit button
    tbl_row.find('.btn_edit').hide();
    tbl_row.find('.btn_delete').hide();

    getOptionSelected(customerSelectedValue, terminalSelectedValue, tbl_row);

    //make the whole row editable

    tbl_row.find('.row_data')
      .attr('contenteditable', 'true')
      .attr('edit_type', 'button')
      .addClass('form-input input-sm rounded-0 bg-info')
      .css('padding', '3px')
    //--->add the original entry > start
    tbl_row.find('.row_data').each(function (index, val) {

      //this will help in case user decided to click on cancel button
      $(this).attr('original_entry', $(this).html());
    });
    //--->add the original entry > end
  });
  //--->button > edit > end
}

//--->button > cancel > start	
$(document).on('click', '.btn_cancel', function (event) {
  event.preventDefault();
  var tbl_row = $(this).closest('tr');
  var row_id = tbl_row.attr('row_id');
  //--->add the original entry > start
  tbl_row.find('.row_data').each(function (index, val) {
    //this will help in case user decided to click on cancel button
    $(this).attr('original_entry', $(this).html());
  });
  //--->add the original entry > end
  //hide save and cacel buttons
  tbl_row.find('.btn_save').hide();
  tbl_row.find('.btn_cancel').hide();
  tbl_row.find('.terminal_dropdown').hide();
  tbl_row.find('.customer_dropdown').hide();
  tbl_row.find('.defaultValueTerminal').show();
  tbl_row.find('.defaultValueCustomer').show();

  //show edit button
  tbl_row.find('.btn_edit').show();
  tbl_row.find('.btn_delete').show();

  //make the whole row editable
  tbl_row.find('.row_data')
    .attr('edit_type', 'click')
    .removeClass('form-input input-sm rounded-0 bg-info')
    .css('padding', '')

  tbl_row.find('.row_data').each(function (index, val) {
    $(this).html($(this).attr('original_entry'));
  });
});