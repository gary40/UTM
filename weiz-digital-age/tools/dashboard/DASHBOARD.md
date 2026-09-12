# WEiZ 數位年齡測驗・戰情室（每小時同步）與每日戰報

這個資料夾支援兩個 Routine：`dashboard-hourly-refresh`（每小時）與 `dashboard-daily-report`（每天 09:00 台北時間）。
兩者都不碰 `weiz-digital-age` 正式站或 Code.gs，只讀 Google 試算表、寫入戰情室 Artifact 自己的 db。

## 固定參數
- Google 試算表（Drive fileId）：`17clrCOtbMCbBNeN9Br-TAw2Y7fzi8jbCxqFBoIDPz7o`（WEiZ 數位年齡測驗 名單與統計）
- 戰情室 Artifact 網址：`https://claude.ai/code/artifact/b79a1930-8b5a-47cf-9789-af00fb797756`
- db collection/doc：`dashboard/latest`

## 每小時刷新（dashboard-hourly-refresh）步驟
1. 呼叫 `mcp__Google_Drive__read_file_content`，`fileId` 用上面固定參數，取得整份試算表的 markdown 文字內容。
2. 用 Write 工具把內容存成暫存檔（任一路徑），執行 `python3 tools/dashboard/parse.py <暫存檔路徑>`（若本機沒有這份 repo，先 `git clone` 這個 repo 的 `claude/new-session-y5za96` 分支，或用 `git pull` 更新既有 clone）。腳本會印出 JSON 彙總（今日/累計筆數、平均年齡、稱號分布、年代分布、分享平台、名單轉換率、依日期分布 by_day 等），已排除 test_mode=1、persona=測試資料、utm 含 test=1、email 含 test 字樣的測試列。
3. 用 Artifact 工具 `action: write_db`、`db_op: set`、`collection: dashboard`、`doc_id: latest`、`url` 用上面固定的 Artifact 網址，`data` 傳入第 2 步印出的 JSON（或用 `file_path` 指向存成檔案的 JSON）。
4. 不用回報 Gary，安靜完成即可（除非讀取或寫入失敗，那就簡短說明失敗原因）。

## 每日戰報（dashboard-daily-report，09:00 台北時間）
1. 同上第 1–2 步取得最新彙總 JSON（若同一小時內已跑過第一步可以重複利用該次結果）。
2. 從 `by_day` 欄位取「昨天」與「前天」兩個日期的筆數，並看 `persona_dist`／`platform_dist`／`lead_conversion_pct`／`totals` 等欄位。
3. 用 4–6 行純文字整理成「每日戰報」訊息回覆給 Gary（不用寫檔、不用建立 PR），內容包含：昨天挑戰人次與較前一天的漲跌、累計人次、平均數位年齡、留信箱轉換率、分享次數最熱的平台、值得注意的變化（例如某稱號或年代占比突然變化）。同時執行 hourly 的第 3 步把彙總寫回戰情室，保持同步。
4. 若試算表讀不到資料或分析不出東西，就照實說「今天讀不到試算表資料，稍後再試」，不要編數字。

## 校驗規則（parse.py 已內建，供人工核對）
- 排除測試資料：`test_mode == '1'`、`persona == '測試資料'`、`utm` 含 `test=1`、`attempt_id` 開頭 `verifytest`；leads 另外排除 email 含 `test` 字樣。
- 時間一律換算台北時區（UTC+8）分日。
- `lead_conversion_pct` = 名單筆數 / 結果筆數 × 100。

## Code.gs v1.2 部署後可以強化
`answers`／`events`／`question_stats` 分頁上線後，可以擴充 parse.py 加入：每題正確率與超時率、平均反應時間、類型標籤分布、結果頁停留數據。屆時記得同步更新這份文件與戰情室頁面上的「更完整的資料等你部署」提示卡。
