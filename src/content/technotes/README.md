# Apollo Tech Notes

This file is the contributing guide for this section of the docs. It is not exposed on the public site.

## Running Locally

Since all the files for technotes is in the `docs` repo, we can run the simplified local dev mode.
First, follow the instructions in the main README about how to setup Netlify and installing packages, but then you can use the local command to do a fast startup:

```shell
npm run start:local
```

## Creating a new Tech Note

### Create a new file
Create a new file in the `src/content/technotes/` directory. The file should follow the format `TN0001-my-page-name.mdx`

* Use kebab-case format for entire file name, this will also be the url format
* Prefix the file name with `TNXXXX` where `X` is an incremental number from the previous tech notes.
* Use `.mdx`
* Add the following MDX headers to the top of the file: `title`, `description`, `tags`
  * ```mdx
    ---
    title: My Title of Tech Note
    description: Sub-description of the technote that may be used for links and metadata
    tags: [server, client, foo, bar] // Any tags relevant to tech note
    ---

    Starting content of technote...
    ```
    
### Add file to sidebar

Update the `src/content/technotes/config.json` so that you add the tech note to the long list in the sidebar.

In the `config.json` you should use the following format:

```json
"sidebar": {
    "Home": "/",
    "TN0001 - My Tech Note": "TN0001-my-tech-note"
}
```

The key on the left is what is seen by users in the UI so it should have standard English spacing of the title, but with the tech note number as a prefix.
The value on the right is the name of the file, but without the file extension `.mdx`