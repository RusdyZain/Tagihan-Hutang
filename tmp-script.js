const babel = require("@babel/core");
const path = require("path");
const result = babel.transformSync(
  "import { View } from 'react-native';\nexport function Demo(){return <View className=\"bg-red-500\" />}\n",
  {
    filename: path.join(process.cwd(), "Demo.tsx"),
    configFile: path.join(process.cwd(), "babel.config.js"),
  }
);
console.log(result ? result.code : "null");
