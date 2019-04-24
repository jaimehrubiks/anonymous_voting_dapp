var Election = artifacts.require("./Election.sol");

module.exports = function(deployer) {
  deployer.deploy(Election, "0x34893Ea5B16D26E796eD784E50a8084c9F16fCb2");
};