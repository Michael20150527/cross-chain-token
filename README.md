<p align="center"># Cross chain transfer example</p>

## Main commands

```
npx create-react-app cross-chain-token

cd cross-chain-token

npm install --save-dev ethereum-waffle @nomiclabs/hardhat-waffle chai ethers @nomiclabs/hardhat-ethers

npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p

Update tailwind.config.js to the following:
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

npm install --save-dev hardhat

npx hardhat

npm install --save-dev "hardhat@^2.14.0" "@nomicfoundation/hardhat-toolbox@^2.0.0"

Update hardhat.config.js to the following:
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  paths: {
    artifacts: "./src/artifacts",
  },
  solidity: "0.8.18",
};

Update ./src/index.css to the following:
@tailwind base;
@tailwind components;
@tailwind utilities;

npm install --save-dev @openzeppelin/contracts

npx hardhat compile

npx hardhat node

npx hardhat run --network localhost .\scripts\deploy.js

npx hardhat test --network localhost .\test\sample-test.js

npm start
```
## Final operating effect
![cross-chain screenshot](https://github.com/Michael20150527/cross-chain-token/blob/master/cross-chain-token.png "cross chain transfer")
