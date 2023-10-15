$(document).ready(function () {
  var isTesting = true
  // setHeaderDate()
  var selectedDays = [];
  var selectedDate = [];
  var calendarResponse = null;
  var chartResponse = null;

  var readUrl = 'MARK_READ_URI'; // todo revert

  var calendarData = function () {
    var tmp = null;
    $.ajax({
      url: readUrl,
      dataType: "json",
      async: false,
      beforeSend: function (xhr) {
        $(".overlay").css("display", 'block');
        xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
      },
      success: function (data) {
        // console.log(parse.JSON(data));
        $(".overlay").css("display", 'none');
        tmp = data;
      },
      complete: function (data) {
        $(".overlay").hide();
        isTesting && (tmp = response);
      }
    });
    return tmp;
  }();

  console.log(readUrl);

  var calendar = calendarData.Table_Data;
  // show planning month on page load
  $("#datepicker1").html('Planning Month ' + convertMonthYear(calendar[0].PLANNING_MONTH));
  var graphData = calendarData.Line_Chart_Data;
  var selectedDays = [];

  $.each(calendar, function (i, obj) {
    selectedDays.push({
      planning_month: obj.PLANNING_MONTH,
      terminal_cd: obj.TERMINSL_CD,
      terminal_nm: obj.TERMINSL_NM,
      day: obj.DAY,
      available_flag: obj.AVAILABLE_FLG,
      modified_dttm: obj.MODIFIED_DTTM,
      modified_by: obj.MODIFIED_BY,
    });
  });

  initializeFullCalendar(selectedDays);

  //Start function to insitalize calendar
  function initializeFullCalendar(selectedDays) {
    // console.log(selectedDays);
    $("table").addClass(".table");
    var cal = $("#calendar");
    var calendarOptions = {
      header: false,
      // aspectRatio:3,
      contentHeight: 400,
      defaultDate: moment().add(1, "months"),
      defaultView: "month",
      fixedWeekCount: "variable",
      showNonCurrentDates: false,
      dayRender: function (date, cell) {
        var theDate = date.format("YYYY-MM-DD");

        // Check if the current date matches any date in the JSON data
        var selectedDate = selectedDays.find(function (day) {
          // console.log(day.day+"=="+theDate);
          return day.day === theDate;
        });

        // If a match is found, set the checkbox as checked
        if (selectedDate && selectedDate.available_flag === "Y") {
          cell.append(
            '<input id="' + selectedDate?.day + '" data-flag="' + selectedDate.available_flag + '" type="checkbox" class="checkbox fc-checkbox-day" checked/>');
        } else {
          var date_n = cell.closest("td").attr("data-date");
          if (date_n === undefined || date_n < 6) {
            var row = cell.closest("tr");

            // Check if all the cells in the row have the 'fc-disabled-day' class
            var allCellsDisabled = true;
            row.find("td").each(function () {
              if (!$(this).hasClass("fc-disabled-day")) {
                allCellsDisabled = false;
                return false; // Exit the loop if any cell does not have the class
              }
            });

            // Hide the row if all cells have the 'fc-disabled-day' class
            if (allCellsDisabled) {
              row.css("display", "none");
              row
                .closest(".fc-row.fc-week.fc-widget-content")
                .css("display", "none");
            }
          }
          if (date_n != undefined && date_n != null && date_n != "") {
            cell.append(
              '<input id="' + date_n + '" data-flag="N" type="checkbox" class="checkbox fc-checkbox-day"' + (date_n === undefined || date_n < 6 ? " disabled" : "") + "/>"
            );
          }

        }
      },
    };
    cal.fullCalendar(calendarOptions);
  }
  //End function to insitalize calendar

  // This fcick handler is used to save data: start
  function saveData() {
    var checkboxes = new Array();
    var $checked = $('input[type="checkbox"]:checked.fc-checkbox-day');
    var allData = new Array();
    $.each($checked, function (i, ctrl) {
      checkboxes.push($(this).closest("td").attr("data-date"));
    });

    var allData = new Array();
    $.each(checkboxes, function (index, val) {
      //var calenMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var dateFormatted = moment(val).format("MMMYYYY");

      allData.push({
        PLANNING_MONTH: dateFormatted,
        TERMINSL_CD: "YNB TERM",
        TERMINSL_NM: "YANBU TERMINAL",
        DAY: val,
        AVAILABLE_FLG: "Y",
        MODIFIED_DTTM: moment().format("MM/DD/YYYY"),
        CREATED_DTTM: moment().format("MM/DD/YYYY"),
        MODIFIED_BY: "SAS",
        CREATED_BY: "UNXSAS",
      });
    });

    csrfToken = "";
    const so = async () => {
      try {
        $(".overlay").show();
        const csrfURL =CSRF_URL;
        const csrfParameters = { method: "GET", credentials: "include" };
        const csrfRequest = await fetch(csrfURL, csrfParameters);
        const csrfToken = csrfRequest.headers.get("X-CSRF-TOKEN");

        // var data = JSON.stringify([{ "id": "id" + 1, "name": "ARAMCO", "lastname": "YNB" }]);
        var newUrl = MARK_SAVE_SLOTS_URI;
        DevExpress.ui.dialog.confirm("Are you sure you want to Save Slots ?", "Confirmation").done(function (dialogResult) {
          if (dialogResult) {
            $.ajax({
              type: "POST",
              url: newUrl,
              dataType: "json",
              // data: data,
              credentials: "include",
              contentType: "application/json",
              beforeSend: function (xhr) {
                $(".overlay").show();
                xhr.setRequestHeader("X-CSRF-Token", csrfToken);
                xhr.setRequestHeader("X-CSRF-Header", "X-CSRF-Token");
              },
              data: JSON.stringify(allData),
              success: function (data, status, xhr) {
                $(".overlay").hide();
                showToast(toastTypes.success, 'Data saved successfully')
                var checked = $('#calendar input[type="checkbox"]:checked');
                let checkedArray = Array.from(checked);
                checkedArray = checkedArray?.map((obj) => {
                  return { DAY: obj?.id };
                });
                setChart(checkedArray, graphData);
              },
              error: function (data) {
                $(".overlay").hide();
              },
            });
          }
        })
      } catch (error) {
        $(".overlay").hide();
      }

    };
    so().then((af) => csrfToken);
  }
  // This fcick handler is used to save data: end
  setChart(calendar, graphData);
  //   --------------------Chart code----------

  // register verticle line code
  const verticalLinePlugin = {
    getLinePosition: function (chart, pointIndex) {
      const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
      const data = meta.data;
      return data[pointIndex]._model.x;
    },
    renderVerticalLine: function (chartInstance, pointIndex) {
      const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex);
      const scale = chartInstance.scales["y-axis-0"];
      const context = chartInstance.chart.ctx;
      // render vertical line
      context.beginPath();
      context.strokeStyle = "rgba(0,163,224, 0.7)";
      context.lineWidth = 1;
      context.moveTo(lineLeftOffset, scale.top);
      context.lineTo(lineLeftOffset, scale.bottom);
      context.stroke();
    },
    afterDatasetsDraw: function (chart, easing) {
      if (chart.config.lineAtIndex) {
        chart.config.lineAtIndex.forEach((pointIndex) =>
          this.renderVerticalLine(chart, pointIndex)
        );
      }
    },
  };
  Chart.plugins.register(verticalLinePlugin);
  // register code end

  function getActiveMonth() {
    let year = moment().format("YYYY");
    let monthName = moment().format("MMMM");
    let futureMonthName = moment().add(1, "month").format("MMMM");
    return {
      year,
      futureMonthName,
      monthName,
      shortMonth: moment().format("MMM"),
      shortFutureMonth: moment().add(1, "month").format("MMM"),
    };
  }
  function setHeaderDate() {
    let { year, monthName } =
      getActiveMonth();
    let planningMonth =
      monthName + " " + year;
    // $("#datepicker1").html(" - " + planningMonth);
  }

  function notifyCosmd() {
    DevExpress.ui.dialog.confirm("Are you sure you want Notify COSMD ?", "Confirmation").done(function (dialogResult) {
      if (dialogResult) {
        var url = MARK_NOTIFY_URI ;
        setTimeout(function () {
          try {
            $.ajax({
              url: url,
              dataType: "json",
              beforeSend: function (xhr) {
                $(".overlay").show();
                xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
              },
              success: function (data) {
                $(".overlay").hide();
                if (data.Message != "") {
                  DevExpress.ui.notify({
                    message: "Successfull",
                    position: {
                      my: "top",
                      at: "top",
                      of: "#gridContainer"
                    },
                    type: "success",
                    displayTime: 2000
                  });
                } else {
                  DevExpress.ui.notify({
                    message: "Something Went Wrong",
                    position: {
                      my: "top",
                      at: "top",
                      of: "#gridContainer"
                    },
                    type: "error",
                    displayTime: 2000
                  });
                }
              },
              error: function (data) {
                $(".overlay").hide();
              },
            });
          } catch (error) {
            console.log("asdasd");
          }
        }, 500);
        $(".overlay").hide();
      }
    })
  }

  // function sendRequest(url) {

  // }

  $(document).ready(function () {
    const actionBtnConfig = [
      {
        icon: 'fa fa-check-square-o',
        hint: 'Check',
        checked: false,
        onClick: function (e) {
          const checkboxes = $('#calendar input[type="checkbox"]');
          this.checked = !this.checked;
          checkboxes.prop('checked', this.checked);
          setChartOnCheckboxClick();
        }
      },
      {
        icon: 'fa fa-save',
        hint: 'Save',
        onClick: saveData
      },
      {
        icon: 'fa fa-envelope-o',
        hint: 'Notify COSMD',
        onClick: (e) => {
          notifyCosmd();
        }
      },
    ]

    $('#actionBtns').dxButtonGroup({
      items: actionBtnConfig,
      keyExpr: 'alignment',
      stylingMode: 'outlined',
      selectedItemKeys: ['grid']
    });
    var toastTypes = { success: 'success', error: 'error' }
    $('#actionBtns').after(`<div id="toast"></div>`)
    var toast = $('#toast').dxToast({ displayTime: 5000, closeOnClick: true, position: 'top center' }).dxToast('instance');
    function showToast(type, message) {
      toast.option({ message, type });
      toast.show();
    }

    setHeaderDate()
    function setChartOnCheckboxClick() {
      var checked = $('#calendar input[type="checkbox"]:checked');
      let checkedArray = Array.from(checked);
      checkedArray = checkedArray?.map((obj) => {
        return { DAY: obj?.id };
      });
      setChart(checkedArray, graphData);
    }
    // Run the function on the first render
    setChartOnCheckboxClick();
    // // Set up the click event handler for ".checkbox" elements
    $(document).on("click", ".checkbox", setChartOnCheckboxClick);

  });

  function setChart(calendarData, graphData) {
    let futureMonthName = moment().add(1, "month").format("MMMM");

    var keyValuesPropane = [];
    var keyValuesButane = [];
    var keyValuesDays = [];
    var lineAtIndex = [];
    $.each(graphData, function (i, obj) {
      keyValuesPropane.push(obj.PROPANE);
      keyValuesButane.push(obj.BUTANE);
      const date = moment(obj.PERIOD_START_DT, "MM-DD-YYYY").format("DD");
      keyValuesDays.push(date);
      let index = calendarData?.findIndex((cObj) => {
        const cdate = moment(cObj.DAY, "YYYY-MM-DD").format("DD");
        return cdate == date;
      });
      index !== -1 && lineAtIndex.push(i);
    });

    var xValues = keyValuesDays;
    var maxDataValuePropane = Math.max(...keyValuesPropane);
    var maxDataValueButane = Math.max(...keyValuesButane);
    var yAxisMax = Math.max((maxDataValueButane, maxDataValuePropane) + 20, 100);
    new Chart("myChart", {
      type: "line",
      lineAtIndex: lineAtIndex,
      responsive: true,
      maintainAspectRatio: true,
      data: {
        labels: xValues,
        datasets: [
          {
            overlay: true,
            data: keyValuesPropane,
            backgroundColor: "rgba(38, 168, 171, 0.5)",
            borderColor: "rgba(38, 168, 171,1)",
            label: "Propane",
            fill: true,
            pointStyle: 'line'
          },
          {
            overlay: true,
            data: keyValuesButane,
            opacity: 0.5,
            backgroundColor: "rgba(132, 189, 0,  0.5)",
            borderColor: "rgba(132,189, 0,  1)",
            label: "Butane",
            fill: true,
            pointStyle: 'line'
          },
          {
            label: 'Available Slots',
            data: [],
            hidden: false, // Set to true to hide the dummy line in the chart
            useLineStyle: true,
            backgroundColor: "rgba(107, 199, 234,  0.5)",
            borderColor: "rgba(107,199, 234,  1)",
            fill: true,
            pointStyle: 'line'
          },
        ],
      },

      options: {
        scales: {
          yAxes: [
            {
              ticks:
              {
                max: yAxisMax,
                min: 0,
              }
            }
          ]
          ,
          xAxes: [
            {
              ticks: {
                padding: 20,
              },
              gridLines: true,
              scaleLabel: {
                display: true,
                text: futureMonthName,
              },
            },
          ],
        },
        animation: false,
        legend: {
          title: {
            display: true,
            text: "LPG",
          },
          labels: {
            usePointStyle: true,
            pointStyle: 'line',
            display: true,
          }
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
      },
      argumentAxis: {
        tick: {
          shift: 6,
        },
      },
    });
  }
});

var response = {
  "Table_Data": [
      {
          "PLANNING_MONTH": "OCT2023",
          "TERMINAL_ID": "T005",
          "TERMINAL_NM": "YNB TRM",
          "AVAILABLE_FLG": "Y",
          "MODIFIED_DTTM": "  20SEP2023:09:28:57.000000",
          "CREATED_DTTM": "  20SEP2023:09:28:57.000000",
          "MODIFIED_BY": "SAS",
          "CREATED_BY": "UNXSAS",
          "DAY": "2023-10-07"
      },
      {
          "PLANNING_MONTH": "OCT2023",
          "TERMINAL_ID": "T005",
          "TERMINAL_NM": "YNB TRM",
          "AVAILABLE_FLG": "Y",
          "MODIFIED_DTTM": "  20SEP2023:09:28:57.000000",
          "CREATED_DTTM": "  20SEP2023:09:28:57.000000",
          "MODIFIED_BY": "SAS",
          "CREATED_BY": "UNXSAS",
          "DAY": "2023-10-08"
      },
      {
          "PLANNING_MONTH": "OCT2023",
          "TERMINAL_ID": "T005",
          "TERMINAL_NM": "YNB TRM",
          "AVAILABLE_FLG": "Y",
          "MODIFIED_DTTM": "  20SEP2023:09:28:57.000000",
          "CREATED_DTTM": "  20SEP2023:09:28:57.000000",
          "MODIFIED_BY": "SAS",
          "CREATED_BY": "UNXSAS",
          "DAY": "2023-10-12"
      },
      {
          "PLANNING_MONTH": "OCT2023",
          "TERMINAL_ID": "T005",
          "TERMINAL_NM": "YNB TRM",
          "AVAILABLE_FLG": "Y",
          "MODIFIED_DTTM": "  20SEP2023:09:28:57.000000",
          "CREATED_DTTM": "  20SEP2023:09:28:57.000000",
          "MODIFIED_BY": "SAS",
          "CREATED_BY": "UNXSAS",
          "DAY": "2023-10-13"
      },
      {
          "PLANNING_MONTH": "OCT2023",
          "TERMINAL_ID": "T005",
          "TERMINAL_NM": "YNB TRM",
          "AVAILABLE_FLG": "Y",
          "MODIFIED_DTTM": "  20SEP2023:09:28:57.000000",
          "CREATED_DTTM": "  20SEP2023:09:28:57.000000",
          "MODIFIED_BY": "SAS",
          "CREATED_BY": "UNXSAS",
          "DAY": "2023-10-15"
      },
      {
          "PLANNING_MONTH": "OCT2023",
          "TERMINAL_ID": "T005",
          "TERMINAL_NM": "YNB TRM",
          "AVAILABLE_FLG": "Y",
          "MODIFIED_DTTM": "  20SEP2023:09:28:57.000000",
          "CREATED_DTTM": "  20SEP2023:09:28:57.000000",
          "MODIFIED_BY": "SAS",
          "CREATED_BY": "UNXSAS",
          "DAY": "2023-10-16"
      },
      {
          "PLANNING_MONTH": "OCT2023",
          "TERMINAL_ID": "T005",
          "TERMINAL_NM": "YNB TRM",
          "AVAILABLE_FLG": "Y",
          "MODIFIED_DTTM": "  20SEP2023:09:28:57.000000",
          "CREATED_DTTM": "  20SEP2023:09:28:57.000000",
          "MODIFIED_BY": "SAS",
          "CREATED_BY": "UNXSAS",
          "DAY": "2023-10-18"
      },
      {
          "PLANNING_MONTH": "OCT2023",
          "TERMINAL_ID": "T005",
          "TERMINAL_NM": "YNB TRM",
          "AVAILABLE_FLG": "Y",
          "MODIFIED_DTTM": "  20SEP2023:09:28:57.000000",
          "CREATED_DTTM": "  20SEP2023:09:28:57.000000",
          "MODIFIED_BY": "SAS",
          "CREATED_BY": "UNXSAS",
          "DAY": "2023-10-19"
      },
      {
          "PLANNING_MONTH": "OCT2023",
          "TERMINAL_ID": "T005",
          "TERMINAL_NM": "YNB TRM",
          "AVAILABLE_FLG": "Y",
          "MODIFIED_DTTM": "  20SEP2023:09:28:57.000000",
          "CREATED_DTTM": "  20SEP2023:09:28:57.000000",
          "MODIFIED_BY": "SAS",
          "CREATED_BY": "UNXSAS",
          "DAY": "2023-10-20"
      },
      {
          "PLANNING_MONTH": "OCT2023",
          "TERMINAL_ID": "T005",
          "TERMINAL_NM": "YNB TRM",
          "AVAILABLE_FLG": "Y",
          "MODIFIED_DTTM": "  20SEP2023:09:28:57.000000",
          "CREATED_DTTM": "  20SEP2023:09:28:57.000000",
          "MODIFIED_BY": "SAS",
          "CREATED_BY": "UNXSAS",
          "DAY": "2023-10-21"
      },
      {
          "PLANNING_MONTH": "OCT2023",
          "TERMINAL_ID": "T005",
          "TERMINAL_NM": "YNB TRM",
          "AVAILABLE_FLG": "Y",
          "MODIFIED_DTTM": "  20SEP2023:09:28:57.000000",
          "CREATED_DTTM": "  20SEP2023:09:28:57.000000",
          "MODIFIED_BY": "SAS",
          "CREATED_BY": "UNXSAS",
          "DAY": "2023-10-22"
      },
      {
          "PLANNING_MONTH": "OCT2023",
          "TERMINAL_ID": "T005",
          "TERMINAL_NM": "YNB TRM",
          "AVAILABLE_FLG": "Y",
          "MODIFIED_DTTM": "  20SEP2023:09:28:57.000000",
          "CREATED_DTTM": "  20SEP2023:09:28:57.000000",
          "MODIFIED_BY": "SAS",
          "CREATED_BY": "UNXSAS",
          "DAY": "2023-10-24"
      },
      {
          "PLANNING_MONTH": "OCT2023",
          "TERMINAL_ID": "T005",
          "TERMINAL_NM": "YNB TRM",
          "AVAILABLE_FLG": "Y",
          "MODIFIED_DTTM": "  20SEP2023:09:28:57.000000",
          "CREATED_DTTM": "  20SEP2023:09:28:57.000000",
          "MODIFIED_BY": "SAS",
          "CREATED_BY": "UNXSAS",
          "DAY": "2023-10-28"
      }
  ],
  "Line_Chart_Data": [
      {
          "PERIOD_START_DT": "10/01/2023",
          "PROPANE": 57,
          "BUTANE": 65
      },
      {
          "PERIOD_START_DT": "10/02/2023",
          "PROPANE": 44,
          "BUTANE": 60
      },
      {
          "PERIOD_START_DT": "10/03/2023",
          "PROPANE": 36,
          "BUTANE": 62
      },
      {
          "PERIOD_START_DT": "10/04/2023",
          "PROPANE": 41,
          "BUTANE": 65
      },
      {
          "PERIOD_START_DT": "10/05/2023",
          "PROPANE": 42,
          "BUTANE": 65
      },
      {
          "PERIOD_START_DT": "10/06/2023",
          "PROPANE": 53,
          "BUTANE": 56
      },
      {
          "PERIOD_START_DT": "10/07/2023",
          "PROPANE": 26,
          "BUTANE": 56
      },
      {
          "PERIOD_START_DT": "10/08/2023",
          "PROPANE": 43,
          "BUTANE": 49
      },
      {
          "PERIOD_START_DT": "10/09/2023",
          "PROPANE": 56,
          "BUTANE": 55
      },
      {
          "PERIOD_START_DT": "10/10/2023",
          "PROPANE": 50,
          "BUTANE": 51
      },
      {
          "PERIOD_START_DT": "10/11/2023",
          "PROPANE": 39,
          "BUTANE": 56
      },
      {
          "PERIOD_START_DT": "10/12/2023",
          "PROPANE": 36,
          "BUTANE": 53
      },
      {
          "PERIOD_START_DT": "10/13/2023",
          "PROPANE": 35,
          "BUTANE": 49
      },
      {
          "PERIOD_START_DT": "10/14/2023",
          "PROPANE": 45,
          "BUTANE": 42
      },
      {
          "PERIOD_START_DT": "10/15/2023",
          "PROPANE": 51,
          "BUTANE": 43
      },
      {
          "PERIOD_START_DT": "10/16/2023",
          "PROPANE": 49,
          "BUTANE": 41
      },
      {
          "PERIOD_START_DT": "10/17/2023",
          "PROPANE": 49,
          "BUTANE": 48
      },
      {
          "PERIOD_START_DT": "10/18/2023",
          "PROPANE": 53,
          "BUTANE": 38
      },
      {
          "PERIOD_START_DT": "10/19/2023",
          "PROPANE": 52,
          "BUTANE": 34
      },
      {
          "PERIOD_START_DT": "10/20/2023",
          "PROPANE": 57,
          "BUTANE": 45
      },
      {
          "PERIOD_START_DT": "10/21/2023",
          "PROPANE": 120,
          "BUTANE": 45
      },
      {
          "PERIOD_START_DT": "10/22/2023",
          "PROPANE": 57,
          "BUTANE": 45
      },
      {
          "PERIOD_START_DT": "10/23/2023",
          "PROPANE": 39,
          "BUTANE": 45
      },
      {
          "PERIOD_START_DT": "10/24/2023",
          "PROPANE": 31,
          "BUTANE": 51
      },
      {
          "PERIOD_START_DT": "10/25/2023",
          "PROPANE": 28,
          "BUTANE": 51
      },
      {
          "PERIOD_START_DT": "10/26/2023",
          "PROPANE": 28,
          "BUTANE": 51
      },
      {
          "PERIOD_START_DT": "10/27/2023",
          "PROPANE": 23,
          "BUTANE": 51
      },
      {
          "PERIOD_START_DT": "10/28/2023",
          "PROPANE": 23,
          "BUTANE": 51
      },
      {
          "PERIOD_START_DT": "10/29/2023",
          "PROPANE": 23,
          "BUTANE": 51
      },
      {
          "PERIOD_START_DT": "10/30/2023",
          "PROPANE": 23,
          "BUTANE": 120
      },
      {
          "PERIOD_START_DT": "10/31/2023",
          "PROPANE": 21,
          "BUTANE": 51
      }
  ]
}