# Google Sheets Newsletter Integration Setup

This guide will help you connect newsletter signups to a Google Sheet for automatic storage.

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Biblical Man Newsletter Subscribers"
4. Add headers in row 1:
   - Column A: `Email`
   - Column B: `Timestamp`
   - Column C: `Source`

## Step 2: Set Up Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Add new row with subscriber data
    sheet.appendRow([
      data.email,
      data.timestamp,
      data.source
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click the disk icon to save
5. Name your project "Newsletter Webhook"

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: "Newsletter signup webhook"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to Newsletter Webhook (unsafe)**
9. Click **Allow**
10. **Copy the Web app URL** - it looks like:
    ```
    https://script.google.com/macros/s/AKfycbyXXXXXXXXXXXXXXXXXXXXXXXXX/exec
    ```

## Step 4: Add to Your Environment Variables

1. Open `.env.local` in your project
2. Add this line:
   ```
   GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_URL_HERE/exec
   ```
3. Save the file
4. Restart your dev server: `npm run dev`

## Step 5: Test It

1. Go to http://localhost:3000
2. Scroll to the newsletter section
3. Enter a test email
4. Click "Subscribe"
5. Check your Google Sheet - you should see a new row!

## Troubleshooting

### "Script function not found: doPost"
- Make sure you saved the Apps Script code
- Redeploy: Deploy → Manage deployments → Edit → Version: New version → Deploy

### No data appearing in sheet
- Check the web app URL is correct in `.env.local`
- Make sure "Who has access" is set to "Anyone"
- Check browser console for errors

### Permission errors
- Re-authorize: Go to Apps Script → Run → authorize again
- Make sure you clicked "Allow" during authorization

## Email Sequence Setup

The newsletter signup automatically sends:

1. **Immediate**: Welcome email with:
   - Brand introduction
   - Links to Substack, Gumroad, X
   - Question prompt for engagement

2. **Day 2** (manual setup required): Substack deep dive
   - Best articles to start with
   - What to expect from weekly emails

3. **Day 3** (manual setup required): Product showcase
   - Featured products
   - Transformation stories
   - Limited-time offer

4. **Day 4** (manual setup required): Community invitation
   - X account introduction
   - How to engage
   - Behind-the-scenes content

### Setting Up Automated Follow-ups

For automated email sequences, integrate with:

**Option 1: ConvertKit** (Recommended)
- Free up to 1,000 subscribers
- Visual automation builder
- Easy Resend integration

**Option 2: Loops.so**
- Built for developers
- API-first approach
- Great for transactional emails

**Option 3: Custom with Resend + Cron**
- Use Vercel Cron Jobs
- Query your Google Sheet
- Send based on signup date

## Data Privacy

Make sure to:
- Add a privacy policy to your site
- Include unsubscribe links in emails
- Comply with GDPR/CAN-SPAM
- Secure your Google Sheet (don't share publicly)

## Support

If you run into issues:
1. Check the [Apps Script documentation](https://developers.google.com/apps-script)
2. Test the webhook with curl:
   ```bash
   curl -X POST YOUR_WEBHOOK_URL \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","timestamp":"2025-01-01","source":"test"}'
   ```
3. Check Apps Script logs: Executions tab in Apps Script editor

---

**Done!** Your newsletter signups are now automatically stored in Google Sheets and triggering welcome emails.
