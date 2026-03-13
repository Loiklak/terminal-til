---
name: prime-frontend
description: Load all frontend docs as conversation context
disable-model-invocation: true
---

# Frontend Documentation

Read all the following frontend doc files:

!`find docs/frontend -name "*.md" -type f | sort | sed 's/^/@/'`

Continue what you were doing or say "Ready!" if nothing to do.
