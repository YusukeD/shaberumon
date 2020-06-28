#!/bin/bash
set -e

npm ci && exec npm run dev
