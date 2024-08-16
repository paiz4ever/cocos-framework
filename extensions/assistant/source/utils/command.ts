import { spawn } from "child_process";

export function runCommand(
  command: string,
  args: string[],
  options = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);

    child.stdout.on("data", (data) => {
      const lines = data.toString().split("\n");
      lines.forEach((line: string) => {
        console.log(line);
      });
    });

    child.stderr.on("data", (data) => {
      const lines = data.toString().split("\n");
      lines.forEach((line: string) => {
        console.error(line);
      });
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}
