@echo off
title Jain Jinvani - Clean Remote Bot Branches
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0clean-remote-branches.ps1"
