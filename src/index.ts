#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import { readFile, writeFile } from "fs";
import * as path from "path";
import * as os from "os";
// Define the desktop directory path
const desktopPath = path.join(os.homedir(), "Desktop");

//output paths
const outputImagePath = path.join(desktopPath, "output-image.jpg");
const outputBufferPath = path.join(desktopPath, "output-buffer.txt");

// parsing base64 code to a buffer code
function b64toBuffer(base64String: string) {
  const buffer = Buffer.from(base64String, "base64");
  return buffer;
}
// turning buffer to image function
function b2p(buffer: string) {
  //getting the Desktop dir path + the user file name
  const inputBufferPath = path.join(desktopPath, buffer);
  //reading the buffer.txt file
  readFile(inputBufferPath, "utf-8", (err: any, data: any) => {
    if (err) {
      console.log(chalk.bgRed(err.message));
    } else {
      // creating an image with the parsed buffer code
      writeFile(outputImagePath, b64toBuffer(data), (err: any) => {
        if (err) {
          console.error(err);
        } else {
          console.log(chalk.green("Done!"));
          console.log("Here's the file path:", chalk.blue(outputImagePath));
        }
      });
    }
  });
}
//turning image to buffer function
function p2b(paths: string) {
  //getting the Desktop dir path + the user file name
  const inputImagePath = path.join(desktopPath, paths);

  // Read the image file and convert it into a buffer
  readFile(inputImagePath, (err: any, data: any) => {
    if (err) {
      console.log(chalk.bgRed(err.message));
    } else {
      //parsing the data to base64
      const parsedData = data.toString("base64");
      // creating a txt file with the parsed buffer code inside
      writeFile(outputBufferPath, parsedData, (err) => {
        if (err) {
          console.error("Error writing to file:", err);
        } else {
          console.log(chalk.green("Done!"));
          console.log(
            "The buffer is encoded in Base64, Here's the file path:",
            chalk.blue(outputBufferPath)
          );
        }
      });
    }
  });
}

const userInput: Record<string, string> = {};
//second option CLI prompt
async function getPathOrBuffer(option: string) {
  if (option == "P2B - Picture to Buffer") {
    //if P2B:
    const answers = await inquirer.prompt({
      name: "getPath",
      type: "input",
      message:
        "Place your image file in the Desktop dir and add the file name here: ",
    });
    userInput["path"] = answers.getPath;
  }
  //if B2P:
  if (option == "B2P - Buffer to Picture") {
    const answers = await inquirer.prompt({
      name: "getBuff",
      type: "input",
      message:
        "Place the buffer.txt file in the Desktop dir then add the file name here : ",
    });
    userInput["path"] = answers.getBuff;
  }
}
//first option CLI prompt
async function getOptions() {
  const answers = await inquirer.prompt({
    name: "bufferingOption",
    type: "list",
    message: "Choose your buffering option:",
    choices: ["P2B - Picture to Buffer", "B2P - Buffer to Picture"],
  });

  userInput["option"] = answers.bufferingOption;
}
//parsing the userInput object based on the options
async function parse() {
  await getPathOrBuffer(userInput.option);
  if (userInput.option == "P2B - Picture to Buffer") {
    p2b(userInput.path.trim());
  }
  if (userInput.option == "B2P - Buffer to Picture") {
    b2p(userInput.path);
  }
}
//calling the functions
await getOptions();
await parse();
