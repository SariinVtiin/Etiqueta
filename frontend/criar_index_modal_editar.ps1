# Script para criar index.js do CentroNotificacoes

$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# Criar pasta se não existir
New-Item -ItemType Directory -Force -Path "src\components\common\CentroNotificacoes" | Out-Null

# Criar index.js
[System.IO.File]::WriteAllLines("src\components\common\CentroNotificacoes\index.js", @("export { default } from './CentroNotificacoes';"), $utf8NoBom)

Write-Host "✅ Arquivo index.js criado com sucesso!" -ForegroundColor Green