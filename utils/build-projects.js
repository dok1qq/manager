const childProcess = require('child_process');
const modules = require('./projects');
const process = require('process');

let time = [];
process.on('exit', () => {
    console.log('TIME REPORT:');
    time.forEach((arg) => {
        console.log.apply(this, arg);
    })
});

function execShellCommand(cmd) {
    return new Promise((resolve, reject) => {
        console.log('START:' + cmd.join(' '));
        const child = childProcess.spawn('node', cmd, {stdio: "inherit"});

        child.on('error', (error) => {
            console.log('error');
            process.abort();
        });

        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if (code) {
                process.abort();
                reject(code);
            } else {
                resolve(code);
            }
        });
    });
}

function buildBunchProjects(index) {
    const currentTime = Date.now();
    const buildPackages = modules[index]
        .map((module) => {
            return execShellCommand([`./node_modules/@angular/cli/bin/ng`, `build`, `@${module}`])
                .then(() => {
                    time.push([module, ((Date.now() - currentTime) / 60000).toFixed(2) + 'min'])
                })
        });
    Promise.all(
        [...buildPackages, Promise.resolve()]
    ).then(() => {
        console.log(index + 1, 'modules');
        if (modules[index + 1]) {
            buildBunchProjects(index + 1)
        }
    });
}

buildBunchProjects(0);

