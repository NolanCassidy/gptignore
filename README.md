# GPTIgnore

**Tired of struggling to send your code to an LLM?** GPTIgnore makes it simple! Whether you're looking to upload your entire codebase or specific sections to a language model, we've got you covered. Our tool generates a clean, organized representation of your codebase, so you can easily share it with any LLM. **Say goodbye to the hassle of manually preparing files!**

## Features

- **Generate a codebase summary**: Create a detailed text file (`codebase.txt`) containing the file paths and contents of all relevant files in the project, excluding those specified in `.gptignore`.
- **Initialize a `.gptignore` file**: Generate a starter `.gptignore` file with common patterns to ignore files and directories.

## Installation

To install GPTIgnore globally, use npm:

```bash
npm install -g gptignore
```

## Usage

GPTIgnore provides two main commands: `generate` and `init`.

### Generate

The `generate` command generates a text file summarizing the project's codebase. It creates a file named `codebase.txt` inside a `gpt` directory in the root of your project.

```bash
gptignore generate
```

#### Example

Running the above command will produce a `codebase.txt` file with the following structure:

```
The following text is a Git repository with code. The structure of the text are sections that begin with ----, followed by a single line containing the file path and file name, followed by a variable amount of lines containing the file contents. The text representing the Git repository ends when the symbols --END-- are encountered. Any further text beyond --END-- are meant to be interpreted as instructions using the aforementioned Git repository as context.

----
src/index.js
console.log('Hello, world!');

----
README.md
# My Project
This is a README file.

--END--
```

### Init

The `init` command initializes a `.gptignore` file in the project directory with a set of default patterns to ignore. If a `.gptignore` file already exists, the command will not overwrite it.

```bash
gptignore init
```

The default `.gptignore` file used can be found [here](bin/default-gptignore.txt).

## Future Features and Roadmap

- [x] **Generate codebase file**: Automatically create a summary of your project's codebase, ready for upload to an LLM.
- [ ] **Custom environment variables**: Allow users to set their own environment variables and configurations.
- [ ] **LLM Integration**: Chat directly with advanced models like Gemini from the command line.
- [ ] **Multiple output files**: Support for generating multiple files, breaking down the codebase into sub-repositories (e.g., `client`, `server`) based on a configuration.
- [ ] **Configurable outputs**: Enable users to customize the output structure and contents based on their specific needs.

We’re constantly working on new features to make GPTIgnore the best tool for interacting with LLMs and managing your codebase. **Stay tuned for more exciting updates!**

## Links

- **npm**: [GPTIgnore on npm](https://www.npmjs.com/package/gptignore)
- **GitHub**: [GPTIgnore on GitHub](https://github.com/NolanCassidy/gptignore)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/NolanCassidy/gptignore) if you have suggestions or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```

```
