const SPREADSHEET_ID = "14Qa1DD5VIhIJGSBNpGhZqatkhQxHllu08MBN6ctqB50";
const FOLDER_ID = "1dVXGlBdqRsLHVF-pRs7q8PKSpaevbl_-";
const SHEET_NAME = "Applications";

const HEADERS = [
  "Timestamp",
  "Email",
  "Hospital Name",
  "Country",
  "City",
  "Principal Investigator (PI)",
  "PI Contact Information (Email)",
  "Neurosurgical service manages high-grade gliomas",
  "Access to diagnostic and treatment tools",
  "Dedicated data collection and management team",
  "Electronic data infrastructure",
  "Patient information recording method",
  "Capacity to digitize or manually extract data",
  "Access to retrospective high-grade glioma records",
  "Staff/resources for retrospective data collection"
];

function doPost(e) {
  const params = e.parameter || {};
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const sheet = getApplicationsSheet_();
    ensureHeaders_(sheet);

    const row = [
      new Date(),
      params.email || "",
      params.hospital_name || "",
      params.country || "",
      params.city || "",
      params.principal_investigator || "",
      params.pi_email || "",
      params.neurosurgical_service || "",
      params.diagnostic_treatment_tools || "",
      params.dedicated_data_team || "",
      params.electronic_data_infrastructure || "",
      params.patient_information_recording || "",
      params.digitization_capacity || "",
      params.retrospective_records_access || "",
      params.retrospective_staff_resources || ""
    ];

    sheet.appendRow(row);
    saveJsonBackup_(params);

    return HtmlService.createHtmlOutput(
      "<h1>Thank you</h1><p>Your SAHARA site eligibility form has been submitted.</p>"
    );
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return HtmlService.createHtmlOutput("SAHARA application endpoint is running.");
}

function getApplicationsSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    return;
  }

  const existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = HEADERS.every((header, index) => existing[index] === header);
  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function saveJsonBackup_(params) {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const safeHospital = String(params.hospital_name || "unknown-site").replace(/[^\w-]+/g, "-");
  const filename = `sahara-application-${safeHospital}-${Date.now()}.json`;
  folder.createFile(filename, JSON.stringify(params, null, 2), MimeType.PLAIN_TEXT);
}
