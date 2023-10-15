// to get values for scenario data
// this return value json object will be stored in scenario data
var scenarioData = function () {
    var tmp = null;
    $.ajax({
        url: READ_URL,
        dataType: "json",
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
            $('.overlay').show();
        },
        success: function (data) {
            $('.overlay').hide();
            tmp = data;
        }
    });
    return tmp;
}();

buttonGroupRefresh(scenarioData);

//Function to calculate the number of nominations that are cancelled or deferred
getCanDefCounts(scenarioData);

// On page refresh load the cancelled Nomination List
initializeCancelledNominationList(scenarioData);

// show planning month on page load
$("#datepicker1").html('Planning Month ' + convertMonthYear(scenarioData.TOLERANCE[0].PLANNING_MONTH));
var monthyear = $("#datepicker1").html();


//Function to call above calculations
function recalculateStats(data, scenarioGrid) {
    getTotalNominations(data, scenarioGrid);
    getDefaultAverages(data, scenarioGrid);
    totalAvailableQty(data, scenarioGrid, unit = "KMT");
    calculateNominationQuantiies(data, scenarioGrid, unit = "KMT");
    getDiversionCounts(data);
    getCanDefCounts(scenarioData, scenarioGrid);
    additionalNominations(data, scenarioGrid)
    getVersionStatus(scenarioData);
    inventoryViolation(data, scenarioData.LPG_OPTMODEL_CONFIG, scenarioGrid);
};

$('#dragIcons').dxCheckBox({
    text: 'Show Drag Icons',
    value: true,
    onValueChanged(data) {
        gridData.option('rowDragging.showDragIcons', data.value);
    },
});
// to get values for Revert Last Saved Version
// this return value json object will be stored in Revert Last Saved Version
revertData = null;
// Filter the DATA array based on region
const eastDate = scenarioData.SLOT_AVAILABILITY.filter((item) => item.REGION === "EAST");
// const westDate = scenarioData.SLOT_AVAILABILITY.filter((item) => item.REGION === "WEST");

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

reCalculateTotals(eastData);
reCalculateTotals(westData);
var changedValue = null;
var changedColumnName = "";
var changedRowIndex = null;

var scenarioGrid = $("#tabpanel-container").dxTabPanel({
    deferRendering: true,
    items: [{
        title: "East",
        icon: "rowfield",
        keyExpr: 'NOMINATION_TEMP_KEY',
        showBorders: true,
        template: function (itemData, itemIndex, element) {
            $('#tabChartContainer').hide();
            let dataEastGridDiv = $("<div id='eastGrid'>");
            dataEastGridDiv.appendTo(element);
            dataEastGridDiv.dxDataGrid({
                dataSource: eastData,
                sorting: {
                    mode: "none"
                },
                headerFilter: { visible: true },
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
                onEditingStart: function (e) {
                    gridValueChanged = true;
                    buttonGroupRefresh(scenarioData);
                },
                paging: false,
                editing: {
                    mode: 'cell',
                    allowUpdating: true,
                },
                onRowPrepared: function (e) {
                    // Check if the row index is divisible by 2 (every two rows)

                    $.each(e.cells, function (i, v) {
                        if (v.rowType == 'data' && v.data.ROW_COUNT == NUM_BERTHS_EAST) {
                            e.rowElement.css({
                                "border-bottom": "2px solid #CCC", // Adjust the thickness and color as needed
                                // Add other inline styles as needed
                            });
                        }
                    })
                    // Apply inline styles to add a thick line

                },
                onInitialized: function (e) {
                    reCalculateTotals(eastData);
                },

                rowDragging: {
                    allowReordering: true,
                    onReorder(e) {

                        const visibleRows = e.component.getVisibleRows();
                        const toIndex = eastData.findIndex((item) => item.ROW_ORDER === (visibleRows[e.toIndex].data.ROW_ORDER));
                        const fromIndex = eastData.findIndex((item) => item.ROW_ORDER === e.itemData.ROW_ORDER);
                        if ((fromIndex >= 0) && (toIndex >= 0) && (fromIndex !== toIndex) && ((eastData[toIndex].LOCK_NOMINATION != "Y") && (eastData[fromIndex].LOCK_NOMINATION != "Y"))) {
                            var dragFr = e.component.getRowElement(fromIndex);
                            var dragTo = e.component.getRowElement(toIndex);

                            dragFr.css("background-color", 'yellow');
                            dragTo.css("background-color", 'red');

                            const temp = eastData[fromIndex];
                            eastData[fromIndex] = eastData[toIndex];
                            eastData[toIndex] = temp;
                            $("#eastGrid").dxDataGrid("instance").refresh();
                            reCalculateDraggedTotals(eastData, toIndex, fromIndex);
                        }

                        removeNonAvailableRows(eastData);
                        $("#eastGrid").dxDataGrid("instance").refresh();
                        recalculateStats(eastData.concat(westData), scenarioGrid.option("selectedIndex"));

                    },
                },
                onDrag: function (e) {
                    var dragDistance = e.event.pageY - e.event.target.getBoundingClientRect().top;
                },
                onRowDragStart: function (e) {
                    e.component.option("drggedRowData", e.data);
                },
                onRowDropped: function (e) {
                    var draggedRowData = e.component.option("draggedRowData");
                    const toIndex = eastData.findIndex((item) => item.ROW_ORDER === visibleRows[e.toIndex].data.ROW_ORDER);
                    const fromIndex = eastData.findIndex((item) => item.ROW_ORDER === e.itemData.ROW_ORDER);

                    if ((eastData[toIndex].LOCK_NOMINATION != "Y" || eastData[fromIndex].LOCK_NOMINATION != "Y")) {
                        var targetData = e.dropInside ? e.component.getVisibleRows()[e.toIndex].data : e.component.getVisibleRows()[e.toIndex - 1].data;
                        targetData.NOMINATION_DATE = draggedRowData.SCENARIO_DATE;
                        reCalculateDraggedTotals(eastData, toIndex, fromIndex);
                    };

                    recalculateStats(eastData.concat(westData), scenarioGrid.option("selectedIndex"));
                    e.component.refresh();

                },
                onEditorPreparing: function (e) {
                    if (e.dataField == "OPENING_INVENTORY_PROPANE") {
                        if (e.row.rowIndex == 0) {
                            e.cancel = false;
                        } else {
                            e.cancel = true;
                        }
                    }

                    if (e.dataField == "OPENING_INVENTORY_BUTANE") {
                        if (e.row.rowIndex == 0) {
                            e.cancel = false;
                        } else {
                            e.cancel = true;
                        }
                    }

                    if (e.dataField == "TERMINAL_AVAILS_PROPANE") {
                        if (e.row.data.ROW_COUNT == 1) {
                            e.cancel = false;
                        } else {
                            e.cancel = true;
                        }
                    }
                    if (e.dataField == "TERMINAL_AVAILS_BUTANE") {
                        if (e.row.data.ROW_COUNT == 1) {
                            e.cancel = false;
                        } else {
                            e.cancel = true;
                        }
                    }

                    if (e.parentType === "dataRow" && e.dataField === "CUSTOMER_LIFTING_PROPANE") {
                        var checkLift = e.row.data.CUSTOMER_LIFTING_PROPANE;
                        var checkNomKey = e.row.data.NOMINATION_TEMP_KEY;
                        if (checkLift !== null && checkNomKey !== "") {
                            e.cancel = false;
                        } else {
                            e.cancel = true;
                        }
                    }

                    if (e.parentType === "dataRow" && e.dataField === "CUSTOMER_LIFTING_BUTANE") {
                        var checkLift = e.row.data.CUSTOMER_LIFTING_BUTANE;
                        var checkNomKey = e.row.data.NOMINATION_TEMP_KEY;
                        if (checkLift !== null && checkNomKey !== "") {
                            e.cancel = false;
                        } else {
                            e.cancel = true;
                        }
                    }
                    if (e.parentType === "dataRow" && e.row.data.NOMINATION_TEMP_KEY == null) {
                        $("#diversionCalendarEast").hide();
                    }

                },
                onEditorPrepared: function (e) {
                    changedValue = e.value;
                    changedColumnName = e.name;
                    changedRowIndex = e.row.dataIndex;
                    var newData = reCalculateTotals(e.component.option('dataSource'));
                    e.component.refresh(true);
                    recalculateStats(eastData.concat(westData), scenarioGrid.option("selectedIndex"));
                },
                onRowUpdated: function (e) {
                    for (var i = changedRowIndex; i < eastData.length; i++) {
                        if (eastData[i].ROW_COUNT == 1) {
                            if (changedColumnName == "TERMINAL_AVAILS_PROPANE") {
                                eastData[i].TERMINAL_AVAILS_PROPANE = changedValue;
                            }
                            if (changedColumnName == "TERMINAL_AVAILS_BUTANE") {
                                eastData[i].TERMINAL_AVAILS_BUTANE = changedValue;
                            }
                        }
                    }
                    reCalculateTotals(e.component.option('dataSource'));
                    recalculateStats(eastData.concat(westData), scenarioGrid.option("selectedIndex"));
                    e.component.refresh(true);

                },
                columns: [
                    {
                        allowFiltering: false,
                        caption: "Action",
                        width: 80,
                        alignment: "center",
                        cellTemplate: function (container, options) {
                            // Create a container div
                            var iconsContainer = $("<div>").addClass("icons-container").appendTo(container);

                            // Calendar icon
                            if (options.data.NOMINATION_TEMP_KEY != null) {
                                $("<a>").addClass("calendar-icon table-btn mr-2")
                                    .append($("<i title='Divert Nomination'>").addClass("fa fa-calendar")).attr(
                                        "disabled", options.data.CUSTOMER_NAME === "")
                                    .on("click", function () {
                                        var popup = $("<div id = 'diversionCalendarEast'>").addClass("calendar-popup").dxPopover({
                                            title: "Calendar",
                                            target: ".calendar-popup",
                                            position: "bottom",
                                            contentTemplate: function (contentElement) {
                                                // Get the current date
                                                var currentDate = new Date();
                                                // Set the next month as the value for the calendar
                                                var nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                                                var disabledDates = findAvailableSlot(scenarioData, eastData.concat(westData));
                                                var nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);
                                                var formatDates = disabledDates.eastSlotAvailDate.map(function (date) { return new Date(date); });
                                                // Create and append the calendar widget
                                                $("<div>").dxCalendar({
                                                    value: nextMonth,
                                                    min: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
                                                    max: nextMonthEnd,
                                                    maxZoomLevel: "month",
                                                    disabledDates: formatDates,
                                                    onValueChanged: function (e) {
                                                        moveNominationOnGrid(options.data, e.value);
                                                        recalculateStats(eastData.concat(westData), scenarioGrid.option("selectedIndex"));
                                                    }
                                                }).appendTo(contentElement);
                                            },
                                            onHidden: function () {
                                                // Cleanup when the popup is closed
                                                popup.remove();
                                            },
                                        }).appendTo(container);
                                        popup.dxPopover("show");
                                    }).appendTo(iconsContainer);
                                //Cancel or Deffered inside grid
                                if (options.data.NOMINATION_TEMP_KEY != null) {
                                    $("<a>").addClass("cancel-icon table-btn mr-2")
                                        .append($("<i title='Defer/Cancel'>").addClass("fa fa-times")).attr(
                                            "disabled", options.data.CUSTOMER_NAME === "")
                                        .on("click", async function () {
                                            cancelNomination(options.data, scenarioData);
                                            recalculateStats(eastData.concat(westData), scenarioGrid.option("selectedIndex"))
                                        }).appendTo(iconsContainer);
                                };
                            };
                            //show dropdown for removed values
                            if (options.data.NOMINATION_TEMP_KEY == null && t_cancelled_nominations_vr.APPND_NAME_KEY.length > 0) {
                                $("<a>").addClass("listing-icon table-btn mr-2")
                                    .append($("<i title='Deferred/Cancelled Customers'>").addClass("fa fa-caret-down")).css("cursor", "pointer").appendTo(iconsContainer)
                                    .on("click", function () {
                                        var popover = $("<div>").addClass("listing-popup").dxPopover({
                                            target: ".listing-popup",
                                            placement: "bottom",
                                            contentTemplate: function (contentElement) {

                                                var customerList = $("<div>").addClass("customer-popover");
                                                var ulElement = $("<ul style='list-style-type: none'>");

                                                t_cancelled_nominations_vr.APPND_NAME_KEY.forEach(function (dataItem) {
                                                    var customerAppend = $('<li>').text(dataItem).on("click", function (e) {
                                                        // Bring Back Nominations
                                                        bringBackNomination(options.data, $(this).text(), scenarioData, scenarioGrid.option("selectedIndex"));
                                                        recalculateStats(eastData.concat(westData), scenarioGrid.option("selectedIndex"))
                                                    });
                                                    ulElement.append(customerAppend).css({ 'cursor': "pointer", "padding": "3px", "background-color": "#f2c2c", "border-bottom": "1px solid #ccc" });
                                                })

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
                        allowFiltering: false,
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
                        dataField: "SCENARIO_DATE11",
                        allowFiltering: false,
                        caption: "Date",
                        allowEditing: false,
                        alignment: "center"

                    },
                    {
                        caption: "Opening Inventory",
                        columns: [
                            {
                                allowFiltering: false,
                                caption: "Propane",
                                dataField: "OPENING_INVENTORY_PROPANE",
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
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
                                allowFiltering: false,
                                dataField: "OPENING_INVENTORY_BUTANE",
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
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
                                allowFiltering: false,
                                caption: "Propane",
                                dataField: "TERMINAL_AVAILS_PROPANE",
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
                                allowEditing: true,
                                cellTemplate: function (container, options) {

                                    var isEditable = options.column.allowEditing && options.rowType === 'data';
                                    if (isEditable) {
                                        if (options.data.ROW_COUNT == 1) {
                                            container.css({ "background-color": "#fff2cc" });
                                        }
                                    }
                                    container.text(options.text);
                                },

                            },
                            {
                                caption: "Butane",
                                dataField: "TERMINAL_AVAILS_BUTANE",
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
                                allowFiltering: false,
                                allowEditing: true,
                                cellTemplate: function (container, options) {
                                    var isEditable = options.column.allowEditing && options.rowType === 'data';
                                    if (isEditable) {
                                        if (options.data.ROW_COUNT == 1) {
                                            container.css({ "background-color": "#fff2cc" });
                                        }
                                    }
                                    container.text(options.text);
                                }
                            }
                        ]
                    },
                    {
                        dataField: "CUSTOMER_NAME1",
                        caption: "Customer",
                        allowFiltering: true,
                        allowEditing: false,
                        alignment: "center",
                        cellTemplate: function (container, options) {
                            if (((options.data.CUSTOMER_NAME).slice(0, 7) != "PROPANE") && ((options.data.CUSTOMER_NAME).slice(0, 5) != "Dummy")) {
                                var customerId = options.data.CUSTOMER_ID;
                                var url = "https://cs-smoke.aramco.com/SASVisualAnalytics/?reportUri=%2Freports%2Freports%2F69b4a12c-4289-4df6-befc-20dcf897c1f3&sectionIndex=0&reportViewOnly=true&reportContextBar=false&pageNavigation=false&sas-welcome=false&pr26083=" + customerId;
                                $("<a>", {
                                    "href": url,
                                    "text": options.data.CUSTOMER_NAME1,
                                    "title": function () {
                                        var customerList = [];
                                        var tCustomerList = '';
                                        $.each(scenarioData.MONTHLY_NOMINATIONS, function (i, v) {
                                            if (v.NOMINATION_TEMP_KEY == options.data.NOMINATION_TEMP_KEY) {
                                                customerList.push(" " + v.CUSTOMER_NM + ": " + (v.PROPANE_KMT + v.BUTANE_KMT))
                                            }
                                            tCustomerList = customerList.toString();
                                        })
                                        return tCustomerList;
                                    },
                                    "target": "_blank"
                                }).appendTo(container);
                            }
                            else {
                                $("<a>", {
                                    "text": options.data.CUSTOMER_NAME1,
                                    "title": function () {
                                        var customerList = [];
                                        var tCustomerList = '';
                                        $.each(scenarioData.MONTHLY_NOMINATIONS, function (i, v) {
                                            if (v.NOMINATION_TEMP_KEY == options.data.NOMINATION_TEMP_KEY) {
                                                customerList.push(" " + v.CUSTOMER_NM + ": " + (v.PROPANE_KMT + v.BUTANE_KMT))
                                            }
                                            tCustomerList = customerList.toString();
                                        })
                                        return tCustomerList;
                                    },
                                }).appendTo(container);
                            }
                        }

                    },
                    {
                        dataField: "NOMINATION_TEMP_KEY",
                        caption: "Nomination Temp Key",
                        allowFiltering: false,
                        allowEditing: false,
                        alignment: "center",
                    },
                    {
                        caption: "Customer Liftings (KMT)",
                        columns: [
                            {
                                caption: "Propane",
                                allowEditing: true,
                                allowFiltering: false,
                                dataField: "CUSTOMER_LIFTING_PROPANE",
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
                                cellTemplate: function (container, options) {
                                    var isEditable = options.column.allowEditing && options.rowType === 'data' && options.data.NOMINATION_TEMP_KEY != null;
                                    if (isEditable) {
                                        container.css({ "background-color": "#fff2cc" });
                                    }
                                    container.text(options.text);
                                }
                            },
                            {
                                caption: "Butane",
                                allowEditing: true,
                                dataField: "CUSTOMER_LIFTING_BUTANE",
                                allowFiltering: false,
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
                                cellTemplate: function (container, options) {
                                    var isEditable = options.column.allowEditing && options.rowType === 'data' && options.data.NOMINATION_TEMP_KEY != null;
                                    if (isEditable) {
                                        container.css({ "background-color": "#fff2cc" });
                                    }
                                    container.text(options.text);
                                }
                            },
                            {
                                caption: "Total",
                                allowFiltering: false,
                                allowEditing: false,
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
                                calculateCellValue: function (rowData) {
                                    var total = rowData['CUSTOMER_LIFTING_PROPANE'] + rowData['CUSTOMER_LIFTING_BUTANE'];
                                    return (total != 0) ? total : "";
                                }
                            },
                        ]
                    },
                    {
                        caption: "Customer Liftings (MB)",
                        columns: [
                            {
                                caption: "Propane",
                                allowEditing: false,
                                allowFiltering: false,
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
                                // dataField: "CUSTOMER_LIFTINGS_PROPANE_MB"
                                calculateCellValue: function (rowData) {
                                    if (rowData.NOMINATION_TEMP_KEY != null) { return rowData.CUSTOMER_LIFTINGS_PROPANE_MB };
                                }
                            },
                            {
                                caption: "Butane",
                                allowEditing: false,
                                allowFiltering: false,
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
                                calculateCellValue: function (rowData) {
                                    if (rowData.NOMINATION_TEMP_KEY != null) { return rowData.CUSTOMER_LIFTINGS_BUTANE_MB };
                                }
                                // dataField: "CUSTOMER_LIFTINGS_BUTANE_MB"
                            }
                        ]
                    },
                    {
                        caption: "Closing Inventory",
                        columns: [
                            {
                                allowFiltering: false,
                                caption: "Propane",
                                allowEditing: false,
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
                                calculateCellValue: function (rowData) {
                                    return rowData.CLOSING_INVENTORY_PROPANE;
                                }
                            },
                            {
                                caption: "Butane",
                                allowEditing: false,
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
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
                                allowFiltering: false,
                                caption: "Propane",
                                allowEditing: false,
                                format: "#0%",
                                alignment: "center",
                                dataType: "number",
                                // dataField: "CLOSING_PERCENTAGE_PROPANE",
                                cellTemplate: function (container, options) {
                                    if (options.data.CLOSING_PERCENTAGE_PROPANE == "" || options.data.CLOSING_PERCENTAGE_PROPANE == undefined) {
                                        return "";
                                    }
                                    const valueDiv = $("<div title= 'Max Threshold:" + MAX_THRESHOLD_P + " Min Threshold: " + MIN_THRESHOLD_P + " Month End Min Propane:" + MNTH_END_MIN_P + "  Lowest Possible Inv Ratio Propane:" + LOWEST_POSSIBLE_INV_RATIO_P + "'>").text(options.data.CLOSING_PERCENTAGE_PROPANE + "%");
                                    if (options.data.SCENARIO_DATE != getLastDayOfMonth(scenarioData.TOLERANCE[0].PLANNING_MONTH)) {
                                        if (options.data.CLOSING_PERCENTAGE_PROPANE < MIN_THRESHOLD_P || options.data.CLOSING_PERCENTAGE_PROPANE > MAX_THRESHOLD_P) {
                                            container.addClass('highlight-cell');
                                        }
                                    }
                                    else {
                                        if (options.data.CLOSING_PERCENTAGE_PROPANE < MNTH_END_MIN_P || options.data.CLOSING_PERCENTAGE_PROPANE > MAX_THRESHOLD_P) {
                                            container.addClass('highlight-cell');
                                        }
                                    }
                                    if (options.data.CLOSING_PERCENTAGE_PROPANE < LOWEST_POSSIBLE_INV_RATIO_P) {
                                        container.addClass('font-weight-bold');
                                    }
                                    return valueDiv;
                                },

                            },
                            {
                                caption: "Butane",
                                allowEditing: false,
                                format: "#0%",
                                alignment: "center",
                                dataType: "number",
                                cellTemplate: function (container, options) {
                                    if (options.data.CLOSING_PERCENTAGE_BUTANE == "" || options.data.CLOSING_PERCENTAGE_BUTANE == undefined) {
                                        return "";
                                    }
                                    const valueDiv = $("<div title= 'Max Threshold:" + MAX_THRESHOLD_B + " Min Threshold: " + MIN_THRESHOLD_B + " Month End Min Butane:" + MNTH_END_MIN_B + " Lowest Possible Inv Ratio Butane:" + LOWEST_POSSIBLE_INV_RATIO_B + "'>").text(options.data.CLOSING_PERCENTAGE_BUTANE + "%");
                                    if (options.data.SCENARIO_DATE != getLastDayOfMonth(scenarioData.TOLERANCE[0].PLANNING_MONTH)) {
                                        if (options.data.CLOSING_PERCENTAGE_BUTANE < MIN_THRESHOLD_B || options.data.CLOSING_PERCENTAGE_BUTANE > MAX_THRESHOLD_B) {
                                            container.addClass('highlight-cell');
                                        }
                                    }
                                    else {
                                        if (options.data.CLOSING_PERCENTAGE_BUTANE < MNTH_END_MIN_B || options.data.CLOSING_PERCENTAGE_BUTANE > MAX_THRESHOLD_B) {
                                            container.addClass('highlight-cell');
                                        }
                                    }
                                    if (options.data.CLOSING_PERCENTAGE_BUTANE < LOWEST_POSSIBLE_INV_RATIO_B) {
                                        container.addClass('font-weight-bold');
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
                        allowFiltering: false,
                        alignment: "center",
                        calculateCellValue: function (rowData) {
                            if (((rowData.CUSTOMER_NAME).slice(0, 7) != "PROPANE") && ((rowData.CUSTOMER_NAME).slice(0, 5) != "Dummy")) {
                                var startDate = new Date(rowData.SCENARIO_DATE);
                                var endDate = new Date(rowData.NOMINATION_DATE);
                                var nomTempKey = rowData.NOMINATION_TEMP_KEY;
                                if (nomTempKey !== null) {
                                    var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
                                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
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
                        }
                    },
                    {
                        // dataField: "NOMINATION_TEMP_KEY",
                        caption: "Days",
                        allowEditing: false,
                        allowFiltering: false,
                        alignment: "center",
                        calculateCellValue: function (rowData) {
                            if (((rowData.CUSTOMER_NAME).slice(0, 7) != "PROPANE") && ((rowData.CUSTOMER_NAME).slice(0, 5) != "Dummy")) {
                                var startDate = new Date(rowData.SCENARIO_DATE);
                                var endDate = new Date(rowData.NOMINATION_DATE);
                                var nomTempKey = rowData.NOMINATION_TEMP_KEY;
                                if (nomTempKey !== null) {
                                    var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
                                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                    return diffDays;
                                }
                            }
                        }
                    },

                ],
            });

            var wcPropane = parseInt(scenarioData.DATA[0].MAX_SAFE_INVENTORY_PROPANE - scenarioData.DATA[0].MIN_SAFE_INVENTORY_PROPANE);
            var wcButane = parseInt(scenarioData.DATA[0].MAX_SAFE_INVENTORY_BUTANE - scenarioData.DATA[0].MIN_SAFE_INVENTORY_BUTANE);

            let formDivEast = $("<div id='eastToleranceForm' class='d-flex flex-row p-3'>")
            // formDiv.appendTo(element);
            formDivEast.appendTo(element);
            var formItemsEast = [
                /* {
                     label: {
                         text: "Ovr. TA Propane",
                         cssClass: "label-extend",
                         title: "Override Terminal Avails Propane"
                     },
                     editorType: "dxTextBox",
                     editorOptions: {
                         onValueChanged: function (e) {
                             var newEastTAPropane = $("#eastGrid").dxDataGrid("instance");
                             var newTADatasourceProp = newEastTAPropane.getDataSource().items();
                             newTADatasourceProp.forEach(function (rowData) {
                                 if (rowData.TERMINAL_AVAILS_PROPANE || rowData.TERMINAL_AVAILS_PROPANE == 0) {
                                     rowData.TERMINAL_AVAILS_PROPANE = parseInt(e.value);
                                 }
                             });
                             newEastTAPropane.refresh();
                             reCalculateTotals(newTADatasourceProp);
                         },
                     },
                 },
                 {
                     label:
                     {
                         text: "Ovr. TA Butane",
                         cssClass: "label-extend",
                         title: "Override Terminal Avails Butane",
                     },
                     editorType: "dxTextBox",
                     editorOptions: {
                         onValueChanged: function (e) {
                             var newEastTAButane = $("#eastGrid").dxDataGrid("instance");
                             var newTADatasourceBut = newEastTAButane.getDataSource().items();
                             newTADatasourceBut.forEach(function (rowData) {
                                 if (rowData.TERMINAL_AVAILS_BUTANE || rowData.TERMINAL_AVAILS_BUTANE == 0) {
                                     rowData.TERMINAL_AVAILS_BUTANE = parseInt(e.value);
                                 }
                             });
                             newEastTAButane.refresh();
                             reCalculateTotals(newTADatasourceBut);
                         },
                     },
                 },*/
                {
                    dataField: "TOLERANCE_PROPANE",
                    label:
                    {
                        text: "Tolerance Propane",
                        cssClass: "label-extend",
                        title: "Tolerance Propane",
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        onValueChanged: function (e) {
                            eastTolPropane = e.value;
                            reCalculateTotals(eastData);
                            $("#eastGrid").dxDataGrid("instance").refresh();
                        },
                    },
                },
                {
                    dataField: "TOLERANCE_BUTANE",
                    label:
                    {
                        text: "Tolerance Butane",
                        cssClass: "label-extend",
                        title: "Tolerance Butane",
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        onValueChanged: function (e) {
                            eastTolButane = e.value;
                            reCalculateTotals(eastData);
                            $("#eastGrid").dxDataGrid("instance").refresh();
                        },
                    },
                },
                {
                    label: {
                        text: "Working Capcity Propane",
                        cssClass: "label-extend",
                        title: "Working Capacity Propane",
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        value: wcPropane,
                        onValueChanged: function (e) {
                            wcPropane = parseInt(e.value);
                            $.each(eastData, function (i, v) {
                                if (v.ROW_COUNT == 1) {
                                    eastData[i].MAX_SAFE_INVENTORY_PROPANE = v.MIN_SAFE_INVENTORY_PROPANE + wcPropane;
                                }
                            });
                            reCalculateTotals(eastData);
                            $("#eastGrid").dxDataGrid("instance").refresh();
                        },
                    },
                },
                {
                    label:
                    {
                        text: "Working Capcity Butane",
                        cssClass: "label-extend",
                        title: "Working Capacity Butane",
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        value: wcButane,
                        onValueChanged: function (e) {
                            wcButane = parseInt(e.value);
                            $.each(eastData, function (i, v) {
                                if (v.ROW_COUNT == 1) {
                                    eastData[i].MAX_SAFE_INVENTORY_BUTANE = v.MIN_SAFE_INVENTORY_BUTANE + wcButane;
                                }
                            });
                            reCalculateTotals(eastData);
                            $("#eastGrid").dxDataGrid("instance").refresh();
                        },
                    },
                },
            ];
            formDivEast.dxForm({
                formData: scenarioData.TOLERANCE[0],
                items: formItemsEast,
                cssClass: "form-group",
                labelLocation: 'top',
                minColWidth: 400,
                colCount: 'auto',
                colCountByScreen: {
                    md: 4,
                    sm: 1,
                },
                screenByWidth(width) {
                    return width < 1000 ? 'sm' : 'md';
                }
            }).dxForm('instance');
        }
    }, {
        title: "West",
        icon: "rowfield",
        keyExpr: 'NOMINATION_TEMP_KEY',
        showBorders: true,
        template: function (itemData, itemIndex, element) {
            let dataWestGridDiv = $("<div id='westGrid'>");
            dataWestGridDiv.appendTo(element);
            dataWestGridDiv.dxDataGrid({
                dataSource: westData,
                sorting: {
                    mode: "none"
                },
                headerFilter: { visible: true },
                rowAlternationEnabled: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnAutoWidth: false,
                showBorders: true,
                columnFixing: {
                    enabled: true,
                },
                onEditingStart: function (e) {
                    gridValueChanged = true;
                    buttonGroupRefresh(scenarioData);

                },
                paging: false,
                onInitialized: function (e) {
                    reCalculateTotals(westData);
                },
                rowDragging: {
                    allowReordering: true,
                    onReorder(e) {
                        const visibleRows = e.component.getVisibleRows();
                        var nonAvailableDay = '';
                        const toIndex = westData.findIndex((item) => item.ROW_ORDER === (visibleRows[e.toIndex].data.ROW_ORDER));
                        const fromIndex = westData.findIndex((item) => item.ROW_ORDER === e.itemData.ROW_ORDER);
                        for (let i = 0; i < scenarioData.SLOT_AVAILABILITY.length; i++) {
                            if (scenarioData.SLOT_AVAILABILITY[i].AVAILABLE_FLG === "N" && westData[toIndex].SCENARIO_DATE == scenarioData.SLOT_AVAILABILITY[i].DAY) {
                                nonAvailableDay = 'Y';
                            }

                        }
                        if ((fromIndex >= 0) && (toIndex >= 0) && (fromIndex !== toIndex) && ((westData[toIndex].LOCK_NOMINATION != "Y") && (westData[fromIndex].LOCK_NOMINATION != "Y")) && (nonAvailableDay != 'Y')) {
                            const temp = westData[fromIndex];
                            westData[fromIndex] = westData[toIndex];
                            westData[toIndex] = temp;

                            $("#westGrid").dxDataGrid("instance").refresh();
                            reCalculateDraggedTotals(westData, toIndex, fromIndex);
                        }
                        removeNonAvailableRows(westData);
                        $("#westGrid").dxDataGrid("instance").refresh();
                        recalculateStats(eastData.concat(westData), scenarioGrid.option("selectedIndex"));
                    },
                },
                onRowDragStart: function (e) {
                    e.component.option("drggedRowData", e.data);
                },
                onRowDropped: function (e) {
                    var draggedRowData = e.component.option("draggedRowData");
                    var nonAvailableDay = '';
                    const toIndex = westData.findIndex((item) => item.ROW_ORDER === visibleRows[e.toIndex].data.ROW_ORDER);
                    const fromIndex = westData.findIndex((item) => item.ROW_ORDER === e.itemData.ROW_ORDER);
                    for (let i = 0; i < scenarioData.SLOT_AVAILABILITY.length; i++) {
                        if (scenarioData.SLOT_AVAILABILITY[i].AVAILABLE_FLG === "N" && westData[toIndex].SCENARIO_DATE == scenarioData.SLOT_AVAILABILITY[i].DAY) {
                            nonAvailableDay = 'Y';
                        }

                    }
                    if ((westData[toIndex].LOCK_NOMINATION != "Y" || westData[fromIndex].LOCK_NOMINATION != "Y") && (nonAvailableDay != "Y")) {
                        var targetData = e.dropInside ? e.component.getVisibleRows()[e.toIndex].data : e.component.getVisibleRows()[e.toIndex - 1].data;
                        getOnTimeAction(draggedRowData.SCENARIO_DATE, targetData.NOMINATION_DATE);
                        targetData.NOMINATION_DATE = draggedRowData.SCENARIO_DATE;
                        reCalculateDraggedTotals(westData, toIndex, fromIndex);
                    };

                    recalculateStats(eastData.concat(westData), scenarioGrid.option("selectedIndex"));
                    e.component.refresh();
                },
                editing: {
                    mode: 'cell',
                    allowUpdating: true,
                },
                onRowPrepared: function (e) {
                    if (e.data && scenarioData.SLOT_AVAILABILITY !== "") {
                        $.each(scenarioData.SLOT_AVAILABILITY, function (index, value) {
                            if (e.data.SCENARIO_DATE === value.DAY && value.AVAILABLE_FLG === "N") {
                                e.cancel = true;
                                e.rowElement.css("opacity", "0.5");
                                //e.rowElement.css("background", "none");
                                //e.rowElement.css({ "background-color": "#CFC", "position": "relative", "z-index": "999", "color": "#000" });

                                //e.rowElement.css({ "color": "#000" });
                                // e.rowElement.css();
                            }
                            else {
                                // e.rowElement.addClass("dx-row-alt");
                                e.rowElement.css("z-index", "0");
                            }
                        })

                    }
                },
                onEditorPreparing: function (e) {
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

                    if (e.parentType === "dataRow" && e.dataField === "CUSTOMER_LIFTING_PROPANE") {
                        var checkLift = e.row.data.CUSTOMER_LIFTING_PROPANE;
                        var checkNomKey = e.row.data.NOMINATION_TEMP_KEY;
                        if (checkLift !== null && checkNomKey !== "") {
                            e.cancel = false;
                        } else {
                            e.cancel = true;
                        }
                    }

                    if (e.parentType === "dataRow" && e.dataField === "CUSTOMER_LIFTING_BUTANE") {
                        var checkLift = e.row.data.CUSTOMER_LIFTING_BUTANE;
                        var checkNomKey = e.row.data.NOMINATION_TEMP_KEY;
                        if (checkLift !== null && checkNomKey !== "") {
                            e.cancel = false;
                        } else {
                            e.cancel = true;
                        }
                    }
                    if (e.parentType === "dataRow" && e.row.data.NOMINATION_TEMP_KEY == null) {
                        $("#diversionCalendarWest").hide();
                    }

                },
                onEditorPrepared: function (e) {
                    var newData = reCalculateTotals(e.component.option('dataSource'));
                    changedValue = e.value;
                    changedColumnName = e.name;
                    changedRowIndex = e.row.dataIndex;
                    e.component.refresh(true);
                    recalculateStats(eastData.concat(westData), scenarioGrid.option("selectedIndex"));
                },
                onRowUpdated: function (e) {
                    if (e.dataField == "OPENING_INVENTORY_PROPANE") {
                        const editColumnName = e.component.option("editing.editColumnName");
                        let scenarioEastData = e.component.option('dataSource');
                        reCalculateTotals(scenarioEastData);
                    }
                    for (var i = changedRowIndex; i < westData.length; i++) {
                        if (westData[i].ROW_COUNT == 1) {
                            if (changedColumnName == "TERMINAL_AVAILS_PROPANE") {
                                westData[i].TERMINAL_AVAILS_PROPANE = changedValue;
                            }
                            if (changedColumnName == "TERMINAL_AVAILS_BUTANE") {
                                westData[i].TERMINAL_AVAILS_BUTANE = changedValue;
                            }
                        }
                    }
                    reCalculateTotals(e.component.option('dataSource'));
                    recalculateStats(eastData.concat(westData), scenarioGrid.option("selectedIndex"));
                    e.component.refresh(true);
                },
                columns: [
                    {
                        allowFiltering: false,
                        caption: "Action",
                        width: 80,
                        alignment: "center",
                        cellTemplate: function (container, options) {
                            // Create a container div
                            var iconsContainer = $("<div>")
                                .addClass("icons-container")
                                .appendTo(container);

                            // Calendar icon
                            if (options.data.NOMINATION_TEMP_KEY != null) {
                                $("<a>").addClass("calendar-icon table-btn mr-2")
                                    .append($("<i title='Divert Nomination'>").addClass("fa fa-calendar")).attr(
                                        "disabled", options.data.CUSTOMER_NAME === "")
                                    .on("click", function () {
                                        var popup = $("<div id = 'diversionCalendarWest'>").addClass("calendar-popup").dxPopover({
                                            title: "Calendar",
                                            target: ".calendar-popup",
                                            position: "bottom",
                                            contentTemplate: function (contentElement) {
                                                // Get the current date
                                                var currentDate = new Date();
                                                // Set the next month as the value for the calendar
                                                var nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                                                var nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);
                                                var disabledDates = findAvailableSlot(scenarioData, eastData.concat(westData));
                                                var formatDates = disabledDates.westSlotAvailDate.map(function (date) { return new Date(date); });
                                                // Create and append the calendar widget
                                                $("<div>").dxCalendar({
                                                    value: nextMonth,
                                                    min: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
                                                    max: nextMonthEnd,
                                                    maxZoomLevel: "month",
                                                    disabledDates: formatDates,
                                                    onValueChanged: function (e) {
                                                        moveNominationOnGrid(options.data, e.value);
                                                        recalculateStats(eastData.concat(westData), scenarioGrid.option("selectedIndex"));
                                                    },


                                                }).appendTo(contentElement);
                                            },
                                            onHidden: function () {
                                                // Cleanup when the popup is closed
                                                popup.remove();
                                            },
                                        })
                                            .appendTo(container);
                                        popup.dxPopover("show");
                                    }).appendTo(iconsContainer);
                            }
                            if (options.data.NOMINATION_TEMP_KEY != null) {
                                $("<a>").addClass("cancel-icon table-btn mr-2")
                                    .append($("<i title='Cancel/Defer'>").addClass("fa fa-times")).attr(
                                        "disabled", options.data.CUSTOMER_NAME === "")
                                    .on("click", async function () {
                                        cancelNomination(options.data, scenarioData);
                                        recalculateStats(eastData.concat(westData), scenarioGrid.option("selectedIndex"))
                                        $('.overlay').hide();
                                    }).appendTo(iconsContainer);
                            };
                            ($.each(scenarioData.SLOT_AVAILABILITY, function (i, v) {
                                if (options.data.SCENARIO_DATE == v.DAY) {
                                    options.data.AVAILABLE_SLOT = v.AVAILABLE_FLG;
                                }
                            }));

                            if (options.data.NOMINATION_TEMP_KEY == null && t_cancelled_nominations_vr.APPND_NAME_KEY.length > 0 && options.data.AVAILABLE_SLOT == "Y") {
                                $("<a>").addClass("listing-icon table-btn mr-2")
                                    .append($("<i>").addClass("fa fa-caret-down")).css("cursor", "pointer").appendTo(iconsContainer)
                                    .on("click", function () {
                                        var popover = $("<div>").addClass("listing-popup").dxPopover({
                                            target: ".listing-popup",
                                            placement: "bottom",
                                            contentTemplate: function (contentElement) {

                                                var customerList = $("<div>").addClass("customer-popover");
                                                var ulElement = $("<ul style='list-style-type: none'>");

                                                t_cancelled_nominations_vr.APPND_NAME_KEY.forEach(function (dataItem) {
                                                    var customerAppend = $('<li>').text(dataItem).on("click", function (e) {
                                                        // Bring Back Nominations
                                                        bringBackNomination(options.data, $(this).text(), scenarioData, scenarioGrid.option("selectedIndex"));
                                                        recalculateStats(eastData.concat(westData), scenarioGrid.option("selectedIndex"))
                                                    });
                                                    ulElement.append(customerAppend).css({ 'cursor': "pointer", "padding": "3px", "background-color": "#f2c2c", "border-bottom": "1px solid #ccc" });
                                                })

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
                                        })
                                            .appendTo(container);
                                        popover.dxPopover("show");
                                    });
                            };
                        },
                    },

                    {
                        dataField: "LOCK_NOMINATION",
                        caption: "Lock Nomination",
                        allowFiltering: false,
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
                        dataField: "SCENARIO_DATE11",
                        allowFiltering: false,
                        caption: "Date",
                        allowEditing: false,
                        alignment: "center"

                    },
                    {
                        caption: "Opening Inventory",
                        columns: [
                            {
                                allowFiltering: false,
                                caption: "Propane",
                                dataField: "OPENING_INVENTORY_PROPANE",
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
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
                                allowFiltering: false,
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
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
                                allowFiltering: false,
                                caption: "Propane",
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
                                dataField: "TERMINAL_AVAILS_PROPANE",
                                allowEditing: true,
                                cellTemplate: function (container, options) {
                                    var isEditable = options.column.allowEditing && options.rowType === 'data';
                                    if (isEditable) {
                                        if (options.data.ROW_COUNT == 1) {
                                            container.css({ "background-color": "#fff2cc" });
                                        }
                                    }
                                    container.text(options.text);
                                },

                            },
                            {
                                caption: "Butane",
                                dataField: "TERMINAL_AVAILS_BUTANE",
                                allowFiltering: false,
                                allowEditing: true,
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
                                cellTemplate: function (container, options) {
                                    var isEditable = options.column.allowEditing && options.rowType === 'data';
                                    if (isEditable) {
                                        if (options.data.ROW_COUNT == 1) {
                                            container.css({ "background-color": "#fff2cc" });
                                        }
                                    }
                                    container.text(options.text);
                                }
                            }
                        ]
                    },
                    {
                        dataField: "CUSTOMER_NAME1",
                        caption: "Customer",
                        allowEditing: false,
                        allowFiltering: true,
                        alignment: "center",
                        cellTemplate: function (container, options) {
                            if (((options.data.CUSTOMER_NAME).slice(0, 7) != "PROPANE") && ((options.data.CUSTOMER_NAME).slice(0, 5) != "Dummy")) {
                                var customerId = options.data.CUSTOMER_ID;
                                var url = "https://cs-smoke.aramco.com/SASVisualAnalytics/?reportUri=%2Freports%2Freports%2F69b4a12c-4289-4df6-befc-20dcf897c1f3&sectionIndex=0&reportViewOnly=true&reportContextBar=false&pageNavigation=false&sas-welcome=false&pr26083=" + customerId;
                                $("<a>", {
                                    "href": url,
                                    "text": options.data.CUSTOMER_NAME1,
                                    "title": function () {
                                        var customerList = [];
                                        var tCustomerList = '';
                                        $.each(scenarioData.MONTHLY_NOMINATIONS, function (i, v) {
                                            if (v.NOMINATION_TEMP_KEY == options.data.NOMINATION_TEMP_KEY) {
                                                customerList.push(" " + v.CUSTOMER_NM + ": " + (v.PROPANE_KMT + v.BUTANE_KMT))
                                            }
                                            tCustomerList = customerList.toString();
                                        })
                                        return tCustomerList;
                                    },
                                    "target": "_blank"
                                }).appendTo(container);
                            }
                            else {
                                $("<a>", {
                                    "text": options.data.CUSTOMER_NAME1,
                                    "title": function () {
                                        var customerList = [];
                                        var tCustomerList = '';
                                        $.each(scenarioData.MONTHLY_NOMINATIONS, function (i, v) {
                                            if (v.NOMINATION_TEMP_KEY == options.data.NOMINATION_TEMP_KEY) {
                                                customerList.push(" " + v.CUSTOMER_NM + ": " + (v.PROPANE_KMT + v.BUTANE_KMT))
                                            }
                                            tCustomerList = customerList.toString();
                                        })
                                        return tCustomerList;
                                    },
                                }).appendTo(container);
                            }
                        }
                    },
                    {
                        dataField: "NOMINATION_TEMP_KEY",
                        caption: "Nomination Temp Key",
                        allowFiltering: false,
                        allowEditing: false,
                        alignment: "center",
                    },
                    {
                        caption: "Customer Liftings (KMT)",
                        columns: [
                            {
                                allowFiltering: false,
                                caption: "Propane",
                                allowEditing: true,
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
                                dataField: "CUSTOMER_LIFTING_PROPANE",
                                cellTemplate: function (container, options) {
                                    var isEditable = options.column.allowEditing && options.rowType === 'data' && options.data.NOMINATION_TEMP_KEY != null;
                                    if (isEditable) {
                                        container.css({ "background-color": "#fff2cc" });
                                    }
                                    container.text(options.text);
                                }
                            },
                            {
                                caption: "Butane",
                                allowEditing: true,
                                allowFiltering: false,
                                dataField: "CUSTOMER_LIFTING_BUTANE",
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
                                cellTemplate: function (container, options) {
                                    var isEditable = options.column.allowEditing && options.rowType === 'data' && options.data.NOMINATION_TEMP_KEY != null;
                                    if (isEditable) {
                                        container.css({ "background-color": "#fff2cc" });
                                    }
                                    container.text(options.text);
                                }
                            }
                        ]
                    },
                    {
                        caption: "Total",
                        allowFiltering: false,
                        allowEditing: false,
                        format: { type: "fixedPoint", precision: 0 },
                        alignment: "center",
                        calculateCellValue: function (rowData) {
                            var total = rowData['CUSTOMER_LIFTING_PROPANE'] + rowData['CUSTOMER_LIFTING_BUTANE'];
                            return (total != 0) ? total : "";
                        }
                    },
                    {
                        caption: "Customer Liftings (MB)",
                        columns: [
                            {
                                allowFiltering: false,
                                caption: "Propane",
                                allowEditing: false,
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
                                calculateCellValue: function (rowData) {
                                    if (rowData.NOMINATION_TEMP_KEY != null) { return rowData.CUSTOMER_LIFTINGS_PROPANE_MB };
                                }
                            },
                            {
                                caption: "Butane",
                                allowEditing: false,
                                allowFiltering: false,
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
                                calculateCellValue: function (rowData) {
                                    if (rowData.NOMINATION_TEMP_KEY != null) { return rowData.CUSTOMER_LIFTINGS_BUTANE_MB };
                                }
                            }
                        ]
                    },
                    {
                        caption: "Closing Inventory",
                        columns: [
                            {
                                allowFiltering: false,
                                caption: "Propane",
                                allowEditing: false,
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
                                calculateCellValue: function (rowData) {
                                    return rowData.CLOSING_INVENTORY_PROPANE;
                                }
                            },
                            {
                                caption: "Butane",
                                allowEditing: false,
                                format: { type: "fixedPoint", precision: 0 },
                                alignment: "center",
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
                                allowFiltering: false,
                                caption: "Propane",
                                allowEditing: false,
                                format: "#0%",
                                alignment: "center",
                                dataType: "number",
                                cellTemplate: function (container, options) {
                                    if (options.data.CLOSING_PERCENTAGE_PROPANE == "" || options.data.CLOSING_PERCENTAGE_PROPANE == undefined) {
                                        return "";
                                    }
                                    const valueDiv = $("<div>").text(options.data.CLOSING_PERCENTAGE_PROPANE + "%");

                                    if (options.data.SCENARIO_DATE != getLastDayOfMonth(scenarioData.TOLERANCE[0].PLANNING_MONTH)) {
                                        if (options.data.CLOSING_PERCENTAGE_PROPANE < MIN_THRESHOLD_P || options.data.CLOSING_PERCENTAGE_PROPANE > MAX_THRESHOLD_P) {
                                            container.addClass('highlight-cell');
                                        }
                                    }
                                    else {
                                        if (options.data.CLOSING_PERCENTAGE_PROPANE < MNTH_END_MIN_P || options.data.CLOSING_PERCENTAGE_PROPANE > MAX_THRESHOLD_P) {
                                            container.addClass('highlight-cell');
                                        }
                                    }
                                    if (options.data.CLOSING_PERCENTAGE_PROPANE < LOWEST_POSSIBLE_INV_RATIO_P) {
                                        container.addClass('font-weight-bold');
                                    }
                                    return valueDiv;
                                },
                            },
                            {
                                caption: "Butane",
                                allowEditing: false,
                                format: "#0%",
                                alignment: "center",
                                dataType: "number",
                                cellTemplate: function (container, options) {
                                    if (options.data.CLOSING_PERCENTAGE_BUTANE == "" || options.data.CLOSING_PERCENTAGE_BUTANE == undefined) {
                                        return "";
                                    }
                                    const valueDiv = $("<div>").text(options.data.CLOSING_PERCENTAGE_BUTANE + "%");
                                    if (options.data.SCENARIO_DATE != getLastDayOfMonth(scenarioData.TOLERANCE[0].PLANNING_MONTH)) {
                                        if (options.data.CLOSING_PERCENTAGE_BUTANE < MIN_THRESHOLD_B || options.data.CLOSING_PERCENTAGE_BUTANE > MAX_THRESHOLD_B) {
                                            container.addClass('highlight-cell');
                                        }
                                    }
                                    else {
                                        if (options.data.CLOSING_PERCENTAGE_BUTANE < MNTH_END_MIN_B || options.data.CLOSING_PERCENTAGE_BUTANE > MAX_THRESHOLD_B) {
                                            container.addClass('highlight-cell');
                                        }
                                    }
                                    if (options.data.CLOSING_PERCENTAGE_BUTANE < LOWEST_POSSIBLE_INV_RATIO_B) {
                                        container.addClass('font-weight-bold');
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
                        allowFiltering: false,
                        alignment: "center",
                        calculateCellValue: function (rowData) {
                            if (((rowData.CUSTOMER_NAME).slice(0, 7) != "PROPANE") && ((rowData.CUSTOMER_NAME).slice(0, 5) != "Dummy")) {
                                var startDate = new Date(rowData.SCENARIO_DATE);
                                var endDate = new Date(rowData.NOMINATION_DATE);
                                var nomTempKey = rowData.NOMINATION_TEMP_KEY;
                                if (nomTempKey !== null) {
                                    var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
                                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
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
                        }
                    },
                    {
                        // dataField: "NOMINATION_TEMP_KEY",
                        caption: "Days",
                        allowEditing: false,
                        allowFiltering: false,
                        alignment: "center",
                        calculateCellValue: function (rowData) {
                            if (((rowData.CUSTOMER_NAME).slice(0, 7) != "PROPANE") && ((rowData.CUSTOMER_NAME).slice(0, 5) != "Dummy")) {
                                var startDate = new Date(rowData.SCENARIO_DATE);
                                var endDate = new Date(rowData.NOMINATION_DATE);
                                var nomTempKey = rowData.NOMINATION_TEMP_KEY;
                                if (nomTempKey !== null) {
                                    var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
                                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                    return diffDays;
                                }
                            }
                        }
                    },

                ],
            });

            var wcPropane = parseInt(scenarioData.DATA[63].MAX_SAFE_INVENTORY_PROPANE - scenarioData.DATA[63].MIN_SAFE_INVENTORY_PROPANE);
            var wcButane = parseInt(scenarioData.DATA[63].MAX_SAFE_INVENTORY_BUTANE - scenarioData.DATA[63].MIN_SAFE_INVENTORY_BUTANE);

            let formDivWest = $("<div id='westToleranceForm' class='d-flex flex-row' style='margin:8px;'>")
            // formDiv.appendTo(element);
            formDivWest.appendTo(element);
            var formItemsWest = [
                /* {
                     label: {
                         text: "Ovr. TA Propane",
                         cssClass: "label-extend",
                         title: "Override Terminal Avails Propane"
                     },
                     editorType: "dxTextBox",
                     editorOptions: {
                         onValueChanged: function (e) {
                             var newWestTAPropane = $("#westGrid").dxDataGrid("instance");
                             var newTADatasourceProp = newWestTAPropane.getDataSource().items();
                             newTADatasourceProp.forEach(function (rowData) {
                                 if (rowData.TERMINAL_AVAILS_PROPANE || rowData.TERMINAL_AVAILS_PROPANE == 0) {
                                     rowData.TERMINAL_AVAILS_PROPANE = parseInt(e.value);
                                 }
                             });
                             newWestTAPropane.refresh();
                             reCalculateTotals(newTADatasourceProp);
                         },
                     },
                 },
                 {
                     label:
                     {
                         text: "Ovr. TA Butane",
                         cssClass: "label-extend",
                         title: "Override Terminal Avails Butane",
                     },
                     editorType: "dxTextBox",
                     editorOptions: {
                         onValueChanged: function (e) {
                             var newWestTAButane = $("#westGrid").dxDataGrid("instance");
                             var newTADatasourceBut = newWestTAButane.getDataSource().items();
                             newTADatasourceBut.forEach(function (rowData) {
                                 if (rowData.TERMINAL_AVAILS_BUTANE || rowData.TERMINAL_AVAILS_BUTANE == 0) {
                                     rowData.TERMINAL_AVAILS_BUTANE = parseInt(e.value);
                                 }
                             });
                             newWestTAButane.refresh();
                             reCalculateTotals(newTADatasourceBut);
                         },
                     },
                 },*/
                {
                    dataField: "TOLERANCE_PROPANE",
                    label:
                    {
                        text: "Tolerance Propane",
                        cssClass: "label-extend",
                        title: "Tolerance Propane",
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        onValueChanged: function (e) {
                            westTolPropane = e.value;
                            reCalculateTotals(westData);
                            $("#westGrid").dxDataGrid("instance").refresh();
                        },
                    },
                },
                {
                    dataField: "TOLERANCE_BUTANE",
                    label:
                    {
                        text: "Tolerance Butane",
                        cssClass: "label-extend",
                        title: "Tolerance Butane",
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        onValueChanged: function (e) {
                            westTolButane = e.value;
                            reCalculateTotals(westData);
                            $("#westGrid").dxDataGrid("instance").refresh();
                        },
                    },
                },
                {
                    label: {
                        text: "Working Capcity Propane",
                        cssClass: "label-extend",
                        title: "Working Capacity Propane",
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        value: wcPropane,
                        onValueChanged: function (e) {
                            wcPropane = parseInt(e.value);
                            $.each(westData, function (i, v) {
                                if (v.ROW_COUNT == 1) {
                                    westData[i].MAX_SAFE_INVENTORY_PROPANE = v.MIN_SAFE_INVENTORY_PROPANE + wcPropane;
                                }
                            });
                            reCalculateTotals(westData);
                            $("#westGrid").dxDataGrid("instance").refresh();
                        },
                    },
                },
                {
                    label:
                    {
                        text: "Working Capcity Butane",
                        cssClass: "label-extend",
                        title: "Working Capacity Butane",
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        value: wcButane,
                        onValueChanged: function (e) {
                            wcButane = parseInt(e.value);
                            $.each(westData, function (i, v) {
                                if (v.ROW_COUNT == 1) {
                                    westData[i].MAX_SAFE_INVENTORY_BUTANE = v.MIN_SAFE_INVENTORY_BUTANE + wcButane;
                                }
                            });
                            reCalculateTotals(westData);
                            $("#westGrid").dxDataGrid("instance").refresh();
                        },
                    },
                },
            ];
            formDivWest.dxForm({
                formData: scenarioData.TOLERANCE[1],
                items: formItemsWest,
                cssClass: "form-group",
                labelLocation: 'top',
                minColWidth: 400,
                colCount: 'auto',
                colCountByScreen: {
                    md: 4,
                    sm: 1,
                },
                screenByWidth(width) {
                    return width < 1000 ? 'sm' : 'md';
                }
            }).dxForm('instance');

        }
    }
    ],
    animationEnabled: true,
    swipeEnabled: true,
    selectedIndex: 0,
    onSelectionChanged: function (e) {
        recalculateStats(eastData.concat(westData), scenarioGrid.option("selectedIndex"));
        var selectedIndex = e.component.option('selectedIndex');
        if (selectedIndex === 0) {
        } else if (selectedIndex === 1) {
        }
    }
}).dxTabPanel("instance");
$("#tabpanel-container").dxTabPanel("instance").option("selectedIndex", 0);
$("#tabpanel-container").dxTabPanel("instance").option("selectedIndex", 1);
$("#tabpanel-container").dxTabPanel("instance").option("selectedIndex", 0);

// On page load run the statistics for export nominations
recalculateStats(scenarioData.DATA, scenarioGrid.option("selectedIndex"));

// This function helps to reformat the data which has been splited has East and West data
function formatToSave(planName = "", planDesc = "") {
    var toleranceData = [];
    var currentDate = new moment();
    var nextMonth = currentDate.clone().add(1, 'months');
    var nextMonthFullname = nextMonth.format("MMMYYYY").toUpperCase();

    toleranceData.push({
        "PLANNING_MONTH": nextMonthFullname,
        "REGION": "EAST",
        "TOLERANCE_BUTANE": parseInt(eastTolButane),
        "TOLERANCE_PROPANE": parseInt(eastTolPropane),
        "SCENARIO_PLANNING_STATUS": scenarioData.TOLERANCE[0].SCENARIO_PLANNING_STATUS
    });
    toleranceData.push({
        "PLANNING_MONTH": nextMonthFullname,
        "REGION": "WEST",
        "TOLERANCE_BUTANE": parseInt(westTolButane),
        "TOLERANCE_PROPANE": parseInt(westTolPropane),
        "SCENARIO_PLANNING_STATUS": scenarioData.TOLERANCE[1].SCENARIO_PLANNING_STATUS
    });
    var mergeData = eastData.concat(westData);
    var scenarioSummary = [];
    scenarioSummary.push({
        "PLANNING_MONTH": nextMonthFullname,
        "NUM_OF_NOMINATIONS_EAST": eastTotNoms,
        "NUM_OF_NOMINATIONS_WEST": westTotNoms,
        "TOTAL_NOMINATIONS": totNoms,
        "DIVERTED_TO_YANBU": eastToWestDiv,
        "DEFERRED_CANCELLED": totCanDef,
        "AVERAGE_DELAYED_DAYS": avg_delays,
        "BUSINESS_UNIT": "COSMD",
        "ACCEPTED_AS_PER_NOM_PORT": (totNoms - totDiv),
        "ACCEPTED_AS_PER_NOM_PORT_PCT": ((totNoms - totDiv) / totNoms),
        "DIVERTED_TO_YANBU_PCT": (eastToWestDiv / eastTotNoms),
        "DEFERRED_CANCELLED_PCT": (totCanDef / totNoms),
        "ACCEPTED_AS_PER_NOM_DATE": (totNoms - num_delays - num_advances),
        "ACCEPTED_AS_PER_NOM_DATE_PCT": ((totNoms - num_delays - num_advances) / totNoms),
        "DELAYED_NOMINATIONS": num_delays,
        "DELAYED_NOMINATIONS_PCT": num_delays / totNoms,
        "ADVANCED_NOMINATIONS": num_advances,
        "ADVANCED_NOMINATIONS_PCT": num_advances / totNoms,
        "AVERAGE_ADVANCEMENT_DAYS": avg_advances,
        "SCENARIO_PLANNING_VERSION": parseInt($('#version').html()),
        "SCENARIO_PLANNING_SUB_VERSION": 1,//backend will not consider this value, required field
        "PLAN_CYCLE_CLICK_VERSION": 1,//backend will not consider this value, required field
        "PLAN_NAME": planName,
        "PLAN_DESC": planDesc,
        "TOTAL_QTY_PROPANE": parseInt($('#totalPropaneQty').html()) ? parseInt($('#totalPropaneQty').html()) : 0,
        "TOTAL_QTY_BUTANE": parseInt($('#totalButaneQty').html()) ? parseInt($('#totalButaneQty').html()) : 0,
    });

    var jsonObject = {
        TOLERANCE: toleranceData,
        DATA: mergeData,
        MONTHLY_NOMINATIONS: scenarioData.MONTHLY_NOMINATIONS,
        LPG_OPTMODEL_CONFIG: scenarioData.LPG_OPTMODEL_CONFIG,
        SUMMARY: scenarioSummary,
    };


    return jsonObject;
}

function saveScenarioData() {
    DevExpress.ui.dialog.confirm("Are you sure you want data to Save Scenario ?", "Confirmation").done(function (dialogResult) {
        if (dialogResult) {
            $(".overlay").show();
            setTimeout(function () {
                var url = SAVE_SCENARIO
                var jsonObject = formatToSave(scenarioData.SUMMARY[0].PLAN_NAME, scenarioData.SUMMARY[0].PLAN_DESC);
                var scenarioSave = sendBatchRequest(url, JSON.stringify(jsonObject));
                $('.overlay').hide();
            }, 100);
        }
    });
}


function saveNewVerionScenarioData(popupDetails) {
    DevExpress.ui.dialog.confirm("Are you sure you want save data has New Version?", "Confirmation").done(function (dialogResult) {
        if (dialogResult) {
            $(".overlay").show();
            setTimeout(function () {
                var url = SAVE_NEW_VERSION;
                var jsonObject = formatToSave(popupDetails[0].PLAN_NAME, popupDetails[0].PLAN_DESC);
                var scenarioSave = sendBatchRequest(url, JSON.stringify(jsonObject));
                $('.overlay').hide();
            }, 100);
        }
    });

}

function revertToLastSaved() {
    DevExpress.ui.dialog.confirm("Are you sure you want data to revert to last saved?", "Confirmation").done(function (dialogResult) {
        if (dialogResult) {
            $(".overlay").show();
            setTimeout(function () {
                var url = REVERT_TO_LASTSAVED;
                var jsonObject = formatToSave(scenarioData.SUMMARY[0].PLAN_NAME, scenarioData.SUMMARY[0].PLAN_DESC);
                // $('.overlay').show();
                var scenarioSave = sendBatchRequest(url, JSON.stringify(jsonObject), actions = "revertToLastSaved");
                $('.overlay').hide();
            }, 100);
        }
    });
}

function nominationSuggestion() {
    DevExpress.ui.dialog.confirm("Are you sure you want data to show nomination suggestion?", "Confirmation").done(function (dialogResult) {
        if (dialogResult) {
            $(".overlay").show();
            setTimeout(function () {
                var url = NOMINATION_SUGGESTION;
                var jsonObject = formatToSave(scenarioData.SUMMARY[0].PLAN_NAME, scenarioData.SUMMARY[0].PLAN_DESC);
                var latestInv = sendBatchRequest(url, JSON.stringify(jsonObject), actions = "nominationSuggestion");
                $('.overlay').hide();
            }, 100);
        }
    });

}


// show pop up for optimization parameters
function fetchLatestInventory() {
    DevExpress.ui.dialog.confirm("Are you sure you want data to fetech latest inventory avails?", "Confirmation").done(function (dialogResult) {
        if (dialogResult) {
            $(".overlay").show();
            setTimeout(function () {
                var url = FETCH_LATES_INV;
                var jsonObject = formatToSave(scenarioData.SUMMARY[0].PLAN_NAME, scenarioData.SUMMARY[0].PLAN_DESC);
                $('.overlay').show();
                var latestInv = sendBatchRequest(url, JSON.stringify(jsonObject), actions = "latestInv");
                $('.overlay').hide();
            }, 100);
        }
    });
}

function reCallOspasApproval() {
    DevExpress.ui.dialog.confirm("Are you sure you want data to Recall your Submitted Approval?", "Confirmation").done(function (dialogResult) {
        if (dialogResult) {
            $(".overlay").show();
            setTimeout(function () {
                var url = RECALL_OSPAS_APPROVAL;
                var jsonObject = formatToSave(scenarioData.SUMMARY[0].PLAN_NAME, scenarioData.SUMMARY[0].PLAN_DESC);
                $('.overlay').show();
                var latestInv = sendBatchRequest(url, JSON.stringify(jsonObject), actions = "recallOSPAS");
                $('.overlay').hide();
            }, 100);
        }
    });
}

function refreshBothGridData(eastData, westData) {
    var selectedTab = scenarioGrid.option("selectedIndex");
    $("#tabpanel-container").dxTabPanel("instance").option("selectedIndex", 0);

    var gridEast = $("#eastGrid").dxDataGrid("instance");
    reCalculateTotals(eastData);
    gridEast.option("dataSource", eastData);

    reCalculateTotals(eastData);
    $("#tabpanel-container").dxTabPanel("instance").option("selectedIndex", 1);

    var gridWest = $("#westGrid").dxDataGrid("instance");
    reCalculateTotals(westData);
    gridWest.option("dataSource", westData);

    $("#tabpanel-container").dxTabPanel("instance").option("selectedIndex", selectedTab);
};

function reloadData(newData) {
    gridValueChanged = false;
    buttonGroupRefresh(newData);
    scenarioData = newData;
    getVersionStatus(newData);
    eastData = newData.DATA.filter(function (item) {
        return item.REGION === "EAST";
    });

    westData = newData.DATA.filter(function (item) {
        return item.REGION === "WEST";
    });
    refreshBothGridData(eastData, westData);
    // scenarioGrid.option("items[0].template", eastData);
};

$('#dragIcons').dxCheckBox({
    text: 'Show Drag Icons',
    value: true,
    onValueChanged(data) {
        gridData.option('rowDragging.showDragIcons', data.value);
    },
});

// new Version pop up
$("#scenarioVersion").dxPopup({
    visible: false,
    hideOnOutsideClick: false,
    title: 'Enter Details to Save New Version',
    showTitle: true,
    onShown: function () {
        $("#field1").css('visibility', 'visible');
        $("#field2").css('visibility', 'visible');
        $("#popup-input-container").dxTextBox({
        }).dxValidator({
            validationRules: [{
                type: "required",
                message: "This field cant be Blank"
            }]
        });
        $("#popup-text-container").dxTextArea({
        });
        $("#popupverion-submit-button").dxButton({
            text: "Save",
            alignment: 'right',
            useSubmitBehavior: true,
            onClick: function () {
                var versionPopupArray = [];
                var versionValue = $("#popup-input-container").dxTextBox("instance").option("value");
                if (versionValue == "") {
                    return false;
                }
                var descValue = $("#popup-text-container").dxTextArea("instance").option("value");
                var jsonObject = {
                    "PLAN_NAME": versionValue,
                    "PLAN_DESC": descValue
                };
                versionPopupArray.push(jsonObject)
                saveNewVerionScenarioData(versionPopupArray);
                $("#scenarioVersion").dxPopup("instance").hide();
            }
        })
    }
});

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
                var url = SUBMIT_COMMENT;
                var textAreaValue = $("#popup-textarea-container").dxTextArea("instance").option("value");
                var jsonObject = {
                    "DATA": textAreaValue
                };
                var jsonData = JSON.stringify(jsonObject);
                sendBatchRequest(url, jsonData);
                // btnInstance.option("disabled", "saveScenario");
                var textAreaValue = "";
                $('#popup').dxPopup("instance").hide();
            }
        });
    }
});

// optimization parameters
//show comments
function showPopupComments() {
    $('.overlay').show();
    $("#allComments").dxPopup({
        visible: false,
        hideOnOutsideClick: false,
        title: 'Comments',
        showTitle: true,
        resizeEnabled: true,
        contentTemplate: function (container) {
            var showCommentsData = function () {
                var tmp = null;
                $(".overlay").show();
                $.ajax({
                    url: SHOW_POPUP_COMMENTS,
                    dataType: "json",
                    async: false,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
                    },
                    success: function (data) {
                        $('.overlay').hide();
                        tmp = data;
                    }
                });
                return tmp;
            }();

            var gridData = $('<div id="showCommentsgrid" style="height:500px; overflow-y:scroll; paddding-bottom:10px;">').dxDataGrid({
                dataSource: showCommentsData,
                showBorders: true,
                paging: false,

                columns: [
                    {
                        dataField: 'COMMENTS',
                        caption: 'Title',
                    },
                    {
                        dataField: 'CREATED_BY',
                        caption: 'Created By',
                    },
                    {
                        dataField: 'CREATED_DTTM',
                        caption: 'Date Time',
                    },

                ],
            });
            gridData.appendTo(container);
        },
    }).dxPopup('instance');
}

//show comments
function optimizationParametersData() {
    $('.overlay').show();
    $("#optimizationParams").dxPopup({
        visible: false,
        hideOnOutsideClick: false,
        title: 'Optimization parameters',
        showTitle: true,
        resizeEnabled: true,
        contentTemplate: function (container) {
            var showOptParaData = function () {
                var tmp = null;
                $(".overlay").show();
                $.ajax({
                    url: OPTIMIZATION_READ_PARAMETRS,
                    dataType: "json",
                    async: false,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
                    },
                    success: function (data) {
                        $('.overlay').hide();
                        tmp = data;
                    }
                });
                return tmp;
            }();

            var gridData = $('<div id="showOptGrid" style="height:500px; overflow-y:scroll; paddding-bottom:10px;">').dxDataGrid({
                dataSource: showOptParaData.LPG_OPTMODEL_CONFIG,
                showBorders: true,
                sorting: {
                    mode: "none"
                },
                allowColumnResizing: true,
                columnAutoWidth: false,
                showBorders: true,
                columnFixing: {
                    enabled: true,
                },
                editing: {
                    mode: 'cell',
                    allowUpdating: true,
                },
                paging: false,
                onToolbarPreparing: function (e) {
                    //disble based on planning cycle started or not
                    var toolbarItems = e.toolbarOptions.items;
                    toolbarItems.push({
                        location: 'after',
                        widget: 'dxButton',
                        options: {
                            icon: "fa fa-save",
                            onClick: function () {
                                DevExpress.ui.dialog.confirm("Are you sure you want save optimization parameters?", "Confirmation").done(function (dialogResult) {
                                    if (dialogResult) {
                                        var newData = formatToSaveOpt();
                                        var url = OPTIMIZATION_SAVE_PARAMETRS;

                                        sendRequest(url, 'POST', JSON.stringify(newData));

                                    }
                                })
                            }
                        }
                    });
                },
                columns: [{
                    dataField: 'MACRO_OPTION',
                    allowEditing: false,
                    caption: 'MACRO Variable',
                    width: 300,
                }, {
                    dataField: 'MACRO_VALUE',
                    caption: 'Macro Value',
                    allowEditing: true,
                    width: 200,
                    cellTemplate: function (container, options) {
                        var isEditable = options.column.allowEditing && options.rowType === 'data';
                        if (isEditable) {
                            container.css({ "background-color": "#fff2cc", "border": "0.5px solid #ECE" });
                        }
                        container.text(options.text);
                    }
                }, {
                    dataField: 'MACRO_DESCRIPTION',
                    allowEditing: false,
                    caption: 'Description',
                },]
            });
            gridData.appendTo(container);
        },
    }).dxPopup('instance');
}

function formatToSaveOpt() {
    var getData = $('#showOptGrid').dxDataGrid("instance");
    var allData = getData.getDataSource().items();
    var formattedData = {
        "LPG_OPTMODEL_CONFIG": allData,
    }
    return formattedData;
}

async function sendRequest(url, method = 'POST', data) {
    const d = $.Deferred();
    if (data === undefined) {
        data = "";
    }
    var myToken = await sasgetCSRFToken();

    $.ajax(url, {
        method,
        data,
        cache: false,
        async: false,
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-Token', myToken);
            xhr.setRequestHeader('X-CSRF-Header', 'X-CSRF-Token');
        },
    }).done((result) => {
        d.resolve(method === 'POST' ? result.data : result);
        if (result != "" && result != null && data === "insertValues") {
            var grid = $('#gridContainer').dxDataGrid("instance");
            grid.option("dataSource", result.LPG_OPTMODEL_CONFIG);
            grid.refresh(result, true);
        }
        $('.overlay').hide();
        DevExpress.ui.notify({
            message: "Successful",
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

var viewBtns = $("#viewBtns").dxButtonGroup({
    items: viewBtnConfig,
    keyExpr: "alignment",
    stylingMode: "outlined",
    selectedItemKeys: ["grid"],
    onItemClick: (e) => {
        refreshBothGridData(eastData, westData);
        prepareChartData(eastData, westData);
        let { hint } = e.itemData;
        switch (hint) {
            case "Graph View":
                $("#tabpanel-container").hide();
                $("#tabChartContainer").show();
                break;
            case "Table View":
                $("#tabpanel-container").show();
                $("#tabChartContainer").hide();
                break;
            default:
                $("#tabpanel-container").show();
                $("#tabChartContainer").hide();
                break;
        }

    },
}).dxButtonGroup("instance");


function buttonGroupRefresh(scenarioData) {
    var scenarioStatus = scenarioData.TOLERANCE[0].SCENARIO_PLANNING_STATUS;
    var disabledbyStatus = disableOnRejection = disableactionbutton = disableOSPAS = disableRecallOSPAS = "";
    if (scenarioStatus == 0) {
        var disabledbyStatus = false;
        var disableOnRejection = false;
        var disableactionbutton = false;
        var disableOSPAS = true;
        var disableRecallOSPAS = true;

    } else if (scenarioStatus == 1) {
        var disabledbyStatus = false;
        var disableOnRejection = false;
        var disableOSPAS = true;
        var disableRecallOSPAS = true;

        if (disableactionbutton == true) {
            var disableactionbutton = false;
        } else {
            var disableactionbutton = true;
        }

    } else if (scenarioStatus == 2) {
        var disabledbyStatus = true;
        var disableOnRejection = true;
        var disableactionbutton = true;
        var disableOSPAS = false;
        var disableRecallOSPAS = false;

    } else if (scenarioStatus == 3) {
        var disabledbyStatus = false;
        var disableOnRejection = true;
        var disableactionbutton = false;
        var disableOSPAS = false;
        var disableRecallOSPAS = true;

    } else if (scenarioStatus == 4) {
        var disabledbyStatus = true;
        var disableOnRejection = true;
        var disableactionbutton = true;
        var disableOSPAS = true;
        var disableRecallOSPAS = true;
    }

    if (gridValueChanged == true || disabledbyStatus == true) {
        disableactionbutton = true;
    } else {
        disableactionbutton = false;
    }

    var groupActionButtons = [{ id: "idFetchLatestInventory", icon: 'fa fa-database', alignment: 'fetchInventory', onClick: fetchLatestInventory, hint: 'Fetch Latest Inventory and Avails' },
    { id: "optParams", icon: 'fa fa-lightbulb-o', alignment: 'optimizationParams', hint: 'Optimization Parameters' },
    { id: "idNominationSuggestion", icon: 'fa fa-magic', alignment: 'nomSuggest', onClick: nominationSuggestion, hint: 'Generate Nomination Suggestion' },
    { id: "revertLastSavedVersion", icon: 'fa fa-cogs', onClick: revertToLastSaved, alignment: 'revertSaved', hint: 'Revert to Last Saved Version' },
    { id: "saveScenario", icon: 'fa fa-save', disabled: disabledbyStatus, onClick: saveScenarioData, alignment: 'saveScenario', hint: 'Save Scenario' },
    { id: "saveAsNewVersion", icon: 'fa fa-share-square-o', disabled: disableOnRejection, alignment: 'saveNewVersion', hint: 'Save Scenario as New Version' },
    { id: "showComments", icon: 'fa fa-comment', alignment: 'showComment', hint: 'Show Comments' },
    { id: "scenarioSummary", icon: 'fa fa-list-alt', alignment: 'scenarioSummary', hint: 'Compare Summary Stats' },
    { id: "viewOspasVersion", icon: 'fa fa-eye', disabled: disableOSPAS, alignment: 'viewOSPASVersion', hint: 'View OSPAS Version' },
    { id: "recallOspasApproval", icon: 'fa fa-undo', disabled: disableRecallOSPAS, alignment: 'recallOspasApprove', hint: 'Recall Submitted Scenario - OSPAS Approval' },
    { id: "ospasApproval", icon: 'fa fa-send', alignment: 'ospasApprove', disabled: disableactionbutton, hint: 'Submit Scenario for OSPAS Approval' },
    { id: "excelDownload", icon: 'xlsxfile', onClick: downloadExcel, alignment: 'excelDownload', hint: 'Excel Download' }];


    $('#groupActionBtns').dxButtonGroup({
        items: groupActionButtons,
        keyExpr: 'alignment',
        stylingMode: 'outlined',
        selectedItemKeys: [],
        onItemClick: (e) => {
            if (e.itemData) {
                var itemId = e.itemData.id
                if (itemId === "optParams") {
                    optimizationParametersData();
                    $("#optimizationParams").dxPopup("instance").show();
                } else if (itemId === "idFetchLatestInventory") {
                    fetchLatestInventory
                } else if (itemId === "idNominationSuggestion") {
                    nominationSuggestion
                } else if (itemId === "revertLastSavedVersion") {
                    revertToLastSaved
                } else if (itemId === "saveScenario") {
                    saveScenarioData
                } else if (itemId === "saveAsNewVersion") {
                    $("#scenarioVersion").css('visibility', 'visible');
                    // $('#groupActionBtns').dxButtonGroup("instance").option("disabled", [ospasApproval]);
                    $(".overlay").show();
                    $("#scenarioVersion").dxPopup("instance").show();
                    $(".overlay").hide();
                } else if (itemId === "showComments") {
                    //we get all the comments data in var showCommentsData
                    showPopupComments();
                    $("#allComments").dxPopup("instance").show();
                } else if (itemId === "scenarioSummary") {
                    window.location.href = "https://cs-action.aramco.com/lpg_v1/scenario-summary-statistics-comparison.html";
                } else if (itemId === "viewOspasVersion") {
                    window.location.href = "https://cs-action.aramco.com/lpg_v1/scenario-planning-ospas-version-ro.html";
                } else if (itemId === "recallOspasApproval") {
                    reCallOspasApproval();
                } else if (itemId === "ospasApproval") {
                    $("#popup").dxPopup("instance").show();
                } else if (itemId === "excelDownload") {
                    downloadExcel
                } else {
                    $("#allComments").dxPopup("instance").hide();
                    $("#popup").dxPopup("instance").hide();
                    $("#scenarioVersion").dxPopup("instance").hide();
                    $("#optimizationParams").dxPopup("instance").hide();
                }
            }
        },
    });
}
