@echo off
title Bingo - Quermesse
echo ==========================================
echo       INICIANDO O SISTEMA DE BINGO
echo ==========================================
echo.
echo Iniciando o painel na interface grafica...
echo Aguarde alguns segundos para o navegador abrir.
echo.

cd frontend
start http://localhost:5173
npm run dev
