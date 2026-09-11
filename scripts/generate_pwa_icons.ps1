Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\src\assets\52d9a82ed1897797854817247f9d26b0426643b0.png"
$outDir = Join-Path $PSScriptRoot "..\public\icons"

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$srcImg = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Loaded source image: $($srcImg.Width)x$($srcImg.Height)"

# Helper function to create resized icon
function Create-ResizedIcon {
    param(
        [string]$outputPath,
        [int]$targetSize,
        [bool]$isMaskable,
        [string]$bgColor = "#05060a"
    )

    $bmp = New-Object System.Drawing.Bitmap($targetSize, $targetSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)

    $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gfx.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    if ($isMaskable) {
        # Fill with cosmic dark background
        $color = [System.Drawing.ColorTranslator]::FromHtml($bgColor)
        $brush = New-Object System.Drawing.SolidBrush($color)
        $gfx.FillRectangle($brush, 0, 0, $targetSize, $targetSize)
        $brush.Dispose()

        # Scale down logo to 72% safe zone in the center
        $contentSize = [int]($targetSize * 0.72)
        $offset = [int](($targetSize - $contentSize) / 2)
        $gfx.DrawImage($srcImg, $offset, $offset, $contentSize, $contentSize)
    } else {
        # Transparent background for standard launcher
        $gfx.Clear([System.Drawing.Color]::Transparent)
        $gfx.DrawImage($srcImg, 0, 0, $targetSize, $targetSize)
    }

    $gfx.Dispose()
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created: $outputPath ($targetSize x $targetSize)"
}

# 1. Standard Icons (purpose: any)
Create-ResizedIcon -outputPath (Join-Path $outDir "pwa-192x192.png") -targetSize 192 -isMaskable $false
Create-ResizedIcon -outputPath (Join-Path $outDir "pwa-512x512.png") -targetSize 512 -isMaskable $false

# 2. Maskable Icons (purpose: maskable with safe zone & cosmic dark background)
Create-ResizedIcon -outputPath (Join-Path $outDir "pwa-maskable-192x192.png") -targetSize 192 -isMaskable $true -bgColor "#05060a"
Create-ResizedIcon -outputPath (Join-Path $outDir "pwa-maskable-512x512.png") -targetSize 512 -isMaskable $true -bgColor "#05060a"

# 3. iOS Apple Touch Icon (180x180 with solid cosmic dark background)
Create-ResizedIcon -outputPath (Join-Path $outDir "apple-touch-icon.png") -targetSize 180 -isMaskable $true -bgColor "#05060a"

$srcImg.Dispose()
Write-Host "All PWA icons generated successfully!"
