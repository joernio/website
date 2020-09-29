# [WIP] Readme

General documentation: https://gohugo.io/documentation/

## Content

### Create

New pages are added by running `hugo new name.md`, like:

```
hugo new test.md
/tmp/website/content/test.md created
```

Add content to the file and see the deploy section below. 



### Server
Simply run `hugo server` and you should be able to see the page on localhost:1313. 

Example output:

```
$ hugo server 

                   | EN  
-------------------+-----
  Pages            |  7  
  Paginator pages  |  0  
  Non-page files   |  0  
  Static files     |  2  
  Processed images |  0  
  Aliases          |  3  
  Sitemaps         |  1  
  Cleaned          |  0  

Built in 6 ms
Watching for changes in /tmp/website/{archetypes,content,data,layouts,static,themes}
Watching for config changes in /tmp/website/config.toml
Environment: "development"
Serving pages from memory
Running in Fast Render Mode. For full rebuilds on change: hugo server --disableFastRender
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
Press Ctrl+C to stop
```

### Deploy

Running `hugo` is generating static html content to `public/`: 
```
$ hugo

                   | EN  
-------------------+-----
  Pages            |  7  
  Paginator pages  |  0  
  Non-page files   |  0  
  Static files     |  2  
  Processed images |  0  
  Aliases          |  3  
  Sitemaps         |  1  
  Cleaned          |  0  

Total in 15 ms
```

The content can be used to push to [joernio](https://github.com/joernio/joernio.github.io) repo. Results should be visible after visiting [https://joernio.github.io/](https://joernio.github.io/).

## Themes

Themes are inside of /themes


