#!/bin/bash

# Salir si ocurre un error
set -e

echo "📦 Configurando scripts en package.json..."

# Usa jq para modificar package.json
if command -v jq >/dev/null 2>&1; then
  jq '.scripts = {"start":"node server.js","dev":"nodemon server.js"}' package.json > tmp.json && mv tmp.json package.json
else
  echo "❌ jq no está instalado. Instálalo con: sudo apt-get install jq (Linux) o brew install jq (Mac)"
  exit 1
fi

echo "✅ Scripts agregados a package.json"
echo "👉 Ahora puedes correr: npm run dev o npm start"
