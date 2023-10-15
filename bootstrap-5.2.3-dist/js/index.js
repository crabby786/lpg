
var dropdownCustomer = function () {
  var customerURL = 'https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FTerminal_Customer_Dropdown&parameter=CUSTOMER';
  var dataCustomer = "";
  $.ajax({
    url: customerURL,
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
    },
    // data : {},
    success: function (data) {
      dataCustomer = data;
    }
  });
  return dataTerminal;
}

var dropdownTerminal = function () {
  var terminalURL = 'https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FTerminal_Customer_Dropdown&parameter=TERMINAL';
  var dataTerminal = "";
  $.ajax({
    url: terminalURL,
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
    },
    // data : {},
    success: function (data) {
      dataTerminal = data;
    }
  });
  return dataTerminal;
}

var monthlyData = function () {
  var monthlyURL = 'https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FMonthly%20Customer%20Nom_Read_7&myjson=%7B"id":"1"%7D';
  var dataMonthlyData = "";
  $.ajax({
    url: terminalURL,
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
    },
    success: function (data) {
      dataMonthlyData = data;
    }
  });
  return dataMonthlyData;
}

var init = function (dataSourceCustomer,dataSourceTerminal,dataSourceMonthly) {
  $('#gridContainer').dxDataGrid({
    dataSource: dataSourceMonthly,
    showBorders: true,
    editing: {
      //   refreshMode: 'reshape',
      mode: 'row',
      allowAdding: true,
      allowUpdating: true,
      allowDeleting: true,
    },
    // scrolling: {
    //   mode: 'virtual',
    // },

    columns: [{
      dataField: 'TERMINAL_ID',
      caption: 'Terminals',
      lookup: {
        dataSource: {
          // paginate: true,
          store: new DevExpress.data.CustomStore({
            key: 'Value',
            type: 'array',
            loadMode: 'raw',
            load() {
              return dataSourceTerminal;
            },
          }),
        },
        valueExpr: 'Value',
        displayExpr: 'Text',
      },
    }, {
      dataField: 'CUSTOMER_NM',
      caption: 'Customers',
      dataType: 'text',
      lookup: {
        dataSource: new DevExpress.data.CustomStore({
          key: 'Value',
          loadMode: 'raw',
          load() {
            return dataSourceCustomer;
          },
        }),
        valueExpr: 'Value',
        displayExpr: 'Text',
      },
    }, {
      dataField: 'Date',
      dataType: 'date',
    }, {
      dataField: 'TEMP_NOMINATION_KEY',
    }, {
      dataField: 'propane_bbl',
      caption: 'Propane BBL',
      calculateCellValue: function (data) {
        return data['PROPANE_KMT'] * 12.446 * 1000;
      }
    }, {
      dataField: 'butane_bbl',
      caption: 'Butane BBL',
      calculateCellValue: function (data) {
        return data['BUTANE_KMT'] * 12.446 * 1000;
      }
    }, {
      dataField: 'PROPANE_KMT',
    }, {
      dataField: 'BUTANE_KMT',
    },
    ],
  }).dxDataGrid("instance");
}

init(dataSourceCustomer,dataSourceTerminal,dataSourceMonthly);