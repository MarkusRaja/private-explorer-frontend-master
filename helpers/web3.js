import Web3 from 'web3';

export const weiToEther = (wei, symbol = 'DTOKEN') => {
  const weiBN = Web3.utils.toBN(wei);
  const ethValue = Web3.utils.fromWei(weiBN, 'ether');

  return ethValue;
}
