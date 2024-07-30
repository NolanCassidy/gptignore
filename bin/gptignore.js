#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Function to read .gptignore and return ignored paths
const getIgnoredPaths = () => {
  const ignoreFilePath = path.join(process.cwd(), ".gptignore");
  let ignoredPaths = [];

  if (fs.existsSync(ignoreFilePath)) {
    const ignoreContent = fs.readFileSync(ignoreFilePath, "utf-8");
    ignoredPaths = ignoreContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#")); // Ignore empty lines and comments
  }

  return ignoredPaths;
};

// Check if a file should be ignored based on .gptignore patterns
const shouldIgnore = (filePath, ignoredPaths) => {
  return ignoredPaths.some((pattern) => {
    if (pattern.endsWith("/")) {
      return filePath.startsWith(pattern.slice(0, -1));
    }
    return filePath === pattern || filePath.includes(pattern);
  });
};

// Recursively get all files and folders in a directory, filtering out ignored ones
const getAllFilesAndFolders = (
  dirPath,
  arrayOfFiles = [],
  ignoredPaths = []
) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const relativeFilePath = path.relative(process.cwd(), filePath);

    if (shouldIgnore(relativeFilePath, ignoredPaths)) {
      return;
    }

    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFilesAndFolders(
        filePath,
        arrayOfFiles,
        ignoredPaths
      );
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
};

// Format the folder structure for output
const formatFolderStructure = (filePath) => {
  const parts = filePath.split(path.sep);
  return parts
    .map((part, index) => {
      if (index === parts.length - 1) {
        return `--${part}`; // File
      } else {
        return `-${part}`; // Folder
      }
    })
    .join("\n");
};

// Generate the AI file
const generateAIFile = () => {
  const rootDir = process.cwd();
  const outputDir = path.join(rootDir, "ai");
  const outputFilePath = path.join(outputDir, "project_contents.txt");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const ignoredPaths = getIgnoredPaths();
  const allFiles = getAllFilesAndFolders(rootDir, [], ignoredPaths);

  let content = "Table of Contents\n\n"; // Add a heading for the folder structure

  allFiles.forEach((file) => {
    const relativePath = path.relative(rootDir, file);
    const folderStructure = formatFolderStructure(relativePath);
    const fileContents = fs.readFileSync(file, "utf8");

    content += `${folderStructure}\n\n`;
    content += `/* Path: ${relativePath} */\n`;
    content += `${fileContents}\n\n`;
  });

  fs.writeFileSync(outputFilePath, content);
  console.log(`AI file generated at ${outputFilePath}`);
};

// Main CLI handler
const main = () => {
  const [, , command, ...args] = process.argv;

  switch (command) {
    case "generate":
      generateAIFile();
      break;
    default:
      console.log(`Unknown command: ${command}`);
      console.log("Available commands: generate");
      break;
  }
};

// Run the CLI
main();
