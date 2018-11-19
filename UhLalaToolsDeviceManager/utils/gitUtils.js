const path = require('path');
var NodeGit = require("nodegit");

const appsSources = path.normalize(`${process.cwd()}/appsSources`);

const public = {};

public.getSources = function(appId, repoUrl) {

    const cloneOptions = {};
    const localPath = path.normalize(`${appsSources}/${appId}`)

    var cloneRepository = NodeGit.Clone(repoUrl, localPath, cloneOptions);
    return cloneRepository.catch(() => {
        return NodeGit.Repository.open(localPath);
    })

}

module.exports = public;