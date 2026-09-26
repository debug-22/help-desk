/**
 * AI Resource Hub — Analytics receiver
 *
 * Deploy this as a Web App (Execute as: Me, Access: Anyone).
 * It accepts POST requests with a JSON body of basic technical
 * fields, validates them, and appends a row to the bound Sheet.
 *
 * No credentials or API keys are exposed to the frontend — only
 * the resulting Web App URL, which can only write rows, not read
 * the sheet's contents.
 */

// Name of the sheet tab rows will be appended to.
const SHEET_NAME = "PageViews";

// Whitelisted fields — anything else in the payload is ignored.
const ALLOWED_FIELDS = [
  "timestamp",
  "userAgent",
  "referrer",
  "pageUrl",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "screenWidth",
  "screenHeight",
  "language"
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse(false, "Missing request body");
    }

    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse(false, "Invalid JSON body");
    }

    if (typeof data !== "object" || data === null) {
      return jsonResponse(false, "Request body must be a JSON object");
    }

    const sheet = getOrCreateSheet();
    const row = buildRow(data);

    sheet.appendRow(row);

    return jsonResponse(true, "Recorded");
  } catch (err) {
    return jsonResponse(false, "Server error: " + err.message);
  }
}

// Reject GET requests explicitly — this endpoint only accepts writes.
function doGet(e) {
  return jsonResponse(false, "This endpoint only accepts POST requests");
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Server Timestamp"].concat(ALLOWED_FIELDS));
  }

  return sheet;
}

function buildRow(data) {
  const serverTimestamp = new Date().toISOString();

  const row = [serverTimestamp];
  ALLOWED_FIELDS.forEach(function (field) {
    const value = data[field];
    // Only allow primitive string/number values — never nested objects
    if (typeof value === "string" || typeof value === "number") {
      row.push(value);
    } else {
      row.push("");
    }
  });

  return row;
}

function jsonResponse(success, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: success, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
