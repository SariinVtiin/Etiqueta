# Script para criar estrutura de GestaoUsuarios

$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# Criar pastas
New-Item -ItemType Directory -Force -Path "src\pages\GestaoUsuarios" | Out-Null

# Criar index.js
[System.IO.File]::WriteAllLines("src\pages\GestaoUsuarios\index.js", @("export { default } from './GestaoUsuarios';"), $utf8NoBom)

Write-Host "✅ Estrutura de GestaoUsuarios criada com sucesso!" -ForegroundColor Green