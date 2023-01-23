import EthereumSVG from "../../icons/ethereum.svg";
import PolygonSVG from "../../icons/polygon.svg";
import GraphSVG from "../../icons/thegraph.svg";
import Tooltip from "../tooltip";
import BscSVG from "../../icons/bsc.svg";
import FvmSVG from "../../icons/fvm.svg";

const createSVGIcon = (url: string, chainName: string) => {
  return (
    <Tooltip tooltipContent={`Delivered by ${chainName}`}>
      <img src={url} alt={chainName.toUpperCase()} />
    </Tooltip>
  )
}

export default {
    ETH_TEST_GOERLI: { label: "ETHEREUM GOERLI", icon: createSVGIcon(EthereumSVG, "Ethereum Goerli") },
    ETH_MAINNET: { label: "ETHEREUM MAINNET", icon: createSVGIcon(EthereumSVG, "Ethereum Mainnet") },
    POLYGON_TEST_MUMBAI: { label: "POLYGON MUMBAI", icon: createSVGIcon(PolygonSVG, "Polygon Mumbai") },
    POLYGON_MAINNET: { label: "POLYGON MAINNET", icon: createSVGIcon(PolygonSVG, "Polygon Mainnet") },
    BSC_TESTNET: { label: "BSC TESTNET", icon: createSVGIcon(BscSVG, "Bsc Testnet") },
    BSC_MAINNET: { label: "BSC MAINNET", icon: createSVGIcon(BscSVG, "Bsc Mainnet") },
    FVM_TESTNET: { label: "FVM HYPERSPACE", icon: createSVGIcon(FvmSVG, "Fvm Hyperspace") },
    THE_GRAPH: { label: "THE GRAPH", icon: createSVGIcon(GraphSVG, "The Graph") },
};
