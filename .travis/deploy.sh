#!/usr/bin/env bash
set -e # Exit with nonzero exit code if anything fails

SOURCE_BRANCH=latest

# Pull requests and commits to other branches shouldn't try to deploy
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "Skipping deploy"
    exit 0
fi

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
COMMIT_SHA=`git rev-parse --verify HEAD`

# Clone and checkout the right branch
git clone $REPO whole_repo
cd whole_repo
git checkout gh-pages

# Remove all existing commits
rm -rf ./sha-*

# Clone repo where we are going to copy files from
git clone $REPO tmp

echo "<ol>" > index.html

# For each commit, add a new submodule
git log latest --reverse --oneline --no-color | while read -r line; do
    SHA=$(echo $line | cut -c-7)
    MESSAGE=$(echo $line | cut -c9-)
    echo "Processing $SHA $MESSAGE"

    cd tmp
    git checkout $SHA
    mkdir "../sha-$SHA"
    cp ./src/* "../sha-$SHA"
    cd ..

    echo "<li><a href='sha-$SHA'>$SHA $MESSAGE</a></li>" >> index.html

    sleep 1
done

echo "</ol>" >> index.html

# If there are no changes to the compiled out (e.g. this is a README update) then just bail
if [ -n "$(git status --porcelain)" ]; then
    echo "Changes found, starting commit process";
else
    echo "No changes to the output on this push; exiting."
    exit 0
fi

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add --all .
git config user.name "Katebot"
git config user.email "katebot@katemihalikova.cz"
git commit -m "Deploy to GitHub Pages ${COMMIT_SHA}"

# Get the deploy key by using Travis's stored variables to decrypt deploy_key.enc
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -k "$ssh_pass" -in ../.travis/repo.key.enc -out ../.travis/repo.key -d
chmod 600 ../.travis/repo.key
eval `ssh-agent -s`
ssh-add ../.travis/repo.key

# Now that we're all set up, we can push.
git push $SSH_REPO gh-pages
