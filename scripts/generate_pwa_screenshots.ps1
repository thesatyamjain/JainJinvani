Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot "..\public\screenshots"
$logoPath = Join-Path $PSScriptRoot "..\src\assets\52d9a82ed1897797854817247f9d26b0426643b0.png"

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$logoImg = [System.Drawing.Image]::FromFile($logoPath)

# 1. Generate Desktop Wide Screenshot (1280x720)
function Generate-DesktopPreview {
    $width = 1280
    $height = 720
    $bmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gfx.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background gradient
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point(0, $height)),
        [System.Drawing.ColorTranslator]::FromHtml("#070d1e"),
        [System.Drawing.ColorTranslator]::FromHtml("#03050b")
    )
    $gfx.FillRectangle($bgBrush, 0, 0, $width, $height)
    $bgBrush.Dispose()

    # Draw sacred golden glow behind logo
    $glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 245, 158, 11))
    $gfx.FillEllipse($glowBrush, 110, 130, 460, 460)
    $glowBrush.Dispose()

    # Draw centered Logo Book on left side
    $gfx.DrawImage($logoImg, 180, 150, 320, 320)

    # Draw Title and Description on right side
    $titleFont = New-Object System.Drawing.Font("Segoe UI", 36, [System.Drawing.FontStyle]::Bold)
    $subFont = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
    $descFont = New-Object System.Drawing.Font("Segoe UI", 15, [System.Drawing.FontStyle]::Regular)
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#fde68a"))
    $amberBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#fbbf24"))
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#cbd5e1"))

    $gfx.DrawString("Jain Jinvani", $titleFont, $goldBrush, 560, 160)
    $gfx.DrawString("Complete Digital Scriptures & Daily Sadhana", $subFont, $amberBrush, 560, 230)
    
    $gfx.DrawString("[x] 100% Offline Temple Mode (All Pooja, Path & Stotras)", $descFont, $textBrush, 560, 295)
    $gfx.DrawString("[x] Shri Bhaktamar Stotra, Aarti, Chalisa & Namokar Audio", $descFont, $textBrush, 560, 340)
    $gfx.DrawString("[x] 108 Beads Digital Jap Mala & Samayik Meditation Timer", $descFont, $textBrush, 560, 385)
    $gfx.DrawString("[x] Authentic Jain Panchang, Parva Nirnay & 24 Tirthankaras", $descFont, $textBrush, 560, 430)
    $gfx.DrawString("[x] Edge-to-Edge Experience with Screen Wake Lock & Haptics", $descFont, $textBrush, 560, 475)

    $titleFont.Dispose()
    $subFont.Dispose()
    $descFont.Dispose()
    $goldBrush.Dispose()
    $amberBrush.Dispose()
    $textBrush.Dispose()
    $gfx.Dispose()

    $destPath = Join-Path $outDir "desktop-preview.png"
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated Desktop Preview: $destPath"
}

# 2. Generate Mobile Narrow Screenshot (720x1280)
function Generate-MobilePreview {
    $width = 720
    $height = 1280
    $bmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gfx.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background gradient
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point(0, $height)),
        [System.Drawing.ColorTranslator]::FromHtml("#070d1e"),
        [System.Drawing.ColorTranslator]::FromHtml("#020408")
    )
    $gfx.FillRectangle($bgBrush, 0, 0, $width, $height)
    $bgBrush.Dispose()

    # Draw golden halo
    $glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 245, 158, 11))
    $gfx.FillEllipse($glowBrush, 135, 150, 450, 450)
    $glowBrush.Dispose()

    # Draw centered Logo
    $gfx.DrawImage($logoImg, 185, 170, 350, 350)

    # Typography
    $titleFont = New-Object System.Drawing.Font("Segoe UI", 34, [System.Drawing.FontStyle]::Bold)
    $subFont = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 15, [System.Drawing.FontStyle]::Regular)
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#fde68a"))
    $amberBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#fbbf24"))
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#e2e8f0"))

    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center

    $gfx.DrawString("Jain Jinvani", $titleFont, $goldBrush, ($width / 2), 560, $sf)
    $gfx.DrawString("Complete Digital Jain Scriptures", $subFont, $amberBrush, ($width / 2), 620, $sf)

    $boxBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 255, 255, 255))
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#f59e0b"), 1)
    $gfx.FillRectangle($boxBrush, 60, 680, 600, 480)
    $gfx.DrawRectangle($borderPen, 60, 680, 600, 480)
    $boxBrush.Dispose()
    $borderPen.Dispose()

    $leftSf = New-Object System.Drawing.StringFormat
    $leftSf.Alignment = [System.Drawing.StringAlignment]::Near
    $gfx.DrawString("Key Highlights & Features:", $subFont, $goldBrush, 90, 715, $leftSf)
    $gfx.DrawString("* 100% Offline Temple Mode - No Internet Needed", $bodyFont, $textBrush, 90, 775, $leftSf)
    $gfx.DrawString("* Bhaktamar Stotra, Namokar Mantra & Audio", $bodyFont, $textBrush, 90, 835, $leftSf)
    $gfx.DrawString("* 450+ Daily Pooja, Aarti, Stuti & Chalisa", $bodyFont, $textBrush, 90, 895, $leftSf)
    $gfx.DrawString("* 108 Beads Digital Jap Mala with Haptics", $bodyFont, $textBrush, 90, 955, $leftSf)
    $gfx.DrawString("* Authentic Jain Panchang & Parva Nirnay", $bodyFont, $textBrush, 90, 1015, $leftSf)
    $gfx.DrawString("* Zero Ads, Completely Free & Open Spiritual Portal", $bodyFont, $amberBrush, 90, 1075, $leftSf)

    $titleFont.Dispose()
    $subFont.Dispose()
    $bodyFont.Dispose()
    $goldBrush.Dispose()
    $amberBrush.Dispose()
    $textBrush.Dispose()
    $sf.Dispose()
    $leftSf.Dispose()
    $gfx.Dispose()

    $destPath = Join-Path $outDir "mobile-preview.png"
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated Mobile Preview: $destPath"
}

Generate-DesktopPreview
Generate-MobilePreview

$logoImg.Dispose()
Write-Host "PWA Screenshots generated successfully!"
