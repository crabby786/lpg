/*!
 * FullCalendar v1.0.1
 * Docs & License: Aramco
 * (c) 2023 Aramco Author : Rajnikanth BS
 */
var url = 'https://sasserver.demo.sas.com';
function addRow() {
  $('body').on('click', '#addRow', function () {
    // if condition is to validate if the field is empty
    //User can't able to add new row until first is saved
    // if ($('#terminal').val() === '' || $('#customer').val() === '' || $('#date').val() === '' || $('#temp_num_key').val() === '' || $('#propane_bbl').val() === '' || $('#butane_bbl').val() === '' || $('#propane_kmt').val() === '' || $('#butane_kmt').val() === '') {
    //     return false;
    // }
    // add new row to the table with input
    $('#annualPlan thead').after('<tr class="newRow">'
      + '<td><select id="terminalIdNewRow" class="form-select terminal_dropdown form-select-sm" name="terminal"><option value="">--Select--</option></select></td>'
      + '<td><select id="customerIdNewRow" class="form-select customer_dropdown form-select-sm" name="customer"><option value="">--Select--</option></select></td>'
      + '<td><input type="number" id="coLoadId" disabled class="form-control form-control-sm" name="coload"></td>'
      + '<td><input type="number" id="preferenceRank" disabled class="form-control form-control-sm" name="preferenceRank"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="jan_propane" name="jan_propane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="jan_butane"  name="jan_butane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="feb_propane" name="feb_propane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="feb_butane"  name="feb_butane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="mar_propane" name="mar_propane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="mar_butane"  name="mar_butane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="apr_propane" name="apr_propane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="apr_butane"  name="apr_butane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="may_propane" name="may_propane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="may_butane"  name="may_butane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="jun_propane" name="jun_propane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="jun_butane"  name="jun_butane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="jul_propane" name="jul_propane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="jul_butane"  name="jul_butane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="aug_propane" name="aug_propane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="aug_butane"  name="aug_butane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="sep_propane" name="sep_propane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="sep_butane"  name="sep_butane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="oct_propane" name="oct_propane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="oct_butane"  name="oct_butane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="nov_propane" name="nov_propane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="nov_butane"  name="nov_butane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="dec_propane" name="dec_propane"></td>'
      + '<td><input type="number" class="form-control form-control-sm" id="dec_butane"  name="dec_butane"></td>'
      + '<td>&nbsp;</td>'
      + '<td>&nbsp;</td>'
      + '<td>&nbsp;</td>'
      + '<td><svg id="save" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save" viewBox="0 0 16 16"><path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/></svg></a> </span> &nbsp; <a href="#" title="close" class="newRowClose">'
      + '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-x" viewBox="0 0 18 18"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></a>'
      + '</td></tr>');
    //append all the terminals to the dropdown
    //to the new row where user will input new data 
    getSelectOptionResults(url);
  });
}

//ajax request for table data > start
//returns success and failure messages

function insertData(newUrl) {
  //ajax request to create new entry or a row insert > start
  $('body').on('click', '.addRow_btn_save', function () {
    var form_array = {};
    form_array['TERMINAL_ID'] = $("#terminalIdNewRow").val();
    form_array['CUSTOMER_ID'] = $("#customerIdNewRow").val();
   
    form_array['PROPANE_JAN'] = parseInt($('#jan_propane').val());
    form_array['BUTANE_JAN'] = parseInt($('#jan_butane').val());
    form_array['PROPANE_FEB'] = parseInt($('#feb_propane').val());
    form_array['BUTANE_FEB'] = parseInt($('#feb_butane').val());
    form_array['PROPANE_MAR'] = parseInt($('#mar_propane').val());
    form_array['BUTANE_MAR'] = parseInt($('#mar_butane').val());
    form_array['PROPANE_APR'] = parseInt($('#apr_propane').val());
    form_array['BUTANE_APR'] = parseInt($('#apr_butane').val());
    form_array['PROPANE_MAY'] = parseInt($('#may_propane').val());
    form_array['BUTANE_MAY'] = parseInt($('#may_butane').val());
    form_array['PROPANE_JUN'] = parseInt($('#jun_propane').val());
    form_array['BUTANE_JUN'] = parseInt($('#jun_butane').val());
    
    form_array['PROPANE_JUL'] = parseInt($('#jul_propane').val());
    form_array['BUTANE_JUL'] = parseInt($('#jul_butane').val());
    form_array['PROPANE_AUG'] = parseInt($('#aug_propane').val());
    form_array['BUTANE_AUG'] = parseInt($('#aug_butane').val());
    form_array['PROPANE_SEP'] = parseInt($('#sep_propane').val());
    form_array['BUTANE_SEP'] = parseInt($('#sep_butane').val());
    form_array['PROPANE_OCT'] = parseInt($('#oct_propane').val());
    form_array['BUTANE_OCT'] = parseInt($('#oct_butane').val());
    form_array['PROPANE_NOV'] = parseInt($('#nov_propane').val());
    form_array['BUTANE_NOV'] = parseInt($('#nov_butane').val());
    form_array['PROPANE_DEC'] = parseInt($('#dec_propane').val());
    form_array['BUTANE_DEC'] = parseInt($('#dec_butane').val());

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
          readDataAnnualPlan();
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
    var id = tbl_row.find('.btn_delete > btn-link');
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

          readDataAnnualPlan();
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

function updateData() {
  //ajax request to create new entry or a row insert > start
  $(document).on('click', '.btn_save', function (event) {
    var tbl_row = $(this).closest('tr');
    var row_id = tbl_row.attr('row_id');
  
    var form_array = {};
    var newUrl = "https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FMonthly%20Customer%20Nom_update";
    var tbl_row = $(this).closest('tr');
    
    
    var jan_propane = tbl_row.find('.jan_propane').html();
    var jan_butane =  tbl_row.find('.jan_butane').html();
    var feb_propane = tbl_row.find('.feb_propane').html();
    var feb_butane = tbl_row.find('.feb_butane').html();
    var mar_propane = tbl_row.find('.mar_propane').html();
    var mar_butane = tbl_row.find('.mar_butane').html();
    var apr_propane = tbl_row.find('.apr_propane').html();
    var apr_butane = tbl_row.find('.apr_butane').html();
    var may_propane = tbl_row.find('.may_propane').html();
    var may_butane = tbl_row.find('.may_butane').html();
    var jun_propane = tbl_row.find('.jun_propane').html();
    var jun_butane = tbl_row.find('.jun_butane').html();
    var jul_propane = tbl_row.find('.jul_propane').html();
    var jul_butane = tbl_row.find('.jul_butane').html();
    var aug_propane = tbl_row.find('.aug_propane ').html();
    var aug_butane = tbl_row.find('.aug_butane ').html();
    var sep_propane = tbl_row.find('.sep_propane ').html();
    var sep_butane = tbl_row.find('.sep_butane ').html();
    var oct_propane = tbl_row.find('.oct_propane ').html();
    var oct_butane = tbl_row.find('.oct_butane ').html();
    var nov_propane = tbl_row.find('.nov_propane ').html();
    var nov_butane = tbl_row.find('.nov_butane ').html();
    var dec_propane = tbl_row.find('.dec_propane ').html();
    var dec_butane = tbl_row.find('.dec_butane ').html();

    form_array['TERMINAL_ID'] = tbl_row.find('.terminal_dropdown').val();
    form_array['CUSTOMER_ID'] = tbl_row.find('.customer_dropdown').val();
    form_array['TERMINAL_ID'] = tbl_row.find('.terminal_dropdown').val();
    form_array['CUSTOMER_ID'] = tbl_row.find('.customer_dropdown').val();
    form_array['PROPANE_JAN'] = parseInt(jan_propane);
    form_array['BUTANE_JAN'] = parseInt(jan_butane);
    form_array['PROPANE_FEB'] = parseInt(feb_propane);
    form_array['BUTANE_FEB'] = parseInt(feb_butane);
    form_array['PROPANE_MAR'] = parseInt(mar_propane);
    form_array['BUTANE_MAR'] = parseInt(mar_butane);
    form_array['PROPANE_APR'] = parseInt(apr_propane);
    form_array['BUTANE_APR'] = parseInt(apr_butane);
    form_array['PROPANE_MAY'] = parseInt(may_propane);
    form_array['BUTANE_MAY'] = parseInt(may_butane);
    form_array['PROPANE_JUN'] = parseInt(jun_propane);
    form_array['BUTANE_JUN'] = parseInt(jun_butane);
    
    form_array['PROPANE_JUL'] = parseInt(jul_propane);
    form_array['BUTANE_JUL'] = parseInt(jul_butane);
    form_array['PROPANE_AUG'] = parseInt(aug_propane);
    form_array['BUTANE_AUG'] = parseInt(aug_butane);
    form_array['PROPANE_SEP'] = parseInt(sep_propane);
    form_array['BUTANE_SEP'] = parseInt(sep_butane);
    form_array['PROPANE_OCT'] = parseInt(oct_propane);
    form_array['BUTANE_OCT'] = parseInt(oct_butane);
    form_array['PROPANE_NOV'] = parseInt(nov_propane);
    form_array['BUTANE_NOV'] = parseInt(nov_butane);
    form_array['PROPANE_DEC'] = parseInt(dec_propane);
    form_array['BUTANE_DEC'] = parseInt(dec_butane);
   

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
          readDataAnnualPlan();

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
  //--->save whole row entry > end
}

// ajax function to get all the data for monthly nominations > start
function readDataAnnualPlan() {
  //ajax row data generating the random id
  var newUrl = 'https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FExport%20Cust%20Annual%20Plan_Read_6_1&myjson=%7B"id":"1"%7D';
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
      var random_id = function () {
        var id_num = Math.random().toString(9).substr(2, 3);
        var id_str = Math.random().toString(36).substr(2);
        return id_num + id_str;
      }

      //--->create data table > start
      var tbl = '';
      tbl += '<table  id="annualPlan" class="table table-striped table-hover text-center" cellspacing="0" width="100%">'
      //--->create table header > start
      tbl += '<thead style="background-color: #00A3E0!important;font-family: Segoe UI; color:white; text-decoration:none;">';
      tbl += '<tr>';
      tbl += '<th colspan="1" rowspan="2">Terminal</th>';
      tbl += '<th colspan="1" rowspan="2">Customer</th>';
      tbl += '<th colspan="1" rowspan="2">Co-Load Grouping</th>';
      tbl += '<th colspan="1" rowspan="2">Preference Rank</th>';
      tbl += '<th colspan="2" rowspan="1">Jan</th>';
      tbl += '<th colspan="2" rowspan="1">Feb</th>';
      tbl += '<th colspan="2" rowspan="1">Mar</th>';
      tbl += '<th colspan="2" rowspan="1">Apr</th>';
      tbl += '<th colspan="2" rowspan="1">May</th>';
      tbl += '<th colspan="2" rowspan="1">Jun</th>';
      tbl += '<th colspan="2" rowspan="1">Jul</th>';
      tbl += '<th colspan="2" rowspan="1">Aug</th>';
      tbl += '<th colspan="2" rowspan="1">Sep</th>';
      tbl += '<th colspan="2" rowspan="1">Oct</th>';
      tbl += '<th colspan="2" rowspan="1">Nov</th>';
      tbl += '<th colspan="2" rowspan="1">Dec</th>';
      tbl += '<th colspan="3" rowspan="1">Customer Nominations <br>(KMT)</th>';
      tbl += '<th></th>';
      tbl += '</tr>';
      tbl += '<tr>';
      tbl += '<th>Propane</th>';
      tbl += '<th>Butane</th>';
      tbl += '<th>Propane</th>';
      tbl += '<th>Butane</th>';
      tbl += '<th>Propane</th>';
      tbl += '<th>Butane</th>';
      tbl += '<th>Propane</th>';
      tbl += '<th>Butane</th>';
      tbl += '<th>Propane</th>';
      tbl += '<th>Butane</th>';
      tbl += '<th>Propane</th>';
      tbl += '<th>Butane</th>';
      tbl += '<th>Propane</th>';
      tbl += '<th>Butane</th>';
      tbl += '<th>Propane</th>';
      tbl += '<th>Butane</th>';
      tbl += '<th>Propane</th>';
      tbl += '<th>Butane</th>';
      tbl += '<th>Propane</th>';
      tbl += '<th>Butane</th>';
      tbl += '<th>Propane</th>';
      tbl += '<th>Butane</th>';
      tbl += '<th>Propane</th>';
      tbl += '<th>Butane</th>';
      tbl += '<th>Propane</th>';
      tbl += '<th>Butane</th>';
      tbl += '<th>Total</th>';
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
        //loop through ajax row data
        tbl += '<tr row_id="' + row_id + '">';
        tbl += '<td><div><select id="terminalId' + i + '" class="form-select terminal_dropdown form-select-sm" name="terminal"><option value="">--Select--</option></select><div class="defaultValueTerminal">' + val['TERMINAL_NM'] + '</div></div></td>';
        tbl += '<td><div><select id="customerId' + i + '" class="form-select customer_dropdown form-select-sm" name="customer"><option value="">--Select--</option></select><div class="defaultValueCustomer">' + val['CUSTOMER_NM'] + '</div></div></td>';
        tbl += '<td><div class="coload">' + val['COLOAD_GROUP'] + '</div></td>';
        tbl += '<td><div class="prank">' + val['PREFERENCE_RANK'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data jan_propane" id="dynamic' + i + '" edit_type="click" col_name="jan_propane">' + val['PROPANE_JAN'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data jan_butane" id="dynamic' + i + '" edit_type="click" col_name="jan_butane">' + val['BUTANE_JAN'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data feb_propane" id="dynamic' + i + '" edit_type="click" col_name="feb_propane">' + val['PROPANE_FEB'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data feb_butane" id="dynamic' + i + '" edit_type="click" col_name="feb_butane">' + val['BUTANE_FEB'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data mar_propane" id="dynamic' + i + '" edit_type="click" col_name="mar_propane">' + val['PROPANE_MAR'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data mar_butane" id="dynamic' + i + '" edit_type="click" col_name="mar_butane">' + val['BUTANE_MAR'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data apr_propane" id="dynamic' + i + '" edit_type="click" col_name="apr_propane">' + val['PROPANE_APR'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data apr_butane" id="dynamic' + i + '" edit_type="click" col_name="apr_butane">' + val['BUTANE_APR'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data may_propane" id="dynamic' + i + '" edit_type="click" col_name="may_propane">' + val['PROPANE_MAY'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data may_butane" id="dynamic' + i + '" edit_type="click" col_name="may_butane">' + val['BUTANE_MAY'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data jun_propane" id="dynamic' + i + '" edit_type="click" col_name="jun_propane">' + val['PROPANE_JUN'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data jun_butane" id="dynamic' + i + '" edit_type="click" col_name="jun_butane">' + val['BUTANE_JUN'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data jul_propane" id="dynamic' + i + '" edit_type="click" col_name="jul_propane">' + val['PROPANE_JUL'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data jul_butane" id="dynamic' + i + '" edit_type="click" col_name="jul_butane">' + val['BUTANE_JUL'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data aug_propane" id="dynamic' + i + '" edit_type="click" col_name="aug_propane">' + val['PROPANE_AUG'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data aug_butane" id="dynamic' + i + '" edit_type="click" col_name="aug_butane">' + val['BUTANE_AUG'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data sep_propane" id="dynamic' + i + '" edit_type="click" col_name="sep_propane">' + val['PROPANE_SEP'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data sep_butane" id="dynamic' + i + '" edit_type="click" col_name="sep_butane">' + val['BUTANE_SEP'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data oct_propane" id="dynamic' + i + '" edit_type="click" col_name="oct_propane">' + val['PROPANE_OCT'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data oct_butane" id="dynamic' + i + '" edit_type="click" col_name="oct_butane">' + val['BUTANE_OCT'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data nov_propane" id="dynamic' + i + '" edit_type="click" col_name="nov_propane">' + val['PROPANE_NOV'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data nov_butane" id="dynamic' + i + '" edit_type="click" col_name="nov_butane">' + val['BUTANE_NOV'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data dec_propane" id="dynamic' + i + '" edit_type="click" col_name="dec_propane">' + val['PROPANE_DEC'] + '</div></td>';
        tbl += '<td style="background-color: #ECECEC;"><div class="row_data dec_butane" id="dynamic' + i + '" edit_type="click" col_name="dec_butane">' + val['BUTANE_DEC'] + '</div></td>';
        tbl += '<td><div id = "kmtPropane' + i + '"></div></td>';
        tbl += '<td><div id = "kmtButane' + i + '"></div></td>';
        tbl += '<td><div id = "totalKmt' + i + '"></div></td>';
        //--->edit options > start
        tbl += '<td>';
        tbl += '<div class="d-flex justify-content-start"><span class="btn_edit" > <a href="#" class="btn btn-link" row_id="' + row_id + '" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg></a> </span>';
        //only show this button if edit button is clicked
        tbl += '<span class="btn_save"> <a href="#" title="Save" class="btn btn-link"  row_id="' + row_id + '"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save" viewBox="0 0 16 16"><path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/></svg></a>  </span>';
        tbl += '<span class="btn_cancel"> <a href="#" title="Reset" class="btn btn-link" row_id="' + row_id + '"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg> </a>  </span>';
        tbl += '<span class="btn_delete"> <a href="#" title="Delete" class="btn btn-link" row_id="' + i + '"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></span>';
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

      //out put table data
      //button to hide and show bassed on edit and display buttons
      $(document).find('.tbl_user_data').html(tbl);
      $(document).find('.btn_save').hide();
      $(document).find('.btn_cancel').hide();
      $(document).find('.terminal_dropdown').hide();
      $(document).find('.customer_dropdown').hide();

      //while editing the data find the default option value is selected      
      var j = 0;
      $.each(data, function (index, appendData) {
        var terminal_value = appendData['terminal'];
        var customer = appendData['customer'];
        // $('.terminal_dropdown').val( $( '.terminal_dropdown option:contains("' + terminal_value + '")' ).val() );
        $("#terminalId" + j).val(terminal_value);
        $("#customerId" + j).val(customer);
        j++;
      });
      //--->save single field data > end
      annualPlanClculate(data);

    },
    error: function () {
      console.log("Error side");
    }
  });

}

// function calculation of horizontal and vertical values for propane and butane
function annualPlanClculate(data) {
  // horizontal calculations > start
  $('#annualPlan tr:last').after('<tr><td colspan="4">RT Total</td> <td class="jan_rt_propane"></td> <td class="jan_rt_butane"></td> <td class="feb_rt_propane"> </td><td class="feb_rt_butane"></td> <td class="mar_rt_propane"></td> <td class="mar_rt_butane"></td> <td class="apr_rt_propane"></td> <td class="apr_rt_butane"></td> <td class="may_rt_propane"></td> <td class="may_rt_butane"></td> <td class="jun_rt_propane"></td> <td class="jun_rt_butane"></td> <td class="jul_rt_propane"></td> <td class="jul_rt_butane"></td> <td class="aug_rt_propane"></td> <td class="aug_rt_butane"></td> <td class="sep_rt_propane"></td> <td class="sep_rt_butane"></td> <td class="oct_rt_propane"></td> <td class="oct_rt_butane"></td> <td class="nov_rt_propane"></td> <td class="nov_rt_butane"></td> <td class="dec_rt_propane"></td> <td class="dec_rt_butane"></td> <td class="kmt_rt_propane"></td> <td class="kmt_rt_butane"></td>  <td class="grandTotalRt"></td></tr>');
  $('#annualPlan tr:last').after('<tr><td colspan="4">YNT Total</td><td class="jan_ynt_propane"></td><td class="jan_ynt_butane"></td><td class="feb_ynt_propane"></td><td class="feb_ynt_butane"></td><td class="mar_ynt_propane"></td><td class="mar_ynt_butane"></td><td class="apr_ynt_propane"></td><td class="apr_ynt_butane"></td><td class="may_ynt_propane"></td><td class="may_ynt_butane"></td><td class="jun_ynt_propane"></td><td class="jun_ynt_butane"></td><td class="jul_ynt_propane"></td><td class="jul_ynt_butane"></td><td class="aug_ynt_propane"></td><td class="aug_ynt_butane"></td><td class="sep_ynt_propane"></td><td class="sep_ynt_butane"></td><td class="oct_ynt_propane"></td><td class="oct_ynt_butane"></td><td class="nov_ynt_propane"></td><td class="nov_ynt_butane"></td><td class="dec_ynt_propane"></td><td class="dec_ynt_butane"></td><td class="kmt_ynt_propane"></td><td class="kmt_ynt_butane"></td> <td class="grandTotalYnt"></td></tr>');
  // horizontal calculations > end

  //----> On Load of page Calculating RT and YNT
  var rtVal = [];
  var yntVal = [];
  var janPropaneRT = janButaneRT = janPropaneYNT = janButaneYNT = 0;
  var febPropaneRT = febButaneRT = febPropaneYNT = febButaneYNT = 0;
  var marPropaneRT = marButaneRT = marPropaneYNT = marButaneYNT = 0;
  var aprPropaneRT = aprButaneRT = aprPropaneYNT = aprButaneYNT = 0;
  var mayPropaneRT = mayButaneRT = mayPropaneYNT = mayButaneYNT = 0;
  var junPropaneRT = junButaneRT = junPropaneYNT = junButaneYNT = 0;
  var julPropaneRT = julButaneRT = julPropaneYNT = julButaneYNT = 0;
  var augPropaneRT = augButaneRT = augPropaneYNT = augButaneYNT = 0;
  var sepPropaneRT = sepButaneRT = sepPropaneYNT = sepButaneYNT = 0;
  var octPropaneRT = octButaneRT = octPropaneYNT = octButaneYNT = 0;
  var novPropaneRT = novButaneRT = novPropaneYNT = novButaneYNT = 0;
  var decPropaneRT = decButaneRT = decPropaneYNT = decButaneYNT = 0;

  var subJanPropaneRt = subFebPropaneRt = subMarPropaneRt = subAprPropaneRt = subMayPropaneRt = subJunPropaneRt = subJulPropaneRt = subAugPropaneRt = subSepPropaneRt = subOctPropaneRt = subNovPropaneRt = subDecPropaneRt = 0;
  var subJanButaneRt = subFebButaneRt = subMarButaneRt = subAprButaneRt = subMayButaneRt = subJunButaneRt = subJulButaneRt = subAugButaneRt = subSepButaneRt = subOctButaneRt = subNovButaneRt = subDecButaneRt = 0;

  var subJanPropaneYnt = subFebPropaneYnt = subMarPropaneYnt = subAprPropaneYnt = subMayPropaneYnt = subJunPropaneYnt = subJulPropaneYnt = subAugPropaneYnt = subSepPropaneYnt = subOctPropaneYnt = subNovPropaneYnt = subDecPropaneYnt = 0;
  var subJanButaneYnt = subFebButaneYnt = subMarButaneYnt = subAprButaneYnt = subMayButaneYnt = subJunButaneYnt = subJulButaneYnt = subAugButaneYnt = subSepButaneYnt = subOctButaneYnt = subNovButaneYnt = subDecButaneYnt = 0;
  var horizontalIndex = 0;
  $.each(data, function (index, appendData) {
    if (appendData['TERMINAL_CD'] === "RTJM TERM") {

      janPropaneRT += parseFloat(appendData['PROPANE_JAN']);
      janButaneRT += parseFloat(appendData['BUTANE_JAN']);
      subJanPropaneRt = subJanPropaneRt = $('.jan_rt_propane').html(janPropaneRT);
      subJanButaneRt = $('.jan_rt_butane').html(janButaneRT);

      febPropaneRT += parseFloat(appendData['PROPANE_FEB']);
      febButaneRT += parseFloat(appendData['BUTANE_FEB']);
      subFebPropaneRt = $('.feb_rt_propane').html(febPropaneRT);
      subFebButaneRt = $('.feb_rt_butane').html(febButaneRT);

      marPropaneRT += parseFloat(appendData['PROPANE_MAR']);
      marButaneRT += parseFloat(appendData['BUTANE_MAR']);
      subMarPropaneRt = $('.mar_rt_propane').html(marPropaneRT);
      subMarButaneRt = $('.mar_rt_butane').html(marButaneRT);

      aprPropaneRT += parseFloat(appendData['PROPANE_APR']);
      aprButaneRT += parseFloat(appendData['BUTANE_APR']);
      $('.apr_rt_propane').html(aprPropaneRT);
      $('.apr_rt_butane').html(aprButaneRT);

      mayPropaneRT += parseFloat(appendData['PROPANE_MAY']);
      mayButaneRT += parseFloat(appendData['BUTANE_MAY']);
      $('.may_rt_propane').html(mayPropaneRT);
      $('.may_rt_butane').html(mayButaneRT);

      junPropaneRT += parseFloat(appendData['PROPANE_JUN']);
      junButaneRT += parseFloat(appendData['BUTANE_JUN']);
      $('.jun_rt_propane').html(junPropaneRT);
      $('.jun_rt_butane').html(junButaneRT);

      julPropaneRT += parseFloat(appendData['PROPANE_JUL']);
      julButaneRT += parseFloat(appendData['BUTANE_JUL']);
      $('.jul_rt_propane').html(julPropaneRT);
      $('.jul_rt_butane').html(julButaneRT);

      augPropaneRT += parseFloat(appendData['PROPANE_AUG']);
      augButaneRT += parseFloat(appendData['BUTANE_AUG']);
      $('.aug_rt_propane').html(augPropaneRT);
      $('.aug_rt_butane').html(augButaneRT);

      sepPropaneRT += parseFloat(appendData['PROPANE_SEP']);
      sepButaneRT += parseFloat(appendData['BUTANE_SEP']);
      $('.sep_rt_propane').html(sepPropaneRT);
      $('.sep_rt_butane').html(sepButaneRT);

      octPropaneRT += parseFloat(appendData['PROPANE_OCT']);
      octButaneRT += parseFloat(appendData['BUTANE_OCT']);
      $('.oct_rt_propane').html(octPropaneRT);
      $('.oct_rt_butane').html(octButaneRT);

      novPropaneRT += parseFloat(appendData['PROPANE_NOV']);
      novButaneRT += parseFloat(appendData['BUTANE_NOV']);
      $('.nov_rt_propane').html(novPropaneRT);
      $('.nov_rt_butane').html(novButaneRT);

      decPropaneRT += parseFloat(appendData['PROPANE_DEC']);
      decButaneRT += parseFloat(appendData['BUTANE_DEC']);
      $('.dec_rt_propane').html(decPropaneRT);
      $('.dec_rt_butane').html(decButaneRT);

      // horizontal calculations RT
      var kmtPropane = parseFloat(appendData['PROPANE_JAN']) + parseFloat(appendData['PROPANE_FEB']) + parseFloat(appendData['PROPANE_MAR']) + parseFloat(appendData['PROPANE_APR']) + parseFloat(appendData['PROPANE_MAY']) + parseFloat(appendData['PROPANE_JUN']) + parseFloat(appendData['PROPANE_JUL']) + parseFloat(appendData['PROPANE_AUG']) + parseFloat(appendData['PROPANE_SEP']) + parseFloat(appendData['PROPANE_OCT']) + parseFloat(appendData['PROPANE_NOV']) + parseFloat(appendData['PROPANE_DEC']);
      var kmtButane = parseFloat(appendData['BUTANE_JAN']) + parseFloat(appendData['BUTANE_FEB']) + parseFloat(appendData['BUTANE_MAR']) + parseFloat(appendData['BUTANE_APR']) + parseFloat(appendData['BUTANE_MAY']) + parseFloat(appendData['BUTANE_JUN']) + parseFloat(appendData['BUTANE_JUL']) + parseFloat(appendData['BUTANE_AUG']) + parseFloat(appendData['BUTANE_SEP']) + parseFloat(appendData['BUTANE_OCT']) + parseFloat(appendData['BUTANE_NOV']) + parseFloat(appendData['BUTANE_DEC']);
      $("#kmtPropane" + horizontalIndex).html(kmtPropane);
      $("#kmtButane" + horizontalIndex).html(kmtButane);
      var total = parseFloat($("#kmtPropane" + horizontalIndex).html()) + parseFloat($("#kmtButane" + horizontalIndex).html());
      $("#totalKmt" + horizontalIndex).html(total);

    } else if (appendData['TERMINAL_CD'] === "YNB TERM") {

      janPropaneYNT += parseFloat(appendData['PROPANE_JAN']);
      janButaneYNT += parseFloat(appendData['BUTANE_JAN']);
      var subJanPropaneYnt = $('.jan_ynt_propane').html(janPropaneYNT);
      var subJanButaneYnt = $('.jan_ynt_butane').html(janButaneYNT);

      febPropaneYNT += parseFloat(appendData['PROPANE_FEB']);
      febButaneYNT += parseFloat(appendData['BUTANE_FEB']);
      var subFebPropaneYnt = $('.feb_ynt_propane').html(febPropaneYNT);
      var subFebButaneYnt = $('.feb_ynt_butane').html(febButaneYNT);

      marPropaneYNT += parseFloat(appendData['PROPANE_MAR']);
      marButaneYNT += parseFloat(appendData['BUTANE_MAR']);
      var subMarPropaneYnt = $('.mar_ynt_propane').html(marPropaneYNT);
      var subMarButaneYnt = $('.mar_ynt_butane').html(marButaneYNT);

      aprPropaneYNT += parseFloat(appendData['PROPANE_APR']);
      aprButaneYNT += parseFloat(appendData['BUTANE_APR']);
      var subAprPropaneYnt = $('.apr_ynt_propane').html(aprPropaneYNT);
      var subAprButaneYnt = $('.apr_ynt_butane').html(aprButaneYNT);

      mayPropaneYNT += parseFloat(appendData['PROPANE_MAY']);
      mayButaneYNT += parseFloat(appendData['BUTANE_MAY']);
      var subMayPropaneYnt = $('.may_ynt_propane').html(mayPropaneYNT);
      var subMayButaneYnt = $('.may_ynt_butane').html(mayButaneYNT);

      junPropaneYNT += parseFloat(appendData['PROPANE_JUN']);
      junButaneYNT += parseFloat(appendData['BUTANE_JUN']);
      var subJunPropaneYnt = $('.jun_ynt_propane').html(junPropaneYNT);
      var subJunButaneYnt = $('.jun_ynt_butane').html(junButaneYNT);

      julPropaneYNT += parseFloat(appendData['PROPANE_JUL']);
      julButaneYNT += parseFloat(appendData['BUTANE_JUL']);
      var subJulPropaneYnt = $('.jul_ynt_propane').html(julPropaneYNT);
      var subJulButaneYnt = $('.jul_ynt_butane').html(julButaneYNT);

      augPropaneYNT += parseFloat(appendData['PROPANE_AUG']);
      augButaneYNT += parseFloat(appendData['BUTANE_AUG']);
      var subAugPropaneYnt = $('.aug_ynt_propane').html(augPropaneYNT);
      var subAugButaneYnt = $('.aug_ynt_butane').html(augButaneYNT);

      sepPropaneYNT += parseFloat(appendData['PROPANE_SEP']);
      sepButaneYNT += parseFloat(appendData['BUTANE_SEP']);
      var subSepPropaneYnt = $('.sep_ynt_propane').html(sepPropaneYNT);
      var subSepButaneYnt = $('.sep_ynt_butane').html(sepButaneYNT);

      octPropaneYNT += parseFloat(appendData['PROPANE_OCT']);
      octButaneYNT += parseFloat(appendData['BUTANE_OCT']);
      var subOctPropaneYnt = $('.oct_ynt_propane').html(octPropaneYNT);
      var subOctButaneYnt = $('.oct_ynt_butane').html(octButaneYNT);

      novPropaneYNT += parseFloat(appendData['PROPANE_NOV']);
      novButaneYNT += parseFloat(appendData['BUTANE_NOV']);
      var subNovPropaneYnt = $('.nov_ynt_propane').html(novPropaneYNT);
      var subNovButaneYnt = $('.nov_ynt_butane').html(novButaneYNT);

      decPropaneYNT += parseFloat(appendData['PROPANE_DEC']);
      decButaneYNT += parseFloat(appendData['BUTANE_DEC']);
      var subDecPropaneYnt = $('.dec_ynt_propane').html(decPropaneYNT);
      var subDecButaneYnt = $('.dec_ynt_butane').html(decButaneYNT);

      // horizontal calculations YNT
      var kmtPropane = parseFloat(appendData['PROPANE_JAN']) + parseFloat(appendData['PROPANE_FEB']) + parseFloat(appendData['PROPANE_MAR']) + parseFloat(appendData['PROPANE_APR']) + parseFloat(appendData['PROPANE_MAY']) + parseFloat(appendData['PROPANE_JUN']) + parseFloat(appendData['PROPANE_JUL']) + parseFloat(appendData['PROPANE_AUG']) + parseFloat(appendData['PROPANE_SEP']) + parseFloat(appendData['PROPANE_OCT']) + parseFloat(appendData['PROPANE_NOV']) + parseFloat(appendData['PROPANE_DEC']);
      var kmtButane = parseFloat(appendData['BUTANE_JAN']) + parseFloat(appendData['BUTANE_FEB']) + parseFloat(appendData['BUTANE_MAR']) + parseFloat(appendData['BUTANE_APR']) + parseFloat(appendData['BUTANE_MAY']) + parseFloat(appendData['BUTANE_JUN']) + parseFloat(appendData['BUTANE_JUL']) + parseFloat(appendData['BUTANE_AUG']) + parseFloat(appendData['BUTANE_SEP']) + parseFloat(appendData['BUTANE_OCT']) + parseFloat(appendData['BUTANE_NOV']) + parseFloat(appendData['BUTANE_DEC']);
      $("#kmtPropane" + horizontalIndex).html(kmtPropane);
      $("#kmtButane" + horizontalIndex).html(kmtButane);
      // horizontal calculations RT
      var kmtPropane = parseFloat(appendData['PROPANE_JAN']) + parseFloat(appendData['PROPANE_FEB']) + parseFloat(appendData['PROPANE_MAR']) + parseFloat(appendData['PROPANE_APR']) + parseFloat(appendData['PROPANE_MAY']) + parseFloat(appendData['PROPANE_JUN']) + parseFloat(appendData['PROPANE_JUL']) + parseFloat(appendData['PROPANE_AUG']) + parseFloat(appendData['PROPANE_SEP']) + parseFloat(appendData['PROPANE_OCT']) + parseFloat(appendData['PROPANE_NOV']) + parseFloat(appendData['PROPANE_DEC']);
      var kmtButane = parseFloat(appendData['BUTANE_JAN']) + parseFloat(appendData['BUTANE_FEB']) + parseFloat(appendData['BUTANE_MAR']) + parseFloat(appendData['BUTANE_APR']) + parseFloat(appendData['BUTANE_MAY']) + parseFloat(appendData['BUTANE_JUN']) + parseFloat(appendData['BUTANE_JUL']) + parseFloat(appendData['BUTANE_AUG']) + parseFloat(appendData['BUTANE_SEP']) + parseFloat(appendData['BUTANE_OCT']) + parseFloat(appendData['BUTANE_NOV']) + parseFloat(appendData['BUTANE_DEC']);
      $("#kmtPropane" + horizontalIndex).html(kmtPropane);
      $("#kmtButane" + horizontalIndex).html(kmtButane);
      var total = parseFloat($("#kmtPropane" + horizontalIndex).html()) + parseFloat($("#kmtButane" + horizontalIndex).html());
      $("#totalKmt" + horizontalIndex).html(total);
    }
    horizontalIndex++;
  });

  var subTotalRtPropane = parseFloat($('.jan_rt_propane').html()) + parseFloat($('.feb_rt_propane').html()) + parseFloat($('.mar_rt_propane').html()) + parseFloat($('.apr_rt_propane').html()) + parseFloat($('.may_rt_propane').html()) + parseFloat($('.jun_rt_propane').html()) + parseFloat($('.jul_rt_propane').html()) + parseFloat($('.aug_rt_propane').html()) + parseFloat($('.sep_rt_propane').html()) + parseFloat($('.oct_rt_propane').html()) + parseFloat($('.nov_rt_propane').html()) + parseFloat($('.dec_rt_propane').html());
  var subTotalRtButane = parseFloat($('.jan_rt_butane').html()) + parseFloat($('.feb_rt_butane').html()) + parseFloat($('.mar_rt_butane').html()) + parseFloat($('.apr_rt_butane').html()) + parseFloat($('.may_rt_butane').html()) + parseFloat($('.jun_rt_butane').html()) + parseFloat($('.jul_rt_butane').html()) + parseFloat($('.aug_rt_butane').html()) + parseFloat($('.sep_rt_butane').html()) + parseFloat($('.oct_rt_butane').html()) + parseFloat($('.nov_rt_butane').html()) + parseFloat($('.dec_rt_butane').html());
  var subTotalYntPropane = parseFloat($('.jan_ynt_propane').html()) + parseFloat($('.feb_ynt_propane').html()) + parseFloat($('.mar_ynt_propane').html()) + parseFloat($('.apr_ynt_propane').html()) + parseFloat($('.may_ynt_propane').html()) + parseFloat($('.jun_ynt_propane').html()) + parseFloat($('.jul_ynt_propane').html()) + parseFloat($('.aug_ynt_propane').html()) + parseFloat($('.sep_ynt_propane').html()) + parseFloat($('.oct_ynt_propane').html()) + parseFloat($('.nov_ynt_propane').html()) + parseFloat($('.dec_ynt_propane').html());
  var subTotalYntButane = parseFloat($('.jan_ynt_butane').html()) + parseFloat($('.feb_ynt_butane').html()) + parseFloat($('.mar_ynt_butane').html()) + parseFloat($('.apr_ynt_butane').html()) + parseFloat($('.may_ynt_butane').html()) + parseFloat($('.jun_ynt_butane').html()) + parseFloat($('.jul_ynt_butane').html()) + parseFloat($('.aug_ynt_butane').html()) + parseFloat($('.sep_ynt_butane').html()) + parseFloat($('.oct_ynt_butane').html()) + parseFloat($('.nov_ynt_butane').html()) + parseFloat($('.dec_ynt_butane').html());

  $('.kmt_rt_propane').html(subTotalRtPropane);
  $('.kmt_rt_butane').html(subTotalRtButane);

  $('.kmt_ynt_propane').html(subTotalYntPropane);
  $('.kmt_ynt_butane').html(subTotalYntButane);

  var grandTotalRt = parseFloat($('.kmt_rt_propane').html()) + parseFloat($('.kmt_rt_butane').html());
  var grandTotalYnt = parseFloat($('.kmt_ynt_propane').html()) + parseFloat($('.kmt_ynt_butane').html());

  $('.grandTotalRt').html(grandTotalRt);
  $('.grandTotalYnt').html(grandTotalYnt);
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



