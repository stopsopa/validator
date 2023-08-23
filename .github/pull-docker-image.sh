
set -e
set -x
set -o pipefail
VERSION="$(SWAPQUIET=1 /bin/bash bash/swap-files-v2.sh package.json package.dev.json -- /bin/bash playwright.sh --version)"
echo ">${VERSION}<"
/bin/bash bash/swap-files-v2.sh package.json package.dev.json -- docker pull "mcr.microsoft.com/playwright:v${VERSION}-focal"   