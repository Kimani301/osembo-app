# Osembo School System: Android app project

This project wraps your Osembo web app (`www/index.html`) into a real Android app (APK) using Capacitor.
GitHub builds the APK for you, so you do **not** need Android Studio or a computer with special tools.

```
osembo-app/
├── www/index.html                 ← the whole Osembo app (edit/replace this to update the app)
├── package.json                   ← lists the Capacitor tools
├── capacitor.config.json          ← app name (Osembo) and app id (com.osembo.school)
├── .github/workflows/build-apk.yml← the robot that builds the APK
├── windows/                       ← Windows app wrapper (Electron): main.js and package.json
├── .github/workflows/build-windows.yml← builds Osembo-Setup.exe for Windows
├── .github/workflows/publish-site.yml← puts the APK on a public download page
├── site/index.html                ← the download page design
└── README.md                      ← this guide
```

---

## Part 1: Put the project on GitHub (one time, about 10 minutes)

1. Create a free account at github.com and sign in.
2. Tap **+ → New repository**. Name it `osembo-app`. Choose **Private** (your school's app stays hidden). Tap **Create repository**.
3. On the new repo page tap **uploading an existing file**.
4. Unzip this project on your computer. Drag **everything inside the `osembo-app` folder** into the upload box.
   - Make sure the hidden `.github` folder goes up too. If your computer hides it, enable "show hidden files" (Windows: View → Hidden items; Mac: Cmd+Shift+.).
   - If drag-and-drop skips `.github`, tap **Add file → Create new file**, type `.github/workflows/build-apk.yml` as the name and paste the contents of that file.
5. Tap **Commit changes**.

## Part 2: Get your first APK

1. Open the **Actions** tab of your repo. A run called **Build Osembo APK** starts by itself (about 5–8 minutes). Green tick = done.
   - If it did not start: Actions → Build Osembo APK → **Run workflow**.
2. Open the finished run and scroll to **Artifacts**. Download **Osembo-APK** (a zip containing the APK).
3. Send the APK to a phone (WhatsApp, USB, Drive). On the phone tap it and allow **Install unknown apps** when asked.

> If the run turns red, open it, click the failed step, and send me the last 30 lines of the log. I will fix it.

## Part 3: Sign your app with your own key (do this BEFORE giving the app to teachers)

Why this matters: Osembo keeps its data on each phone. Android only accepts an update over an installed app if both are signed with the **same key**. Without your own key, every build is signed differently, and teachers would have to uninstall first, which **erases their data**.

1. On any computer with Java installed, run this once (pick a strong password and write it down; **if you lose this file or password you can never update the app**):
   ```
   keytool -genkeypair -v -keystore osembo.jks -alias osembo -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Turn the file into text. Mac/Linux: `base64 -w0 osembo.jks` (Mac: `base64 -i osembo.jks`). Windows PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("osembo.jks"))`.
3. In GitHub: **Settings → Secrets and variables → Actions → New repository secret**. Add these four:

   | Name | Value |
   |---|---|
   | `KEYSTORE_BASE64` | the long text from step 2 |
   | `KEYSTORE_PASSWORD` | the keystore password |
   | `KEY_ALIAS` | `osembo` |
   | `KEY_PASSWORD` | the key password (same as keystore password if you pressed Enter) |

4. Run the workflow again. The artifact is now `Osembo-signed.apk`. Use this one from now on.
5. Keep a safe copy of `osembo.jks` and the passwords (not on the school phone, not in GitHub files).

## Part 4: Install on teacher phones

1. Send `Osembo-signed.apk` to the teachers (WhatsApp is fine).
2. Each teacher installs it and opens **Osembo**.
3. On the admin phone: log in, go to **Sync devices**, and make it the master. Teachers then import the sync file (this is the WhatsApp sync you already have).
4. Admin: take a backup from **Admin → Backup** regularly and keep it in Drive or WhatsApp.

## Part 5: Updating the app later

1. Replace `www/index.html` in GitHub (open the file → pencil/upload → commit).
2. Wait for the green tick in Actions, download the new signed APK, send it to teachers.
3. They install it **over** the old one (do not uninstall). Their data stays.

Every build automatically gets a higher version number, so Android accepts it as an update.

## Part 6: Making a proper release (optional)

Tag a version (GitHub → Releases → Draft a new release → tag `v1.0`). The APK is then attached to the release page, giving you a permanent download link to share.

## Part 7: Google Play Store (optional, later)

- Needs a Google Play developer account (one-time USD 25 fee), a privacy policy page, screenshots, and an **AAB** file instead of an APK. Ask me and I will add an AAB build to the workflow.
- Your app id `com.osembo.school` becomes permanent once published, so change it in `capacitor.config.json` **before** the first release if you want a different one.
- For a school's own staff, sending the APK directly (Parts 4–5) is simpler and free.

## Part 8: Before you go live, test on a real phone

- [ ] Log in as admin and as a teacher.
- [ ] Add a student, enter marks, record a remedial payment, close the app, reopen it: data is still there.
- [ ] Download a PDF: your phone's share sheet opens so you can save it or send it on WhatsApp.
- [ ] Broadcast SMS / WhatsApp buttons open WhatsApp.
- [ ] Generate the remedial timetable for a week and mark a lesson missed.
- [ ] Sync from the admin phone to a teacher phone.
- [ ] Owner console (tap the "Osembo" title 5 times) → reset admin password asks for the PIN.

## Part 9: Public download page (so anyone can download the APK)

The workflow `publish-site.yml` builds a simple download page and puts the latest APK on it. After each successful APK build it updates the page by itself.

1. In your repo go to **Settings → Pages**. Under **Source** choose **GitHub Actions**.
2. Open **Actions → Publish Osembo download page → Run workflow** (after your first APK build is green).
3. When it finishes, the link appears in the run (and under Settings → Pages). It looks like `https://YOUR-USERNAME.github.io/osembo-app/`. Share that link with teachers and parents.

**Important:** GitHub Pages only works from a **public** repository on a free account (private repos need a paid plan). A public repo means anyone can read your source code. Do not put real student data, passwords or secrets in the files. Your signing key stays safe because it lives in GitHub Secrets, not in the files.

## Part 10: Windows version

`build-windows.yml` builds `Osembo-Setup.exe` (an installer for Windows 10/11) from the same `www/index.html`, so Android and Windows always match. After it finishes, `publish-site.yml` adds a **Download for Windows** button to your page automatically.

- Run it once by hand: **Actions → Build Osembo for Windows → Run workflow**.
- Windows may show "Windows protected your PC" because the installer is not code-signed: click **More info → Run anyway**. Removing this warning needs a paid code-signing certificate.
- Data is saved on that computer. Windows PCs have their own data, so use the sync files between devices, and take backups.
- Printing works on Windows (the print window opens normally).

## Known limits

- **Printing**: Android's app view cannot open the print dialog. Use the **Download PDF** buttons instead and print from the PDF.
- **Clearing app data / uninstalling erases that phone's data.** Take backups.
- Data lives on each phone; without a server, devices only share data through the sync files or Firebase if you set it up in the owner console.
- The owner PIN and licence checks are stored inside the app code, so a technical person with the APK could change them. This is fine for a trusted school setup, but it is not bank-level security.

## Building on your own computer instead (optional)

Install Node 20, Java 17 and Android Studio, then:
```
npm install
npx cap add android
npx cap sync android
npx cap open android      # then Build → Build APK(s)
```
