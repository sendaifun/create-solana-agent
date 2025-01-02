import fs from 'fs';
import path from 'path';
import pc from 'picocolors';
import * as p from '@clack/prompts';
import { optimizedCopy } from './utils.js';

const renameFiles: Record<string, string | undefined> = {
    _gitignore: '.gitignore',
    '_env.local': '.env.local',
};

const excludeDirs = ['node_modules', '.next'];
const excludeFiles = ['.DS_Store'];

async function copyDir(src: string, dest: string) {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });
  
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, renameFiles[entry.name] || entry.name);
  
      if (entry.isDirectory()) {
        if (!excludeDirs.includes(entry.name)) {
          await copyDir(srcPath, destPath);
        }
      } else {
        if (!excludeFiles.includes(entry.name)) {
          await optimizedCopy(srcPath, destPath);
        }
      }
    }
  }
  

export async function main(argv: string[]) {
    console.log(
        `${pc.greenBright(`
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                                                                                                              //
        //                                      ::::::::  :::::::::: ::::    ::: :::::::::      :::     :::::::::::                     //   
        //                                    :+:    :+: :+:        :+:+:   :+: :+:    :+:   :+: :+:       :+:                          //
        //                                   +:+        +:+        :+:+:+  +:+ +:+    +:+  +:+   +:+      +:+                           //
        //                                  +#++:++#++ +#++:++#   +#+ +:+ +#+ +#+    +:+ +#++:++#++:     +#+                            //
        //                                        +#+ +#+        +#+  +#+#+# +#+    +#+ +#+     +#+     +#+                             //
        //                                #+#    #+# #+#        #+#   #+#+# #+#    #+# #+#     #+#     #+#                              //
        //                                ########  ########## ###    #### #########  ###     ### ###########                           //   
        //                                                                                                                              //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////`)}\n\n`
    );

    const defaultProjectName = 'solana-agent-terminal';

    
}
