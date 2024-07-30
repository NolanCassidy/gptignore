#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Path to the default .gptignore template
const defaultGptignorePath = path.join(__dirname, "default-gptignore.txt");

// Function to read .gptignore and return ignored paths
const getIgnoredPaths = () => {
  const currentDir = process.cwd();
  const ignoreFilePath = path.join(currentDir, ".gptignore");
  let ignoredPaths = [];

  console.log(`Looking for .gptignore file at: ${ignoreFilePath}`);

  if (fs.existsSync(ignoreFilePath)) {
    console.log(".gptignore file found");
    const ignoreContent = fs.readFileSync(ignoreFilePath, "utf-8");
    ignoredPaths = ignoreContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#")); // Ignore empty lines and comments
  } else {
    console.log(".gptignore file not found");
  }

  return ignoredPaths;
};

// Improved function to check if a file or directory should be ignored
const shouldIgnore = (filePath, ignoredPaths) => {
  const normalizedFilePath = filePath.replace(/\\/g, "/");
  return ignoredPaths.some((pattern) => {
    const normalizedPattern = pattern.replace(/\\/g, "/");
    if (normalizedPattern.endsWith("/")) {
      // Directory pattern: check if the file path starts with the directory path
      return normalizedFilePath.startsWith(normalizedPattern);
    }
    // For files, use minimatch-like behavior
    const regexPattern = new RegExp(
      "^" + normalizedPattern.replace(/\*/g, ".*").replace(/\?/g, ".") + "$"
    );
    return regexPattern.test(normalizedFilePath);
  });
};

// Recursively get all files and folders in a directory, strictly filtering out ignored ones
const getAllFilesAndFolders = (
  dirPath,
  arrayOfFiles = [],
  ignoredPaths = []
) => {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const relativeFilePath = path.relative(process.cwd(), filePath);

    if (shouldIgnore(relativeFilePath, ignoredPaths)) {
      // console.log(`Ignoring: ${relativeFilePath}`);
      continue;
    }

    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFilesAndFolders(filePath, arrayOfFiles, ignoredPaths);
    } else {
      // console.log(`Adding: ${relativeFilePath}`);
      arrayOfFiles.push(filePath);
    }
  }

  return arrayOfFiles;
};

// Generate the AI file
const generateAIFile = (
  inputPath = process.cwd(),
  outputFileName = "codebase.txt"
) => {
  const rootDir = path.resolve(inputPath);
  const outputDir = path.join(process.cwd(), "gpt");
  const outputFilePath = path.join(outputDir, outputFileName);

  console.log(`Current working directory: ${rootDir}`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
    console.log(`Created output directory: ${outputDir}`);
  }

  const ignoredPaths = getIgnoredPaths();
  const allFiles = getAllFilesAndFolders(rootDir, [], ignoredPaths);

  let content =
    "The following text is a Git repository with code. The structure of the text are sections that begin with ----, followed by a single line containing the file path and file name, followed by a variable amount of lines containing the file contents. The text representing the Git repository ends when the symbols --END-- are encountered. Any further text beyond --END-- are meant to be interpreted as instructions using the aforementioned Git repository as context.\n\n";

  allFiles.forEach((file) => {
    const relativePath = path.relative(rootDir, file);
    const fileContents = fs.readFileSync(file, "utf8");
    content += `----\n${relativePath}\n${fileContents}\n\n`;
  });

  content += "--END--\n";

  fs.writeFileSync(outputFilePath, content);
  console.log(`AI file generated at ${outputFilePath}`);
};

// Initialize the .gptignore file
const initGptignore = () => {
  const targetPath = path.join(process.cwd(), ".gptignore");

  if (fs.existsSync(targetPath)) {
    console.log(".gptignore already exists. No changes made.");
    return;
  }

  fs.copyFileSync(defaultGptignorePath, targetPath);
  console.log(".gptignore file has been created with default content.");
};

// Main CLI handler
const main = () => {
  const [, , command, ...args] = process.argv;

  switch (command) {
    case "generate":
      const inputPath = args[0] || process.cwd();
      const outputFileName = args[1] || "codebase.txt";
      generateAIFile(inputPath, outputFileName);
      break;
    case "init":
      initGptignore();
      break;
    default:
      console.log(`Unknown command: ${command}`);
      console.log("Available commands: generate, init");
      break;
  }
};

// Run the CLI
main();
