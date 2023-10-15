
$('.alert-success').css("display", "none");
var ajax_data =
  [
    { "date": "Feb-01", "cust1_forecasted": 55, "cust1_override": "", "cust2_forecasted": 55, "cust2_override": "", "cust3_forecasted": 55, "cust3_override": "", "cust4_forecasted": 55, "cust4_override": "", "cust5_forecasted": 55, "cust5_override": "" },
    { "date": "Feb-02", "cust1_forecasted": 55, "cust1_override": "", "cust2_forecasted": 55, "cust2_override": "", "cust3_forecasted": 55, "cust3_override": "", "cust4_forecasted": 55, "cust4_override": "", "cust5_forecasted": 55, "cust5_override": "" },
    { "date": "Feb-03", "cust1_forecasted": 55, "cust1_override": "", "cust2_forecasted": 55, "cust2_override": "", "cust3_forecasted": 55, "cust3_override": "", "cust4_forecasted": 55, "cust4_override": "", "cust5_forecasted": 55, "cust5_override": "" },
    { "date": "Feb-04", "cust1_forecasted": 55, "cust1_override": "", "cust2_forecasted": 55, "cust2_override": "", "cust3_forecasted": 55, "cust3_override": "", "cust4_forecasted": 55, "cust4_override": "", "cust5_forecasted": 55, "cust5_override": "" },
    { "date": "Feb-05", "cust1_forecasted": 55, "cust1_override": "", "cust2_forecasted": 55, "cust2_override": "", "cust3_forecasted": 55, "cust3_override": "", "cust4_forecasted": 55, "cust4_override": "", "cust5_forecasted": 55, "cust5_override": "" },
    { "date": "Feb-06", "cust1_forecasted": 55, "cust1_override": "", "cust2_forecasted": 55, "cust2_override": "", "cust3_forecasted": 55, "cust3_override": "", "cust4_forecasted": 55, "cust4_override": "", "cust5_forecasted": 55, "cust5_override": "" },
    { "date": "Feb-07", "cust1_forecasted": 55, "cust1_override": "", "cust2_forecasted": 55, "cust2_override": "", "cust3_forecasted": 55, "cust3_override": "", "cust4_forecasted": 55, "cust4_override": "", "cust5_forecasted": 55, "cust5_override": "" },
    
  ];

//save values using json with the new data
$('body').on('click', '#save', function () {
  // var form_array = {};
  // form_array['terminal'] = $('#terminal').val();
  // form_array['customer'] = $('#customer').val();
  // form_array['date'] = $('#date').val();
  // form_array['temp_num_key'] = $('#temp_num_key').val();
  // form_array['propane_bbl'] = $('#propane_bbl').val();
  // form_array['butane_bbl'] = $('#butane_bbl').val();
  // form_array['propane_kmt'] = $('#propane_kmt').val();
  // form_array['butane_kmt'] = $('#butane_kmt').val();
  // $('.post_msg').html('<pre class="bg-light">' + JSON.stringify(form_array, null, 2) + '</pre>');
});

function setHeaderDate() {
    let today = new Date().toLocaleDateString()
    var year = moment().format('YYYY');
      var futureMonthName = moment().add(1, "month").format('MMMM');
      var planningMonth = futureMonthName + ' ' + year;
      $("#datepicker1").html("Planning Month - " + planningMonth)

}

const tabPanelItems = [{
  ID: 1,
  CompanyName: 'SuprMart',
  Address: '702 SW 8th Street',
  City: 'Bentonville',
  State: 'Arkansas',
  Zipcode: 72716,
  Phone: '(800) 555-2797',
  Fax: '(800) 555-2171',
  Website: 'http://www.nowebsitesupermart.com',
}, {
  ID: 2,
  CompanyName: "El'Depot",
  Address: '2455 Paces Ferry Road NW',
  City: 'Atlanta',
  State: 'Georgia',
  Zipcode: 30339,
  Phone: '(800) 595-3232',
  Fax: '(800) 595-3231',
  Website: 'http://www.nowebsitedepot.com',
}, 
];

function handleTabs (){
  DevExpress.setTemplateEngine('underscore');

  const tabPanel = $('#tabpanel-container').dxTabPanel({
    height: 260,
    dataSource: tabPanelItems,
    selectedIndex: 0,
    loop: false,
    animationEnabled: true,
    swipeEnabled: true,
    itemTitleTemplate: $('#title'),
    itemTemplate: $('#customer'),
    onSelectionChanged(e) {
      $('.selected-index')
        .text(e.component.option('selectedIndex') + 1);
    },
  }).dxTabPanel('instance');

  $('#loop-enabled').dxCheckBox({
    value: false,
    text: 'Loop enabled',
    onValueChanged(e) {
      tabPanel.option('loop', e.value);
    },
  });

  $('#animation-enabled').dxCheckBox({
    value: true,
    text: 'Animation enabled',
    onValueChanged(e) {
      tabPanel.option('animationEnabled', e.value);
    },
  });

  $('#swipe-enabled').dxCheckBox({
    value: true,
    text: 'Swipe enabled',
    onValueChanged(e) {
      tabPanel.option('swipeEnabled', e.value);
    },
  });

  $('.item-count').text(tabPanelItems.length);
}

$(document).ready(function () {
    setHeaderDate()

    handleTabs()



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
  //--->create data table > start
  var tbl = '';
  tbl += '<table id="dtBasicExample" class="table table-sm table-striped table-hover table-bordered text-center" cellspacing="0" width="100%">'
  //--->create table header > start
  tbl += '<thead style="background-color: #00A3E0!important;font-family: ManifaPro2-Regular; color:white; text-decoration:none;">';
  tbl += '<tr>';
  tbl += '<td class="" rowspan="2">Date</td>';
  tbl += '<td class="" colspan="2">Domestic Customer 1 Demand</td>';
  tbl += '<td class="" colspan="2">Domestic Customer 2 Demand</td>';
  tbl += '<td class="" colspan="2">Domestic Customer 3 Demand</td>';
  tbl += '<td class="" colspan="2">Domestic Customer 4 Demand</td>';
  tbl += '<td class="" colspan="2">Domestic Customer 5 Demand</td>';
  tbl += '</tr>';
  tbl += '<tr>';
  tbl += '<td class="">Forecasted</td>';
  tbl += '<td class="">User Override</td>';
  tbl += '<td class="">Forecasted</td>';
  tbl += '<td class="">User Override</td>';
  tbl += '<td class="">Forecasted</td>';
  tbl += '<td class="">User Override</td>';
  tbl += '<td class="">Forecasted</td>';
  tbl += '<td class="">User Override</td>';
  tbl += '<td class="">Forecasted</td>';
  tbl += '<td class="">User Override</td>';
  tbl += '</tr>';
  tbl += '</thead>';
  //--->create table header > end
  //--->create table body > start
  tbl += '<tbody>';
  //--->create table body rows > start
  var i = 0;
  $.each(ajax_data, function (index, val) {
    //you can replace with your database row id
    var row_id = random_id();
    var random = temp_key();
    //loop through ajax row data
    tbl += '<tr row_id=' + row_id + '>';
    tbl += '<td width="60">'+val['date']+'</td>';
    tbl += '<td>'+val['cust1_forecasted']+'</td>';
    tbl += '<td><div class="row_data cust1_override bg-light" id="cust1_override'+i+'" edit_type="click" col_name="cust1_override">'+val['cust1_override']+'</div></td>';
    tbl += '<td>'+val['cust2_forecasted']+'</td>';
    tbl += '<td><div class="row_data cust1_override bg-light" id="cust2_override'+i+'" edit_type="click" col_name="cust2_override">'+val['cust2_override']+'</div></td>';
    tbl += '<td>'+val['cust3_forecasted']+'</td>';
    tbl += '<td><div class="row_data cust1_override bg-light" id="cust3_override'+i+'" edit_type="click" col_name="cust3_override">'+val['cust3_override']+'</div></td>';
    tbl += '<td>'+val['cust4_forecasted']+'</td>';
    tbl += '<td><div class="row_data cust1_override bg-light" id="cust4_override'+i+'" edit_type="click" col_name="cust4_override">'+val['cust4_override']+'</div></td>';
    tbl += '<td>'+val['cust5_forecasted']+'</td>';
    tbl += '<td><div class="row_data cust1_override bg-light" id="cust5_override'+i+'" edit_type="click" col_name="cust5_override">'+val['cust5_override']+'</div></td>';

    //--->edit options > start
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


  //--->button > edit > start	
  $(document).on('click', '.btn_edit', function (event) {
    event.preventDefault();
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
    
    //--->make div editable > start
  $(document).on('click', '.row_data', function (event) {
    event.preventDefault();

    if ($(this).attr('edit_type') == 'button') {
      return false;
    }

    //make div editable
    $(this).closest('div').attr('contenteditable', 'true');
    //add bg css
    $(this).addClass('bg-warning').css('padding', '5px');

    $(this).focus();
  })
  //--->make div editable > end

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

 
  

  //--->save single field data > start
  $(document).on('focusout', '.row_data', function (event) {
    event.preventDefault();

    if ($(this).attr('edit_type') == 'button') {
      return false;
    }

    var row_id = $(this).closest('tr').attr('row_id');

    var row_div = $(this)
      .removeClass('form-input input-sm rounded-0 bg-info') //add bg css
      .css('padding', '')

    var col_name = row_div.attr('col_name');
    var col_val = row_div.html();

    var arr = {};
    arr[col_name] = col_val;

    //use the "arr"	object for your ajax call
    $.extend(arr, { row_id: row_id });

    //out put to show
    $('.post_msg').html('<pre class="bg-light">' + JSON.stringify(arr, null, 2) + '</pre>');

  })
  

}); 