<#
.SYNOPSIS
    Generates a production Android upload keystore and outputs GitHub Secrets configuration.
.DESCRIPTION
    Creates mobile/android/upload-keystore.jks and mobile/android/key.properties,
    then generates the Base64 representation to copy into GitHub Secrets.
#>

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$androidDir = Join-Path $projectRoot "mobile\android"
$keystorePath = Join-Path $androidDir "upload-keystore.jks"
$propertiesPath = Join-Path $androidDir "key.properties"

# 1. Locate keytool
$keytool = $null
$possiblePaths = @(
    "C:\Program Files\Stirling-PDF\runtime\jre\bin\keytool.exe",
    "C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe",
    "C:\Program Files\Java\*\bin\keytool.exe",
    "C:\Program Files (x86)\Java\*\bin\keytool.exe"
)

if (Get-Command keytool -ErrorAction SilentlyContinue) {
    $keytool = "keytool"
} else {
    foreach ($p in $possiblePaths) {
        $found = Resolve-Path $p -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) {
            $keytool = $found.Path
            break
        }
    }
}

if (-not $keytool) {
    Write-Error "keytool.exe could not be found. Please ensure Java JRE or JDK is installed."
    exit 1
}

Write-Host "Found keytool at: $keytool" -ForegroundColor Cyan

# 2. Key configuration
$alias = "jainjinvani"
$password = "JainJinvani2026SecureKey"

if (-not (Test-Path $keystorePath)) {
    Write-Host "Generating upload-keystore.jks..." -ForegroundColor Yellow
    $dname = "CN=Jain Jinvani, OU=Mobile App, O=Jain Jinvani Team, L=New Delhi, ST=Delhi, C=IN"
    
    & $keytool -genkeypair `
        -v `
        -keystore $keystorePath `
        -alias $alias `
        -keyalg RSA `
        -keysize 2048 `
        -validity 10000 `
        -storetype PKCS12 `
        -storepass $password `
        -keypass $password `
        -dname $dname

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to generate keystore."
        exit 1
    }
    Write-Host "Keystore successfully created at: $keystorePath" -ForegroundColor Green
} else {
    Write-Host "Existing keystore found at: $keystorePath" -ForegroundColor Green
}

# 3. Create or update key.properties
$propsContent = @"
storePassword=$password
keyPassword=$password
keyAlias=$alias
storeFile=upload-keystore.jks
"@

Set-Content -Path $propertiesPath -Value $propsContent -Encoding Ascii
Write-Host "Created $propertiesPath" -ForegroundColor Green

# 4. Generate Base64 for GitHub Secrets
$keystoreBytes = [System.IO.File]::ReadAllBytes($keystorePath)
$base64Keystore = [System.Convert]::ToBase64String($keystoreBytes)

# Also save base64 to a local temporary file for easy copying
$b64File = Join-Path $androidDir "keystore_base64.txt"
Set-Content -Path $b64File -Value $base64Keystore -Encoding Ascii

Write-Host "`n========================================================" -ForegroundColor Magenta
Write-Host "🎉 ANDROID KEYSTORE SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Magenta
Write-Host "To allow GitHub Actions to build APKs that update seamlessly:" -ForegroundColor White
Write-Host "1. Go to your GitHub repository -> Settings -> Secrets and variables -> Actions" -ForegroundColor White
Write-Host "2. Add the following 4 Repository Secrets:`n" -ForegroundColor White

Write-Host "SECRET NAME: ANDROID_KEYSTORE_BASE64" -ForegroundColor Yellow
Write-Host "VALUE: [Saved to mobile/android/keystore_base64.txt - copy all text from that file]" -ForegroundColor DarkGray

Write-Host "SECRET NAME: KEYSTORE_PASSWORD" -ForegroundColor Yellow
Write-Host "VALUE: $password`n" -ForegroundColor Cyan

Write-Host "SECRET NAME: KEY_ALIAS" -ForegroundColor Yellow
Write-Host "VALUE: $alias`n" -ForegroundColor Cyan

Write-Host "SECRET NAME: KEY_PASSWORD" -ForegroundColor Yellow
Write-Host "VALUE: $password`n" -ForegroundColor Cyan

Write-Host "========================================================" -ForegroundColor Magenta
Write-Host "Once added, every build from GitHub Actions will use this exact" -ForegroundColor Green
Write-Host "signature and will install directly over older versions without error!" -ForegroundColor Green
Write-Host "========================================================`n" -ForegroundColor Magenta
