#!/bin/bash
export PATH="$HOME/.nvm/versions/node/v22.5.1/bin:$PATH"
cd "$(dirname "$0")"
npm run dev -- -p 3099
