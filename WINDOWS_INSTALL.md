# Install KnowMeBro on Windows

## Download options

- **Setup installer:** `KnowMeBro-Setup-0.1.0.exe` installs the app and can add Start Menu/Desktop shortcuts.
- **Portable app:** `KnowMeBro-Portable-0.1.0.exe` runs without a traditional installation. Keep the file in a folder you can find again.

Download both files from the **Build KnowMeBro for Windows** workflow in the repository's GitHub Actions page. Workflow artifacts are temporary (30 days). Version-tagged builds are attached to GitHub Releases.

## Install

1. Download the Setup installer from a successful workflow run or GitHub Release.
2. Open the downloaded `.exe` and follow the setup screens.
3. Launch **KnowMeBro** from the Start Menu or desktop shortcut.
4. Sign up or log in with your existing KnowMeBro account.

Windows may show a SmartScreen warning because the app is not signed with a paid code-signing certificate. Only run the installer when you have downloaded it from the official KnowMeBro repository and trust the source.

## Accounts and saved data

The desktop app opens the hosted KnowMeBro web application and uses the existing Supabase-backed account and quiz services. It requires an internet connection; it is not a fully offline version.

Cloud-saved quizzes and recorded attempts remain associated with the account and are available after closing the app or signing in on another device, subject to backend and account availability. Unpublished/local-only drafts are not guaranteed to sync to the cloud; save or publish content through the signed-in app when cross-device access is needed. "Forever" storage cannot be guaranteed.

## Uninstall

Uninstalling the Windows app does not intentionally delete cloud data from your KnowMeBro account. Local-only browser storage and drafts may not transfer to another computer.
