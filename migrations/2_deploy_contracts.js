var Election = artifacts.require("./Election.sol");

module.exports = function(deployer) {
  deployer.deploy(Election, "0x0A852248141A937DA7221e50CEF4965e3e072a29");
};