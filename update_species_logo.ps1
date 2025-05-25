# PowerShell script to add logo to all species pages

$speciesFiles = Get-ChildItem -Path "species" -Filter "*.html"

foreach ($file in $speciesFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if logo is already added
    if ($content -match '<img src="../img/logo/logo.png"') {
        Write-Host "Logo already exists in $($file.Name), skipping..."
        continue
    }
    
    # Add logo styles if not present
    if (-not ($content -match '/* Logo Stilleri */')) {
        $stylePosition = $content.IndexOf('</style>')
        if ($stylePosition -gt 0) {
            $logoStyles = @"
        
        /* Logo Stilleri */
        .site-logo {
            display: flex;
            align-items: center;
        }
        
        .site-logo img {
            height: 50px;
            margin-right: 15px;
        }
"@
            $content = $content.Insert($stylePosition, $logoStyles)
        }
    }
    
    # Add logo to header
    $headerPosition = $content.IndexOf('<div class="logo">')
    if ($headerPosition -gt 0) {
        $logoHtml = @"
                <div class="logo">
                <div class="site-logo">
                    <img src="../img/logo/logo.png" alt="Egzotik Hayvanlar Dünyası Logo">
"@
        $content = $content.Replace('<div class="logo">', $logoHtml)
        
        # Close the site-logo div after the h1
        $h1Position = $content.IndexOf('</h1>', $headerPosition)
        if ($h1Position -gt 0) {
            $content = $content.Insert($h1Position + 5, '</div>')
        }
    }
    
    # Save the modified content
    Set-Content -Path $file.FullName -Value $content
    Write-Host "Updated $($file.Name) with logo"
}

Write-Host "All species files have been updated." 