# 威柏科技 品牌規範 Skill 安裝包 — 安裝說明

版本：weibo-design V1.0（WEIBO VIS V1.0，2026-09-10 總經理審核通過）

## 包內檔案

| 檔案 | 用途 |
|---|---|
| `weibo-design.skill` | Claude Skill 封裝檔。在 Claude 對話中點檔案卡的「Save skill」即可裝進個人帳號 |
| `weibo-design.zip` | 同一個 Skill 的一般 zip，供管理員在 claude.ai 組織設定上傳 |
| `WEIBO品牌規範_共用段落.md` | 貼進 Organization instructions（A 版）或 Project Instructions（B 版）的文字 |
| `安裝說明.md` | 本文件 |

## 一、全公司發布（管理員，建議做法）

1. claude.ai 左下角帳號 → 管理員設定（Admin settings）→ Skills → 上傳 `weibo-design.zip`，設為全組織啟用。
2. 同一處 → Claude 設定 → Organization instructions，貼入 `WEIBO品牌規範_共用段落.md` 的 **A 版**四行，儲存。
3. 完成後所有成員、所有 Project 立即生效，不需逐人安裝。

## 二、個人安裝（不等管理員）

在 Claude 對話中打開 `weibo-design.skill` 的檔案卡，點「Save skill」。之後對話提到威柏、WEIBO、報價單、合約、組織圖、名片、新進員工簡報時會自動觸發。

## 三、個別 Project 補強（選用）

若某個 Project 常做威柏對外文件，把共用段落的 **B 版** 貼到該 Project → Instructions 最末端，讓短對話也遵守底線。

## 四、驗證是否生效

在任一對話輸入：「幫我用公司規範做一份給 momo MD 的 ACEFAST 新品提案簡報」。
正確結果：Claude 先讀 weibo-design，使用新品簡報模板版型，主色 #5D59FF，Logo 在左下，結尾附 AI 產出驗證區塊。

## 五、與其他 Skill 的關係

- `weiz-design`：WEiZ 消費者端素材，兩者不混用。
- `ai-output-check`：所有落地產出都要附驗證區塊，與本 Skill 並用。

## 六、更新方式

規範改版時重新上傳 `weibo-design.zip` 覆蓋同名 Skill，版本號寫在 SKILL.md 末端。原始檔與重建腳本在 repo `gary40/UTM` 的 `skills/weibo-design/` 與 `docs/weibo-vis/`。
