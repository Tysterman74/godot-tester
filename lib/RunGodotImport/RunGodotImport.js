const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const getProjectPath = require('../GetProjectPath/GetProjectPath');
const getCliArgs = require('../GetCliArgs/GetCliArgs');

const {
    addRebuilderSceneToProjectAddonFolder,
    removeRebuilderSceneFromProjectAddonFolder,
} = require('./helpers/ImportRebuilderHelpers/ImportRebuilderHelpers');

function runGodotImport(exePath) {
    var filesPre = fs.readdirSync(getProjectPath());
    for (index = 0; index < filesPre.length; index++) {
        console.log(filesPre[index]);
    }
    addRebuilderSceneToProjectAddonFolder();

    console.log("Running Godot import...");
    const { importTime } = getCliArgs();
    const importProcResults = spawnSync(
        exePath,
        [
            '--headless',
            '--editor',
            path.join(
                'addons',
                'gut',
                '.cli_support',
                '__rebuilder_scene.tscn',
            ),
        ],
        {
            cwd: getProjectPath(),
            timeout: importTime * 1000,
        }
    );

    //var filesPost = fs.readdirSync(getProjectPath());

    console.log('Godot Import results: ', importProcResults.stdout.toString());

    removeRebuilderSceneFromProjectAddonFolder();
};

module.exports = runGodotImport;