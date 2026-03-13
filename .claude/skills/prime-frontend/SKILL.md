---
name: prime-frontend
description: Load all frontend docs as conversation context
disable-model-invocation: true
---

# Frontend Documentation

!`for file in $(find docs/frontend -name "*.md" -type f | sort); do echo "---"; echo "## $file"; echo ""; cat "$file"; echo ""; done`

Continue what you were doing or say "Ready!" if nothing to do.
