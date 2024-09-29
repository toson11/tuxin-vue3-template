```json
{
  "pnpm": {
    // 允许已弃用的依赖包版本，不触发警告
    "allowedDeprecatedVersions": {
      "rimraf": "*" // 指定允许版本
    },
    // 设置对等依赖版本
    "peerDependencyRules": {
      "allowedVersions": {
        // 所有项目中的 eslint 的 peer 依赖为 9.x，确保不同包之间的依赖版本一致
        "eslint": "9"
      }
    }
  },
  // 对工具版本要求
  "engines": {
    "node": "^18.18.0 || ^20.9.0 || >=21.1.0",
    "pnpm": ">=9"
  }
}
```
