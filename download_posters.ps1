# PowerShell script to download movie posters
$posters = @{
    "avengers.jpg" = "https://i.imgur.com/IklJIcj.jpg"
    "joker.jpg" = "https://i.imgur.com/Jnubd5G.jpg"
    "lionking.jpg" = "https://i.imgur.com/fE1JeOu.jpg"
    "inception.jpg" = "https://i.imgur.com/5BQvMjs.jpg"
    "parasite.jpg" = "https://i.imgur.com/G1qQPeU.jpg"
    "darknight.jpg" = "https://i.imgur.com/l4hIe9v.jpg"
    "interstellar.jpg" = "https://i.imgur.com/kV3q7C5.jpg"
    "blackpanther.jpg" = "https://i.imgur.com/jQ8zomR.jpg"
}

# Create the directory if it doesn't exist
$moviesDir = "images/movies"
if (!(Test-Path $moviesDir)) {
    New-Item -ItemType Directory -Force -Path $moviesDir
}

# Download each poster
foreach ($poster in $posters.GetEnumerator()) {
    $filePath = Join-Path $moviesDir $poster.Key
    Write-Host "Downloading $($poster.Key)..."
    try {
        Invoke-WebRequest -Uri $poster.Value -OutFile $filePath
        Write-Host "Downloaded $($poster.Key) successfully."
    } catch {
        Write-Host "Failed to download $($poster.Key): $_"
    }
}

Write-Host "All downloads complete!" 