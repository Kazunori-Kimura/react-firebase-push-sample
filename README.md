# 追伸。そろそろおまえもFirebase Cloud Messagingを使うように。　母より
(コピーメカ/キャッチコピー自動作成サイト - http://www.copymecha.com/index.php)


## 概要

> Firebase Cloud Messaging（FCM）は、メッセージを無料で確実に配信するためのクロスプラットフォーム メッセージング ソリューションです。

Firebase Cloud Messaging  |  Firebase
https://firebase.google.com/docs/cloud-messaging/?hl=ja

iOS/Android/Webでプッシュ通知を簡単に実装できる
ここでは、Webアプリ (React) での実装について解説する

---

## 処理の流れ

```
@startuml

actor ユーザー
participant Webアプリ
participant サーバー
participant Firebase

ユーザー -> Webアプリ : アクセス
ユーザー <-- Webアプリ : Push通知の許可
ユーザー -> Webアプリ : OK
Webアプリ -> Firebase : token要求
Webアプリ <-- Firebase : token
Webアプリ -> サーバー: token
サーバー -> Firebase : Push通知データを送信
Webアプリ <-- Firebase : Push通知
ユーザー <- Webアプリ : 表示
note right
  通知をService Workerが受け取り
  Webアプリに渡すかブラウザ標準の通知を出すか判断する
end note
@enduml
```

![](http://www.plantuml.com/plantuml/png/XPB1IWCn48RlUOgyG5z0H7houa71Gy_R6knItIrfwhcP72fMgFQmfLwaKfTLqTA3eglGXnbtktqB4xJI1CHB66Q--V-P8UMMyBXe7nyHhoP2Jb75g3uGNlHBchhar_oc5mXQOLM46rH3LFTM0U7PTAWBjsFRvwpgjHWXwwAqj6LfqGrgOfWYl2EysUncgUJ2U-rMVTcvMbpVedmgabdMd_wdlxj3h8mcLhFfgWWRB2XYcS_0neovoxb2rlOhPZrdcLdJgww1O8umM7RavtpybxlJw5x8tROO9uj9Ie9GCChzmxeWbFvOmc2VyHE_ncWbv0t6KPvd_I7AowmV8PmHQccXVCXVnoX7A7ke8bHt2B6spPDHdaRw-h-gMJVznhBJIHuzcXXwX0K7r4n1oZhIF-mB)

---

## プロジェクトの作成

まずはReactのプロジェクトを作成し、`firebase` をインストールします。

```sh
> create-react-app react-firebase-push-sample
> cd react-firebase-push-sample
> npm install --save firebase
```

---

## Notification Componentの作成

Push通知の実装を一箇所にまとめるため、`Notification` コンポーネントを作成します。

```sh
> mkdir src/components
> touch src/components/Notification.js 
```

https://github.com/Kazunori-Kimura/react-firebase-push-sample/blob/master/src/components/Notification.js

---

## App.jsにNotification Componentを埋め込む

https://github.com/Kazunori-Kimura/react-firebase-push-sample/blob/master/src/App.js

---

## publicフォルダにService Workerスクリプトを配置

`firebase-messaging-sw.js` というファイル名で作成します。
内容はほぼ定型です。

https://github.com/Kazunori-Kimura/react-firebase-push-sample/blob/master/public/firebase-messaging-sw.js

---

## .envにFirebaseのキー情報を追加

Firebaseコンソール > 設定 > 全般 でアプリの種別からウェブアプリを選択
Reactでは.envファイルに定義した環境変数'REACT_APP_XXX'をprocess.envから参照できる

---

## 動作確認

- **https** でないとPush通知を受け取れない。
- Google Chromeの場合は証明書エラーを無視して通信するように `--ignore-certificate-errors` を指定してブラウザを実行する必要がある。
- Macでの手順を紹介するが、Windowsでもやらないといけないことは同じ。

---

### npm scriptsにブラウザ起動コマンドを追加する

```json:package.json
  "scripts": {
    ...
    "browser": "\"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome\"
      --ignore-certificate-errors
      --unsafely-treat-insecure-origin-as-secure=https://localhost:3000
      --allow-insecure-localhost
      --user-data-dir=/tmp"
  },
```

見やすいように改行していますが、実際には1行で入力してください。

---

### httpsでlocalhostにサーバーを立てる

react-scriptsは環境変数 `HTTPS` がセットされていると開発用サーバーを**https**で実行してくれる。

```sh
> HTTPS=true npm start
```

---

![スクリーンショット 2019-01-17 14.18.41.png](https://qiita-image-store.s3.amazonaws.com/0/39362/b8234cbb-327d-de73-8f2f-8394b8dab29a.png)

---

## Push通知送信スクリプト

サーバーから送信する代わりに、コマンドラインでPush通知の送信要求を投げるスクリプトを作成する

```sh
> mkdir scripts
> touch scripts/sendNotification.js
> npm install --save-dev dotenv node-fetch
```

https://github.com/Kazunori-Kimura/react-firebase-push-sample/blob/master/scripts/sendNotification.js

---

## トークンを.envファイルに反映

本来はWebアプリからサーバーにFCMトークンを渡す処理が必要ですが、今回は面倒なので手動で連携します。
ブラウザに表示されたFCMトークンを `.env`ファイルにコピペします。

---

## 通知送信スクリプトを実行

```sh
> node scripts/sendNotification.js
200
```

FirebaseにデータがPOSTされます。問題なく完了すればステータスコード `200` が返ってきます。

---

## Webアプリがアクティブな場合

![スクリーンショット 2019-01-17 14.19.50.png](https://qiita-image-store.s3.amazonaws.com/0/39362/9ccf3f8f-12d2-9ec3-d1dd-4484f0fa4ae0.png)

コンソールに送信した内容が表示される
`onMessage`で画面に表示させるなりなんなりのロジックを実装する

---

## Webアプリが非アクティブな場合

<img width="564" alt="スクリーンショット 2019-01-17 14.20.28.png" src="https://qiita-image-store.s3.amazonaws.com/0/39362/138987fd-cac0-1686-7570-212cd6c659e6.png">

見た目をカスタマイズしたい場合は送信データに `notification` を含めずに `setBackgroundMessageHandler` メソッドに実装を追加する

---

## 参考

- Kazunori-Kimura/react-firebase-push-sample: Firebase Cloud Messagingのサンプル (https://github.com/Kazunori-Kimura/react-firebase-push-sample)
- Firebase Cloud Messaging（FCM）でより簡単にWebブラウザにPush通知を送るサンプル - DRYな備忘録(http://otiai10.hatenablog.com/entry/2017/06/22/023025)
- コピーメカ/キャッチコピー自動作成サイト(http://www.copymecha.com/index.php)
