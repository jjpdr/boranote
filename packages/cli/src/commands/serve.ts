import path from "path";
import { Command } from "commander";
import { serve } from "@boranote/local-api";

const isProduction = process.env.NODE_ENV === "production";

export const serveCommand = new Command()
    .command("serve [filename]")
    .description("Open a file for editing")
    .option("-p, --port <number>", "port to run server on", "5151")
    .action(
        async (filename: string = "notebook.js", options: { port: string }) => {
            try {
                const dir = path.join(process.cwd(), path.dirname(filename));
                await serve(
                    parseInt(options.port),
                    path.basename(filename),
                    dir,
                    !isProduction
                );
                console.log(
                    `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file.`
                );
            } catch (err: any) {
                if (err.code === "EADDRINUSE") {
                    console.error(
                        `Port ${options.port} is in use. Try running on a different port. Use --port [number] to solve this error.`
                    );
                } else {
                    console.log("Here is the error:", err.message);
                }
                process.exit(1);
            }
        }
    );
