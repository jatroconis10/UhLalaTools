var shell = require('shelljs');

var chaosMonkeyRunner = {};

chaosMonkeyRunner.runChaosMonkey = function(chaosMonkeyConfiguration) {
    shell.exec(`docker pull mlafeldt/simianarmy && docker run -d \
                              -e SIMIANARMY_CLIENT_AWS_ACCOUNTKEY=${chaosMonkeyConfiguration.awsAccessKey} \
                              -e SIMIANARMY_CLIENT_AWS_SECRETKEY=${chaosMonkeyConfiguration.awsSecretAccessKey} \
                              -e SIMIANARMY_CLIENT_AWS_REGION=${chaosMonkeyConfiguration.awsRegion} \
                              -e SIMIANARMY_CALENDAR_ISMONKEYTIME=true \
                              -e SIMIANARMY_CHAOS_ASG_ENABLED=true \
                              mlafeldt/simianarmy`);
}

module.exports = chaosMonkeyRunner;
