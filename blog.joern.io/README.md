# Joern Ghost Setup

## Casper Theme

This code is based on pre-built version of casper theme - casper-v3.1.2 (https://github.com/TryGhost/Casper/releases/tag/3.1.2)

 1. Make changes to the handlebar templates and zip the `casper` directory. Optionally give the directory a version number to keep track of variations
 2. Login to ghost admin and click "Design" ins sidebar and then upload then click  "Upload a theme" all the way down in the page
 3. Drag and drop the zip and you are done!


### Changing Home Page

Modify `home.hbs` file and save it


## Custom Routes

Changes to default routes can be made using `routes.yaml` which can then be uploaded by Clicking on "Labs" in sidebar and then uploading the file
Currently `/blog` routes have been setup for new blogs already and `/` renders the `home.hbs` template on the main page instead of `index.hbs`


