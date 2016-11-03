# onamae-ddns

Public IPアドレスの変更をお名前.comのDNS設定に反映させるクライアントです。

## 使い方

1. このリポジトリをcloneする
2. `npm install`
3. `cp settings-sample.json settings.json`
4. `settings.json` を適切に編集する
    * `username`, `password` の値にお名前.comへのログインに必要なユーザー名、パスワードを代入
    * `domain` の値に管理しているドメイン名を代入
    * `subdomains` の値に、クライアントのPublic IPアドレスの変更を反映させたいサブドメインらの配列を代入
    * `publicIp` の値に現在のPublic IPアドレスを代入
5. 定期的に `node index.js` を実行するよう設定する

## 連絡先

* Twitter: @hideo54
* E-mail: contact@hideo54.com
