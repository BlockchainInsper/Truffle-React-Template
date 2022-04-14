const GovernanceFactory = artifacts.require("GovernanceFactory");

module.exports = function (deployer) {
  deployer.deploy(GovernanceFactory);
};