# 更新流程規範（2026-09-12 起，Gary 指示）

- 正式版 = `gary40/weiz-digital-age` 的 `main` 分支（age.weiz.com.tw）與已部署的 Apps Script。
- **未經 Gary 親自回覆「正式版更新上線」，不得改動正式版**：不推 main、不改 CNAME／DNS 設定、不動已部署後端。
- 所有準備中的變更一律做成草稿：
  - 程式：`v4-preview`（草稿）分支 + Claude 預覽頁（artifact）
  - 文案／題庫／Code.gs：草稿檔案與版本說明，附「與正式版差異」清單
  - 同步保存在 UTM 鏡像分支 `claude/new-session-y5za96`
- 上線時由 Gary 回覆「正式版更新上線」後，才合併 main 並回報。
