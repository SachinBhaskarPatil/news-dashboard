import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import crypto from 'crypto';

interface ExportData {
  title: string;
  author: string;
  type: string;
  date: string;
  payout: number;
}

// OAuth2 configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_SECRET || '';
const REDIRECT_URI = process.env.NEXTAUTH_URL + '/api/auth/callback/google';

// Generate PKCE code verifier and challenge
function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
  return { verifier, challenge };
}

export function getAuthUrl() {
  const oauth2Client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );

  const scopes = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive',
  ];

  const { verifier, challenge } = generatePKCE();

  // Store the verifier in a cookie or session
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('code_verifier', verifier);
  }

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    code_challenge: challenge,
    code_challenge_method: 'S256' as 'S256',
  });
}

export async function getOAuthClient(code: string) {
  const oauth2Client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );

  // Get the stored code verifier
  let codeVerifier;
  if (typeof window !== 'undefined') {
    codeVerifier = sessionStorage.getItem('code_verifier');
  }

  const response = await oauth2Client.getToken({
    code,
    codeVerifier: codeVerifier || undefined,
  });

  oauth2Client.setCredentials(response.tokens);
  return oauth2Client;
}

export async function createAndGetSpreadsheet(auth: OAuth2Client) {
  try {
    // Create a new spreadsheet
    const drive = google.drive({ version: 'v3', auth });
    const timestamp = new Date().toISOString().split('T')[0];
    const fileMetadata = {
      name: `Payout Report ${timestamp}`,
      mimeType: 'application/vnd.google-apps.spreadsheet',
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });

    if (!file.data.id) {
      throw new Error('Failed to create spreadsheet');
    }

    const spreadsheetId = file.data.id;
    
    // Create new spreadsheet instance
    const doc = new GoogleSpreadsheet(spreadsheetId, auth);
    await doc.loadInfo();
    return doc;
  } catch (error) {
    console.error('Error creating spreadsheet:', error);
    throw error;
  }
}

export async function exportToGoogleSheets(data: ExportData[], auth: OAuth2Client) {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    const doc = await createAndGetSpreadsheet(auth);

    // Create a new sheet
    const sheet = await doc.addSheet({ 
      title: 'Payout Report', 
      headerValues: ['Title', 'Author', 'Type', 'Date', 'Payout'] 
    });

    // Add the data rows
    const rows = data.map(item => ({
      Title: item.title,
      Author: item.author,
      Type: item.type,
      Date: item.date,
      Payout: item.payout,
    }));

    await sheet.addRows(rows);

    // Add total row
    const totalPayout = data.reduce((sum, item) => sum + item.payout, 0);
    await sheet.addRow({
      Title: 'TOTAL',
      Author: '',
      Type: '',
      Date: '',
      Payout: totalPayout,
    });

    // Format the sheet
    await sheet.loadCells('A1:E' + (data.length + 2));

    // Format header row
    for (let i = 0; i < 5; i++) {
      const cell = sheet.getCell(0, i);
      cell.textFormat = { bold: true };
      cell.backgroundColor = { red: 0.9, green: 0.9, blue: 0.9 };
    }

    // Format payout column as currency
    for (let i = 1; i <= data.length + 1; i++) {
      const cell = sheet.getCell(i, 4);
      cell.numberFormat = { type: 'CURRENCY', pattern: '$#,##0.00' };
    }

    // Format total row
    const totalCell = sheet.getCell(data.length + 1, 0);
    totalCell.textFormat = { bold: true };

    await sheet.saveUpdatedCells();

    return {
      success: true,
      url: `https://docs.google.com/spreadsheets/d/${doc.spreadsheetId}/edit?usp=sharing`,
      error: null,
    };
  } catch (error) {
    console.error('Error in exportToGoogleSheets:', error);
    return {
      success: false,
      url: null,
      error: error instanceof Error ? error.message : 'Failed to export to Google Sheets',
    };
  }
} 