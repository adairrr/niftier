// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/EnumerableSetUpgradeable.sol";

contract Layer is ERC1155Upgradeable {
    using SafeMathUpgradeable for uint256;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;


    event LayerCreated(uint256 indexed layerId);

    struct LayerTypeData {
        EnumerableSetUpgradeable.UintSet layers;
        bytes
    }

    mapping (bytes32 => LayerTypeData) private _layerTypes;

    function createLayer(string calldata _)
}
