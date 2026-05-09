param(
  [string]$ProjectRoot = "C:\Users\DELL\Documents\New project"
)

$ErrorActionPreference = 'Stop'

function Test-CommandExists {
  param([string]$Name)
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

Write-Host "EcoTrack launcher starting..." -ForegroundColor Cyan

if (-not (Test-Path $ProjectRoot)) {
  Write-Host "Project path not found: $ProjectRoot" -ForegroundColor Red
  exit 1
}

if (-not (Test-CommandExists dotnet)) {
  Write-Host "dotnet SDK is not installed or not in PATH." -ForegroundColor Red
  Write-Host "Install .NET 8 SDK: https://dotnet.microsoft.com/en-us/download/dotnet/8.0"
  exit 1
}

if (-not (Test-CommandExists pnpm)) {
  Write-Host "pnpm is not installed or not in PATH." -ForegroundColor Red
  Write-Host "Install pnpm: npm i -g pnpm"
  exit 1
}

$apiProject = Join-Path $ProjectRoot "backend\EcoTrack.Api\EcoTrack.Api.csproj"
if (-not (Test-Path $apiProject)) {
  Write-Host "Backend project file not found: $apiProject" -ForegroundColor Red
  exit 1
}

$envExample = Join-Path $ProjectRoot ".env.example"
$envFile = Join-Path $ProjectRoot ".env"
if ((Test-Path $envExample) -and -not (Test-Path $envFile)) {
  Copy-Item $envExample $envFile -Force
  Write-Host "Created .env from .env.example" -ForegroundColor Yellow
}

Write-Host "Installing frontend dependencies (pnpm install)..." -ForegroundColor Yellow
pnpm install --dir "$ProjectRoot"
if ($LASTEXITCODE -ne 0) {
  Write-Host "pnpm install failed." -ForegroundColor Red
  exit 1
}

$backendCmd = "cd /d `"$ProjectRoot`" && dotnet run --project backend\\EcoTrack.Api\\EcoTrack.Api.csproj"
$frontendCmd = "cd /d `"$ProjectRoot`" && pnpm dev"

Write-Host "Starting backend in a new terminal..." -ForegroundColor Green
Start-Process cmd.exe -ArgumentList "/k $backendCmd"

Start-Sleep -Seconds 2

Write-Host "Starting frontend in a new terminal..." -ForegroundColor Green
Start-Process cmd.exe -ArgumentList "/k $frontendCmd"

Write-Host "Done." -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend:  http://localhost:5000 (or https://localhost:5001)"
Write-Host "Admin login: admin@ecotrack.local / Admin@12345"
