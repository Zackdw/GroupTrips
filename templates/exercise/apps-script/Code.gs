// Receives exercise submissions from GitHub Pages and appends them to this Sheet.
// One tab per exercise (named "<trip>/<exercise>"); new answer fields become new columns.

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const tabName = `${body.trip}/${body.exercise}`.slice(0, 100);
  const row = Object.assign({ timestamp: new Date() }, flatten(body.answers || {}));

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);

    let headers = sheet.getLastColumn() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      : [];
    const newKeys = Object.keys(row).filter((k) => !headers.includes(k));
    if (newKeys.length) {
      headers = headers.concat(newKeys);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    }
    sheet.appendRow(headers.map((h) => (h in row ? row[h] : '')));
  } finally {
    lock.releaseLock();
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Returns all rows for one exercise so pages can show group results:
// GET <exec url>?trip=2027-04-hawaii&exercise=dates → { rows: [{ timestamp, name, ... }] }
function doGet(e) {
  const tabName = `${e.parameter.trip}/${e.parameter.exercise}`.slice(0, 100);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tabName);
  let rows = [];
  if (sheet && sheet.getLastRow() > 1) {
    const [headers, ...data] = sheet.getDataRange().getValues();
    rows = data.map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i]])));
  }
  return ContentService.createTextOutput(JSON.stringify({ rows }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Arrays and objects (rankings, map pins, date lists) are stored as JSON text in a single cell.
// Strings starting with = + - @ get a leading ' so Sheets doesn't run them as formulas.
function flatten(answers) {
  const out = {};
  for (const [k, v] of Object.entries(answers)) {
    if (v !== null && typeof v === 'object') out[k] = JSON.stringify(v);
    else if (typeof v === 'string' && /^[=+\-@]/.test(v)) out[k] = `'${v}`;
    else out[k] = v;
  }
  return out;
}
