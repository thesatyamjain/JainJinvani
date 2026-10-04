Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\src\assets\52d9a82ed1897797854817247f9d26b0426643b0.png"
$androidResDir = Join-Path $PSScriptRoot "..\mobile\android\app\src\main\res"
$iosAppIconDir = Join-Path $PSScriptRoot "..\mobile\ios\Runner\Assets.xcassets\AppIcon.appiconset"
$mobileAssetsDir = Join-Path $PSScriptRoot "..\mobile\assets\images"
$mobileWebIconsDir = Join-Path $PSScriptRoot "..\mobile\web\icons"
$mobileWebDir = Join-Path $PSScriptRoot "..\mobile\web"

if (-not (Test-Path $srcPath)) {
    Write-Error "Source icon not found at $srcPath"
    exit 1
}

$srcImg = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Loaded master icon from $srcPath ($($srcImg.Width)x$($srcImg.Height))"

# Helper function to generate an icon
function Save-ResizedImage {
    param(
        [string]$destinationPath,
        [int]$width,
        [int]$height,
        [bool]$hasBackground = $false,
        [string]$bgColor = "#05060a",
        [double]$scaleFactor = 1.0 # ratio of image inside canvas
    )

    $destDir = Split-Path $destinationPath -Parent
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }

    $bmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)

    $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gfx.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    if ($hasBackground) {
        $color = [System.Drawing.ColorTranslator]::FromHtml($bgColor)
        $brush = New-Object System.Drawing.SolidBrush($color)
        $gfx.FillRectangle($brush, 0, 0, $width, $height)
        $brush.Dispose()
    } else {
        $gfx.Clear([System.Drawing.Color]::Transparent)
    }

    $contentWidth = [int]($width * $scaleFactor)
    $contentHeight = [int]($height * $scaleFactor)
    $offsetX = [int](($width - $contentWidth) / 2)
    $offsetY = [int](($height - $contentHeight) / 2)

    $gfx.DrawImage($srcImg, $offsetX, $offsetY, $contentWidth, $contentHeight)

    $gfx.Dispose()
    $bmp.Save($destinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created: $destinationPath ($width x $height)"
}

# 1. Android Legacy Launcher Icons (solid background, 85% safe scale)
$androidDensities = @{
    "mipmap-mdpi"    = 48
    "mipmap-hdpi"    = 72
    "mipmap-xhdpi"   = 96
    "mipmap-xxhdpi"  = 144
    "mipmap-xxxhdpi" = 192
}

foreach ($density in $androidDensities.Keys) {
    $size = $androidDensities[$density]
    $iconPath = Join-Path $androidResDir "$density\ic_launcher.png"
    Save-ResizedImage -destinationPath $iconPath -width $size -height $size -hasBackground $true -scaleFactor 0.72
}

# 2. Android Adaptive Icon Foregrounds (108x108 base grid, 66% safe mask, 50% logo scale)
$adaptiveDensities = @{
    "mipmap-mdpi"    = 108
    "mipmap-hdpi"    = 162
    "mipmap-xhdpi"   = 216
    "mipmap-xxhdpi"  = 324
    "mipmap-xxxhdpi" = 432
}

foreach ($density in $adaptiveDensities.Keys) {
    $size = $adaptiveDensities[$density]
    $fgPath = Join-Path $androidResDir "$density\ic_launcher_foreground.png"
    Save-ResizedImage -destinationPath $fgPath -width $size -height $size -hasBackground $false -scaleFactor 0.50
}

# 3. Android Adaptive XML Definitions & Colors
$anyDpiDir = Join-Path $androidResDir "mipmap-anydpi-v26"
if (-not (Test-Path $anyDpiDir)) {
    New-Item -ItemType Directory -Path $anyDpiDir -Force | Out-Null
}

$adaptiveXmlContent = @'
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
'@
Set-Content -Path (Join-Path $anyDpiDir "ic_launcher.xml") -Value $adaptiveXmlContent -Encoding UTF8
Set-Content -Path (Join-Path $anyDpiDir "ic_launcher_round.xml") -Value $adaptiveXmlContent -Encoding UTF8

$valuesDir = Join-Path $androidResDir "values"
if (-not (Test-Path $valuesDir)) {
    New-Item -ItemType Directory -Path $valuesDir -Force | Out-Null
}
$colorsXmlPath = Join-Path $valuesDir "colors.xml"
$colorsXmlContent = @'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#05060A</color>
</resources>
'@
Set-Content -Path $colorsXmlPath -Value $colorsXmlContent -Encoding UTF8

# 4. iOS App Icons
$iosIcons = @{
    "Icon-App-1024x1024@1x.png" = 1024
    "Icon-App-20x20@1x.png"     = 20
    "Icon-App-20x20@2x.png"     = 40
    "Icon-App-20x20@3x.png"     = 60
    "Icon-App-29x29@1x.png"     = 29
    "Icon-App-29x29@2x.png"     = 58
    "Icon-App-29x29@3x.png"     = 87
    "Icon-App-40x40@1x.png"     = 40
    "Icon-App-40x40@2x.png"     = 80
    "Icon-App-40x40@3x.png"     = 120
    "Icon-App-60x60@2x.png"     = 120
    "Icon-App-60x60@3x.png"     = 180
    "Icon-App-76x76@1x.png"     = 76
    "Icon-App-76x76@2x.png"     = 152
    "Icon-App-83.5x83.5@2x.png" = 167
}

foreach ($fileName in $iosIcons.Keys) {
    $size = $iosIcons[$fileName]
    $iosPath = Join-Path $iosAppIconDir $fileName
    Save-ResizedImage -destinationPath $iosPath -width $size -height $size -hasBackground $true -scaleFactor 0.90
}

# 5. Mobile Project Asset Images & Web Icons
Save-ResizedImage -destinationPath (Join-Path $mobileAssetsDir "app_icon.png") -width 1024 -height 1024 -hasBackground $false
Save-ResizedImage -destinationPath (Join-Path $mobileAssetsDir "app_icon_square.png") -width 512 -height 512 -hasBackground $true -scaleFactor 0.72
Save-ResizedImage -destinationPath (Join-Path $mobileWebIconsDir "Icon-192.png") -width 192 -height 192 -hasBackground $false
Save-ResizedImage -destinationPath (Join-Path $mobileWebIconsDir "Icon-512.png") -width 512 -height 512 -hasBackground $false
Save-ResizedImage -destinationPath (Join-Path $mobileWebIconsDir "Icon-maskable-192.png") -width 192 -height 192 -hasBackground $true -scaleFactor 0.72
Save-ResizedImage -destinationPath (Join-Path $mobileWebIconsDir "Icon-maskable-512.png") -width 512 -height 512 -hasBackground $true -scaleFactor 0.72
Save-ResizedImage -destinationPath (Join-Path $mobileWebDir "favicon.png") -width 64 -height 64 -hasBackground $false

$srcImg.Dispose()
Write-Host "All mobile icons for Android, iOS, and Web generated successfully!"
