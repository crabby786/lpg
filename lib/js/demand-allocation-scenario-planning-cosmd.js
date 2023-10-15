var monthyear = $("#datepicker1").html();
console.log(monthyear);
// to get values for scenario data
// this return value json object will be stored in scenario data
var scenarioData = function () {
    var tmp = null;
    $.ajax({
        url: 'https://cs-action.aramco.com/SASJobExecution/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Read&PLANNING_MONTH=MAY2023',
        dataType: "json",
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
            $('.overlay').show();
        },
        success: function (data) {
            // console.log(parse.JSON(data));
            $('.overlay').hide();
            tmp = data;
        }
    });
    return tmp;
}();

var eastCount = 0;
var westCount = 0;
var pushDaysEast = [];
var pushDaysWest = [];
// var pushDaysTotal = [];
if (scenarioData.DATA != "") {
    $.each(scenarioData.DATA, function (index, scenario) {
        if (scenario.REGION === "EAST" && scenario.NOMINATION_TEMP_KEY) {
            //To Calculate Average Delays in east
            var startDate = new Date(scenario.SCENARIO_DATE);
            var endDate = new Date(scenario.NOMINATION_DATE);
            var nomTempKey = scenario.NOMINATION_TEMP_KEY;
            if (nomTempKey !== null) {
                var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                pushDaysEast.push(diffDays);
            }
            //To Calculate total count of nominations in east
            eastCount++;
        } else {
            //To Calculate total count of nominations in west
            var startDate = new Date(scenario.SCENARIO_DATE);
            var endDate = new Date(scenario.NOMINATION_DATE);
            var nomTempKey = scenario.NOMINATION_TEMP_KEY;
            if (nomTempKey !== null) {
                var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                pushDaysWest.push(diffDays);
            }
            //To Calculate total count of nominations in east
            westCount++;
        }
    });
}

totalCount = eastCount + westCount;
$("#nomEast").html(eastCount);
$("#nomWest").html(westCount);
$("#totalNominations").html(totalCount);

$("#lastSaved").html(scenarioData.DATA[0].UPDATED_DTTM);
$("#version").html(scenarioData.DATA[0].SCENARIO_PLANNING_VERSION);
$("#ospasSubmitStatus").html(scenarioData.TOLERANCE[0].SCENARIO_PLANNING_STATUS);
// to get values for Revert Last Saved Version
// this return value json object will be stored in Revert Last Saved Version
revertData = null;
// $("#revertLastSavedVersion").dxButton({
//     onClick: function () {
//         // var tabPanel = $("#tabpanel-container").dxTabPanel("instance");
//         $('#loadPanelContainer').dxLoadPanel("show");
//         var revertData = function () {
//             var tmp = null;
//             $.ajax({
//                 url: 'https://cs-action.aramco.com/SASJobExecution/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Revert%20Last%20Saved&PLANNING_MONTH=MAY2023',
//                 dataType: "json",
//                 async: false,
//                 beforeSend: function (xhr) {
//                     xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
//                     $('.overlay').show();
//                 },
//                 success: function (data) {
//                     $('.overlay').hide();
//                     tmp = data;
//                 }
//             });
//             return tmp;
//         }();
//         // e.component.getDataSource('instance')._items
//         scenarioData = revertData;
//         $('#loadPanelContainer').dxLoadPanel("hide");
//         // $("#tabpanel-container").dxTabPanel("getDataSource").reload();
//         $("#myGrid").dxDataGrid("instance").refresh();
//     }
// });

// to get values for generate nomination suggestion
// this return value json object will be stored in generate nomination suggestion
// $('#idNominationSuggestion').click(function () {
//     var generateNominationSuggestion = function () {
//         var tmp = null;
//         $.ajax({
//             url: '',
//             dataType: "json",
//             async: false,
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
//                 $('.overlay').show();
//             },
//             success: function (data) {
//                 tmp = data;
//                 $('.overlay').hide();
//             }
//         });
//         return generateNominationSuggestion;
//     }();
// });

// to get values for scenario data last saved version
// this return value json object will be stored in scenario data to last saved version
// $(document).on('click', '#idLastSavedVersion', function () {
//     var scenarioOldData = function () {
//         alert("Hi");
//         var tmp = null;
//         $.ajax({
//             url: 'https://cs-action.aramco.com/SASJobExecution/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Revert%20Last%20Saved&PLANNING_MONTH=MAY2023',
//             dataType: "json",
//             async: false,
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
//                 $('.overlay').show();
//             },
//             success: function (data) {
//                 $('.overlay').hide();
//                 tmp = data;
//             }
//         });
//         return tmp;
//     }();
//     scenarioData = scenarioOldData;
//     alert(scenarioData);
// });

const eastDate = [];

for (let i = 0; i < scenarioData.DATA.length - 1; i++) {
    const currentObject = scenarioData.DATA[i];
    const nextObject = scenarioData.DATA[i + 1];

    if (
        currentObject.SCENARIO_DATE === nextObject.SCENARIO_DATE &&
        currentObject.CUSTOMER_NAME !== "" &&
        nextObject.CUSTOMER_NAME !== ""
    ) {
        eastDate.push(currentObject);
        eastDate.push(nextObject);
    }
}

console.log(eastDate);

// Filter the DATA array based on region
// const eastDate = result.filter((item) => item.REGION === "EAST");
const westDate = scenarioData.DATA.filter((item) => item.REGION === "WEST" && item.CUSTOMER_NAME !== "");

// Extract unique dates from the filtered data
const eastDateArray = [...new Set(eastDate.map((item) => item.SCENARIO_DATE))];
const westDateArray = [...new Set(scenarioData.SLOT_AVAILABILITY.map((item) => item.DAY))];

var tolerance = scenarioData.TOLERANCE;
var eastTolPropane = tolerance[0].TOLERANCE_PROPANE;
var eastTolButane = tolerance[0].TOLERANCE_BUTANE;

var westTolPropane = tolerance[1].TOLERANCE_PROPANE;
var westTolButane = tolerance[1].TOLERANCE_BUTANE;

var now = new Date();
var nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
var nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);

var eastData = scenarioData.DATA.filter(function (item) {
    return item.REGION === "EAST";
});

var westData = scenarioData.DATA.filter(function (item) {
    return item.REGION === "WEST";
});

function getDatesOfNextMonth() {
    // Get the current date
    var currentDate = new Date();

    // Calculate the first day of the next month
    var nextMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
    );

    // Create an array to store the formatted dates and data
    var datesArray = [];

    // Initialize the date number
    var dateNumber = 1;
    var planningMonth = moment(nextMonth).format("MMMYYYY").toUpperCase();

    // Loop through each day of the month and add it to the array
    while (nextMonth.getMonth() === currentDate.getMonth() + 1) {
        var formattedDate = moment(nextMonth).format("DDMMMYYYY").toUpperCase(); // Format the date using Moment.js

        // Find all matching entries in the eastData array based on SCENARIO_DATE
        var matchingEntries = eastData.filter(function (entry) {
            return entry.SCENARIO_DATE === formattedDate;
        });

        // Calculate the number of rows to add for each date
        var rowsToAdd = dateNumber >= 4 ? 2 : 1;

        for (var i = 0; i < rowsToAdd; i++) {
            if (matchingEntries.length > 0) {
                // If matching entries are found, add all of them to datesArray
                matchingEntries.forEach(function (entry) {
                    var newData = {
                        ...entry,
                        PLANNING_MONTH: planningMonth,
                        ROW_ORDER: dateNumber,
                    };
                    datesArray.push(newData);
                });
            } else {
                // If no matching entry is found, create a new object with default values
                var newData = {
                    PLANNING_MONTH: planningMonth,
                    REGION: "EAST",
                    TERMINAL_ID: "A004",
                    LOCK_NOMINATION: "N",
                    SCENARIO_DATE: formattedDate,
                    OPENING_INVENTORY_PROPANE: null,
                    OPENING_INVENTORY_BUTANE: null,
                    TERMINAL_AVAILS_PROPANE: null,
                    TERMINAL_AVAILS_BUTANE: null,
                    MIN_SAFE_INVENTORY_PROPANE: null,
                    MIN_SAFE_INVENTORY_BUTANE: null,
                    MAX_SAFE_INVENTORY_PROPANE: null,
                    MAX_SAFE_INVENTORY_BUTANE: null,
                    CUSTOMER_ID: "",
                    CUSTOMER_NAME: "",
                    NOMINATION_TEMP_KEY: null,
                    CUSTOMER_LIFTING_PROPANE: null,
                    CUSTOMER_LIFTING_BUTANE: null,
                    SCENARIO_PLANNING_VERSION: 1,
                    SCENARIO_PLANNING_SUB_VERSION: 2,
                    PLAN_CYCLE_CLICK_VERSION: 3,
                    NOMINATION_DATE: formattedDate,
                    NOMINATION_REGION: "EAST",
                    NOMINATION_TERMINAL_ID: "A004",
                    NOMINATION_CUSTOMER_LIFTING_PROP: null,
                    NOMINATION_CUSTOMER_LIFTING_BUTA: null,
                    ROW_ORDER: dateNumber,
                };
                datesArray.push(newData);
            }
            dateNumber++;
        }
        nextMonth.setDate(nextMonth.getDate() + 1);
    }
    return datesArray;
}
var datesOfNextMonth = getDatesOfNextMonth();

function westDatesOfNextMonth() {
    var currentDate = new Date();

    // Calculate the first day of the next month
    var nextMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
    );

    // Create an array to store the formatted dates and data
    var datesArray = [];

    // Initialize the date number
    var dateNumber = 1;
    var planningMonth = moment(nextMonth).format("MMMYYYY").toUpperCase();

    // Loop through each day of the month and add it to the array
    while (nextMonth.getMonth() === currentDate.getMonth() + 1) {
        var formattedDate = moment(nextMonth).format("DDMMMYYYY").toUpperCase(); // Format the date using Moment.js

        // Find all matching entries in the eastData array based on SCENARIO_DATE
        var matchingEntries = westData.filter(function (entry) {
            return entry.SCENARIO_DATE === formattedDate;
        });

        // Calculate the number of rows to add for each date

        if (matchingEntries.length > 0) {
            // If matching entries are found, add all of them to datesArray
            matchingEntries.forEach(function (entry) {
                var newData = {
                    ...entry,
                    PLANNING_MONTH: planningMonth,
                    ROW_ORDER: dateNumber,
                };
                datesArray.push(newData);
            });
        } else {
            // If no matching entry is found, create a new object with default values
            var newData = {
                PLANNING_MONTH: planningMonth,
                REGION: "EAST",
                TERMINAL_ID: "A004",
                LOCK_NOMINATION: "N",
                SCENARIO_DATE: formattedDate,
                OPENING_INVENTORY_PROPANE: null,
                OPENING_INVENTORY_BUTANE: null,
                TERMINAL_AVAILS_PROPANE: null,
                TERMINAL_AVAILS_BUTANE: null,
                MIN_SAFE_INVENTORY_PROPANE: null,
                MIN_SAFE_INVENTORY_BUTANE: null,
                MAX_SAFE_INVENTORY_PROPANE: null,
                MAX_SAFE_INVENTORY_BUTANE: null,
                CUSTOMER_ID: "",
                CUSTOMER_NAME: "",
                NOMINATION_TEMP_KEY: null,
                CUSTOMER_LIFTING_PROPANE: null,
                CUSTOMER_LIFTING_BUTANE: null,
                SCENARIO_PLANNING_VERSION: 1,
                SCENARIO_PLANNING_SUB_VERSION: 2,
                PLAN_CYCLE_CLICK_VERSION: 3,
                NOMINATION_DATE: formattedDate,
                CREATED_BY: "unxsas",
                CREATED_DTTM: "07JUN2023:16:34:25",
                UPDATED_BY: "unxsas",
                UPDATED_DTTM: "07JUN2023:16:34:25",
                BUSINESS_UNIT: "COSMD",
                ROW_COUNT: 2,
                NOMINATION_REGION: "EAST",
                NOMINATION_TERMINAL_ID: "A004",
                NOMINATION_CUSTOMER_LIFTING_PROP: null,
                NOMINATION_CUSTOMER_LIFTING_BUTA: null,
                ROW_ORDER: dateNumber,
            };
            datesArray.push(newData);
        }
        nextMonth.setDate(nextMonth.getDate() + 1);
        dateNumber++;
    }
    return datesArray;
}
var westDatesOfMonth = westDatesOfNextMonth();
console.log(westDatesOfMonth);
var eastRemovedData = [];
var eastRowIndex = null;

var westRemovedData = [];

var eastDelaydays = 0;
var westDelaydays = 0;


totalCount = eastCount + westCount;
$("#nomEast").html(eastCount);
$("#nomWest").html(westCount);
$("#totalNominations").html(totalCount);

reCalculateTotals(datesOfNextMonth);
reCalculateTotals(westDatesOfMonth);

var grid = $("#tabpanel-container").dxTabPanel({
    deferRendering: true,
    items: [{
        title: "East",
        icon: "rowfield",
        keyExpr: 'NOMINATION_TEMP_KEY',
        showBorders: true,
        itemClick: function (e) {
            var selectInd = e.component.option('selectedIndex');
            console.log('selectInd', selectInd);
            console.log('al', e.component.option());
        },
        template: function (itemData, itemIndex, element) {
            console.log(itemData, itemIndex);
            let dataGridDiv = $("<div id='eastGrid'>");
            dataGridDiv.appendTo(element);
            dataGridDiv.dxDataGrid({
                dataSource: datesOfNextMonth,
                sorting: {
                    mode: "none"
                },
                onRowPrepared: function (e) {
                    if (e.rowType === "data") {
                        if (
                            e.data.REGION !== e.data.NOMINATION_REGION
                        ) {
                            e.rowElement.addClass("new-added-row"); // Change the background color as needed
                        }
                    }
                },
                rowAlternationEnabled: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: false,
                showBorders: true,
                // height: 500,
                // direction: 'vertical',
                columnFixing: {
                    enabled: true,
                },
                paging: false,
                editing: {
                    mode: 'cell',
                    allowUpdating: true,
                },
                onInitialized: function (e) {
                    reCalculateTotals(datesOfNextMonth);
                    $('#eastPropaneChart').hide();
                    // var tolp = scenarioData.TOLERANCE[0].TOLERANCE_PROPANE;
                    // var tolb = scenarioData.TOLERANCE[0].TOLERANCE_BUTANE;

                    // var eastTab = $("<div>").dxTextBox({
                    //     onValueChanged: function (e) {
                    //         var value = e.value;
                    //         console.log(value)
                    //     }
                    // }).dxTextBox("instance");
                    // // console.log("asdasd", eastTab, "gibni", tolp, "asdas", tolb);
                },
                rowDragging: {
                    allowReordering: true,
                    onReorder(e) {
                        const visibleRows = e.component.getVisibleRows();
                        const toIndex = eastData.findIndex((item) => item.ROW_ORDER === (visibleRows[e.toIndex].data.ROW_ORDER));
                        const fromIndex = eastData.findIndex((item) => item.ROW_ORDER === e.itemData.ROW_ORDER);
                        // eastData.splice(fromIndex, 1);
                        // eastData.splice(toIndex, 0, e.itemData);

                        if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
                            // [eastData[toIndex]], eastData[fromIndex] = [eastData[fromIndex], eastData[toIndex]];
                            // e.component.refresh();
                            const temp = eastData[fromIndex];
                            eastData[fromIndex] = eastData[toIndex];
                            eastData[toIndex] = temp;

                            $("#eastGrid").dxDataGrid("instance").refresh();
                        }
                        // console.log(fromIndex, toIndex, eastData);

                        reCalculateDraggedTotals(datesOfNextMonth, toIndex, fromIndex);
                        $("#eastGrid").dxDataGrid("instance").refresh();
                        getAvgDelay();
                    },
                },
                onDrag: function (e) {
                    console.log(e);
                    console.log(e.pageY, e.event.target.getBoundingClientRect().top);
                    var dragDistance = e.event.pageY - e.event.target.getBoundingClientRect().top;
                    console.log(dragDistance);
                },
                onRowDragStart: function (e) {
                    e.component.option("drggedRowData", e.data);
                },
                onRowDropped: function (e) {
                    var draggedRowData = e.component.option("draggedRowData");
                    const toIndex = eastData.findIndex((item) => item.ROW_ORDER === visibleRows[e.toIndex].data.ROW_ORDER);
                    const fromIndex = eastData.findIndex((item) => item.ROW_ORDER === e.itemData.ROW_ORDER);
                    var targetData = e.dropInside ? e.component.getVisibleRows()[e.toIndex].data : e.component.getVisibleRows()[e.toIndex - 1].data;
                    // console.log(draggedRowData.SCENARIO_DATE + " , " + targetData.NOMINATION_DATE + "," + targetData.NOMINATION_TEMP_KEY);

                    getOnTimeAction(draggedRowData.SCENARIO_DATE, targetData.NOMINATION_DATE);
                    targetData.NOMINATION_DATE = draggedRowData.SCENARIO_DATE;
                    reCalculateDraggedTotals(datesOfNextMonth, toIndex, fromIndex);
                    e.component.refresh();
                },
                onEditorPreparing: function (e) {
                    // console.log(e);
                    if (e.dataField == "OPENING_INVENTORY_PROPANE") {
                        if (e.row.rowIndex === 0) {
                            e.cancel = false;
                        } else {
                            e.cancel = true;
                        }
                    }

                    if (e.dataField == "OPENING_INVENTORY_BUTANE") {
                        if (e.row.rowIndex === 0) {
                            e.cancel = false;
                        } else {
                            e.cancel = true;
                        }
                    }

                },
                onEditorPrepared: function (e) {
                    var newData = reCalculateTotals(e.component.option('dataSource'));
                    e.component.refresh(true);
                    getAvgDelay();
                },
                onCellClick: function (e) {
                    var columnIndex = e.columnIndex;
                    var rowIndex = e.rowIndex;

                    // Check if the clicked cell contains a button element
                    if (columnIndex >= 0 && rowIndex >= 0) {
                        var cellElement = e.cellElement;
                        var buttonElement = $(cellElement).find("button");
                        if (buttonElement.length > 0) {
                            // Handle button click event
                            eastRowIndex = rowIndex;
                        }
                    }
                },
                columns: [{
                    caption: "Action",
                    width: 80,
                    alignment: "center",
                    cellTemplate: function (container, options) {
                        // Create a container div
                        var iconsContainer = $("<div>").addClass("icons-container").appendTo(container);
                        // Calendar icon
                        $("<button>").addClass("calendar-icon mr-2")
                            .append($("<i>").addClass("fa fa-calendar"))
                            .attr("disabled", options.data.CUSTOMER_NAME === "")
                            .on("click", function () {
                                const rowData = options.data;

                                var popup = $("<div>").addClass("calendar-popup").dxPopover({
                                    title: "Calendar",
                                    target: ".calendar-popup",
                                    position: "bottom",
                                    contentTemplate: function (
                                        contentElement
                                    ) {
                                        // Get the current date
                                        var currentDate =
                                            new Date();
                                        // Set the next month as the value for the calendar
                                        var nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
                                        // Create and append the calendar widget
                                        $("<div>")
                                            .dxCalendar({
                                                value: nextMonth,
                                                disabledDates: westDateArray.map((item) => new Date(item)),
                                                onValueChanged:
                                                    function (e) {
                                                        var selectedDate = e.value;
                                                        var formattedDate = moment(selectedDate).format("DDMMMYYYY").toUpperCase();
                                                        var existingRowIndex = -1;

                                                        for (var i = 0; i < westDatesOfMonth.length; i++) {
                                                            if (westDatesOfMonth[i].SCENARIO_DATE === formattedDate) {
                                                                existingRowIndex = i;
                                                                break;
                                                            }
                                                        }
                                                        const newEast =
                                                        {
                                                            PLANNING_MONTH: "JUL2023",
                                                            REGION: "WEST",
                                                            TERMINAL_ID: rowData.TERMINAL_ID,
                                                            LOCK_NOMINATION: rowData.LOCK_NOMINATION,
                                                            SCENARIO_DATE: formattedDate,
                                                            TERMINAL_AVAILS_PROPANE: rowData.TERMINAL_AVAILS_PROPANE,
                                                            TERMINAL_AVAILS_BUTANE: rowData.TERMINAL_AVAILS_BUTANE,
                                                            CUSTOMER_ID: rowData.CUSTOMER_ID,
                                                            CUSTOMER_NAME: rowData.CUSTOMER_NAME,
                                                            NOMINATION_TEMP_KEY: rowData.NOMINATION_TEMP_KEY,
                                                            CUSTOMER_LIFTING_PROPANE: rowData.CUSTOMER_LIFTING_PROPANE,
                                                            CUSTOMER_LIFTING_BUTANE: rowData.CUSTOMER_LIFTING_BUTANE,
                                                            SCENARIO_PLANNING_VERSION: rowData.SCENARIO_PLANNING_VERSION,
                                                            SCENARIO_PLANNING_SUB_VERSION: rowData.SCENARIO_PLANNING_SUB_VERSION,
                                                            PLAN_CYCLE_CLICK_VERSION: rowData.PLAN_CYCLE_CLICK_VERSION,
                                                            NOMINATION_DATE: rowData.NOMINATION_DATE,
                                                            CREATED_BY: rowData.CREATED_BY,
                                                            CREATED_DTTM: rowData.CREATED_DTTM,
                                                            UPDATED_BY: rowData.UPDATED_BY,
                                                            UPDATED_DTTM: rowData.UPDATED_DTTM,
                                                            BUSINESS_UNIT: rowData.BUSINESS_UNIT,
                                                            ROW_COUNT: rowData.ROW_COUNT,
                                                            NOMINATION_REGION: "EAST",
                                                            NOMINATION_TERMINAL_ID: rowData.NOMINATION_TERMINAL_ID,
                                                            ROW_ORDER: 1,
                                                        };

                                                        if (existingRowIndex >= 0) {
                                                            westDatesOfMonth[existingRowIndex] = newEast;
                                                        } else {
                                                            westDatesOfMonth.push(newEast);
                                                        }

                                                        var object = datesOfNextMonth.find((obj) => obj.CUSTOMER_NAME === rowData.CUSTOMER_NAME);

                                                        if (object) {
                                                            // Create a copy of the object
                                                            var updatedObject = { ...object, };

                                                            // Modify the copied object
                                                            updatedObject.CUSTOMER_NAME = "";
                                                            updatedObject.CUSTOMER_ID = "";
                                                            updatedObject.NOMINATION_TEMP_KEY = null;
                                                            updatedObject.CUSTOMER_LIFTING_PROPANE = null;
                                                            updatedObject.CUSTOMER_LIFTING_BUTANE = null;

                                                            // Update the original object in datesOfNextMonth
                                                            var index = datesOfNextMonth.indexOf(object);
                                                            datesOfNextMonth[index] = updatedObject;
                                                        }

                                                        $("#tabpanel-container #eastGrid").dxDataGrid("instance").option("dataSource", datesOfNextMonth);
                                                        $("#tabpanel-container #westGrid").dxDataGrid("instance").option("dataSource", westDatesOfMonth);
                                                    },
                                            }).appendTo(contentElement);

                                        var nextLink = $("a.dx-widget.dx-button.dx-button-mode-contained.dx-button-normal.dx-button-has-icon.dx-calendar-navigator-next-view.dx-calendar-navigator-next-month");
                                        var prevLink = $("a.dx-widget.dx-button.dx-button-mode-contained.dx-button-normal.dx-button-has-icon.dx-calendar-navigator-previous-view.dx-calendar-navigator-previous-month");
                                        var headerTitle = $("a.dx-widget.dx-button.dx-button-mode-contained.dx-button-normal.dx-button-has-text.dx-calendar-caption-button");

                                        // Get the icon HTML from the <a> tags
                                        var nextIconHtml = nextLink.find("i").prop("outerHTML");
                                        var prevIconHtml = prevLink.find("i").prop("outerHTML");
                                        var headerTitleHtml = headerTitle.find("div").prop("outerHTML");

                                        var nextButton = $("<button>").attr("type", "button")
                                            .addClass("dx-widget dx-button dx-button-mode-contained dx-button-normal dx-button-has-icon dx-calendar-navigator-next-view dx-calendar-navigator-next-month")
                                            .html(nextIconHtml);

                                        var prevButton = $("<button>").attr("type", "button")
                                            .addClass("dx-widget dx-button dx-button-mode-contained dx-button-normal dx-button-has-icon dx-calendar-navigator-previous-view dx-calendar-navigator-previous-month")
                                            .html(prevIconHtml);

                                        var titleButton = $("<button>").attr("type", "button")
                                            .addClass("dx-widget dx-button dx-button-mode-contained dx-button-normal dx-button-has-text dx-calendar-caption-button")
                                            .html(headerTitleHtml);

                                        nextLink.replaceWith(nextButton);
                                        prevLink.replaceWith(prevButton);
                                        headerTitle.replaceWith(titleButton);
                                    },
                                    onHidden: function () {
                                        // Cleanup when the popup is closed
                                        popup.remove();
                                    },
                                }).appendTo(container);
                                popup.dxPopover("show");
                                // $(".dx-icon-chevronright").prop("disabled",true)
                            }).appendTo(iconsContainer);

                        // Clear nomination key
                        $("<button>").addClass("cancel-icon table-btn mr-2").append($("<i>"))
                            .addClass("fa fa-xmark").attr("disabled", options.data.CUSTOMER_NAME === "")
                            .on("click", function () {
                                //  TODO: Make this row specific
                                $(".cancel-icon").css("display", "none");

                                $("<button>").addClass("undo-icon table-btn mr-2").append(
                                    $("<i>").addClass("fa fa-rotate-left")
                                ).appendTo(iconsContainer);
                            }).appendTo(iconsContainer);

                        // customer dropdown
                        if (eastRemovedData.length > 0) {
                            $("<button>").addClass("listing-icon table-btn mr-2")
                                .append($("<i>").addClass("fa fa-caret-down")
                                ).appendTo(iconsContainer).on("click", function () {
                                    var popover = $("<div>").addClass("listing-popup").dxPopover({
                                        target: ".listing-popup",
                                        placement: "bottom",
                                        contentTemplate: function (contentElement) {
                                            var customerList = $("<div>").addClass("customer-popover");
                                            var ulElement = $("<ul style='list-style-type: none'>");

                                            eastRemovedData.forEach(function (dataItem) {
                                                var liElement = $("<li>").text(dataItem["CUSTOMER_NAME"])
                                                    .on("click", function () {
                                                        // TODO: Refresh the grid
                                                        alert("Popover content clicked");
                                                    }
                                                    );
                                                ulElement.append(liElement);
                                            });

                                            customerList.append(ulElement);
                                            contentElement.append(customerList);
                                        },
                                        onShown: function (e) {
                                            var popoverContent = e.component.content();
                                            popoverContent.trigger("click");
                                        },
                                        onHidden: function () {
                                            $(".customer-popover").remove();
                                            $(".listing-popup").remove();
                                        },
                                    }).appendTo(container);
                                    popover.dxPopover("show");
                                });
                        }
                    },
                },
                {
                    dataField: "LOCK_NOMINATION",
                    caption: "Lock Nomination",
                    allowEditing: false,
                    width: 50,
                    alignment: "center",
                    cellTemplate: function (container, options) {
                        $("<div>").addClass("dx-checkbox")
                            .dxCheckBox({
                                value: options.data.LOCK_NOMINATION === "Y",
                                onValueChanged: function (e) {
                                    var newValue = e.value ? "Y" : "N";
                                    options.data.LOCK_NOMINATION = newValue;
                                }
                            }).appendTo(container);
                    }
                },
                {
                    dataField: "SCENARIO_DATE",
                    caption: "Date",
                    sortIndex: 0,
                    sortOrder: "asc",
                    calculateSortValue: function (rowData) {
                        return new Date(rowData.SCENARIO_DATE);
                    },
                    // showSortIndexes: false
                },

                {
                    caption: "Opening Inventory",
                    columns: [
                        {
                            caption: "Propane",
                            dataField: "OPENING_INVENTORY_PROPANE",
                            format: { type: "fixedPoint", precision: 2 },
                            cellTemplate: function (container, options) {
                                var isEditable = options.column.allowEditing && options.rowType === 'data' && options.rowIndex === 0;
                                if (isEditable) {
                                    container.css("background-color", "#fff2cc");
                                }
                                container.text(options.text);
                            }
                        },
                        {
                            caption: "Butane",
                            dataField: "OPENING_INVENTORY_BUTANE",
                            format: { type: "fixedPoint", precision: 2 },
                            cellTemplate: function (container, options) {
                                var isEditable = options.column.allowEditing && options.rowType === 'data' && options.rowIndex === 0;
                                if (isEditable) {
                                    container.css("background-color", "#fff2cc");
                                }
                                container.text(options.text);
                            }
                        }
                    ]
                },
                {
                    caption: "Terminal Avails",
                    columns: [
                        {
                            caption: "Propane",
                            dataField: "TERMINAL_AVAILS_PROPANE",
                            allowEditing: true,
                            cellTemplate: function (container, options) {
                                var isEditable = options.column.allowEditing && options.rowType === 'data';
                                if (isEditable) {
                                    container.css("background-color", "#fff2cc");
                                }
                                container.text(options.text);
                            }
                        },
                        {
                            caption: "Butane",
                            dataField: "TERMINAL_AVAILS_BUTANE",
                            allowEditing: true,
                            cellTemplate: function (container, options) {
                                var isEditable = options.column.allowEditing && options.rowType === 'data';
                                if (isEditable) {
                                    container.css("background-color", "#fff2cc");
                                }
                                container.text(options.text);
                            }
                        }
                    ]
                },
                {
                    dataField: "CUSTOMER_NAME",
                    caption: "Customer",
                    allowEditing: false,
                },
                {
                    dataField: "NOMINATION_TEMP_KEY",
                    caption: "Nomination Temp Key",
                    allowEditing: false,
                },
                {
                    caption: "Customer Liftings (KMT)",
                    columns: [
                        {
                            caption: "Propane",
                            allowEditing: true,
                            dataField: "CUSTOMER_LIFTING_PROPANE",
                            cellTemplate: function (container, options) {
                                var isEditable = options.column.allowEditing && options.rowType === 'data';
                                if (isEditable) {
                                    container.css("background-color", "#fff2cc");
                                }
                                container.text(options.text);
                            }
                        },
                        {
                            caption: "Butane",
                            allowEditing: true,
                            dataField: "CUSTOMER_LIFTING_BUTANE",
                            cellTemplate: function (container, options) {
                                var isEditable = options.column.allowEditing && options.rowType === 'data';
                                if (isEditable) {
                                    container.css("background-color", "#fff2cc");
                                }
                                container.text(options.text);
                            }
                        }
                    ]
                },
                {
                    caption: "Customer Liftings (MB)",
                    columns: [
                        {
                            caption: "Propane",
                            allowEditing: false,
                            // dataField: "CUSTOMER_LIFTINGS_PROPANE_MB"
                            calculateCellValue: function (rowData) {
                                return rowData.CLOSING_INVENTORY_PROPANE;
                            }
                        },
                        {
                            caption: "Butane",
                            allowEditing: false,
                            calculateCellValue: function (rowData) {
                                return rowData.CLOSING_INVENTORY_PROPANE;
                            }
                            // dataField: "CUSTOMER_LIFTINGS_BUTANE_MB"
                        }
                    ]
                },
                {
                    caption: "Closing Inventory",
                    columns: [
                        {
                            caption: "Propane",
                            allowEditing: false,
                            calculateCellValue: function (rowData) {
                                return rowData.CLOSING_INVENTORY_PROPANE;
                            }
                        },
                        {
                            caption: "Butane",
                            allowEditing: false,
                            calculateCellValue: function (rowData) {
                                return rowData.CLOSING_INVENTORY_BUTANE;
                            }
                        }
                    ]
                },
                {
                    caption: "Closing Percentage",
                    columns: [
                        {
                            caption: "Propane",
                            allowEditing: false,
                            format: "percent",
                            alignment: "right",
                            dataType: "number",
                            // dataField: "CLOSING_PERCENTAGE_PROPANE",
                            cellTemplate: function (container, options) {
                                if (options.data.CLOSING_PERCENTAGE_PROPANE == "" || options.data.CLOSING_PERCENTAGE_PROPANE == undefined) {
                                    return "";
                                }
                                const valueDiv = $("<div>").text(options.data.CLOSING_PERCENTAGE_PROPANE + "%");
                                if (options.data.CLOSING_PERCENTAGE_PROPANE < 20 || options.data.CLOSING_PERCENTAGE_PROPANE > 80) {
                                    container.addClass('highlight-cell');
                                }
                                return valueDiv;
                            },

                        },
                        {
                            caption: "Butane",
                            allowEditing: false,
                            format: "percent",
                            alignment: "right",
                            dataType: "number",
                            cellTemplate: function (container, options) {
                                if (options.data.CLOSING_PERCENTAGE_BUTANE == "" || options.data.CLOSING_PERCENTAGE_BUTANE == undefined) {
                                    return "";
                                }
                                const valueDiv = $("<div>").text(options.data.CLOSING_PERCENTAGE_BUTANE + "%");
                                if (options.data.CLOSING_PERCENTAGE_BUTANE < 20 || options.data.CLOSING_PERCENTAGE_BUTANE > 80) {
                                    container.addClass('highlight-cell');
                                }
                                return valueDiv;
                            },
                        }
                    ]
                },
                {
                    // dataField: "NOMINATION_TEMP_KEY",
                    caption: "OnTime/Delayed/Advanced",
                    allowEditing: false,
                    calculateCellValue: function (rowData) {
                        return rowData.ONTIME_ACTION;
                    }
                },
                {
                    // dataField: "NOMINATION_TEMP_KEY",
                    caption: "Days",
                    allowEditing: false,
                    calculateCellValue: function (rowData) {
                        var startDate = new Date(rowData.SCENARIO_DATE);
                        var endDate = new Date(rowData.NOMINATION_DATE);
                        var nomTempKey = rowData.NOMINATION_TEMP_KEY;
                        if (nomTempKey !== null) {
                            var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
                            // console.log("timediff", timeDiff);
                            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                            return diffDays;
                        }
                    }
                },
                ],
            });
            //east Propane Chart
            let eastDataPropaneChartDiv = $("<div id='eastPropaneChart'>");
            eastDataPropaneChartDiv.appendTo(element);
            eastDataPropaneChartDiv.dxChart({
                dataSource: datesOfNextMonth,
                palette: 'Harmony Light',
                title: {
                    text: 'Propane',
                    font: {
                        color: "#10BF78",
                        size: 18,
                        weight: 600
                    }
                },
                valueAxis: [{
                    name: "CUSTOMER_LIFTINGS_PROPANE_MB",
                    position: 'left',
                    // visualRange: [0, 100],
                    visualRangeUpdateMode: 'keep',
                    title: '',
                    constantLines: [
                        {
                            value: 80,
                            width: 2,
                            color: 'red',
                            dashStyle: 'solid', label: {
                                visible: true,
                                text: 'Safe Max'
                            }
                        },
                        {
                            value: 20, width: 2,
                            color: 'red',
                            dashStyle: 'solid', label: {
                                visible: true,
                                text: 'Safe Min'
                            }
                        }
                    ]
                },
                ],
                commonSeriesSettings: {
                    argumentField: 'NOMINATION_DATE',
                    point: {
                        visible: false
                    }
                },
                series:
                    [{
                        type: 'bar',
                        valueField: 'MIN_SAFE_INVENTORY_PROPANE',
                        // axis: 'PropaneGraph',
                        name: 'Min Safe Inventory Propane',
                        color: "#ddd",
                    }, {
                        type: 'line',
                        valueField: 'MAX_SAFE_INVENTORY_PROPANE',
                        // axis: 'PropaneGraph',
                        name: 'Max Safe Inventory Propane',
                        color: "#cccc",
                    }],
                legend: {
                    verticalAlignment: 'bottom',
                    horizontalAlignment: 'center',
                },
            });
            //east butane chart
            let dataButaneChartDiv = $("<div id='eastButaneChart'>");
            dataButaneChartDiv.appendTo(element).hide();

            let formDivEast = $("<div id='eastToleranceForm' style='margin:8px;'>")
            // formDiv.appendTo(element);
            formDivEast.appendTo(element);

            // console.log("asdad",eastTolPropane);
            var formItemsEast = [
                {
                    dataField: "TOLERANCE_PROPANE",
                    label: {
                        text: "Tolerance Propane",
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        onValueChanged: function (e) {
                            eastTolPropane = e.value;
                            reCalculateTotals(datesOfNextMonth);
                            $("#eastGrid").dxDataGrid("instance").refresh();
                        }
                    },
                },
                {
                    dataField: "TOLERANCE_BUTANE",
                    label:
                    {
                        text: "Tolerance Butane",
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        onValueChanged: function (e) {
                            eastTolButane = e.value;
                            reCalculateTotals(datesOfNextMonth);
                            $("#eastGrid").dxDataGrid("instance").refresh();
                        }
                    },
                }
            ];
            formDivEast.dxForm({
                colCount: 4,
                formData: scenarioData.TOLERANCE[0],
                items: formItemsEast
            }).dxForm('instance');
        }
    }, {
        title: "West",
        icon: "rowfield",
        keyExpr: 'NOMINATION_TEMP_KEY',

        showBorders: true,
        template: function (itemData, itemIndex, element) {
            // if(itemIndex == 1 && ) {
            // }

            let dataGridDiv = $("<div id='westGrid'>");
            dataGridDiv.appendTo(element);
            dataGridDiv.dxDataGrid({
                dataSource: westDatesOfMonth,
                sorting: {
                    mode: "none",
                },
                onRowPrepared: function (e) {
                    if (e.rowType === "data") {
                        if (e.data.REGION !== e.data.NOMINATION_REGION) {
                            e.rowElement.addClass("new-added-row"); // Change the background color as needed
                        }
                    }
                },
                rowAlternationEnabled: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: false,
                showBorders: true,
                columnFixing: {
                    enabled: true,
                },

                paging: false,
                onInitialized: function (e) {
                    reCalculateTotals(westDatesOfMonth);
                    // var tolp = scenarioData.TOLERANCE[0].TOLERANCE_PROPANE;
                    // var tolb = scenarioData.TOLERANCE[0].TOLERANCE_BUTANE;

                    // var eastTab = $("<div>").dxTextBox({
                    //     onValueChanged: function (e) {
                    //         var value = e.value;
                    //         console.log(value)
                    //     }
                    // }).dxTextBox("instance");
                    // // console.log("asdasd", eastTab, "gibni", tolp, "asdas", tolb);
                },
                rowDragging: {
                    allowReordering: true,
                    onReorder(e) {
                        const visibleRows = e.component.getVisibleRows();
                        const toIndex = westDatesOfMonth.findIndex((item) => item.ROW_ORDER === visibleRows[e.toIndex].data.ROW_ORDER);
                        const fromIndex = westDatesOfMonth.findIndex((item) => item.ROW_ORDER === e.itemData.ROW_ORDER);

                        if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
                            const temp = westDatesOfMonth[fromIndex];
                            westDatesOfMonth[fromIndex] = westDatesOfMonth[toIndex];
                            westDatesOfMonth[toIndex] = temp;
                            $("#westGrid").dxDataGrid("instance").refresh();
                        }
                        // console.log(fromIndex, toIndex, eastData);

                        reCalculateDraggedTotals(westDatesOfMonth, toIndex, fromIndex);
                        getAvgDelay();
                        $("#westGrid").dxDataGrid("instance").refresh();
                    },
                },
                onRowDragStart: function (e) {
                    e.component.option("drggedRowData", e.data);
                },
                onRowDropped: function (e) {
                    var draggedRowData = e.component.option("draggedRowData");
                    const toIndex = westDatesOfMonth.findIndex((item) => item.ROW_ORDER === visibleRows[e.toIndex].data.ROW_ORDER);
                    const fromIndex = westDatesOfMonth.findIndex((item) => item.ROW_ORDER === e.itemData.ROW_ORDER);
                    var targetData = e.dropInside ? e.component.getVisibleRows()[e.toIndex].data : e.component.getVisibleRows()[e.toIndex - 1].data;
                    getOnTimeAction(draggedRowData.SCENARIO_DATE, targetData.NOMINATION_DATE);
                    targetData.NOMINATION_DATE = draggedRowData.SCENARIO_DATE;
                    reCalculateDraggedTotals(westDatesOfMonth, toIndex, fromIndex);
                    e.component.refresh();
                },
                editing: {
                    mode: "cell",
                    allowUpdating: true,
                },
                onContextMenuPreparing: function (e) {
                    if (e.column.visibleIndex) {
                        e.items = [{
                            text: "Divert to West",
                            onItemClick: function () {
                                if (e.row.rowIndex) {

                                }
                            },
                        }, {
                            text: "Defer/Cancel Nomination",
                            onItemClick: function () {
                                console.log(e.row.rowIndex);
                            }
                        }
                        ]
                    }
                },
                onRowUpdated: function (e) {
                    console.log("asdasd", e);
                    if (e.dataField == "OPENING_INVENTORY_PROPANE") {
                        const editColumnName = e.component.option("editing.editColumnName");
                        let scenarioEastData = e.component.option('dataSource');
                        reCalculateTotals(scenarioEastData);
                        // e.component.cellValue(e.row.rowIndex, editColumnName, e.data);
                    }
                },
                onEditorPreparing: function (e) {
                    console.log(e);
                    if (e.dataField == "OPENING_INVENTORY_PROPANE") {
                        if (e.row.rowIndex === 0) {
                            e.cancel = false;
                        } else {
                            e.cancel = true;
                        }
                    }

                    if (e.dataField == "OPENING_INVENTORY_BUTANE") {
                        if (e.row.rowIndex === 0) {
                            e.cancel = false;
                        } else {
                            e.cancel = true;
                        }
                    }

                },
                onEditorPrepared: function (e) {
                    var newData = reCalculateTotals(e.component.option('dataSource'));
                    e.component.refresh(true);
                },
                columns: [
                    {
                        caption: "Action",
                        width: 80,
                        alignment: "center",
                        cellTemplate: function (container, options) {
                            // Create a container div
                            var iconsContainer = $("<div>")
                                .addClass("icons-container")
                                .appendTo(container);

                            // Calendar icon
                            $("<button>").addClass("calendar-icon table-btn mr-2").append(
                                $("<i>").addClass(
                                    "fa fa-calendar fa-solid"
                                )
                            ).attr("disabled", options.data.CUSTOMER_NAME === "").on("click", function () {
                                const rowData = options.data;

                                var popup = $("<div>").addClass("calendar-popup").dxPopover({
                                    title: "Calendar",
                                    target: ".calendar-popup",
                                    position: "bottom",
                                    contentTemplate: function (contentElement) {
                                        // Get the current date
                                        var currentDate = new Date();

                                        // Set the next month as the value for the calendar
                                        var nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

                                        // Create and append the calendar widget
                                        $("<div>").dxCalendar({
                                            value: nextMonth,
                                            disabledDates: eastDateArray.map((item) => new Date(item)),
                                            onValueChanged:
                                                function (e) {
                                                    var selectedDate = e.value;
                                                    var formattedDate = moment(selectedDate).format("DDMMMYYYY").toUpperCase();

                                                    // Find the index of the existing row with the selected date
                                                    var existingRowIndex = -1;
                                                    for (var i = 0; i < datesOfNextMonth.length; i++) {
                                                        if (datesOfNextMonth[i].SCENARIO_DATE === formattedDate) {
                                                            let eastTable = $("#eastGrid").find(".dx-datagrid-table.dx-datagrid-table-fixed");
                                                            let eastRows = eastTable.find("tr:eq(" + i + ")");
                                                            let customerName = eastRows.find("td:eq(8)").text();
                                                            if (customerName.trim() === "") {
                                                                existingRowIndex = i;
                                                            } else {
                                                                existingRowIndex = i + 1;

                                                                var disabledDates = eastDateArray.map((item) => new Date(item));
                                                                var disabledFormattedDate = moment(selectedDate, "DDMMMYYYY").toDate();
                                                                disabledDates.push(disabledFormattedDate);

                                                                $(".calendar-popup").dxCalendar();
                                                                var calendarInstance = $(".calendar-popup").dxCalendar("instance");
                                                                calendarInstance.option("disabledDates", disabledDates);
                                                            }
                                                            break;
                                                        }
                                                    }

                                                    // Create a newEast object
                                                    const newEast =
                                                    {
                                                        PLANNING_MONTH: "JUL2023",
                                                        REGION: "EAST",
                                                        TERMINAL_ID: rowData.TERMINAL_ID,
                                                        LOCK_NOMINATION: rowData.LOCK_NOMINATION,
                                                        SCENARIO_DATE: formattedDate,
                                                        TERMINAL_AVAILS_PROPANE: rowData.TERMINAL_AVAILS_PROPANE,
                                                        TERMINAL_AVAILS_BUTANE: rowData.TERMINAL_AVAILS_BUTANE,
                                                        CUSTOMER_ID: rowData.CUSTOMER_ID,
                                                        CUSTOMER_NAME: rowData.CUSTOMER_NAME,
                                                        NOMINATION_TEMP_KEY: rowData.NOMINATION_TEMP_KEY,
                                                        CUSTOMER_LIFTING_PROPANE: rowData.CUSTOMER_LIFTING_PROPANE,
                                                        CUSTOMER_LIFTING_BUTANE: rowData.CUSTOMER_LIFTING_BUTANE,
                                                        SCENARIO_PLANNING_VERSION: rowData.SCENARIO_PLANNING_VERSION,
                                                        SCENARIO_PLANNING_SUB_VERSION: rowData.SCENARIO_PLANNING_SUB_VERSION,
                                                        PLAN_CYCLE_CLICK_VERSION: rowData.PLAN_CYCLE_CLICK_VERSION,
                                                        NOMINATION_DATE: rowData.NOMINATION_DATE,
                                                        CREATED_BY: rowData.CREATED_BY,
                                                        CREATED_DTTM: rowData.CREATED_DTTM,
                                                        UPDATED_BY: rowData.UPDATED_BY,
                                                        UPDATED_DTTM: rowData.UPDATED_DTTM,
                                                        BUSINESS_UNIT: rowData.BUSINESS_UNIT,
                                                        ROW_COUNT: rowData.ROW_COUNT,
                                                        NOMINATION_REGION: "WEST",
                                                        NOMINATION_TERMINAL_ID: rowData.NOMINATION_TERMINAL_ID,
                                                        ROW_ORDER: 1,
                                                    };

                                                    // Replace the existing row or add a new row based on the index
                                                    if (existingRowIndex >= 0) {
                                                        datesOfNextMonth[existingRowIndex] = newEast;
                                                    } else {
                                                        datesOfNextMonth.push(newEast);
                                                    }

                                                    // Reset the necessary fields in rowData
                                                    var object = westDatesOfMonth.find((obj) => obj.CUSTOMER_NAME === rowData.CUSTOMER_NAME);

                                                    if (object) {
                                                        // Create a copy of the object
                                                        var updatedObject = { ...object, };

                                                        // Modify the copied object
                                                        updatedObject.CUSTOMER_NAME = "";
                                                        updatedObject.CUSTOMER_ID = "";
                                                        updatedObject.NOMINATION_TEMP_KEY = null;
                                                        updatedObject.CUSTOMER_LIFTING_PROPANE = null;
                                                        updatedObject.CUSTOMER_LIFTING_BUTANE = null;

                                                        // Update the original object in westDatesOfMonth
                                                        var index = westDatesOfMonth.indexOf(object);
                                                        westDatesOfMonth[index] = updatedObject;
                                                    }

                                                    // Update the dataSource of the eastGrid and westGrid
                                                    $("#tabpanel-container #eastGrid").dxDataGrid("instance").option("dataSource", datesOfNextMonth);
                                                    $("#tabpanel-container #westGrid").dxDataGrid("instance").option("dataSource", westDatesOfMonth);
                                                },
                                        }).appendTo(contentElement);
                                    },
                                    onHidden: function () {
                                        // Cleanup when the popup is closed
                                        popup.remove();
                                    },
                                }).appendTo(container);
                                popup.dxPopover("show");
                            }).appendTo(iconsContainer);

                            // Clear nomination key
                            $("<button>").addClass("cancel-icon table-btn mr-2")
                                .append($("<i>"))
                                .addClass("fa fa-xmark")
                                .attr("disabled", options.data.CUSTOMER_NAME === "").on("click", function () {
                                    var rowData = options.data;
                                    westRemovedData.push(rowData);

                                    var object = datesOfNextMonth.find((obj) => obj.CUSTOMER_NAME === rowData.CUSTOMER_NAME);

                                    if (object) {
                                        // Create a copy of the object
                                        var updatedObject = { ...object, };

                                        // Modify the copied object
                                        updatedObject.CUSTOMER_NAME = "";
                                        updatedObject.CUSTOMER_ID = "";
                                        updatedObject.NOMINATION_TEMP_KEY = null;
                                        updatedObject.CUSTOMER_LIFTING_PROPANE = null;
                                        updatedObject.CUSTOMER_LIFTING_BUTANE = null;

                                        // Update the original object in datesOfNextMonth
                                        var index = datesOfNextMonth.indexOf(object);
                                        datesOfNextMonth[index] = updatedObject;
                                    }

                                    $("#tabpanel-container #eastGrid").dxDataGrid("instance").option("dataSource", datesOfNextMonth);
                                }).appendTo(iconsContainer);

                            // undo icon
                            var undoButton = $("<button>").addClass("undo-icon table-btn mr-2").append($("<i>").addClass("fa fa-rotate-left"))
                                .attr("disabled", options.data.CUSTOMER_NAME === "")
                                .hide() // Hide the button initially
                                .on("click", function () {
                                    // undo action
                                }).appendTo(iconsContainer);
                            // customer dropdown

                            if (westRemovedData.length > 0) {
                                $("<button>").addClass("listing-icon table-btn mr-2")
                                    .append($("<i>").addClass("fa fa-caret-down")
                                    ).appendTo(iconsContainer).on("click", function () {
                                        var popover = $("<div>").addClass("listing-popup")
                                            .dxPopover({
                                                target: ".listing-popup",
                                                placement: "bottom",
                                                contentTemplate: function (contentElement) {
                                                    var customerList = $("<div>").addClass("customer-popover");
                                                    var ulElement = $("<ul>").addClass("list-popover");

                                                    westRemovedData.forEach(function (dataItem) {
                                                        // console.log(dataItem.CUSTOMER_NAME);
                                                        var liElement = $("<li>").text(dataItem["CUSTOMER_NAME"]);
                                                        ulElement.append(liElement);
                                                    });

                                                    customerList.append(ulElement);
                                                    contentElement.append(customerList);
                                                },
                                                onHidden: function () {
                                                    $(".customer-popover").remove();
                                                },
                                            }).appendTo(container);
                                        popover.dxPopover("show");
                                    });
                            }
                        },
                    },
                    {
                        dataField: "LOCK_NOMINATION",
                        caption: "Lock Nomination",

                        width: 50,
                        alignment: "center",
                        cellTemplate: function (container, options) {
                            $("<div>")
                                .addClass("dx-checkbox")
                                .dxCheckBox({
                                    value: options.data.LOCK_NOMINATION === "Y",
                                    onValueChanged: function (e) {
                                        var newValue = e.value ? "Y" : "N";
                                        options.data.LOCK_NOMINATION = newValue;
                                    }
                                }).appendTo(container);
                        }
                    },
                    {
                        dataField: "SCENARIO_DATE",
                        caption: "Date",
                        sortIndex: 0,
                        sortOrder: "asc",
                        calculateSortValue: function (rowData) {
                            return new Date(rowData.SCENARIO_DATE);
                        },
                        // showSortIndexes: false
                    },
                    {
                        caption: "Opening Inventory",
                        columns: [
                            {
                                caption: "Propane",
                                dataField: "OPENING_INVENTORY_PROPANE",
                                format: { type: "fixedPoint", precision: 2 },
                                cellTemplate: function (container, options) {
                                    var isEditable = options.column.allowEditing && options.rowType === 'data' && options.rowIndex === 0;
                                    if (isEditable) {
                                        container.css("background-color", "#fff2cc");
                                    }
                                    container.text(options.text);
                                }
                            },
                            {
                                caption: "Butane",
                                dataField: "OPENING_INVENTORY_BUTANE",
                                format: { type: "fixedPoint", precision: 2 },
                                onValueChanged: function (e) {
                                    reCalculateTotals(e.data);
                                },
                                cellTemplate: function (container, options) {
                                    var isEditable = options.column.allowEditing && options.rowType === 'data' && options.rowIndex === 0;
                                    if (isEditable) {
                                        container.css("background-color", "#fff2cc");
                                    }
                                    container.text(options.text);
                                }
                            }
                        ]
                    },
                    {
                        caption: "Terminal Avails",
                        columns: [
                            {
                                caption: "Propane",
                                dataField: "TERMINAL_AVAILS_PROPANE",
                                allowEditing: true,
                                cellTemplate: function (container, options) {
                                    var isEditable = options.column.allowEditing && options.rowType === 'data';
                                    if (isEditable) {
                                        container.css("background-color", "#fff2cc");
                                    }
                                    container.text(options.text);
                                }
                            },
                            {
                                caption: "Butane",
                                dataField: "TERMINAL_AVAILS_BUTANE",
                                allowEditing: true,
                                cellTemplate: function (container, options) {
                                    var isEditable = options.column.allowEditing && options.rowType === 'data';
                                    if (isEditable) {
                                        container.css("background-color", "#fff2cc");
                                    }
                                    container.text(options.text);
                                }
                            }
                        ]
                    },
                    {
                        dataField: "CUSTOMER_NAME",
                        caption: "Customer",
                        allowEditing: false,
                    },
                    {
                        dataField: "NOMINATION_TEMP_KEY",
                        caption: "Nomination Temp Key",
                        allowEditing: false,
                    },
                    {
                        caption: "Customer Liftings (KMT)",
                        columns: [
                            {
                                caption: "Propane",
                                allowEditing: true,
                                dataField: "CUSTOMER_LIFTING_PROPANE",
                                cellTemplate: function (container, options) {
                                    var isEditable = options.column.allowEditing && options.rowType === 'data';
                                    if (isEditable) {
                                        container.css("background-color", "#fff2cc");
                                    }
                                    container.text(options.text);
                                }
                            },
                            {
                                caption: "Butane",
                                allowEditing: true,
                                dataField: "CUSTOMER_LIFTING_BUTANE",
                                cellTemplate: function (container, options) {
                                    var isEditable = options.column.allowEditing && options.rowType === 'data';
                                    if (isEditable) {
                                        container.css("background-color", "#fff2cc");
                                    }
                                    container.text(options.text);
                                }
                            }
                        ]
                    },
                    {
                        caption: "Customer Liftings (MB)",
                        columns: [
                            {
                                caption: "Propane",
                                allowEditing: false,
                                calculateCellValue: function (rowData) {
                                    return rowData.CUSTOMER_LIFTINGS_PROPANE_MB;
                                }
                            },
                            {
                                caption: "Butane",
                                allowEditing: false,
                                calculateCellValue: function (rowData) {
                                    return rowData.CUSTOMER_LIFTINGS_BUTANE_MB;
                                }
                            }
                        ]
                    },
                    {
                        caption: "Closing Inventory",
                        columns: [
                            {
                                caption: "Propane",
                                allowEditing: false,
                                calculateCellValue: function (rowData) {
                                    return rowData.CLOSING_INVENTORY_PROPANE;
                                }
                            },
                            {
                                caption: "Butane",
                                allowEditing: false,
                                calculateCellValue: function (rowData) {
                                    return rowData.CLOSING_INVENTORY_BUTANE;
                                }
                            }
                        ]
                    },
                    {
                        caption: "Closing Percentage",
                        columns: [
                            {
                                caption: "Propane",
                                allowEditing: false,
                                format: "percent",
                                alignment: "right",
                                dataType: "number",
                                cellTemplate: function (container, options) {
                                    if (options.data.CLOSING_PERCENTAGE_PROPANE == "" || options.data.CLOSING_PERCENTAGE_PROPANE == undefined) {
                                        return "";
                                    }
                                    const valueDiv = $("<div>").text(options.data.CLOSING_PERCENTAGE_PROPANE + "%");
                                    if (options.data.CLOSING_PERCENTAGE_PROPANE < 20 || options.data.CLOSING_PERCENTAGE_PROPANE > 80) {
                                        container.addClass('highlight-cell');
                                    }
                                    return valueDiv;
                                },
                            },
                            {
                                caption: "Butane",
                                allowEditing: false,
                                format: "percent",
                                alignment: "right",
                                dataType: "number",
                                cellTemplate: function (container, options) {
                                    if (options.data.CLOSING_PERCENTAGE_BUTANE == "" || options.data.CLOSING_PERCENTAGE_BUTANE == undefined) {
                                        return "";
                                    }
                                    const valueDiv = $("<div>").text(options.data.CLOSING_PERCENTAGE_BUTANE + "%");
                                    if (options.data.CLOSING_PERCENTAGE_BUTANE < 20 || options.data.CLOSING_PERCENTAGE_BUTANE > 80) {
                                        container.addClass('highlight-cell');
                                    }
                                    return valueDiv;
                                },
                            }
                        ]
                    },
                    {
                        // dataField: "NOMINATION_TEMP_KEY",
                        caption: "OnTime/Delayed/Advanced",
                        allowEditing: false,
                        calculateCellValue: function (rowData) {
                            var startDate = new Date(rowData.SCENARIO_DATE);
                            var endDate = new Date(rowData.NOMINATION_DATE);
                            var nomTempKey = rowData.NOMINATION_TEMP_KEY;
                            //  console.log(startDate + "<" + endDate + " = " + startDate < endDate);
                            if (nomTempKey !== null) {
                                var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
                                // // console.log("timediff", timeDiff);
                                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                // console.log(diffDays);
                                if (diffDays === 0) {
                                    return rowData.ONTIME_ACTION = "OnTime";
                                } else if (startDate < endDate) {
                                    return rowData.ONTIME_ACTION = "Advanced";
                                } else {
                                    return rowData.ONTIME_ACTION = "Delayed";
                                }
                            }
                            return rowData.ONTIME_ACTION;
                        }
                    },
                    {
                        // dataField: "NOMINATION_TEMP_KEY",
                        caption: "Days",
                        allowEditing: false,
                        calculateCellValue: function (rowData) {
                            var startDate = new Date(rowData.SCENARIO_DATE);
                            var endDate = new Date(rowData.NOMINATION_DATE);
                            var nomTempKey = rowData.NOMINATION_TEMP_KEY;
                            if (nomTempKey !== null) {
                                var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
                                // console.log("timediff", timeDiff);
                                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                return diffDays;
                            }
                        }
                    },

                ],
            });

            //west Propane Chart
            let westDataPropaneChartDiv = $("<div id='westPropaneChart'>");
            westDataPropaneChartDiv.appendTo(element).hide();
            westDataPropaneChartDiv.dxChart({
                dataSource: datesOfNextMonth,
                palette: "Harmony Light",
                title: {
                    text: "Propane",
                    font: {
                        color: "#10BF78",
                        size: 18,
                        weight: 600
                    }
                },
                valueAxis: [{
                    name: "CUSTOMER_LIFTINGS_PROPANE_MB",
                    position: "left",
                    // visualRange: [0, 100],
                    visualRangeUpdateMode: "keep",
                    title: "",
                    constantLines: [
                        {
                            value: 80,
                            width: 2,
                            color: 'red',
                            dashStyle: 'solid', label: {
                                visible: true,
                                text: 'Safe Max'
                            }
                        },
                        {
                            value: 20, width: 2,
                            color: 'red',
                            dashStyle: 'solid', label: {
                                visible: true,
                                text: 'Safe Min'
                            }
                        }
                    ]
                },
                ],
                commonSeriesSettings: {
                    argumentField: 'NOMINATION_DATE',
                    point: {
                        visible: false
                    }
                },
                series:
                    [{
                        type: 'bar',
                        valueField: 'MIN_SAFE_INVENTORY_PROPANE',
                        // axis: 'PropaneGraph',
                        name: 'Min Safe Inventory Propane',
                        color: "#ddd",
                    }, {
                        type: 'line',
                        valueField: 'MAX_SAFE_INVENTORY_PROPANE',
                        // axis: 'PropaneGraph',
                        name: 'Max Safe Inventory Propane',
                        color: "#cccc",
                    }],
                legend: {
                    verticalAlignment: 'bottom',
                    horizontalAlignment: 'center',
                },
            });
            //west butane chart
            let dataButaneChartDiv = $("<div id='westButaneChart'>");
            dataButaneChartDiv.appendTo(element).hide();
            dataButaneChartDiv.dxChart({
                dataSource: datesOfNextMonth,
                palette: "Harmony Light",
                title: {
                    text: "Butane",
                    font: {
                        color: "#10BF78",
                        size: 18,
                        weight: 600
                    }
                },
                valueAxis: [{
                    name: "CUSTOMER_LIFTINGS_BUTANE_MB",
                    position: 'left',
                    visualRange: [0, 100],
                    visualRangeUpdateMode: 'keep',
                    title: '',
                    constantLines: [
                        {
                            value: 80,
                            width: 2,
                            color: 'red',
                            dashStyle: 'solid', label: {
                                visible: true,
                                text: 'Safe Max'
                            }
                        },
                        {
                            value: 20, width: 2,
                            color: 'red',
                            dashStyle: 'solid', label: {
                                visible: true,
                                text: 'Safe Min'
                            }
                        }
                    ]
                },
                ],
                commonSeriesSettings: {
                    argumentField: 'NOMINATION_DATE',
                    point: {
                        visible: false
                    }
                },
                series:
                    [{
                        type: 'bar',
                        valueField: 'MIN_SAFE_INVENTORY_BUTANE',
                        axis: 'PropaneGraph',
                        name: 'Min Safe Inventory Butane',
                        color: "#ddd",
                    }, {
                        type: 'line',
                        valueField: 'MAX_SAFE_INVENTORY_BUTANE',
                        axis: 'PropaneGraph',
                        name: 'Max Safe Inventory Butane',
                        color: "#cccc",
                    }],
                legend: {
                    verticalAlignment: 'bottom',
                    horizontalAlignment: 'center',
                },
            });


            let formDivWest = $("<div id='westToleranceForm' style='margin:8px;'>")
            // formDiv.appendTo(element);
            formDivWest.appendTo(element);

            // console.log("asdad",eastTolPropane);
            var formItemsWest = [
                {
                    dataField: "TOLERANCE_PROPANE",
                    label:
                    {
                        text: "Tolerance Propane",
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        onValueChanged: function (e) {
                            westTolPropane = e.value;
                            reCalculateTotals(westDatesOfMonth);
                            // $("#westGrid").dxDataGrid("instance").refresh();
                            e.component.option('dataSource');
                        }
                    },
                },
                {
                    dataField: "TOLERANCE_BUTANE",
                    label:
                    {
                        text: "Tolerance Butane",
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        onValueChanged: function (e) {
                            westTolButane = e.value;
                            reCalculateTotals(westDatesOfMonth);
                            e.component.option("dataSource");
                            // $("#westGrid").dxDataGrid("instance").refresh();
                        }
                    },
                }
            ];
            formDivWest.dxForm({
                colCount: 4,
                formData: scenarioData.TOLERANCE[1],
                items: formItemsWest
            }).dxForm('instance');

        }
    }
    ],
    animationEnabled: true,
    swipeEnabled: true
}).dxTabPanel("instance");

function cellTemplate() {
    var popOver = new dxPopover()({
        content: new dxCalendar({
            value: new Date('2023-06-19')
        })
    });
    popOver.show();
    // console.log(targetElement, initialDate);
    // var popoverInstance = $("<div>").dxPopover({
    //     target: targetElement,
    //     width: 250,
    //     height: 250,
    //     position: {
    //         my: "left top",
    //         at: "left bottom",
    //         of: targetElement
    //     },
    //     contentTemplate: function (contentElement) {
    //         contentElement.dxCalendar({
    //             value: initialDate,
    //             onValueChanged: function (e) {
    //                 var selectedDate = e.value;
    //             }
    //         })
    //     }
    // }).dxPopover("instance");
    // popoverInstance.show();
}
// var butaneChart = $("#westChart").dxChart({
//     palette: 'Harmony Light',
//     title: {
//         text: 'Butane',
//         font: {
//             color : "0F0F0F",
//             size: 18,
//             weight: 600
//         }
//     },
//     valueAxis: getValueAxis('butane'),
//     commonSeriesSettings: {
//         argumentField: 'DAY',
//         point: {
//             visible: false
//         }
//     },
//     series:
//         [{
//             type: 'line',
//             valueField: 'BUTANE_CLOSING_INV_PERCENT',
//             axis: 'butaneGraph',
//             name: 'Actual Inventory',
//             color: COLORS.g_blue,
//         }, {
//             type: 'line',
//             valueField: 'BUTANE_OPENING_INV_PERCENT',
//             axis: 'butaneGraph',
//             name: 'Adjusted Inventory',
//             color: COLORS.g_yellow,
//         }]
//     ,
//     legend: {
//         verticalAlignment: 'bottom',
//         horizontalAlignment: 'center',
//     },


// }).dxChart("instance")

function saveScenarioData() {
    // console.log(grid.option('selectedIndex',1));
    // console.log(grid.option('selectedIndex',1));

    var url = "https://cs-action.aramco.com/SASJobExecution/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Save";
    var jsonObject = formatToSave();

    var scenarioSave = sendBatchRequest(url, JSON.stringify(jsonObject));
    if (scenarioSave) {

    } else {
        console.log("error")
    }
}


function saveNewVerionScenarioData() {
    var url = "https://cs-action.aramco.com/SASJobExecution/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Save%20as%20New%20Version";
    var jsonObject = formatToSave();

    var scenarioSave = sendBatchRequest(url, JSON.stringify(jsonObject));
    if (scenarioSave) {

    } else {
        console.log("error")
    }
}

function revertToLastSaved() {
    var url = "https://cs-action.aramco.com/SASJobExecution/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Revert%20Last%20Saved&BUSINESS_UNIT=COSMD";
    var jsonObject = formatToSave();

    var scenarioSave = sendBatchRequest(url, JSON.stringify(jsonObject));
    if (scenarioSave) {

    } else {
        console.log("error")
    }
}

function fetchLatestInventory() {
    var url = "https://cs-action.aramco.com/SASJobExecution/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Fetch%20Latest%20Inventory%20and%20Avails";
    var jsonObject = formatToSave();

    var latestInv = sendBatchRequest(url, JSON.stringify(jsonObject), actions = "latestInv");
    if (latestInv) {
        console.log("fetched", latestInv);
    } else {
        console.log("error")
    }
}

function formatToSave() {
    var toleranceData = [];
    var getYear = monthyear.split(' - ');
    toleranceData.push({
        "PLANNING_MONTH": getYear[1],
        "REGION": "EAST",
        "TOLERANCE_BUTANE": eastTolButane,
        "TOLERANCE_PROPANE": eastTolPropane,
    });
    toleranceData.push({
        "PLANNING_MONTH": getYear[1],
        "REGION": "WEST",
        "TOLERANCE_BUTANE": westTolButane,
        "TOLERANCE_PROPANE": westTolPropane,
    });
    // var mergeData = eastData.concat(westData);
    // var acceptedPerPort = acceptedPerPort(mergeData);
    // var acceptedPerNomDate = acceptedPerNomDate(mergeData);
    // var delayedNominations = delayedNominations(mergeData);
    // var advancedNominations = advancedNominations(mergeData);
    // var averageAdvancedDays = averageAdvancedDays(mergeData);

    var scenarioSummary = [];
    scenarioSummary.push({
        "PLANNING_MONTH": getYear[1],
        "NUM_OF_NOMINATIONS_EAST": eastCount,
        "NUM_OF_NOMINATIONS_WEST": westCount,
        "TOTAL_NOMINATIONS": $('#totalNominations').html(),
        "DIVERTED_TO_YANBU": $('#totalDiversion').html(),
        "DEFERRED_CANCELLED": $('#totalDiversion').html(),
        "AVERAGE_DELAYED_DAYS": $('#avgDelay').html(),
        "BUSINESS_UNIT": "COSMD",
        "ACCEPTED_AS_PER_NOM_PORT": 2,  //
        "ACCEPTED_AS_PER_NOM_PORT_PCT": "100%",//
        "DIVERTED_TO_YANBU_PCT": "0%",//
        "DEFERRED_CANCELLED_PCT": "0%",//
        "ACCEPTED_AS_PER_NOM_DATE": 2,//
        "ACCEPTED_AS_PER_NOM_DATE_PCT": "100%",//
        "DELAYED_NOMINATIONS": 0,//
        "DELAYED_NOMINATIONS_PCT": "0%",//
        "ADVANCED_NOMINATIONS": 0,//
        "ADVANCED_NOMINATIONS_PCT": "0%",//
        "AVERAGE_ADVANCEMENT_DAYS": 0,//
        "SCENARIO_PLANNING_VERSION": $('#version').html(),
        "SCENARIO_PLANNING_SUB_VERSION": 1,//
        "PLAN_CYCLE_CLICK_VERSION": 8,//

    });

    var jsonObject = {
        TOLERANCE: toleranceData,
        DATA: mergeData,
        MONTHLY_NOMINATIONS: scenarioData.MONTHLY_NOMINATIONS,
        SUMMARY: scenarioSummary
    };
    return jsonObject;
}


function getAvgDelay() {
    pushDaysEast = [];
    pushDaysWest = [];
    var mergeData = eastData.concat(westData);

    $.each(mergeData, function (index, scenario) {
        var startDate = new Date(scenario.SCENARIO_DATE);
        var endDate = new Date(scenario.NOMINATION_DATE);

        var nomTempKey = scenario.NOMINATION_TEMP_KEY;
        if (nomTempKey !== null) {
            getOnTimeAction(startDate, endDate);
            console.log("", startDate.getTime() + "-" + endDate.getTime());
            var timeDiff = startDate.getTime() - endDate.getTime();
            console.log(timeDiff);
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (diffDays > 0) {
                console.log("diffDateas", diffDays);
                pushDaysEast.push(diffDays);
            }
        }


    });

    if (pushDaysEast != "") {
        var sumDelay = pushDaysEast.reduce(function (a, b) {
            return a + b;
        })
        var countDelay = pushDaysEast.length;
        var averageDelay = sumDelay / countDelay;
        console.log("AD", averageDelay);
        if (averageDelay == "") {
            var averageDelay = 0;
            $('#avgDelay').html(averageDelay);
        } else {
            $('#avgDelay').html(averageDelay);
        }

        // console.log("sumDelay=",sumDelay,"averageDelay=",averageDelay , "countDelay=",countDelay);
    }
}

// function getInventoryScenarioData() {
//     var toleranceData = [];
//     var url = "https://cs-action.aramco.com/SASJobExecution/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Fetch%20Latest%20Inventory%20and%20Avails";
//     var getYear = monthyear.split(' - ');
//     console.log(scenarioData);
//     toleranceData.push({
//         "PLANNING_MONTH": getYear[1],
//         "REGION": "EAST",
//         "TOLERANCE_BUTANE": eastTolButane,
//         "TOLERANCE_PROPANE": eastTolPropane,
//     });

//     toleranceData.push({
//         "PLANNING_MONTH": getYear[1],
//         "REGION": "WEST",
//         "TOLERANCE_BUTANE": westTolButane,
//         "TOLERANCE_PROPANE": westTolPropane,
//     });

//     var mergeData = eastData.concat(westData);

//     var jsonObject = {
//         TOLERANCE: toleranceData,
//         DATA: mergeData,
//         MONTHLY_NOMINATIONS: scenarioData.MONTHLY_NOMINATIONS,
//         SUMMARY: scenarioData.SUMMARY
//     };
//     var getScenarioData = sendAndGetInventoryData(url, JSON.stringify(jsonObject));
//     reCalculateTotals(getScenarioData);
//     console.log(getScenarioData);
// }

$('#dragIcons').dxCheckBox({
    text: 'Show Drag Icons',
    value: true,
    onValueChanged(data) {
        // console.log("ydasr" + data);
        gridData.option('rowDragging.showDragIcons', data.value);
    },
});

async function sendBatchRequest(url, data, actions = "") {
    const d = $.Deferred();
    var myToken = await sasgetCSRFToken();
    $.ajax(url, {
        type: "POST",
        data: data,
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-Token', myToken);
            xhr.setRequestHeader('X-CSRF-Header', 'X-CSRF-Token');
            $('.overlay').show();
        },
    }).done((result) => {
        $('.overlay').hide();
        console.log(result)
        if (result != "" && result != null && actions === "latestInv") {
            var grid = $('#tabpanel-container').dxTabPanel("instance");
            grid.option("dataSource", result);
            // grid.reload();
        }
        d.resolve(result);
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
    }).fail((xhr) => {
        d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
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
    });
    return d.promise();

}

// async function sendAndGetInventoryData(url, dataInstance) {
//     var myToken = await sasgetCSRFToken();
//     var scenarioDataInventory = function () {
//         var tmpInventory = null;
//         $.ajax({
//             type: "POST",
//             data: dataInstance,
//             url: url,
//             contentType: 'application/json',
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader('X-CSRF-Token', myToken);
//                 xhr.setRequestHeader('X-CSRF-Header', 'X-CSRF-Token');
//                 $('.overlay').show();
//             },
//             success: function (data) {
//                 // console.log(parse.JSON(data));
//                 $('.overlay').hide();
//                 tmpInventory = data;
//             }
//         });
//         return tmpInventory;
//     }();
//     return scenarioDataInventory;
// }

async function sasgetCSRFToken() {
    const csrfURL = `https://cs-action.aramco.com/SASJobExecution/csrf`
    const csrfParameters = { method: "GET", credentials: "include" }
    const csrfRequest = await fetch(csrfURL, csrfParameters)
    const csrfToken = await csrfRequest.headers.get("X-CSRF-TOKEN")
    return csrfToken;
}

// Ospas Approval

$("#popup").dxPopup({
    visible: false,
    hideOnOutsideClick: true,
    title: 'Submit Scenario for OSPAS Approval',
    showTitle: true,
    onShown: function () {
        $("#popup-textarea-container").dxTextArea({
            height: 150,
        });
        $("#popup-submit-button").dxButton({
            text: "Submit Comment",
            onClick: function () {
                var url = "https://cs-action.aramco.com/SASJobExecution/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Submit%20to%20OSPAS&PLANNING_MONTH=MAY2023";
                var textAreaValue = $("#popup-textarea-container").dxTextArea("instance").option("value");
                var jsonObject = {
                    "DATA": textAreaValue
                };
                var jsonData = JSON.stringify(jsonObject);
                sendBatchRequest(url, jsonData);
            }
        })
    }
});



// const popup = $("#popup").dxPopup("instance");
// $("#ospasApproval").dxButton({
//     text: "Open popup",
//     onClick: () => {
//         popup.show();
//     }
// });

//show comments
$("#allComments").dxPopup({
    visible: false,
    hideOnOutsideClick: true,
    title: 'Comments',
    showTitle: true,
    contentTemplate: function (container) {
        var commentsData = function () {

            var tmp = null;
            $.ajax({
                url: 'https://cs-action.aramco.com/SASJobExecution/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Read%20Comments&PLANNING_MONTH=MAY2023',
                dataType: "json",
                async: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
                    $('.overlay').show();
                },
                success: function (data) {
                    // console.log(parse.JSON(data));
                    $('.overlay').hide();
                    tmp = data;
                }
            });
            return tmp;
        }();

        var gridData = $('<div>').dxDataGrid({
            dataSource: commentsData,
            showBorders: true,
            columns: [
                {
                    dataField: 'COMMENTS',
                    caption: 'Comments',
                },
                {
                    dataField: 'CREATED_BY',
                    caption: 'Created By',
                },
                {
                    dataField: 'CREATED_DTTM',
                    caption: 'Created DTTM',
                },

            ],
        });
        gridData.appendTo(container);
    },

});


//scenario summary statistics comparision
// $("#scenarioSummary").dxButton({
//     text: "Scenario Summary Statistics Comparsion",
//     onClick: function () {
//         window.location.href = "https://cs-action.aramco.com/lpg_v1/scenario-summary-statistics-comparison.html";
//     }
// });

function reCalculateDraggedTotals(data, toIndex, fromIndex) {
    var fromItem = data[fromIndex];
    var toItem = data[toIndex];
    // console.log(fromIndex);
    // console.log(toIndex);
    var startDate = new Date(fromItem.SCENARIO_DATE);
    var endDate = new Date(toItem.NOMINATION_DATE);
    // var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
    // console.log("asdasd"+diffDays);

    if (fromIndex < toIndex) {
        if (fromItem.NOMINATION_TEMP_KEY != null) {
            fromItem.ONTIME_ACTION = "Delayed";
        } else {
            toItem.ONTIME_ACTION = "Advanced";
        }
    } else if (fromIndex > toIndex) {
        if (toItem.NOMINATION_TEMP_KEY != null) {
            toItem.ONTIME_ACTION = "Delayed";
        } else {
            fromItem.ONTIME_ACTION = "Advanced";
        }
    } else {
        fromItem.ONTIME_ACTION = "OnTime";
    }

    temp_nom_date = toItem.SCENARIO_DATE;
    toItem.SCENARIO_DATE = fromItem.SCENARIO_DATE;
    fromItem.SCENARIO_DATE = temp_nom_date;

    temp_oi_propane = toItem.OPENING_INVENTORY_PROPANE;
    toItem.OPENING_INVENTORY_PROPANE = fromItem.OPENING_INVENTORY_PROPANE;
    fromItem.OPENING_INVENTORY_PROPANE = temp_oi_propane;

    temp_oi_butane = toItem.OPENING_INVENTORY_BUTANE;
    toItem.OPENING_INVENTORY_BUTANE = fromItem.OPENING_INVENTORY_BUTANE;
    fromItem.OPENING_INVENTORY_BUTANE = temp_oi_butane;

    temp_ta_propane = toItem.TERMINAL_AVAILS_PROPANE;
    toItem.TERMINAL_AVAILS_PROPANE = fromItem.TERMINAL_AVAILS_PROPANE;
    fromItem.TERMINAL_AVAILS_PROPANE = temp_ta_propane;

    temp_ta_butane = toItem.TERMINAL_AVAILS_BUTANE;
    toItem.TERMINAL_AVAILS_BUTANE = fromItem.TERMINAL_AVAILS_BUTANE;
    fromItem.TERMINAL_AVAILS_BUTANE = temp_ta_butane;

    temp_maxsaf_butane = toItem.MAX_SAFE_INVENTORY_BUTANE;
    toItem.MAX_SAFE_INVENTORY_BUTANE = fromItem.MAX_SAFE_INVENTORY_BUTANE;
    fromItem.MAX_SAFE_INVENTORY_BUTANE = temp_maxsaf_butane;

    temp_maxsaf_propane = toItem.MAX_SAFE_INVENTORY_PROPANE;
    toItem.MAX_SAFE_INVENTORY_PROPANE = fromItem.MAX_SAFE_INVENTORY_PROPANE;
    fromItem.MAX_SAFE_INVENTORY_PROPANE = temp_maxsaf_propane;

    temp_minsaf_butane = toItem.MIN_SAFE_INVENTORY_BUTANE;
    toItem.MIN_SAFE_INVENTORY_BUTANE = fromItem.MIN_SAFE_INVENTORY_BUTANE;
    fromItem.MIN_SAFE_INVENTORY_BUTANE = temp_minsaf_butane;

    temp_minsaf_propane = toItem.MIN_SAFE_INVENTORY_PROPANE;
    toItem.MIN_SAFE_INVENTORY_PROPANE = fromItem.MIN_SAFE_INVENTORY_PROPANE;
    fromItem.MIN_SAFE_INVENTORY_PROPANE = temp_minsaf_propane;

    delete temp_nom_date;
    delete temp_oi_propane;
    delete temp_oi_butane;
    delete temp_ta_propane;
    delete temp_ta_butane;
    delete fromItem;
    delete toItem;
    for (var i = 1; i < data.length; i++) {
        data.ROW_ORDER = i;
    }
    reCalculateTotals(data);
    //  console.log(eastData);
}

function reCalculateTotals(data) {
    for (var i = 0; i < data.length - 1; i++) {
        data[i].CUSTOMER_LIFTINGS_PROPANE_MB = ((data[i].CUSTOMER_LIFTING_PROPANE * 12.446) + ((data[i].CUSTOMER_LIFTING_PROPANE * 12.446 * (eastTolPropane / 100)))).toFixed(2);
        data[i].CUSTOMER_LIFTINGS_BUTANE_MB = ((data[i].CUSTOMER_LIFTING_BUTANE * 12.446) + ((data[i].CUSTOMER_LIFTING_BUTANE * 12.446 * (eastTolButane / 100)))).toFixed(2);
        if (data[i].REGION == "EAST") {
            if (i == 0) {
                data[i].OPENING_INVENTORY_PROPANE = parseFloat(data[i].OPENING_INVENTORY_PROPANE);

                data[i].CLOSING_INVENTORY_PROPANE = (data[i].OPENING_INVENTORY_PROPANE + data[i].TERMINAL_AVAILS_PROPANE - data[i].CUSTOMER_LIFTINGS_PROPANE_MB - data[i + 1].CUSTOMER_LIFTINGS_PROPANE_MB).toFixed(2);
                data[i].CLOSING_PERCENTAGE_PROPANE = ((data[i].CLOSING_INVENTORY_PROPANE / (data[0].MAX_SAFE_INVENTORY_PROPANE - data[0].MIN_SAFE_INVENTORY_PROPANE)) * 100).toFixed(2);

                data[i].OPENING_INVENTORY_BUTANE = parseFloat(data[i].OPENING_INVENTORY_BUTANE);
                data[i].CLOSING_INVENTORY_BUTANE = (data[i].OPENING_INVENTORY_BUTANE + data[i].TERMINAL_AVAILS_BUTANE - data[i].CUSTOMER_LIFTINGS_BUTANE_MB - data[i + 1].CUSTOMER_LIFTINGS_BUTANE_MB).toFixed(2);
                data[i].CLOSING_PERCENTAGE_BUTANE = ((data[i].CLOSING_INVENTORY_BUTANE / (data[0].MAX_SAFE_INVENTORY_BUTANE - data[0].MIN_SAFE_INVENTORY_BUTANE)) * 100).toFixed(2);
                data[i].ONTIME_ACTION = "";
            } else {
                if (i % 2 == 0) {
                    data[i].CUSTOMER_LIFTINGS_PROPANE_MB = ((data[i].CUSTOMER_LIFTING_PROPANE * 12.446) + ((data[i].CUSTOMER_LIFTING_PROPANE * 12.446 * (eastTolPropane / 100)))).toFixed(2);
                    data[i].CUSTOMER_LIFTINGS_BUTANE_MB = (((data[i].CUSTOMER_LIFTING_BUTANE * 12.446) + ((data[i].CUSTOMER_LIFTING_BUTANE * 12.446 * (eastTolButane / 100)))).toFixed(2));

                    data[i].OPENING_INVENTORY_PROPANE = parseFloat(data[i - 2].CLOSING_INVENTORY_PROPANE);
                    data[i].CLOSING_INVENTORY_PROPANE = (data[i].OPENING_INVENTORY_PROPANE + data[i].TERMINAL_AVAILS_PROPANE - data[i].CUSTOMER_LIFTINGS_PROPANE_MB - data[i + 1].CUSTOMER_LIFTINGS_PROPANE_MB).toFixed(2);
                    data[i].CLOSING_PERCENTAGE_PROPANE = ((data[i].CLOSING_INVENTORY_PROPANE / (data[0].MAX_SAFE_INVENTORY_PROPANE - data[0].MIN_SAFE_INVENTORY_PROPANE)) * 100).toFixed(2);

                    data[i].OPENING_INVENTORY_BUTANE = parseFloat(data[i - 2].CLOSING_INVENTORY_BUTANE);
                    data[i].CLOSING_INVENTORY_BUTANE = (data[i].OPENING_INVENTORY_BUTANE + data[i].TERMINAL_AVAILS_BUTANE - data[i].CUSTOMER_LIFTINGS_BUTANE_MB - data[i + 1].CUSTOMER_LIFTINGS_BUTANE_MB).toFixed(2);
                    data[i].CLOSING_PERCENTAGE_BUTANE = ((data[i].CLOSING_INVENTORY_BUTANE / (data[0].MAX_SAFE_INVENTORY_BUTANE - data[0].MIN_SAFE_INVENTORY_BUTANE)) * 100).toFixed(2);
                    data[i].ONTIME_ACTION = "";
                }

            }
        }
    }
    var k = 0;
    for (var i = 0; i < data.length; i++) {
        if (data.REGION == "WEST") {
            if (data[i - 1].REGION == "EAST") {
                k = i;
            }
        }
    }

    for (var i = k; i < data.length; i++) {
        data[i].CUSTOMER_LIFTINGS_PROPANE_MB = ((data[i].CUSTOMER_LIFTING_PROPANE * 12.446) + ((data[i].CUSTOMER_LIFTING_PROPANE * 12.446 * (westTolPropane / 100)))).toFixed(2);
        data[i].CUSTOMER_LIFTINGS_BUTANE_MB = ((data[i].CUSTOMER_LIFTING_BUTANE * 12.446) + ((data[i].CUSTOMER_LIFTING_BUTANE * 12.446 * (westTolButane / 100)))).toFixed(2);

        if (data[i].REGION == "WEST") {
            data[i].CUSTOMER_LIFTINGS_PROPANE_MB = ((data[i].CUSTOMER_LIFTING_PROPANE * 12.446) + ((data[i].CUSTOMER_LIFTING_PROPANE * 12.446 * (westTolPropane / 100)))).toFixed(2);
            data[i].CUSTOMER_LIFTINGS_BUTANE_MB = ((data[i].CUSTOMER_LIFTING_BUTANE * 12.446) + ((data[i].CUSTOMER_LIFTING_BUTANE * 12.446 * (westTolButane / 100)))).toFixed(2);
            if (i == k) {
                data[i].OPENING_INVENTORY_PROPANE = parseFloat(data[i].OPENING_INVENTORY_PROPANE);

                data[i].CLOSING_INVENTORY_PROPANE = (data[i].OPENING_INVENTORY_PROPANE + data[i].TERMINAL_AVAILS_PROPANE - data[i].CUSTOMER_LIFTINGS_PROPANE_MB).toFixed(2);
                data[i].CLOSING_PERCENTAGE_PROPANE = ((data[i].CLOSING_INVENTORY_PROPANE / (data[0].MAX_SAFE_INVENTORY_PROPANE - data[0].MIN_SAFE_INVENTORY_PROPANE)) * 100).toFixed(2);

                data[i].OPENING_INVENTORY_BUTANE = parseFloat(data[i].OPENING_INVENTORY_BUTANE);
                data[i].CLOSING_INVENTORY_BUTANE = (data[i].OPENING_INVENTORY_BUTANE + data[i].TERMINAL_AVAILS_BUTANE - data[i].CUSTOMER_LIFTINGS_BUTANE_MB).toFixed(2);
                data[i].CLOSING_PERCENTAGE_BUTANE = ((data[i].CLOSING_INVENTORY_BUTANE / (data[0].MAX_SAFE_INVENTORY_BUTANE - data[0].MIN_SAFE_INVENTORY_BUTANE)) * 100).toFixed(2);
                data[i].ONTIME_ACTION = "";
            }
            else {
                data[i].OPENING_INVENTORY_PROPANE = parseFloat(data[i - 1].CLOSING_INVENTORY_PROPANE);
                data[i].CLOSING_INVENTORY_PROPANE = data[i].OPENING_INVENTORY_PROPANE + data[i].TERMINAL_AVAILS_PROPANE - data[i].CUSTOMER_LIFTINGS_PROPANE_MB;
                data[i].CLOSING_PERCENTAGE_PROPANE = ((data[i].CLOSING_INVENTORY_PROPANE / (data[0].MAX_SAFE_INVENTORY_PROPANE - data[0].MIN_SAFE_INVENTORY_PROPANE)) * 100).toFixed(2);

                data[i].OPENING_INVENTORY_BUTANE = parseFloat(data[i - 1].CLOSING_INVENTORY_BUTANE);
                data[i].CLOSING_INVENTORY_BUTANE = (data[i].OPENING_INVENTORY_BUTANE + data[i].TERMINAL_AVAILS_BUTANE - data[i].CUSTOMER_LIFTINGS_BUTANE_MB).toFixed(2);
                data[i].CLOSING_PERCENTAGE_BUTANE = ((data[i].CLOSING_INVENTORY_BUTANE / (data[0].MAX_SAFE_INVENTORY_BUTANE - data[0].MIN_SAFE_INVENTORY_BUTANE)) * 100).toFixed(2);
                data[i].ONTIME_ACTION = "";
            }
        }
    }
}

function getOnTimeAction(startDate, endDate) {
    // console.log("star date" + startDate + "end date"+ endDate);
    if ((startDate == "" || startDate == null) && (endDate == "" || endDate == null)) {
        return "";
    }
    console.log(startDate, endDate);

    var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    console.log(diffDays);
    switch (diffDays) {
        case (diffDays === 0): {
            return "OnTime";
        }
        case (diffDays > 0): {
            return "Advanced";
        }
        case (diffDays > 0): {
            return "Delayed";
        }

    }
}
const viewBtnConfig = [
    {
        icon: 'contentlayout',
        alignment: 'grid',
        hint: 'Table View',
    },
    {
        icon: 'chart',
        alignment: 'chart',
        hint: 'Graph View',
    },
];

var viewBtns = $('#viewBtns').dxButtonGroup({
    items: viewBtnConfig,
    keyExpr: 'alignment',
    stylingMode: 'outlined',
    selectedItemKeys: ['grid'],
    onItemClick: (e) => {
        let { hint } = e.itemData;
        // if(hint == "Chart View") {
        //     $('#eastGrid').hide();
        //     $('#westGrid').hide();

        //     $('#eastToleranceForm').hide();
        //     $('#westToleranceForm').hide();

        //     $('#eastPropaneChart,#eastButaneChart').show();
        //     $('#westPropaneChart,#westButaneChart').show();
        // } else if(hint == "Table View") {
        //     $('#eastGrid').show();
        //     $('#westGrid').show();

        //     $('#eastToleranceForm').show();
        //     $('#westToleranceForm').show();

        //     $('#eastPropaneChart,#eastButaneChart').hide();
        //     $('#westPropaneChart,#westButaneChart').hide();
        // } else {
        //     $('#eastGrid').show();
        //     $('#westGrid').show();

        //     $('#eastToleranceForm').show();
        //     $('#westToleranceForm').show();

        //     $('#eastPropaneChart,#eastButaneChart').hide();
        //     $('#westPropaneChart,#westButaneChart').hide();
        // }
        switch (hint) {
            case 'Chart View':
                $('#eastGrid').hide();
                $('#westGrid').hide();

                $('#eastToleranceForm').hide();
                $('#westToleranceForm').hide();

                $('#eastPropaneChart,#eastButaneChart').show();
                $('#westPropaneChart,#westButaneChart').show();
                break;
            case 'Table View':
                $('#eastGrid').show();
                $('#westGrid').show();

                $('#eastToleranceForm').show();
                $('#westToleranceForm').show();

                $('#eastPropaneChart,#eastButaneChart').hide();
                $('#westPropaneChart,#westButaneChart').hide();
                break;
            default:
                $('#eastGrid').show();
                $('#westGrid').show();

                $('#eastToleranceForm').show();
                $('#westToleranceForm').show();

                $('#eastPropaneChart,#eastButaneChart').hide();
                $('#westPropaneChart,#westButaneChart').hide();
                break;
        }
    },
}).dxButtonGroup('instance');

var groupActionButtons = [{ id: "idFetchLatestInventory", icon: 'fa fa-database', onClick: fetchLatestInventory, hint: 'Fetch Latest Inventory and Avails' },
{ id: "idNominationSuggestion", icon: 'fa fa-magic', hint: 'Generate Nomination Suggestion' },
{ id: "revertLastSavedVersion", icon: 'fa fa-cogs', onClick: revertToLastSaved, hint: 'Revert to Last Saved Version' },
{ id: "saveScenario", icon: 'fa fa-save', onClick: saveScenarioData, hint: 'Save Scenario' },
{ id: "saveAsNewVersion", icon: 'fa fa-share-square-o', onClick: saveNewVerionScenarioData, hint: 'Save Scenario as New Version' },
{ id: "showComments", icon: 'fa fa-comment', hint: 'Show Comments' },
// {id: "scenarioSummary", icon:'fa fa-paperclip', onClick: window.location.href = "https://cs-action.aramco.com/lpg_v1/scenario-summary-statistics-comparison.html"},
{ id: "scenarioSummary", icon: 'fa fa-paperclip', hint: 'Compare Summary Stats' },
{ id: "viewOspasVersion", icon: 'fa fa-eye', hint: 'View OSPAS Version' },
{ id: "ospasApproval", icon: 'fa fa-send', hint: 'Submit Scenario for OSPAS Approval' }];

$('#groupActionBtns').dxButtonGroup({
    items: groupActionButtons,
    keyExpr: 'alignment',
    stylingMode: 'outlined',
    // selectedItemKeys: ['grid'],
    onItemClick: (e) => {
        if (e.itemData) {
            var itemId = e.itemData.id
            if (itemId === "idFetchLatestInventory") {
                fetchLatestInventory
            } else if (itemId === "idNominationSuggestion") {

            } else if (itemId === "revertLastSavedVersion") {

            } else if (itemId === "saveScenario") {
                saveScenarioData
            } else if (itemId === "saveAsNewVersion") {
                saveNewVerionScenarioData
            } else if (itemId === "showComments") {
                $("#allComments").dxPopup("instance").show()
            } else if (itemId === "scenarioSummary") {
                window.location.href = "https://cs-action.aramco.com/lpg_v1/scenario-summary-statistics-comparison.html";
            } else if (itemId === "viewOspasVersion") {
                window.location.href = "https://cs-action.aramco.com/lpg_v1/scenario-planning-ospas-version-ro.html";
            } else if (itemId === "ospasApproval") {
                $("#popup").dxPopup("instance").show()
            }
        }
    },
});