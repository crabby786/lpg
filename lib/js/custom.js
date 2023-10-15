/*****************************************************************************************
 *  Web Application for LPG Project
 *  (c) 2023 Aramco Author : Rajnikanth BS
 *  Usage: below function is created to read the planning month
 *  and parse it to so it can be visible on the headers of the web pages
 *  input: monthyearplan = "JUN2023";
*******************************************************************************************
*/

// variable for unit of measurement
var PROPANE_KMT_UOM = 12.446;
var BUTANE_KMT_UOM = 10.896;
var gridValueChanged = false;

//  scenario planning API URI's constants
var ROOT_URL = "https://sas-dev.aramco.com.sa";
var JOBEXEC_ROOT_URL = ROOT_URL + "/SASJobExecution";
var PROCESS_FLOW_USER_DETAILS = ROOT_URL + "/identities/users/";
var CSRF_URL = JOBEXEC_ROOT_URL + "/csrf";
var READ_URL = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Read&PLANNING_MONTH=MAY2023";
var SAVE_SCENARIO = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Save";
var SAVE_NEW_VERSION = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Save%20as%20New%20Version";
var REVERT_TO_LASTSAVED = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Revert%20Last%20Saved&BUSINESS_UNIT=COSMD";
var NOMINATION_SUGGESTION = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Generate%20Nomination%20Suggestion";
var FETCH_LATES_INV = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Fetch%20Latest%20Inventory%20and%20Avails";
var SUBMIT_COMMENT = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Submit%20to%20OSPAS&PLANNING_MONTH=MAY2023";
var SHOW_POPUP_COMMENTS = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Read%20Comments&PLANNING_MONTH=MAY2023";

// Approve Scenario API URI's Constants
var APPROVE_READ_URI = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Read&BUSINESS_UNIT=OSPAS";
var APPROVE_SAVE_URI = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Save%20OSPAS";
var APPROVE_FETCH_LATEST_INV = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Fetch%20Latest%20Inventory%20and%20Avails";
var APPROVE_REVERT_COSMD_VERSION = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Revert%20to%20COSMD%20Version";
var APPROVE_COMMENTS_OSPAS = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Return%20to%20COSMD";
var OPTIMIZATION_SAVE_PARAMETRS = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FOptimizer%20Rule%20Parameter%20Editor%20-%20Update";
var OPTIMIZATION_READ_PARAMETRS = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FOptimizer%20Rule%20Parameter%20Editor%20-%20Read";
var RECALL_OSPAS_APPROVAL = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Reset";
// JSON object with short month names as keys and full month names as values

//Scenario Planning OSPAS Version Read only
var OSPAS_VERSION_READONLY_READ = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Read%20OSPAS";
var OSPAS_VERSION_READONLY_SUBMIT_COMMENT = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Submit%20to%20OSPAS&PLANNING_MONTH=MAY2023";
var OSPAS_VERSION_READONLY_SHOW_POPUP_COMMENTS = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Read%20Comments&PLANNING_MONTH=MAY2023";
var OSPAS_VERSION_READONLY_CHANGE_SUMMARY = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20OSPAS%20Change%20Summary";

// Scenario Summary statistics comparision OSPAS
var OSPAS_SCENARIO_SUMMARY_STATISTICS_COMPARISION = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Statistics%20Comparision%20OSPAS";

//Scenario Summary Statistics comparision COSMD
var COSMD_SCENARIO_SUMMARY_STATISTICS_COMPARISION = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Statistics%20Comparision";

//Approve Scenario COSMD VERSION
var APPROVE_SCENARIO_COSMD_VERSION_RO_READ = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Read";
var APPROVE_SCENARIO_COSMD_VERSION_RO_COMMENTS_FROM_OSPAS = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FSubmit%20scenario%20for%20OSPAS%20approval%20-%20Load%20Data";
var APPROVE_SCENARIO_COSMD_VERSION_RO_SHOW_COMMENTS = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Demand%20Allocation%20Scenario%20Planning%20Read%20Comments";

// MONTHLY NOMINATIONS URI CONSTANTS
var MONTHLY_READ_URI = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Cust%20Monthly%20Data_Dropdown-Read";
var MONTHLY_DELETE_URI = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Cust%20Monthly%20Nom-Delete";
var MONTHLY_SAVE_URI = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Cust%20Monthly%20Nom-Upsert";
var MONTHLY_START_PLANNING_CYCLE_URI = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FStart_Planning_Cycle_Status_Update&planning_month=";
var MONTHLY_LOAD_FROM_SAP_URI = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FExport%20Cust%20Monthly%20Nom-Load%20From%20SAP";

// MARK AVAILABILITY SLOTS
var MARK_READ_URI = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FMark%20Unavailable%20Slots%20in%20West%20Term_Data%20and%20Line%20Chart%20-%20Read";
var MARK_SAVE_SLOTS_URI = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FMark%20Unavailable%20Slots%20in%20West%20Term-Upsert";
var MARK_NOTIFY_URI = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FMark%20Unavailable%20Slots%20in%20West%20Term-Send%20Email%20To%20COSMD";

// DOMESTIC CUSTOMER DEMAND
var DOMESTIC_DEMAND_READ_URI = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FDownload%20Domestic%20Customer%20Demand";
var PROCEESS_FLOW_READ_URI = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FScenario%20Planning%20Cycle%20Active%20Stage%20Status";

//Create Nominations in SAP
var GET_NOMINATION_URL = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FCreate%20SAP%20Nom%20Dropdown%20and%20Read%20Data%20API";
var SAVE_NOMINATION_URL = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FCreate%20SAP%20Nomination%20-Update";
var CREATE_SAP_NOMINATION_URL = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FCreate%20SAP%20Nom%20-%20Load%20to%20SAP%20-%209_4";
var RECALL_NOMINATION_COSMD = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FCreate%20SAP%20Nom%20-%20Reset";

//Forecast Override Operating Month
const FORECAST_OPERATING_LIST = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FAPI%20Domestic_Demand_Over_Screen%20-%20READ&MONTH=";
const FORECAST_OPERATING_SAVE = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FUpdate_Domestic_Demand_Save_Overrides_API&MONTH=";
const FORECAST_OPERATING_RUN = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FUpdate_Domestic_Demand_Run_Forecast_API&MONTH=";
const FORECAST_OPERATING_SAP_UPDATE = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FUpdate_Domestic_Demand_Update_In_SAP_API&MONTH=";

//Forecast Override Planning Month
const FORECAST_PLANNING_LIST = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FAPI%20Domestic_Demand_Over_Screen%20-%20READ&MONTH=";
const FORECAST_PLANNING_SAVE = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FUpdate_Domestic_Demand_Save_Overrides_API&MONTH=";
const FORECAST_PLANNING_RUN = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FUpdate_Domestic_Demand_Run_Forecast_API&MONTH=";
const FORECAST_PLANNING_SAP_UPDATE = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FUpdate_Domestic_Demand_Update_In_SAP_API&MONTH=";

//Operating Simulation
var SIMULATION_GET_DATA = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FOperating%20Month%20Inv%20Simulation%20-%20Read%20API";
var SIMULATION_SAVE_ADJUSTMENT = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FOperating%20Month%20Inv%20Sim%20-%20Save%20Adjustment";
var SIMULATION_SEND_NOTIFICATION = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FOperating%20Month%20Inv%20Sim%20-%20Send%20Notification%20to%20COSMD";
var SIMULATION_NOMINATION_SUGGESTION = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FOperating%20Month%20Inv%20Sim%20-%20Generate%20Nomination%20Suggestion";

//Make Session Active
var makeSessionActiveURL = JOBEXEC_ROOT_URL + "/?_program=%2FSTSP%20LPG%20Demand%20Forecasting%2FCodes%2FWeb%20Interface%2FAPI%20Jobs%2FKeep%20Session%20Active";

var monthNames = {
  "JAN": "January",
  "FEB": "February",
  "MAR": "March",
  "APR": "April",
  "MAY": "May",
  "JUN": "June",
  "JUL": "July",
  "AUG": "August",
  "SEP": "September",
  "OCT": "October",
  "NOV": "November",
  "DEC": "December"
};

var dummyNominations = {
  "PROPANE44_BUTANE00": "Full C3",
  "PROPANE00_BUTANE44": "Full C4",
  "PROPANE22_BUTANE22": "Equal Split",
  "PROPANE33_BUTANE11": "Heavy C3",
  "PROPANE11_BUTANE33": "Heavy C4"
};

// Function to calculate number of days of inventory violation
var dayWestViolation = 0;
var dayEastViolation = 0;
var dayViolation = 0;
var MAX_THRESHOLD_P = 80;
var MIN_THRESHOLD_P = 20;
var MAX_THRESHOLD_B = 80;
var MIN_THRESHOLD_B = 20;
var MNTH_END_MIN_P = 20;
var MNTH_END_MIN_B = 20;
var LOWEST_POSSIBLE_INV_RATIO_P = 10;
var LOWEST_POSSIBLE_INV_RATIO_B = 10;
var NUM_BERTHS_EAST = 2;
var NUM_BERTHS_WEST = 1;
var LOWEST_OSPAS_INV_RATIO_B = 20;
var LOWEST_OSPAS_INV_RATIO_P = 20;
var MAX_OSPAS_THRESHOLD_B = 70;
var MAX_OSPAS_THRESHOLD_P = 70;
var MAXIMUM_OSPAS_INV_RATIO_B = 90;
var MAXIMUM_OSPAS_INV_RATIO_P = 90;
var MIN_OSPAS_THRESHOLD_B = 20;
var MIN_OSPAS_THRESHOLD_P = 20;
var MNTH_OSPAS_END_MAX_B = 70;
var MNTH_OSPAS_END_MAX_P = 70;
var MNTH_OSPAS_END_MIN_B = 20;
var MNTH_OSPAS_END_MIN_P = 20;



// Function to calculate nomination total quantities
var propaneWestNomQty = 0;
var butaneWestNomQty = 0;
var propaneEastNomQty = 0;
var butaneEastNomQty = 0;
// Function to calculation total nominations for export planning

var eastTotNoms = 0;
var westTotNoms = 0;
var totNoms = 0;
var eastChartData = [];
var westChartData = [];

// Function to calculation average delays and advances for export nominations

var num_delays = 0;
var sum_delays = 0;
var avg_delays = 0;
var num_advances = 0;
var sum_advances = 0;
var avg_advances = 0;

//Function to calculate the number of diversions for export nominations
var eastToWestDiv = 0;
var westToWestDiv = 0;
var totDiv = 0;

//Function to calculate the number of nominations that are cancelled or deferred
var eastCanDef = 0;
var westCanDef = 0;
var totCanDef = 0;

// function to calculate additional nominations suggested by algorithm
var totAddNom = 0;
var eastAddNom = 0;
var westAddNom = 0;


// Function to calculation total available quantities
var totC3EastAvailableQty = 0;
var totC4EastAvailableQty = 0;
var totC3WestAvailableQty = 0;
var totC4WestAvailableQty = 0;

// Function to convert "JUN2023" to "June 2023"
function convertMonthYear(monthyearplan) {
  // Extract the month abbreviation (e.g., "JUN") and year (e.g., "2023") from the given string
  var month = monthyearplan.slice(0, 3);
  var year = monthyearplan.slice(3);

  // Get the full month name from the dictionary using the abbreviation
  var fullMonth = monthNames[month.toUpperCase()];

  // Check if the full month name is found in the dictionary
  if (fullMonth) {
    return fullMonth + " " + year;
  } else {
    return null; // Return null if the month abbreviation is not found in the dictionary
  }
}
function handleUserDetails(data) {
  var ospasGroup = "STSP LPG Demand Forecasting OSPAS";
  var nglGroup = "LPG NGL COORDINATION SAS";
  var comdGroup = "STSP LPG Demand Forecasting COSMD";
  var sropGroup = "LPG SROP SAS";
  var TechnicalGroup = "STSP LPG Demand Forecasting Technical Group";
  ospasAccess = JSON.stringify(data).indexOf(ospasGroup);
  nglCoordinationAccess = JSON.stringify(data).indexOf(nglGroup);
  cosmdGroupAccess = JSON.stringify(data).indexOf(comdGroup);
  sropAccess = JSON.stringify(data).indexOf(sropGroup);
  technicalAccess = JSON.stringify(data).indexOf(TechnicalGroup);
  console.log('handleUserDetails', 'ospasAccess', ospasAccess);

  // Enable or Disable link based on the security
  // Ospas to get access to only upload the west availability
  if (ospasAccess != -1) {
    $("#l_create_nom").removeAttr("href").addClass('disabled').css('color', 'gray');
    $("#l_cosmd_planning").removeAttr("href").addClass('disabled').css('color', 'gray');
    $("#l_export_nomination").removeAttr("href").addClass('disabled').css('color', 'gray');

  };
  // Cosmd to get access to enter monthly nomination & Scenario planning but not approval
  if (cosmdGroupAccess != -1) {
    $("#l_west_availability").removeAttr("href").addClass('disabled').css('color', 'gray');
    $("#l_ospas_planning").removeAttr("href").addClass('disabled').css('color', 'gray');
  };

  // technical group get all access
  if (technicalAccess != -1) {

  };




}
function getUserDetails(user) {
  var url = PROCESS_FLOW_USER_DETAILS + user + "/memberships?limit=100";
  $.ajax({
    url: url,
    dataType: "json",
    async: false,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('X-CSRF-TOKEN', 'Bearer sas_services');
      $('.overlay').show();
    },
    success: (data) => {
      handleUserDetails(data);
    },
    complete: (data) => {
      //  handleUserDetails(data); // when testing locally
      $('.overlay').hide();
    },

  })
};

// Function to convert "JUN2023" to "May 2023", i.e. finding operating month
function findPreviousMonth(monthyearplan) {
  var month = monthyearplan.slice(0, 3);
  var year = parseInt(monthyearplan.slice(3));

  var numericMonth = Object.keys(monthNames).find(key => monthNames[key] === month);
  numericMonth = parseInt(numericMonth);

  if (numericMonth === 1) {
    // Handle January (1 becomes 12)
    numericMonth = 12;
    year--;
  } else {
    numericMonth--;
  }

  var previousMonthAbbreviation = Object.keys(monthNames).find(key => parseInt(key) === numericMonth);
  var previousMonthFull = monthNames[previousMonthAbbreviation];

  if (previousMonthFull) {
    return previousMonthFull + " " + year;
  } else {
    return null;
  }
}

// function to find the last day of the planning month
function getLastDayOfMonth(monthyearplan) {
  // Convert the planning month string to a Date object
  const date = new Date(monthyearplan);

  // Set the date to the next month's first day (month + 1)
  date.setMonth(date.getMonth() + 1, 1);

  // Subtract one day to get the last day of the planning month
  date.setDate(date.getDate() - 1);

  // Format the date as "ddMONyyyy" (e.g., "30JUN2023")
  const formattedDate = date.getDate().toString().padStart(2, '0') + date.toLocaleString('default', { month: 'short' }).toUpperCase() + date.getFullYear();

  return formattedDate;
}

//Initializes the chart for Scenario Planning
function createChartOptions(data, calledFrom) {
  var valueAxisSettings = {
    grid: {
      visible: true,
    },
    size: {
      height: 400,
      width: 600,
    },
    label: {
      format: {
        type: "fixedPoints",
        precision: 2,

      },
      overlappingBehaviour: 'stagger',

    },
    axisDivisionFactor: 0,
  };
  if (calledFrom === "propane") {
    valueAxisSettings.title = "Propane";
  }
  else {
    valueAxisSettings.title = "Butane";
  }

  return {
    dataSource: data,
    title: {
      text: calledFrom.toUpperCase(),
      font: {
        size: 18
      }
    },

    export: {
      enabled: true,
    },
    valueAxis: [
      {
        name: 'valueAxis',
        position: 'left',
        grid: {
          visible: true,
        },
        visualRange: {

        },

      }
    ],
    valueAxis: [
      {
        name: 'valueAxis2',
        position: 'right',
        grid: {
          visible: true,
        },

      }
    ],
    series: [
      {
        name: "Safe Inventory Area",
        type: 'rangeArea',
        axis: "valueAxis",
        rangeValue2Field:
          calledFrom === "butane"
            ? "MAX_SAFE_THRESHOLD_BUTANE"
            : "MAX_SAFE_THRESHOLD_PROPANE",
        rangeValue1Field:
          calledFrom === "butane"
            ? "MIN_SAFE_THRESHOLD_BUTANE"
            : "MIN_SAFE_THRESHOLD_PROPANE",
        color: "rgba(155,238,194,0.2)",
        opacity: 1,
        point: { visible: false }

      },
      {
        valueField:
          calledFrom === "propane"
            ? "CUSTOMER_LIFTINGS_PROPANE_MB"
            : "CUSTOMER_LIFTINGS_BUTANE_MB",
        name:
          calledFrom === "propane"
            ? "Customer Lifting Propane"
            : "Customer Lifting Butane",
        type: "bar",
        axis: "valueAxis2",
        color: "#ffc107",
      },
      {
        valueField:
          calledFrom === "propane"
            ? "ADDITIONAL_LIFTINGS_PROPANE_MB"
            : "ADDITIONAL_LIFTINGS_BUTANE_MB",
        name:
          calledFrom === "propane"
            ? "Additional Lifting Propane"
            : "Additional Lifting Butane",
        type: "bar",
        axis: "valueAxis2",
        color: "#07ffc1",
      },
      {
        valueField:
          calledFrom === "propane"
            ? "CLOSING_INVENTORY_PROPANE"
            : "CLOSING_INVENTORY_BUTANE",
        name:
          calledFrom === "propane"
            ? "Closing Inventory Propane"
            : "Closing Inventory Butane",
        type: "line",
        axis: "valueAxis",
        color: "#0dcaf0",
        point: { visible: false }
      },
      {
        valueField:
          calledFrom === "propane"
            ? "MIN_SAFE_INVENTORY_PROPANE"
            : "MIN_SAFE_INVENTORY_BUTANE",
        name: "Min Safe Inventory",
        dashStyle: 'dash',
        axis: "valueAxis",
        color: "red",
        point: { visible: false }
      },
      {
        valueField:
          calledFrom === "butane"
            ? "MAX_SAFE_INVENTORY_BUTANE"
            : "MAX_SAFE_INVENTORY_PROPANE",
        name: "Max Safe Inventory",
        dashStyle: 'dash',
        axis: "valueAxis",
        color: "green",
        point: { visible: false }
      },

    ],
    commonSeriesSettings: {
      argumentField: "SCENARIO_DATE",
      aggregatedPointsPosition: 'crossTicks'
    },

    argumentAxis: {
      label: {
        rotationAngle: 60,
        customizeText: function () {
          // var dateParts = this.value.split(/\d{4}/).filter(Boolean);
          var dateParts = this.value.match(/\d{2}/);
          return dateParts[0];
        },
      },
    },
    tooltip: {
      enabled: true,
      customizeTooltip: function (arg) {
        return {
          text: "Day: " + arg.argument + "<br/>" + arg.seriesName + ": " + arg.valueText
        };
      },
    },
    legend: {
      visible: true,
      verticalAlignment: "bottom",
      horizontalAlignment: "center",
    }
  };
};


// function for chart preparation
function preProcessData(data, returnData) {
  var tData = {};
  $.each(data, function (i, v) {
    var date = v.SCENARIO_DATE;
    if (!tData[date]) {
      tData[date] = {
        "CUSTOMER_LIFTINGS_PROPANE_MB": 0,
        "CUSTOMER_LIFTINGS_BUTANE_MB": 0,
        "ADDITIONAL_LIFTINGS_BUTANE_MB": 0,
        "ADDITIONAL_LIFTINGS_PROPANE_MB": 0,
        "MIN_SAFE_INVENTORY_PROPANE": 0,
        "MIN_SAFE_INVENTORY_BUTANE": 0,
        "MAX_SAFE_INVENTORY_BUTANE": 0,
        "MAX_SAFE_INVENTORY_PROPANE": 0,
        "CLOSING_INVENTORY_BUTANE": 0,
        "CLOSING_INVENTORY_PROPANE": 0,
        'MIN_SAFE_THRESHOLD_PROPANE': 0,
        'MIN_SAFE_THRESHOLD_BUTANE': 0,
        'MAX_SAFE_THRESHOLD_PROPANE': 0,
        'MAX_SAFE_THRESHOLD_BUTANE': 0,
      };
    }
    if (v.CUSTOMER_ID.indexOf("PROPANE") == -1 && v.CUSTOMER_NAME.indexOf("Dummy") == -1) {
      tData[date].CUSTOMER_LIFTINGS_PROPANE_MB += parseInt(v.CUSTOMER_LIFTINGS_PROPANE_MB) || 0;
      tData[date].CUSTOMER_LIFTINGS_BUTANE_MB += parseInt(v.CUSTOMER_LIFTINGS_BUTANE_MB) || 0;
    }
    else {
      tData[date].ADDITIONAL_LIFTINGS_BUTANE_MB += parseInt(v.CUSTOMER_LIFTINGS_BUTANE_MB) || 0;
      tData[date].ADDITIONAL_LIFTINGS_PROPANE_MB += parseInt(v.CUSTOMER_LIFTINGS_PROPANE_MB) || 0;
    }
    tData[date].MIN_SAFE_INVENTORY_PROPANE += parseInt(v.MIN_SAFE_INVENTORY_PROPANE) || 0;
    tData[date].MIN_SAFE_INVENTORY_BUTANE += parseInt(v.MIN_SAFE_INVENTORY_BUTANE) || 0;
    tData[date].MAX_SAFE_INVENTORY_BUTANE += parseInt(v.MAX_SAFE_INVENTORY_BUTANE) || 0;
    tData[date].MAX_SAFE_INVENTORY_PROPANE += parseInt(v.MAX_SAFE_INVENTORY_PROPANE) || 0;
    tData[date].CLOSING_INVENTORY_BUTANE += parseInt(v.CLOSING_INVENTORY_BUTANE) || 0;
    tData[date].CLOSING_INVENTORY_PROPANE += parseInt(v.CLOSING_INVENTORY_PROPANE) || 0;
    if (pageNm == 'ospas') {
      tData[date].MIN_SAFE_THRESHOLD_PROPANE += parseInt((MIN_OSPAS_THRESHOLD_P / 100) * ((v.MAX_SAFE_INVENTORY_PROPANE || 0) - (v.MIN_SAFE_INVENTORY_PROPANE || 0)));
      tData[date].MIN_SAFE_THRESHOLD_BUTANE += parseInt((MIN_OSPAS_THRESHOLD_B / 100) * ((v.MAX_SAFE_INVENTORY_BUTANE || 0) - (v.MIN_SAFE_INVENTORY_BUTANE || 0)));
      tData[date].MAX_SAFE_THRESHOLD_PROPANE += parseInt((MAX_OSPAS_THRESHOLD_P / 100) * ((v.MAX_SAFE_INVENTORY_PROPANE || 0) - (v.MIN_SAFE_INVENTORY_PROPANE || 0)));
      tData[date].MAX_SAFE_THRESHOLD_BUTANE += parseInt((MAX_OSPAS_THRESHOLD_B / 100) * ((v.MAX_SAFE_INVENTORY_BUTANE || 0) - (v.MIN_SAFE_INVENTORY_BUTANE || 0)));
    }
    else {
      tData[date].MIN_SAFE_THRESHOLD_PROPANE += parseInt((MIN_THRESHOLD_P / 100) * ((v.MAX_SAFE_INVENTORY_PROPANE || 0) - (v.MIN_SAFE_INVENTORY_PROPANE || 0)));
      tData[date].MIN_SAFE_THRESHOLD_BUTANE += parseInt((MIN_THRESHOLD_B / 100) * ((v.MAX_SAFE_INVENTORY_BUTANE || 0) - (v.MIN_SAFE_INVENTORY_BUTANE || 0)));
      tData[date].MAX_SAFE_THRESHOLD_PROPANE += parseInt((MAX_THRESHOLD_P / 100) * ((v.MAX_SAFE_INVENTORY_PROPANE || 0) - (v.MIN_SAFE_INVENTORY_PROPANE || 0)));
      tData[date].MAX_SAFE_THRESHOLD_BUTANE += parseInt((MAX_THRESHOLD_B / 100) * ((v.MAX_SAFE_INVENTORY_BUTANE || 0) - (v.MIN_SAFE_INVENTORY_BUTANE || 0)));

    }

  });
  $.each(tData, function (date, sums) {
    var newRow = {
      "index": tData.length,
      "SCENARIO_DATE": date,
      "CUSTOMER_LIFTINGS_PROPANE_MB": sums.CUSTOMER_LIFTINGS_PROPANE_MB,
      "CUSTOMER_LIFTINGS_BUTANE_MB": sums.CUSTOMER_LIFTINGS_BUTANE_MB,
      "ADDITIONAL_LIFTINGS_BUTANE_MB": sums.ADDITIONAL_LIFTINGS_BUTANE_MB,
      "ADDITIONAL_LIFTINGS_PROPANE_MB": sums.ADDITIONAL_LIFTINGS_PROPANE_MB,
      "MIN_SAFE_INVENTORY_PROPANE": sums.MIN_SAFE_INVENTORY_PROPANE,
      "MIN_SAFE_INVENTORY_BUTANE": sums.MIN_SAFE_INVENTORY_BUTANE,
      "MAX_SAFE_INVENTORY_BUTANE": sums.MAX_SAFE_INVENTORY_BUTANE,
      "MAX_SAFE_INVENTORY_PROPANE": sums.MAX_SAFE_INVENTORY_PROPANE,
      "CLOSING_INVENTORY_BUTANE": sums.CLOSING_INVENTORY_BUTANE,
      "CLOSING_INVENTORY_PROPANE": sums.CLOSING_INVENTORY_PROPANE,
      "MIN_SAFE_THRESHOLD_PROPANE": sums.MIN_SAFE_THRESHOLD_PROPANE,
      "MIN_SAFE_THRESHOLD_BUTANE": sums.MIN_SAFE_THRESHOLD_BUTANE,
      "MAX_SAFE_THRESHOLD_PROPANE": sums.MAX_SAFE_THRESHOLD_PROPANE,
      "MAX_SAFE_THRESHOLD_BUTANE": sums.MAX_SAFE_THRESHOLD_BUTANE
    };
    returnData.push(newRow);
  });
  return returnData;
};

function prepareChartData(eData, wData) {
  eastChartData = [];
  westChartData = [];
  preProcessData(eastData, eastChartData);
  preProcessData(westData, westChartData);
  // Create the four chart options
  var eastPropaneChartOptions = createChartOptions(eastChartData, "propane");
  var eastButaneChartOptions = createChartOptions(eastChartData, "butane");
  var westPropaneChartOptions = createChartOptions(westChartData, "propane");
  var westButaneChartOptions = createChartOptions(westChartData, "butane");

  // Create the TabPanel and add the charts to the appropriate tabs
  var tabPanelOptions = {
    dataSource: [
      {
        title: "East",
        charts: [eastPropaneChartOptions, eastButaneChartOptions],
      },
      {
        title: "West",
        charts: [westPropaneChartOptions, westButaneChartOptions],
      },
    ],
    itemTitleTemplate: function (data) {
      return $("<div>")
        .append($("<i>").addClass("dx-icon dx-icon-rowfield"))
        .append($("<span>").text(data.title))
    },
    itemTemplate: function (data) {
      var $tabContent = $("<div class='row'>");
      for (var i = 0; i < data.charts.length; i++) {
        var $chartContainer = $("<div class='col'>");
        $tabContent.append($chartContainer);
        $chartContainer.css("height", "400px").css("width", "600px");
        $chartContainer.dxChart(data.charts[i]);
      }

      var radioGroupOptions = ['KMT', 'MB'];
      let dataEastGridDiv = $("<div id='eastGrid'>");

      dataEastGridDiv.dxRadioGroup({
        items: radioGroupOptions,
        value: radioGroupOptions[0],
        layout: 'horizontal'
      });
      return $tabContent;
    },
    // template: function (itemData, itemIndex, element) {
    //   var $tabContent = $("<div class='row'>");
    //   var radioGroupOptions = ['KMT', 'MB'];
    //   $('#tabChartContainer').hide();

    //   let dataEastGridDiv = $("<div id='eastGrid'>");
    //   dataEastGridDiv.appendTo(element);
    //   dataEastGridDiv.dxRadioGroup({
    //     items: radioGroupOptions,
    //     value: radioGroupOptions[0],
    //     layout: 'horizontal'
    //   });
    //   $tabContent.append(optionsRadio);
    // },
    animationEnabled: true,
    swipeEnabled: true,
    paddingTop: 30,
  };

  $("#tabChartContainer").dxTabPanel(tabPanelOptions);
};

// It Generates the CSRF Token to Create, Update and Delete
async function sasgetCSRFToken() {
  const csrfURL = CSRF_URL
  const csrfParameters = { method: "GET", credentials: "include" }
  const csrfRequest = await fetch(csrfURL, csrfParameters)
  const csrfToken = await csrfRequest.headers.get("X-CSRF-TOKEN")
  return csrfToken;
}

async function sendBatchRequest(url, data, actions = "") {
  const resultObject = {};
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
    reloadData(result);
    d.resolve(result);

    resultObject.promiseResult = Promise.resolve(result);

    DevExpress.ui.notify({
      message: "Successful", position: { my: "top", at: "top", of: "#gridContainer" },
      type: "success",
      displayTime: 2000
    });
  }).fail((xhr) => {
    d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    DevExpress.ui.notify({
      message: "Something Went Wrong", position: { my: "top", at: "top", of: "#gridContainer" },
      type: "error",
      displayTime: 2000
    });
  });
  resultObject.promise = d.promise();
  return resultObject;
}

// on Drag or swap of rows this function will be called & from here recalcuclate totals will be called
function reCalculateDraggedTotals(data, toIndex, fromIndex) {
  var fromItem = data[fromIndex];
  var toItem = data[toIndex];
  var startDate = new Date(fromItem.SCENARIO_DATE);
  var endDate = new Date(toItem.NOMINATION_DATE);

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

  temp_row_order = toItem.ROW_ORDER;
  toItem.ROW_ORDER = fromItem.ROW_ORDER;
  fromItem.ROW_ORDER = temp_row_order;

  temp_row_count = toItem.ROW_COUNT;
  toItem.ROW_COUNT = fromItem.ROW_COUNT;
  fromItem.ROW_COUNT = temp_row_count;

  temp_minsaf_propane = toItem.MIN_SAFE_INVENTORY_PROPANE;
  toItem.MIN_SAFE_INVENTORY_PROPANE = fromItem.MIN_SAFE_INVENTORY_PROPANE;
  fromItem.MIN_SAFE_INVENTORY_PROPANE = temp_minsaf_propane;
  toItem.CLOSING_INVENTORY_BUTANE = null;
  toItem.CLOSING_INVENTORY_PROPANE = null;
  toItem.CLOSING_PERCENTAGE_PROPANE = null;
  toItem.CLOSING_PERCENTAGE_BUTANE = null;
  fromItem.CLOSING_INVENTORY_BUTANE = null;
  fromItem.CLOSING_INVENTORY_PROPANE = null;
  fromItem.CLOSING_PERCENTAGE_PROPANE = null;
  fromItem.CLOSING_PERCENTAGE_BUTANE = null;
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
}
// TBC
function groupAndSum(arr, value) {
  return arr.reduce((sum, current) => {
    if (current[value]) {
      sum += parseFloat(current[value]) || 0;
    }
    return sum;
  }, 0);
}

//For calculcation of in scenario and OSPAS  grid like Closing inventory,
//opeing inventory, and the values of both East and west grid will be done
function calculateKMTFromMB(data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].REGION == "EAST") {
      data[i].CUSTOMER_LIFTING_PROPANE = data[i].CUSTOMER_LIFTINGS_PROPANE_MB / (PROPANE_KMT_UOM + (PROPANE_KMT_UOM * (eastTolPropane / 100)));
      data[i].CUSTOMER_LIFTING_BUTANE = data[i].CUSTOMER_LIFTINGS_BUTANE_MB / (BUTANE_KMT_UOM + (BUTANE_KMT_UOM * (eastTolButane / 100)));

    }
    if (data[i].REGION == "WEST") {
      data[i].CUSTOMER_LIFTING_PROPANE = data[i].CUSTOMER_LIFTINGS_PROPANE_MB / (PROPANE_KMT_UOM + (PROPANE_KMT_UOM * (westTolPropane / 100)));
      data[i].CUSTOMER_LIFTING_BUTANE = data[i].CUSTOMER_LIFTINGS_BUTANE_MB / (BUTANE_KMT_UOM + (BUTANE_KMT_UOM * (westTolButane / 100)));
    }
  }
};
function reCalculateTotals(data) {
  var oiEastPropane = 0;
  var oiEastButane = 0;
  var oiWestPropane = 0;
  var oiWestButane = 0;
  // first calculate liftings in MB and capture opening inventories
  for (var i = 0; i < data.length; i++) {
    data[i].ONTIME_ACTION = "";
    if (data[i].REGION == "EAST") {
      if (data[i].NOMINATION_TEMP_KEY != null) {
        data[i].CUSTOMER_LIFTINGS_PROPANE_MB = ((data[i].CUSTOMER_LIFTING_PROPANE * PROPANE_KMT_UOM) + ((data[i].CUSTOMER_LIFTING_PROPANE * PROPANE_KMT_UOM * (eastTolPropane / 100))));
        data[i].CUSTOMER_LIFTINGS_BUTANE_MB = ((data[i].CUSTOMER_LIFTING_BUTANE * BUTANE_KMT_UOM) + ((data[i].CUSTOMER_LIFTING_BUTANE * BUTANE_KMT_UOM * (eastTolButane / 100))));
      }
      else {
        data[i].CUSTOMER_LIFTINGS_PROPANE_MB = null;
        data[i].CUSTOMER_LIFTINGS_BUTANE_MB = null;
      }
      if (data[i].SCENARIO_DATE.slice(0, 2) == "01" && data[i].ROW_COUNT == 1) {
        oiEastPropane = data[i].OPENING_INVENTORY_PROPANE;
        oiEastButane = data[i].OPENING_INVENTORY_BUTANE;
      }
    }
    if (data[i].REGION == "WEST") {
      if (data[i].NOMINATION_TEMP_KEY != null) {
        data[i].CUSTOMER_LIFTINGS_PROPANE_MB = ((data[i].CUSTOMER_LIFTING_PROPANE * PROPANE_KMT_UOM) + ((data[i].CUSTOMER_LIFTING_PROPANE * PROPANE_KMT_UOM * (westTolPropane / 100))));
        data[i].CUSTOMER_LIFTINGS_BUTANE_MB = ((data[i].CUSTOMER_LIFTING_BUTANE * BUTANE_KMT_UOM) + ((data[i].CUSTOMER_LIFTING_BUTANE * BUTANE_KMT_UOM * (westTolButane / 100))));
      }
      else {
        data[i].CUSTOMER_LIFTINGS_PROPANE_MB = null;
        data[i].CUSTOMER_LIFTINGS_BUTANE_MB = null;
      }
      if (data[i].SCENARIO_DATE.slice(0, 2) == "01" && data[i].ROW_COUNT == 1) {
        oiWestPropane = data[i].OPENING_INVENTORY_PROPANE;
        oiWestButane = data[i].OPENING_INVENTORY_BUTANE;
      }
    }
  };


  // Now create a list of days assuming maximum is 31 days in the month minimum can be 28 but it can be handled with 31 day assumptions
  const listOfDays = [];

  for (let i = 1; i <= 31; i++) {
    const datFormatted = i.toString().padStart(2, '0');
    listOfDays.push(datFormatted)
  }

  // Calculate closing inventory and opening inventory
  for (let day of listOfDays) {
    let dailyCustomerLiftingsEast = data.filter(row => row.SCENARIO_DATE.slice(0, 2) === day && row.REGION === "EAST");
    let dailyCustomerLiftingsWest = data.filter(row => row.SCENARIO_DATE.slice(0, 2) === day && row.REGION === "WEST");

    let dailyCustomerLiftingsPropaneEast = groupAndSum(dailyCustomerLiftingsEast, 'CUSTOMER_LIFTINGS_PROPANE_MB');
    let dailyCustomerLiftingsPropaneWest = groupAndSum(dailyCustomerLiftingsWest, 'CUSTOMER_LIFTINGS_PROPANE_MB');
    let dailyCustomerLiftingsButaneEast = groupAndSum(dailyCustomerLiftingsEast, 'CUSTOMER_LIFTINGS_BUTANE_MB');
    let dailyCustomerLiftingsButaneWest = groupAndSum(dailyCustomerLiftingsWest, 'CUSTOMER_LIFTINGS_BUTANE_MB');

    $.each(data, function (i, v) {
      if (((v.SCENARIO_DATE).toString().slice(0, 2) == day) && (v.ROW_COUNT == 1)) {
        if (v.REGION == 'EAST') {
          if (day == "01") {
            data[i].CLOSING_INVENTORY_PROPANE = oiEastPropane + v.TERMINAL_AVAILS_PROPANE - dailyCustomerLiftingsPropaneEast;
            data[i].CLOSING_INVENTORY_BUTANE = oiEastButane + v.TERMINAL_AVAILS_BUTANE - dailyCustomerLiftingsButaneEast;
          }
          else {
            data[i].OPENING_INVENTORY_BUTANE = nextEastOiButane;
            data[i].OPENING_INVENTORY_PROPANE = nextEastOiPropane;
            data[i].CLOSING_INVENTORY_PROPANE = v.OPENING_INVENTORY_PROPANE + v.TERMINAL_AVAILS_PROPANE - dailyCustomerLiftingsPropaneEast;
            data[i].CLOSING_INVENTORY_BUTANE = v.OPENING_INVENTORY_BUTANE + v.TERMINAL_AVAILS_BUTANE - dailyCustomerLiftingsButaneEast;
          }
          nextEastOiButane = data[i].CLOSING_INVENTORY_BUTANE;
          nextEastOiPropane = data[i].CLOSING_INVENTORY_PROPANE;

        }
        if (v.REGION == 'WEST') {
          if (day == "01") {
            data[i].CLOSING_INVENTORY_PROPANE = oiWestPropane + v.TERMINAL_AVAILS_PROPANE - dailyCustomerLiftingsPropaneWest;
            data[i].CLOSING_INVENTORY_BUTANE = oiWestButane + v.TERMINAL_AVAILS_BUTANE - dailyCustomerLiftingsButaneWest;
          }
          else {
            data[i].OPENING_INVENTORY_BUTANE = nextWestOiButane;
            data[i].OPENING_INVENTORY_PROPANE = nextWestOiPropane;
            data[i].CLOSING_INVENTORY_PROPANE = v.OPENING_INVENTORY_PROPANE + v.TERMINAL_AVAILS_PROPANE - dailyCustomerLiftingsPropaneWest;
            data[i].CLOSING_INVENTORY_BUTANE = v.OPENING_INVENTORY_BUTANE + v.TERMINAL_AVAILS_BUTANE - dailyCustomerLiftingsButaneWest;
          }
          nextWestOiButane = data[i].CLOSING_INVENTORY_BUTANE;
          nextWestOiPropane = data[i].CLOSING_INVENTORY_PROPANE;
        }
        data[i].CLOSING_PERCENTAGE_PROPANE = ((data[i].CLOSING_INVENTORY_PROPANE / (data[0].MAX_SAFE_INVENTORY_PROPANE - data[0].MIN_SAFE_INVENTORY_PROPANE)) * 100).toFixed(0);
        data[i].CLOSING_PERCENTAGE_BUTANE = ((data[i].CLOSING_INVENTORY_BUTANE / (data[0].MAX_SAFE_INVENTORY_BUTANE - data[0].MIN_SAFE_INVENTORY_BUTANE)) * 100).toFixed(0);

      };
      if (v.NOMINATION_TEMP_KEY == null) {
        data[i].CUSTOMER_LIFTING_PROPANE = null;
        data[i].CUSTOMER_LIFTING_BUTANE = null;
      };

      if ((v.CUSTOMER_NAME).slice(0, 7) == "PROPANE") {
        data[i].CUSTOMER_NAME1 = dummyNominations[(data[i].CUSTOMER_NAME).slice(0, 18)];

      }
      else {
        data[i].CUSTOMER_NAME1 = data[i].CUSTOMER_NAME;

      };
      data[i].SCENARIO_DATE11 = (data[i].SCENARIO_DATE).slice(0, 5);
    });
  }

  var k = 0;
  for (var i = 0; i < data.length; i++) {
    if (data.REGION == "WEST") {
      if (data[i - 1].REGION == "EAST") {
        k = i;
      }
    }
  };

}

//added by kamlessx
// Removing or emptying the rows which are not required
function removeNonAvailableRows(data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].REGION == "EAST" && (data[i].CUSTOMER_ID == null || data[i].CUSTOMER_ID == "") && data[i].ROW_COUNT > NUM_BERTHS_EAST) {
      data.splice(i, 1);
    }
    if (data[i].REGION == "WEST" && (data[i].CUSTOMER_ID == null || data[i].CUSTOMER_ID == "") && data[i].ROW_COUNT > NUM_BERTHS_WEST) {
      data.splice(i, 1);
    }
  };
};

// Function to calculation total nominations for export planning
function getTotalNominations(data, scenarioGrid) {
  eastTotNoms = 0;
  westTotNoms = 0;
  totNoms = 0;
  if (data != "") {
    $.each(data, function (index, value) {
      if (value.REGION === "EAST" && value.CUSTOMER_ID.indexOf("PROPANE") == -1 && value.CUSTOMER_NAME.indexOf("Dummy") == -1) {
        if (value.NOMINATION_TEMP_KEY !== null && value.NOMINATION_TEMP_KEY !== "") {
          eastTotNoms++;
        }

      } else if (value.REGION === "WEST" && value.CUSTOMER_ID.indexOf("PROPANE") == -1 && value.CUSTOMER_NAME.indexOf("Dummy") == -1) {
        if (value.NOMINATION_TEMP_KEY !== null && value.NOMINATION_TEMP_KEY !== "") {
          westTotNoms++;
        }
      }
    })
  }
  var selectedActiveTab = scenarioGrid;
  if (selectedActiveTab == 0) {
    $("#totalNominations").html(Math.round(eastTotNoms));
  } else {
    $("#totalNominations").html(Math.round(westTotNoms));
  };

};


// Function to calculate nomination total quantities
function calculateNominationQuantiies(data, scenarioGrid, unit) {
  propaneWestNomQty = 0;
  butaneWestNomQty = 0;
  propaneEastNomQty = 0;
  butaneEastNomQty = 0;
  if (data != "") {
    $.each(data, function (i, v) {
      var t_propaneWestNomQty = 0;
      var t_butaneWestNomQty = 0;
      var t_propaneEastNomQty = 0;
      var t_butaneEastNomQty = 0;
      if (v.REGION === "EAST") {
        if (v.NOMINATION_TEMP_KEY !== null && v.NOMINATION_TEMP_KEY !== "") {
          t_propaneEastNomQty = v.CUSTOMER_LIFTING_PROPANE;
          t_butaneEastNomQty = v.CUSTOMER_LIFTING_BUTANE;
          propaneEastNomQty += t_propaneEastNomQty;
          butaneEastNomQty += t_butaneEastNomQty;
        }

      } else if (v.REGION === "WEST") {
        if (v.NOMINATION_TEMP_KEY !== null && v.NOMINATION_TEMP_KEY !== "") {
          t_propaneWestNomQty = v.CUSTOMER_LIFTING_PROPANE;
          t_butaneWestNomQty = v.CUSTOMER_LIFTING_BUTANE;
          propaneWestNomQty += t_propaneWestNomQty;
          butaneWestNomQty += t_butaneWestNomQty;
        }
      }
    })
  }
  if (unit == 'KMT') {
    var selectedActiveTab = scenarioGrid;
    if (selectedActiveTab == 0) {
      $("#totalPropaneQty").html(Math.round(propaneEastNomQty));
      $("#totalButaneQty").html(Math.round(butaneEastNomQty));
    } else {
      $("#totalPropaneQty").html(Math.round(propaneWestNomQty));
      $("#totalButaneQty").html(Math.round(butaneWestNomQty));
    };
  }
  if (unit == 'MB') {
    var selectedActiveTab = scenarioGrid;
    if (selectedActiveTab == 0) {
      $("#totalPropaneQty").html(Math.round(propaneEastNomQty * PROPANE_KMT_UOM));
      $("#totalButaneQty").html(Math.round(butaneEastNomQty * BUTANE_KMT_UOM));
    } else {
      $("#totalPropaneQty").html(Math.round(propaneWestNomQty * PROPANE_KMT_UOM));
      $("#totalButaneQty").html(Math.round(butaneWestNomQty * BUTANE_KMT_UOM));
    };
  }
};

// Function to calculation average delays and advances for export nominations
function getDefaultAverages(data, scenarioGrid) {
  var selectedActiveTab = scenarioGrid;
  var eastDelays = [];
  var eastAdvances = [];
  var westDelays = [];
  var westAdvances = [];
  num_delays = 0;
  sum_delays = 0;
  avg_delays = 0;
  num_advances = 0;
  sum_advances = 0;
  avg_advances = 0;
  $.each(data, function (index, value) {
    var newdt = new Date(value.SCENARIO_DATE);
    var olddt = new Date(value.NOMINATION_DATE);
    var nomTempKey = value.NOMINATION_TEMP_KEY;
    if ((nomTempKey !== null) && ((value.CUSTOMER_NAME).slice(0, 7) != "PROPANE") && ((value.CUSTOMER_NAME).slice(0, 5) != "Dummy")) {
      var daydif = newdt.getDate() - olddt.getDate();
      if (daydif > 0) {
        if (value.REGION === 'EAST') {
          eastDelays.push(daydif);
        }
        else {
          westDelays.push(daydif);
        }
      }
      if (daydif < 0) {
        if (value.REGION === 'EAST') {
          eastAdvances.push(daydif);
        }
        else {
          westAdvances.push(daydif);
        }
      }
    }
  });
  if (selectedActiveTab == 0) {
    if (eastDelays !== "") {
      num_delays = eastDelays.length;
      sum_delays = eastDelays.reduce((acc, curr) => acc + curr, 0);
      avg_delays = Math.round(num_delays === 0 ? 0 : sum_delays / num_delays);
      $("#avgDelay").html(avg_delays);
    } else {
      avg_delays = 0;
      $("#avgDelay").html(avg_delays);
    }
    if (eastAdvances !== "") {
      num_advances = eastAdvances.length;
      sum_advances = eastAdvances.reduce((acc, curr) => acc + curr, 0);
      avg_advances = Math.abs(Math.round(num_advances === 0 ? 0 : sum_advances / num_advances));
      $("#avgAdv").html(avg_advances);
    } else {
      avg_advances = 0;
      $("#avgAdv").html(avg_advances);
    }
  }
  else {
    if (westDelays !== "") {
      num_delays = westDelays.length;
      sum_delays = westDelays.reduce((acc, curr) => acc + curr, 0);
      avg_delays = Math.round(num_delays === 0 ? 0 : sum_delays / num_delays);
      $("#avgDelay").html(avg_delays);
    } else {
      avg_delays = 0;
      $("#avgDelay").html(avg_delays);
    }
    if (westAdvances !== "") {
      num_advances = westAdvances.length;
      sum_advances = westAdvances.reduce((acc, curr) => acc + curr, 0);
      avg_advances = Math.abs(Math.round(num_advances === 0 ? 0 : sum_advances / num_advances));
      $("#avgAdv").html(avg_advances);
    } else {
      avg_advances = 0;
      $("#avgAdv").html(avg_advances);
    }
  }

};

//Function to calculate the number of diversions for export nominations
function getDiversionCounts(data) {
  eastToWestDiv = 0;
  westToWestDiv = 0;
  totDiv = 0;
  $.each(data, function (index, value) {
    var srcRegion = value.NOMINATION_REGION;
    var destRegion = value.REGION;
    var nomTempKey = value.NOMINATION_TEMP_KEY;
    if ((srcRegion === "EAST" && destRegion === "WEST") && (nomTempKey != null)) {
      eastToWestDiv++;
    }
    if ((srcRegion === "WEST" && destRegion === "EAST") && (nomTempKey != null)) {
      westToWestDiv++;
    }
    totDiv = eastToWestDiv + westToWestDiv;
    $("#totalDiversion").html(totDiv);
  })
};
// this function calculates available quantities for the month
function totalAvailableQty(data, scenarioGrid, unit) {
  totC3EastAvailableQty = 0;
  totC4EastAvailableQty = 0;
  totC3WestAvailableQty = 0;
  totC4WestAvailableQty = 0;
  $.each(data, function (i, v) {
    if (v.REGION == "EAST") {
      if (v.SCENARIO_DATE.slice(0, 2) == "01" && v.ROW_COUNT == 1) {
        totC3EastAvailableQty += v.OPENING_INVENTORY_PROPANE + v.TERMINAL_AVAILS_PROPANE;
        totC4EastAvailableQty += v.OPENING_INVENTORY_BUTANE + v.TERMINAL_AVAILS_BUTANE;
      }
      else {
        totC3EastAvailableQty += v.TERMINAL_AVAILS_PROPANE;
        totC4EastAvailableQty += v.TERMINAL_AVAILS_BUTANE;
      }

    }

    if (v.REGION == "WEST") {
      if (v.SCENARIO_DATE.slice(0, 2) == "01" && v.ROW_COUNT == 1) {
        totC3WestAvailableQty += v.OPENING_INVENTORY_PROPANE + v.TERMINAL_AVAILS_PROPANE;
        totC4WestAvailableQty += v.OPENING_INVENTORY_BUTANE + v.TERMINAL_AVAILS_BUTANE;
      }
      else {
        totC3WestAvailableQty += v.TERMINAL_AVAILS_PROPANE;
        totC4WestAvailableQty += v.TERMINAL_AVAILS_BUTANE;
      }
    }

  });
  if (unit == 'MB') {
    var selectedActiveTab = scenarioGrid;
    if (selectedActiveTab == 0) {
      $("#totalAvailPropaneQty").html(Math.round(totC3EastAvailableQty));
      $("#totalAvailButaneQty").html(Math.round(totC4EastAvailableQty));
    } else {
      $("#totalAvailPropaneQty").html(Math.round(totC3WestAvailableQty));
      $("#totalAvailButaneQty").html(Math.round(totC4WestAvailableQty));
    };
  }
  if (unit == 'KMT') {
    var selectedActiveTab = scenarioGrid;
    if (selectedActiveTab == 0) {
      $("#totalAvailPropaneQty").html(Math.round(totC3EastAvailableQty / PROPANE_KMT_UOM));
      $("#totalAvailButaneQty").html(Math.round(totC4EastAvailableQty / BUTANE_KMT_UOM));
    } else {
      $("#totalAvailPropaneQty").html(Math.round(totC3WestAvailableQty / PROPANE_KMT_UOM));
      $("#totalAvailButaneQty").html(Math.round(totC4WestAvailableQty / BUTANE_KMT_UOM));
    };
  }

};

//Function to calculate the number of nominations that are cancelled or deferred
function getCanDefCounts(scenarioData, scenarioGrid) {
  eastCanDef = 0;
  westCanDef = 0;
  totCanDef = 0;
  $.each(scenarioData.MONTHLY_NOMINATIONS, function (index, value) {
    var srcRegion = value.REGION;
    var deleteFlg = value.DELETE_FLAG;
    var terminalNm = value.TERMINAL_NM;
    if (srcRegion === "EAST" && deleteFlg == "Y" && terminalNm != "") {
      eastCanDef++;
    }
    if (srcRegion === "WEST" && deleteFlg == "Y" && terminalNm != "") {
      westCanDef++;
    }
    totCanDef = eastCanDef + westCanDef;
  })
  var selectedActiveTab = scenarioGrid;
  if (selectedActiveTab == 0) {
    $("#totalCancel").html(eastCanDef);
  } else {
    $("#totalCancel").html(westCanDef);
  };
};

// function to calculate additional nominations suggested by algorithm
function additionalNominations(data, scenarioGrid) {
  var selectedActiveTab = scenarioGrid;
  eastAddNom = 0;
  westAddNom = 0;
  totAddNom = 0;
  $.each(data, function (index, value) {
    if (value.REGION === "EAST" && (value.CUSTOMER_ID.indexOf("PROPANE") >= 0 || value.CUSTOMER_NAME.indexOf("Dummy") >= 0) && value.NOMINATION_TEMP_KEY !== null && value.NOMINATION_TEMP_KEY !== "") {
      eastAddNom++;
    }
    if (value.REGION === "WEST" && (value.CUSTOMER_ID.indexOf("PROPANE") >= 0 || value.CUSTOMER_NAME.indexOf("Dummy") >= 0) && value.NOMINATION_TEMP_KEY !== null && value.NOMINATION_TEMP_KEY !== "") {
      westAddNom++;
    }
    totAddNom = eastAddNom + westAddNom;
    if (selectedActiveTab == 0) {
      $("#addNom").html(eastAddNom);
    } else {
      $("#addNom").html(westAddNom);
    };
  })
}

function getVersionStatus(data) {
  var status = data.TOLERANCE[0].SCENARIO_PLANNING_STATUS_DESC;
  var version = data.DATA[0].SCENARIO_PLANNING_VERSION;
  var lastSaved = data.DATA[0].UPDATED_DTTM;
  var planName = data.SUMMARY[0].PLAN_NAME;
  var planDesc = data.SUMMARY[0].PLAN_DESC;
  $("#planName").html(planName);
  $("#planDesc").html(planDesc);
  $("#ospasSubmitStatus").html(status);
  $("#version").html(version);
  $("#lastSaved").html(lastSaved);
}


// Function to extract the unavailable dates for moving any nomination

function findAvailableSlot(staticData, data) {
  var westSlotAvailDate = [];
  var eastSlotAvailDate = [];
  // Get slot unavailability from west
  for (let i = 0; i < staticData.SLOT_AVAILABILITY.length; i++) {
    if (staticData.SLOT_AVAILABILITY[i].AVAILABLE_FLG === "N") {
      const currentObject = staticData.SLOT_AVAILABILITY[i].DAY;
      westSlotAvailDate.push(currentObject);
    }

  }
  // Get slot which are already blocked by the nominations in west
  $.each(data, function (index, value) {
    if (value.REGION === "WEST" && value.NOMINATION_TEMP_KEY !== null) {
      if ($.inArray(value.SCENARIO_DATE, westSlotAvailDate) === -1) {
        westSlotAvailDate.push(value.SCENARIO_DATE);
      }
    }
  });


  // Get Slots unavailable for east
  // Object to store counts by date
  var countsByDate = {};

  // Iterate over the data array
  $.each(data, function (index, item) {
    if (item.REGION === "EAST") {
      var date = item.SCENARIO_DATE;
      var character = item.NOMINATION_TEMP_KEY;
      if (character != null) {
        // Check if the date already exists in the counts object
        if (countsByDate[date]) {
          // Increment the count for the character if it exists
          countsByDate[date] += 1;
        }
        else {
          countsByDate[date] = 1;
        }
      }
    }

  });
  $.each(countsByDate, function (index, item) {
    if (item == 2) {
      if ($.inArray(index, eastSlotAvailDate) === -1) {
        eastSlotAvailDate.push(index);
      }
    }
  });

  return { "westSlotAvailDate": westSlotAvailDate, "eastSlotAvailDate": eastSlotAvailDate };

};

function inventoryViolation(data, optConfig, scenarioGrid) {
  dayWestViolation = 0;
  dayEastViolation = 0;
  dayViolation = 0;
  $.each(optConfig, function (i, v) {
    if (v.MACRO_OPTION == "NUM_BERTHS_EAST") {
      NUM_BERTHS_EAST = parseInt(v.MACRO_VALUE);
    };
    if (v.MACRO_OPTION == "NUM_BERTHS_WEST") {
      NUM_BERTHS_WEST = parseInt(v.MACRO_VALUE);
    };
    if (v.MACRO_OPTION == "MAX_THRESHOLD_P") {
      MAX_THRESHOLD_P = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "MIN_THRESHOLD_P") {
      MIN_THRESHOLD_P = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "MAX_THRESHOLD_B") {
      MAX_THRESHOLD_B = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "MIN_THRESHOLD_B") {
      MIN_THRESHOLD_B = parseFloat(v.MACRO_VALUE) * 100;
    };

    if (v.MACRO_OPTION == "MNTH_END_MIN_P") {
      MNTH_END_MIN_P = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "MNTH_END_MIN_B") {
      MNTH_END_MIN_B = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "LOWEST_POSSIBLE_INV_RATIO_P") {
      LOWEST_POSSIBLE_INV_RATIO_P = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "LOWEST_POSSIBLE_INV_RATIO_B") {
      LOWEST_POSSIBLE_INV_RATIO_B = parseFloat(v.MACRO_VALUE) * 100;
    };
    // OSPAS Thresholds
    if (v.MACRO_OPTION == "LOWEST_OSPAS_INV_RATIO_B") {
      LOWEST_OSPAS_INV_RATIO_B = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "LOWEST_OSPAS_INV_RATIO_P") {
      LOWEST_OSPAS_INV_RATIO_P = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "MAX_OSPAS_THRESHOLD_B") {
      MAX_OSPAS_THRESHOLD_B = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "MAX_OSPAS_THRESHOLD_P") {
      MAX_OSPAS_THRESHOLD_P = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "MAXIMUM_OSPAS_INV_RATIO_B") {
      MAXIMUM_OSPAS_INV_RATIO_B = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "MAXIMUM_OSPAS_INV_RATIO_P") {
      MAXIMUM_OSPAS_INV_RATIO_P = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "MIN_OSPAS_THRESHOLD_B") {
      MIN_OSPAS_THRESHOLD_B = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "MIN_OSPAS_THRESHOLD_P") {
      MIN_OSPAS_THRESHOLD_P = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "MNTH_OSPAS_END_MAX_B") {
      MNTH_OSPAS_END_MAX_B = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "MNTH_OSPAS_END_MAX_P") {
      MNTH_OSPAS_END_MAX_P = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "MNTH_OSPAS_END_MIN_B") {
      MNTH_OSPAS_END_MIN_B = parseFloat(v.MACRO_VALUE) * 100;
    };
    if (v.MACRO_OPTION == "MNTH_OSPAS_END_MIN_P") {
      MNTH_OSPAS_END_MIN_P = parseFloat(v.MACRO_VALUE) * 100;
    };
  });
  $.each(data, function (i, v) {
    if (v.CLOSING_PERCENTAGE_BUTANE != null) {
      if ((v.CLOSING_PERCENTAGE_BUTANE > MAX_OSPAS_THRESHOLD_B) || (v.CLOSING_PERCENTAGE_BUTANE < MIN_OSPAS_THRESHOLD_B)
        || (v.CLOSING_PERCENTAGE_PROPANE > MAX_OSPAS_THRESHOLD_P) || (v.CLOSING_PERCENTAGE_PROPANE < MIN_OSPAS_THRESHOLD_P)) {
        if (v.REGION == "EAST") {
          dayEastViolation++;
        }
        else {
          dayWestViolation++;
        };
      };
    };
  });
  dayViolation = dayEastViolation + dayWestViolation;
  var selectedActiveTab = scenarioGrid;
  if (selectedActiveTab == 0) {
    $("#violateDays").html(dayEastViolation);
  } else {
    $("#violateDays").html(dayWestViolation);
  };

};

// Function to move nominations from one region to other region
function moveNominationOnGrid(data, plDate) {
  if (data.LOCK_NOMINATION != "Y") {
    var tformatDates = DevExpress.localization.formatDate(plDate, "ddMMMyyyy").toUpperCase();
    // Moving from East to West
    if (data.REGION == 'EAST') {
      var rowbreaker = 0;
      $.each(eastData, function (i, v) {
        if ((rowbreaker === 0) && (v.SCENARIO_DATE == tformatDates) && (v.NOMINATION_TEMP_KEY == null)) {
          v.REGION = "EAST";
          v.CUSTOMER_ID = data.CUSTOMER_ID;
          v.CUSTOMER_LIFTING_BUTANE = data.CUSTOMER_LIFTING_BUTANE;
          v.CUSTOMER_LIFTING_PROPANE = data.CUSTOMER_LIFTING_PROPANE;
          v.CUSTOMER_NAME = data.CUSTOMER_NAME;
          v.LOCK_NOMINATION = 'N';
          v.NOMINATION_CUSTOMER_LIFTING_BUTA = data.NOMINATION_CUSTOMER_LIFTING_BUTA;
          v.NOMINATION_CUSTOMER_LIFTING_PROP = data.NOMINATION_CUSTOMER_LIFTING_PROP;
          v.NOMINATION_DATE = data.NOMINATION_DATE;
          v.NOMINATION_REGION = data.NOMINATION_REGION;
          v.NOMINATION_TEMP_KEY = parseInt(data.NOMINATION_TEMP_KEY);
          v.NOMINATION_TERMINAL_ID = data.NOMINATION_TERMINAL_ID;
          v.SCENARIO_DATE = tformatDates.toUpperCase();
          v.TERMINAL_ID = "A004";
          rowbreaker = 1;
        }

      });
      $.each(eastData, function (i, v) {
        if (rowbreaker == 1 && v.ROW_ORDER == data.ROW_ORDER && v.ROW_COUNT == data.ROW_COUNT) {
          v.CUSTOMER_ID = "";
          v.CUSTOMER_LIFTING_BUTANE = null;
          v.CUSTOMER_LIFTING_PROPANE = null;
          v.CUSTOMER_NAME = "";
          v.LOCK_NOMINATION = "N";
          v.NOMINATION_CUSTOMER_LIFTING_BUTA = null;
          v.NOMINATION_CUSTOMER_LIFTING_PROP = null;
          v.NOMINATION_TEMP_KEY = null;
          v.ONTIME_ACTION = "";
        }
      });
    }

    // Moving from West to East
    if (data.REGION == 'WEST') {
      var rowbreaker = 0;
      $.each(westData, function (i, v) {
        if ((rowbreaker === 0) && (v.SCENARIO_DATE == tformatDates) && (v.NOMINATION_TEMP_KEY == null)) {
          v.REGION = "WEST";
          v.CUSTOMER_ID = data.CUSTOMER_ID;
          v.CUSTOMER_LIFTING_BUTANE = data.CUSTOMER_LIFTING_BUTANE;
          v.CUSTOMER_LIFTING_PROPANE = data.CUSTOMER_LIFTING_PROPANE;
          v.CUSTOMER_NAME = data.CUSTOMER_NAME;
          v.LOCK_NOMINATION = 'N';
          v.NOMINATION_CUSTOMER_LIFTING_BUTA = data.NOMINATION_CUSTOMER_LIFTING_BUTA;
          v.NOMINATION_CUSTOMER_LIFTING_PROP = data.NOMINATION_CUSTOMER_LIFTING_PROP;
          v.NOMINATION_DATE = data.NOMINATION_DATE;
          v.NOMINATION_REGION = data.NOMINATION_REGION;
          v.NOMINATION_TEMP_KEY = parseInt(data.NOMINATION_TEMP_KEY);
          v.NOMINATION_TERMINAL_ID = data.NOMINATION_TERMINAL_ID;
          v.SCENARIO_DATE = tformatDates.toUpperCase();
          v.TERMINAL_ID = "T005";
          rowbreaker = 1;
        }


      });
      $.each(westData, function (i, v) {
        if (rowbreaker == 1 && v.ROW_ORDER == data.ROW_ORDER && v.ROW_COUNT == data.ROW_COUNT) {
          v.CUSTOMER_ID = "";
          v.CUSTOMER_LIFTING_BUTANE = null;
          v.CUSTOMER_LIFTING_PROPANE = null;
          v.CUSTOMER_NAME = "";
          v.LOCK_NOMINATION = "N";
          v.NOMINATION_CUSTOMER_LIFTING_BUTA = null;
          v.NOMINATION_CUSTOMER_LIFTING_PROP = null;
          v.NOMINATION_TEMP_KEY = null;
          v.ONTIME_ACTION = "";
        }
      });
    };
  };
  refreshRecalculateGrid();
};

// Function to refresh calculation and grid data
function refreshRecalculateGrid() {
  initializeCancelledNominationList(scenarioData);
  reCalculateTotals(westData);
  reCalculateTotals(eastData);
  $("#eastGrid").dxDataGrid("instance").refresh();
  $("#westGrid").dxDataGrid("instance").refresh();
};

// Function to append cancelled nomintaion to a temporary array
var t_cancelled_nominations_ar = [];
var t_cancelled_nominations_vr = [];
function initializeCancelledNominationList(scenarioData) {
  t_cancelled_nominations_ar = [];
  $.each(scenarioData.MONTHLY_NOMINATIONS, function (i, v) {
    if (v.DELETE_FLAG == "Y") {
      t_cancelled_nominations_ar.push(v);
    };
  });
  t_cancelled_nominations_vr.CUSTOMER_NM = $.map(t_cancelled_nominations_ar, function (v) {
    return v.CUSTOMER_NM;
  });
  t_cancelled_nominations_vr.NOMINATION_TEMP_KEY = $.map(t_cancelled_nominations_ar, function (v) {
    return v.NOMINATION_TEMP_KEY;
  });
  t_cancelled_nominations_vr.APPND_NAME_KEY = $.map(t_cancelled_nominations_ar, function (v) {
    return v.CUSTOMER_NM + " ( " + v.NOMINATION_TEMP_KEY + " )";
  });
  t_cancelled_nominations_vr.CUSTOMER_NM = [... new Set(t_cancelled_nominations_vr.CUSTOMER_NM)];
  t_cancelled_nominations_vr.NOMINATION_TEMP_KEY = [... new Set(t_cancelled_nominations_vr.NOMINATION_TEMP_KEY)];
  t_cancelled_nominations_vr.APPND_NAME_KEY = [... new Set(t_cancelled_nominations_vr.APPND_NAME_KEY)];

  // add one dummy nomination

  dummyList = { "CUSTOMER_NM": "Dummy", "NOMINATION_TEMP_KEY": 999999, "APPND_NAME_KEY": "Dummy", "CUSTOMER_ID": "PROPANE_BUTANE" };
  t_cancelled_nominations_vr.CUSTOMER_NM.push(dummyList.CUSTOMER_NM);
  t_cancelled_nominations_vr.NOMINATION_TEMP_KEY.push(dummyList.NOMINATION_TEMP_KEY);
  t_cancelled_nominations_vr.APPND_NAME_KEY.push(dummyList.APPND_NAME_KEY);
  // push dummy record to scenario data
  scenarioData.MONTHLY_NOMINATIONS.push(dummyList);
};

// function to Cancel nominations
function cancelNomination(data, scenarioData) {
  // Don't change anything to nomination if it is locked
  if (data.LOCK_NOMINATION != "Y") {
    // Update flag in monthly nomination grid
    $.each(scenarioData.MONTHLY_NOMINATIONS, function (i, v) {
      if ((data.NOMINATION_TEMP_KEY == v.NOMINATION_TEMP_KEY) && (data.CUSTOMER_ID == v.CUSTOMER_ID)) {
        v.DELETE_FLAG = "Y";
      };
    });
    initializeCancelledNominationList(scenarioData);
    // update datagrid
    if (data.REGION == "EAST") {
      $.each(eastData, function (i, v) {
        if ((v.ROW_COUNT == data.ROW_COUNT) && (data.ROW_ORDER == v.ROW_ORDER)) {
          v.CUSTOMER_ID = "";
          v.CUSTOMER_LIFTING_BUTANE = null;
          v.CUSTOMER_LIFTING_PROPANE = null;
          v.CUSTOMER_NAME = "";
          v.LOCK_NOMINATION = "N";
          v.NOMINATION_CUSTOMER_LIFTING_BUTA = null;
          v.NOMINATION_CUSTOMER_LIFTING_PROP = null;
          v.NOMINATION_TEMP_KEY = null;
          v.ONTIME_ACTION = "";
        };
      });
    };
    if (data.REGION == "WEST") {
      $.each(westData, function (i, v) {
        if ((v.ROW_COUNT == data.ROW_COUNT) && (data.ROW_ORDER == v.ROW_ORDER)) {
          v.CUSTOMER_ID = "";
          v.CUSTOMER_LIFTING_BUTANE = null;
          v.CUSTOMER_LIFTING_PROPANE = null;
          v.CUSTOMER_NAME = "";
          v.LOCK_NOMINATION = "N";
          v.NOMINATION_CUSTOMER_LIFTING_BUTA = null;
          v.NOMINATION_CUSTOMER_LIFTING_PROP = null;
          v.NOMINATION_TEMP_KEY = null;
          v.ONTIME_ACTION = "";
        }
      });
    };
  };

  refreshRecalculateGrid();
};


// Function to bring back cancelled Nomination
function bringBackNomination(selectedrow, selectedcust, scenarioData, scenarioGrid) {
  var selectedTab = scenarioGrid;
  var t_CUSTOMER_ID = "";
  var t_CUSTOMER_NM = "";
  var t_CUSTOMER_LIFTING_BUTANE = "";
  var t_CUSTOMER_LIFTING_PROPANE = "";
  var t_NOMINATION_TEMP_KEY = "";
  var t_NOM_DT = "";
  var t_TERMINAL_NM = "";
  var t_TERMINAL_ID = "";
  var t_REGION = "";
  var randomNum = 99999;
  function genNomKey() {
    randomNum = Math.floor(Math.random() * 100000);
    while (randomNum < 900000) {
      randomNum += 100000;
    }
    return randomNum
  };
  genNomKey();
  $.each(scenarioData.MONTHLY_NOMINATIONS, function (i, v) {
    t_c = v.CUSTOMER_NM + " ( " + v.NOMINATION_TEMP_KEY + " )";
    if (t_c == selectedcust && selectedcust != "Dummy") {
      t_CUSTOMER_ID = v.CUSTOMER_ID;
      t_CUSTOMER_NM = v.CUSTOMER_NM;
      t_CUSTOMER_LIFTING_BUTANE = v.BUTANE_KMT;
      t_CUSTOMER_LIFTING_PROPANE = v.PROPANE_KMT;
      t_NOMINATION_TEMP_KEY = v.NOMINATION_TEMP_KEY;
      t_NOM_DT = v.NOMINATION_DAY;
      t_TERMINAL_NM = v.TERMINAL_NM;
      t_TERMINAL_ID = v.TERMINAL_ID;
      t_REGION = v.REGION;
      v.DELETE_FLAG = "N";
    }
    else if (selectedcust == "Dummy" && v.CUSTOMER_NM == "Dummy") {
      t_CUSTOMER_ID = "1234";
      t_CUSTOMER_NM = "Dummy";
      t_CUSTOMER_LIFTING_BUTANE = 0;
      t_CUSTOMER_LIFTING_PROPANE = 0;
      t_NOMINATION_TEMP_KEY = randomNum;
      t_NOM_DT = selectedrow.SCENARIO_DATE;
      t_TERMINAL_NM = selectedrow.TERMINAL_NM;
      t_TERMINAL_ID = selectedrow.TERMINAL_ID;
      t_REGION = selectedrow.REGION;
      v.DELETE_FLAG = "N";
    };
  });
  if (selectedTab == 0) {
    $.each(eastData, function (i, v) {
      if (v.ROW_ORDER == selectedrow.ROW_ORDER) {
        v.REGION = "EAST";
        v.CUSTOMER_ID = t_CUSTOMER_ID;
        v.CUSTOMER_LIFTING_BUTANE = t_CUSTOMER_LIFTING_BUTANE;
        v.CUSTOMER_LIFTING_PROPANE = t_CUSTOMER_LIFTING_PROPANE;
        v.CUSTOMER_NAME = t_CUSTOMER_NM;
        v.LOCK_NOMINATION = 'N';
        v.NOMINATION_CUSTOMER_LIFTING_BUTA = t_CUSTOMER_LIFTING_BUTANE;
        v.NOMINATION_CUSTOMER_LIFTING_PROP = t_CUSTOMER_LIFTING_BUTANE;
        v.NOMINATION_DATE = t_NOM_DT;
        v.NOMINATION_REGION = t_REGION;
        v.NOMINATION_TEMP_KEY = t_NOMINATION_TEMP_KEY;
        v.NOMINATION_TERMINAL_ID = t_TERMINAL_ID;
        v.SCENARIO_DATE = selectedrow.SCENARIO_DATE;
        v.TERMINAL_ID = "A004";
      };
    });
  };
  if (selectedTab == 1) {
    $.each(westData, function (i, v) {
      if (v.ROW_ORDER == selectedrow.ROW_ORDER) {
        v.REGION = "WEST";
        v.CUSTOMER_ID = t_CUSTOMER_ID;
        v.CUSTOMER_LIFTING_BUTANE = t_CUSTOMER_LIFTING_BUTANE;
        v.CUSTOMER_LIFTING_PROPANE = t_CUSTOMER_LIFTING_PROPANE;
        v.CUSTOMER_NAME = t_CUSTOMER_NM;
        v.LOCK_NOMINATION = 'N';
        v.NOMINATION_CUSTOMER_LIFTING_BUTA = t_CUSTOMER_LIFTING_BUTANE;
        v.NOMINATION_CUSTOMER_LIFTING_PROP = t_CUSTOMER_LIFTING_BUTANE;
        v.NOMINATION_DATE = t_NOM_DT;
        v.NOMINATION_REGION = t_REGION;
        v.NOMINATION_TEMP_KEY = t_NOMINATION_TEMP_KEY;
        v.NOMINATION_TERMINAL_ID = t_TERMINAL_ID;
        v.SCENARIO_DATE = selectedrow.SCENARIO_DATE;
        v.TERMINAL_ID = "T005";
      };
    });
  };
  refreshRecalculateGrid();
};

//excel Download function for cosmd and ospas

function downloadExcel(scenarioGrid) {
  var selectedTab = $("#tabpanel-container").dxTabPanel("instance").option("selectedIndex");
  const workbook = new ExcelJS.Workbook();
  function convertDataToExcel(data, workSheetName, definedColumns) {
    var worksheet = workbook.addWorksheet(workSheetName);

    var columns = Object.keys(definedColumns[0]);
    worksheet.addRow(columns);

    data.forEach(row => {
      var rowData = columns.map(col => row[col]);
      worksheet.addRow(rowData);
    });
  }

  $("#tabpanel-container").dxTabPanel("instance").option("selectedIndex", 0);
  var gridEast = $("#eastGrid").dxDataGrid("instance");
  var eastGridData = gridEast.getDataSource().items();
  reCalculateTotals(eastGridData);

  $("#tabpanel-container").dxTabPanel("instance").option("selectedIndex", 1);
  var gridWest = $("#westGrid").dxDataGrid("instance");
  var westGridData = gridWest.getDataSource().items();

  reCalculateTotals(westGridData);

  var definedColumns = [
    {
      "PLANNING_MONTH": "",
      "REGION": "",
      "TERMINAL_ID": "",
      "LOCK_NOMINATION": "",
      "SCENARIO_DATE": "",
      "OPENING_INVENTORY_PROPANE": "",
      "OPENING_INVENTORY_BUTANE": "",
      "TERMINAL_AVAILS_PROPANE": "",
      "TERMINAL_AVAILS_BUTANE": "",
      "CUSTOMER_ID": "",
      "CUSTOMER_NAME": "",
      "CUSTOMER_LIFTING_PROPANE": "",
      "CUSTOMER_LIFTING_BUTANE": "",
      "CUSTOMER_LIFTING_PROPANE_MB": "",
      "CUSTOMER_LIFTING_BUTANE_MB": "",
      "CLOSING_INVENTORY_PROPANE": "",
      "CLOSING_INVENTORY_BUTANE": "",
      "CLOSING_PERCENTAGE_PROPANE": "",
      "CLOSING_PERCENTAGE_BUTANE": "",
    }
  ];
  convertDataToExcel(eastGridData, "East Data", definedColumns);
  convertDataToExcel(westGridData, "West Data", definedColumns);

  workbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Scenario-Data.xlsx');
  });
  $("#tabpanel-container").dxTabPanel("instance").option("selectedIndex", selectedTab);
}