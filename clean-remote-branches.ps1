Set-Location -Path $PSScriptRoot

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   Jain Jinvani: Cleaning Remote Bot Branches" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$branches = @(git branch -r | Where-Object { $_ -match 'origin/(bolt|sentinel|palette|jules|fix)' } | ForEach-Object { ($_ -replace '^\s*origin/', '').Trim() })

if ($branches.Count -eq 0) {
    Write-Host "No remote bot branches found! Remote is already clean." -ForegroundColor Green
} else {
    Write-Host "Found $($branches.Count) remote bot branches on GitHub." -ForegroundColor Yellow
    Write-Host "Deleting from origin in progress..." -ForegroundColor Yellow
    Write-Host ""
    
    # Delete in batches of 25
    for ($i = 0; $i -lt $branches.Count; $i += 25) {
        $endIdx = [Math]::Min($i + 24, $branches.Count - 1)
        $chunk = $branches[$i..$endIdx]
        $batchNum = [Math]::Floor($i/25) + 1
        Write-Host "Deleting batch $batchNum ($($chunk.Count) branches)..." -ForegroundColor Magenta
        git push origin --delete $chunk
    }
    
    Write-Host ""
    Write-Host "Pruning local tracking branches..." -ForegroundColor Cyan
    git remote prune origin
    
    Write-Host ""
    Write-Host "SUCCESS: All remote bot branches have been deleted from GitHub!" -ForegroundColor Green
    Write-Host "GitHub Desktop dropdown will now show only main." -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to close this window..."
[void][System.Console]::ReadKey()
