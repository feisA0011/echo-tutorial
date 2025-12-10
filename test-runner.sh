#!/bin/bash
set -euo pipefail

echo "========================================="
echo "Echo Tutorial Monorepo Test Suite"
echo "========================================="
echo ""

if [ ! -f "pnpm-lock.yaml" ]; then
    echo "Error: Must be run from repository root"
    exit 1
fi

cd tests

if [ ! -d "node_modules" ]; then
    echo "Installing test dependencies..."
    pnpm install
    echo ""
fi

echo "Running test suite..."
echo ""

pnpm test

if [ $? -eq 0 ]; then
    echo ""
    echo "All tests passed!"
else
    echo ""
    echo "Some tests failed."
    exit 1
fi