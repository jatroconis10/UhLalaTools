const path = require('path');
const shell = require('shelljs');
const NodeGit = require("nodegit");

const appsSources = path.normalize(`${process.cwd()}/appsSources`);

const public = {};

public.getSources = function(appId, version, repoUrl) {

    const cloneOptions = {};
    const localPath = path.normalize(`${appsSources}/${appId}/${version}`)
    shell.mkdir('-p', localPath);

    var cloneRepository = NodeGit.Clone(repoUrl, localPath, cloneOptions);
    return cloneRepository.catch(() => {
        return NodeGit.Repository.open(localPath);
    })

}

module.exports = public;