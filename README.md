# Fashion-journal - A wordpress application with gulp builder

## Wordpress - Gulp - AWS CodeCommit

### Patterns and Principles in this project

- Automatically build Scss, Sass into Css
- Minify Css, Uglify Js
- Automatically deploy to AWS S3 Bucket via CodeCommit

### Install

Via Command Prompt type:

- cd .../../htdocs
- git clone git@github.com:Namtech/fashion-journal.git
- cd fashion-journal
- copy and past your current wordpress appication to this folder
- then cd webpackage
- delet the wp-content folder, then copy and past your current wp-content folder to this directory
- npm install
- gulp build

### Code flow

The gulp command will do the followings:

- It first migrate any files and folders within the directory './webpackage/wp-content' to './wp-content'. Any code belongs to './webpackage/wp-content' will be left unchanged for developers to continue thier works
- Then, gulp will try to find any Scss files within the directory './wp-content' and compile them to Css files
- After that, it continues to find any Css and Js files within the directory './wp-content' and minify them
- PHP team can view their website via localhost as normal. This version of website has Scss and Js files compiled and minified
- From now on, changes for wordpress themes should only be made within the './webpackage/wp-content' directory

### Watcher

In progress...

- Gulp will watch for any changes that have been made within the './webpackage/wp-content' directory and automatically build and minified Scss and Js files
- Changes can be viewed via the Command Prompt

### Server Integration

In progress...

- This Git repo is in sync with an Amazon S3 Bucket
- Any commit to this folder will first update the AWS S3 Bucket
- If there are any changes to AWS S3 Bucket, AWS CodePipeline will automatically run the Configuration Phase
- In the Configuration Phase: a gulp command will be runned to:
    + Find any function.php files within the root directory, (except for the './webpackage/wp-content' directory) and replace 'http://localhost' string to 'http://fj-sg.nativesdev.com.au'
    + Then Update database scheme to mySQL database
- After the Configuration Phase, AWS CodeBuild will be runned and the project will be deployed to an AWS EC2 Instance for Staging
- Testers will confirm the Staging and then AWS CodeBuild will continue to deploy to Production

### Command Prompt

In progress...

- npm build     ---------------// install dependencies and run gulp build
