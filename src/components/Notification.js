import React, { Component } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/messaging';

class Notification extends Component {
  state = {
    /**
     * FCMトークン
     * @type {String}
     */
    token: '',
  };

  /**
   * FCM初期化済みフラグ
   * @type {Boolean}
   */
  initialized = false;

  /**
   * renderメソッドが呼ばれる前に実行される
   * ライフサイクルメソッド
   */
  componentWillMount() {
    // FCM初期化処理
    this.initializeFCM();
  }

  /**
   * FCM初期化およびイベントリスナーのセット
   */
  initializeFCM = async () => {
    if (this.initialized) {
      // 初期化済みなら何もしない
      // 通常はcomponentWillMountは一度しか呼ばれないが、
      // react-router-domを使用した場合に画面遷移に伴って
      // 複数回呼ばれることがあったので、フラグで管理しておく
      return;
    }

    if (!firebase.messaging.isSupported()) {
      // FCMサポート対象ブラウザでなければ何もしない ex) Safari
      // firebase-messaging.js broken on iOS Safari 11.1.2 · Issue #1260 · firebase/firebase-js-sdk
      // https://github.com/firebase/firebase-js-sdk/issues/1260
      return;
    }

    // APIキーなどの設定
    // Firebaseのコンソール > 設定 > 全般 でアプリの種別からウェブアプリを選択すると
    // JavaScriptのスニペットが表示されるので環境変数 (.env) にコピペする
    const config = {
      // Reactでは.envファイルに定義した環境変数'REACT_APP_XXX'をprocess.envから参照できる
      // (トランスパイル時に置換される)
      apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
      projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
    };

    if (!firebase.apps.length) {
      // initializeAppを複数回呼ぶと例外が発生するので
      // 初期化済みかどうかを判定する
      firebase.initializeApp(config);
    }

    const messaging = firebase.messaging();

    // permission要求
    await messaging.requestPermission();

    // tokenを取得する
    const token = await messaging.getToken();
    // stateに保持
    this.setState({ token });

    // tokenは定期的に更新される
    // tokenが更新されたらstateに反映する
    messaging.onTokenRefresh(() => {
      messaging.getToken()
        .then((token) => {
          // stateのtokenを更新
          this.setState({ token });
        })
        .catch((err) => {
          console.error(err);
        });
    });

    // ブラウザがフォアグラウンド時に通知を受け取った場合は
    // onMessageイベントが発火する
    messaging.onMessage((payload) => {
      console.log(payload);
    });

    // 初期化済みフラグをセット
    this.initialized = true;
  };

  /**
   * コンポーネントの描画メソッド
   */
  render() {
    const { token } = this.state;

    // tokenを画面に表示する
    return (
      <div>FCM Token: {token}</div>
    );
  }
}

export default Notification;
