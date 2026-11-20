# Running the mobile app (Android build)

The mobile app is self-contained: its own `package.json` and `package-lock.json`.
You do NOT need pnpm or the monorepo root to build the APK.

## One-time setup

    cd apps\mobile
    npm install --legacy-peer-deps
    npx expo prebuild --platform android
    "sdk.dir=C:/Users/Lenovo/AppData/Local/Android/Sdk" | Set-Content android\local.properties -Encoding ascii

`prebuild` writes `android\`. It also deletes `local.properties` every time it runs,
so rewrite that line after every prebuild.

## Build the APK

    cd apps\mobile\android
    $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
    $env:NODE_ENV = "production"
    .\gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a

Output: `apps\mobile\android\app\build\outputs\apk\release\app-release.apk`

## After changing JS only (no native changes)

Clear the cached bundle first, or Gradle reuses the old one:

    Remove-Item -Recurse -Force android\app\build\generated -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force android\app\build\intermediates\assets -ErrorAction SilentlyContinue

then run the gradle line again. Takes about 1-3 minutes.

## Install on the phone

    & "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r "apps\mobile\android\app\build\outputs\apk\release\app-release.apk"

Or copy the APK to the phone and tap it.

## Proving you are running the new build

The start screen shows a small `BUILD nn` under `LOCAL - ONLINE`.
Bump `BUILD_TAG` in `src\components\start\StartScreen.tsx` whenever you ship a change.

## Web and server

    cd apps\web    ; npm run dev    (or deploy to Vercel)
    cd apps\server ; npm run dev    (or deploy to Render)

The mobile app talks to https://imposter-2-0.onrender.com by default.
Override with EXPO_PUBLIC_SERVER_URL in `apps\mobile\.env` for LAN testing.
