$(document).ready(function () {
  // const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

  const ordersStore = new DevExpress.data.CustomStore({
    key: 'TEMP_NOMINATION_KEY',
    load() {
      return sendRequest(`https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FMonthly%20Customer%20Nom_Read_7&myjson=%7B"id":"1"%7D`, 'POST', data='');
    },
    insert(values) {
      return sendRequest(`https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FMonthly%20Customer%20Nom_INSERT%207sas`, 'POST', {
        values: JSON.stringify(values),
      });
    },
    update(key, values) {
      return sendRequest(`https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FMonthly%20Customer%20Nom_update`, 'POST', {
        key,
        values: JSON.stringify(values),
      });
    },
    remove(key) {
      return sendRequest(`https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FMonthly%20Customer%20Nom_delete`, 'POST', {
        key,
      });
    },
  });

  const dataGrid = $('#grid').dxDataGrid({
    dataSource: ordersStore,
    repaintChangesOnly: true,
    showBorders: true,
    editing: {
      refreshMode: 'reshape',
      mode: 'cell',
      allowAdding: true,
      allowUpdating: true,
      allowDeleting: true,
    },
    scrolling: {
      mode: 'virtual',
    },
    columns: [{
      dataField: 'TERMINAL_ID',
      caption: 'Terminals',
      lookup: {
        dataSource: {
          // paginate: true,
          store: new DevExpress.data.CustomStore({
            key: 'Value',
            loadMode: 'raw',
            load() {
              return sendRequest('https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FTerminal_Customer_Dropdown&parameter=TERMINAL');
            },
          }),
        },
        valueExpr: 'Value',
        displayExpr: 'Text',
      },
        }, {
          dataField: 'CUSTOMER_ID',
          caption: 'Customers',
          lookup: {
            dataSource: {
              // paginate: true,
              store: new DevExpress.data.CustomStore({
                key: 'Value',
                loadMode: 'raw',
                load() {
                  return sendRequest('https://sasserver.demo.sas.com/SASJobExecution/?_program=%2FLPG%2FTerminal_Customer_Dropdown&parameter=CUSTOMER');
                },
              }),
            },
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

  }).dxDataGrid('instance');

  $('#refresh-mode').dxSelectBox({
    items: ['full', 'reshape', 'repaint'],
    value: 'reshape',
    onValueChanged(e) {
      dataGrid.option('editing.refreshMode', e.value);
    },
  });

  $('#clear').dxButton({
    text: 'Clear',
    onClick() {
      $('#requests ul').empty();
    },
  });

  async function sendRequest(url, method = 'POST', data) {
    const d = $.Deferred();
    var myToken = await sasgetCSRFToken();
    console.log("myb url : " + myToken);

    $.ajax(url, {
      method,
      data,
      // xhrFields: { withCredentials: false },
      cache: false,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-CSRF-Token', myToken);
        xhr.setRequestHeader('X-CSRF-Header', 'X-CSRF-Token');
      },
    }).done((result) => {
      console.log(result);
      d.resolve(method === 'POST' ? result.data : result);
    }).fail((xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });
    return d.promise();

  }

  async function sasgetCSRFToken() {
    const csrfURL = `https://sasserver.demo.sas.com/SASJobExecution/csrf`
    const csrfParameters = { method: "GET", credentials: "include" }
    const csrfRequest = await fetch(csrfURL, csrfParameters)
    const csrfToken = await csrfRequest.headers.get("X-CSRF-TOKEN")
    return csrfToken;
  }

});
