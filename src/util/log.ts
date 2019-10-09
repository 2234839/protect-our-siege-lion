import {promises as _fs, writeFile} from "fs";
export class Log {

    info(msg:string){
        this.writeLine(msg)
    }
    writeLine(msg:string){
        writeLine('./log.log',`${new Date().toLocaleString()} ${msg}`)
    }
}

/** 写出一行文本 */
async function writeLine(path:string,msg:string) {
    return _fs.appendFile(path,msg+"\n");
}