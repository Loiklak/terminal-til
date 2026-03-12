# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Terminal TIL ("Today I Learned") — a side project to build an aesthetic, terminal-themed responsive web app for capturing and retrieving personal learnings. Aesthetic goal: riced terminal feeling, inspired by Hyprland designs.

## Commands

- **Dev server:** `pnpm dev` (Vite with HMR)
- **Build:** `pnpm build` (runs `tsc -b && vite build`)
- **Lint:** `pnpm lint` (ESLint with TypeScript + React hooks/refresh rules)
- **Preview production build:** `pnpm preview`

Package manager is **pnpm**.

## Tech Stack

- React 19 + TypeScript (vanilla React, no framework)
- Vite 8 for bundling/dev server
- ESLint with typescript-eslint, react-hooks, and react-refresh plugins

## Architecture

Early-stage project — currently a single `App.tsx` component with the Vite starter template.

Planned directions from `roadmap.md`:
- Plugin-based storage system (localStorage → IndexedDB → GDrive → Firebase, anything implementing a shared interface)
- LLM integrations for auto-tagging learnings and weekly recaps (designed to be provider-agnostic)
- Learning graphs and TIL sharing features
