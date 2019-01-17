# 追伸。そろそろおまえもFirebase Cloud Messagingを使うように。　母より
(コピーメカ/キャッチコピー自動作成サイト - http://www.copymecha.com/index.php)

---

## 概要

> Firebase Cloud Messaging（FCM）は、メッセージを無料で確実に配信するためのクロスプラットフォーム メッセージング ソリューションです。

Firebase Cloud Messaging  |  Firebase
https://firebase.google.com/docs/cloud-messaging/?hl=ja

iOS/Android/Webでプッシュ通知を簡単に実装できます。
ここでは、Webアプリ (React) での実装について解説します。

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



