const getProjectPath = require('../GetProjectPath/GetProjectPath');
const getCliArgs = require('../GetCliArgs/GetCliArgs');
const isGodotFour = require('../IsGodotFour/IsGodotFour');
const { spawnSync } = require('child_process');

function executeGutTests(exePath) {
    const cliArgs = getCliArgs();
    let args = [];

    if(isGodotFour()) {
        args.push('--headless');
    };

    if(cliArgs.directScene !== 'false') {
        args.push(cliArgs.directScene);
    } else {
        console.log("Not using Direct Scene, concatenating gut commands");
        args = args.concat([
            `-d`, '-s', 'res://addons/gut/gut_cmdln.gd',
            `-gdir=${cliArgs.testDir}`,
            '-ginclude_subdirs',
            `-gjunit_xml_file=./${cliArgs.resultOutputFile}`,
            `-gexit`,
        ]);

        if(cliArgs.configFile !== 'res://.gutconfig.json') {
            console.log(`Appending configFile name ${cliArgs.configFile}`)
            args.push(`-gconfig=${cliArgs.configFile}`);
        }
    };

    console.log("Running GUT tests...")
    const results = spawnSync(
        exePath,
        args,
        {
            cwd: getProjectPath(),
            timeout: cliArgs.testTimeout * 1000,
        }
    );

    console.log('GUT test results: ', results.stdout.toString());
};

module.exports = executeGutTests;