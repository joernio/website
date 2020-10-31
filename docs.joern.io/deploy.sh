#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset
# Script starts here
readonly WORKING_DIRECTORY="/tmp/joern-website"
if [ -d "${WORKING_DIRECTORY}" ]; then
    echo "removing old website directory";
    rm -rf "${WORKING_DIRECTORY}";
fi
echo "Clone the joernio/website repository."
git clone --depth 1 https://github.com/joernio/website.git "${WORKING_DIRECTORY}"
if [ ! -d "${WORKING_DIRECTORY}" ]; then
    echo "Cloning `joernio/website` failed";
    exit
fi
echo "Build the HTML for the documentation website"
readonly DOCUMENTATION_DIRECTORY="${WORKING_DIRECTORY}/docs.joern.io"
pushd "${DOCUMENTATION_DIRECTORY}"
yarn add docusaurus
yarn build
if [ ! -f "${DOCUMENTATION_DIRECTORY}/build/index.html" ]; then
    echo "Index file not present";
    exit
fi
popd
echo "Copy HTML to /var/www folder."
readonly WWW_JOERN_DIRECTORY="/var/www/docs.joern.io"
rm -rf "${WWW_JOERN_DIRECTORY}"
mkdir "${WWW_JOERN_DIRECTORY}"
cp -r "${DOCUMENTATION_DIRECTORY}/build/"* "${WWW_JOERN_DIRECTORY}/"
echo "Done."
